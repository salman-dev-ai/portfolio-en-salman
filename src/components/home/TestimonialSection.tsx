// الملف: TestimonialSection.tsx
// الوظيفة: قسم آراء العملاء بتصميم زجاجي؛ كرة أرضية سلكية بنجوم وهالة تدور إلى موقع العميل الحالي وترسم قوساً يصله بك
// المحتوى: TestimonialSection (نفس التنقل الأمامي/الخلفي والنقاط) + TestimonialGlobe (Canvas خارج دورة React)
// الاعتماديات: useState وuseLanguage وtestimonialsData وأيقونات lucide-react
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { testimonialsData } from '../../data/testimonials.ts';
import { Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Geo data                                                            */
/* ------------------------------------------------------------------ */

interface GeoPoint {
  lat: number;
  lng: number;
  /** Optional city/country label per locale, e.g. { en: 'Dubai, UAE', ar: 'دبي، الإمارات' } */
  label?: Partial<Record<string, string>>;
}

/** Optional `location` on each testimonial. Items without it still work: no dot, no arc. */
type TestimonialItem = (typeof testimonialsData)[number] & { location?: GeoPoint };

/** نقطة "أنت" — عدّل الإحداثيات لتطابق موقعك. */
const HOME: GeoPoint = { lat: 24.7, lng: 46.7 };

const ITEMS = testimonialsData as readonly TestimonialItem[];
const POINTS: (GeoPoint | null)[] = ITEMS.map((item) => item.location ?? null);

const AUTOPLAY_MS = 7000;
const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

/* ------------------------------------------------------------------ */
/* Globe math                                                          */
/* ------------------------------------------------------------------ */

type Vec = [number, number, number];
const DEG = Math.PI / 180;

const toVec = (lat: number, lng: number): Vec => {
  const la = lat * DEG;
  const lo = lng * DEG;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

const rotate = (v: Vec, yaw: number, pitch: number): Vec => {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x = v[0] * cy - v[2] * sy;
  const z = v[0] * sy + v[2] * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return [x, v[1] * cp - z * sp, v[1] * sp + z * cp];
};

const normalize = (v: Vec): Vec => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

const slerp = (a: Vec, b: Vec, f: number): Vec => {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-3) return a;
  const s = Math.sin(om);
  const wa = Math.sin((1 - f) * om) / s;
  const wb = Math.sin(f * om) / s;
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb];
};

/** Fixed, deterministic star field (no Math.random): x, y in 0..1 and radius. */
const STARS: [number, number, number][] = Array.from({ length: 30 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(n * 127.1 + i * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  return [r(1), r(2), 0.5 + r(3) * 0.9] as [number, number, number];
});

const GRATICULE: Vec[][] = (() => {
  const lines: Vec[][] = [];
  for (const lat of [-60, -30, 0, 30, 60]) {
    const line: Vec[] = [];
    for (let j = 0; j <= 72; j++) line.push(toVec(lat, (j / 72) * 360 - 180));
    lines.push(line);
  }
  for (let lng = 0; lng < 360; lng += 30) {
    const line: Vec[] = [];
    for (let j = 0; j <= 48; j++) line.push(toVec(-90 + (j / 48) * 180, lng));
    lines.push(line);
  }
  return lines;
})();

/* ------------------------------------------------------------------ */
/* Globe (canvas)                                                      */
/* ------------------------------------------------------------------ */

interface GlobeProps {
  points: (GeoPoint | null)[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const TestimonialGlobe: React.FC<GlobeProps> = ({ points, activeIndex, onSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectRef = useRef(onSelect);
  const apiRef = useRef<{ select: (i: number) => void } | null>(null);

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      ctx = null;
    }
    if (!ctx) return; // decorative only: quotes and controls keep working
    const c: CanvasRenderingContext2D = ctx;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const homeV = toVec(HOME.lat, HOME.lng);
    const pointV = points.map((p) => (p ? toVec(p.lat, p.lng) : null));

    let size = 0;
    let glow: CanvasGradient | null = null;
    let body: CanvasGradient | null = null;
    let rim: CanvasGradient | null = null;
    let yaw = 0;
    let pitch = 0;
    let tYaw = 0;
    let tPitch = 0;
    let arcT = 0;
    let time = 0;
    let last = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let reduced = motionQuery.matches;
    let active = 0;
    let first = true;
    let failed = false;
    let hits: { i: number; x: number; y: number }[] = [];

    const aim = (i: number) => {
      const v = pointV[i];
      const base = v ? normalize([v[0] * 0.65 + homeV[0] * 0.35, v[1] * 0.65 + homeV[1] * 0.35, v[2] * 0.65 + homeV[2] * 0.35]) : homeV;
      tYaw = Math.atan2(base[0], base[2]);
      tPitch = Math.asin(Math.min(1, Math.max(-1, base[1]))) * 0.6;
    };

    const draw = () => {
      const cx = size / 2;
      const cy = size / 2;
      const R = size * 0.43;
      c.clearRect(0, 0, size, size);
      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
      // subtle idle sway so the globe feels alive between selections (time is frozen when motion is reduced)
      const yw = yaw + Math.sin(time * 0.3) * 0.05;

      // faint twinkling star field behind the globe
      c.fillStyle = 'rgb(200,215,235)';
      for (let i = 0; i < STARS.length; i++) {
        const st = STARS[i];
        c.globalAlpha = 0.12 + 0.22 * (0.5 + 0.5 * Math.sin(time * 0.8 + i * 1.7));
        c.beginPath();
        c.arc(st[0] * size, st[1] * size, st[2], 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;

      if (glow) {
        c.fillStyle = glow;
        c.fillRect(0, 0, size, size);
      }
      if (body) {
        c.fillStyle = body;
        c.beginPath();
        c.arc(cx, cy, R, 0, Math.PI * 2);
        c.fill();
      }
      if (rim) {
        c.fillStyle = rim;
        c.beginPath();
        c.arc(cx, cy, R, 0, Math.PI * 2);
        c.fill();
      }
      c.strokeStyle = 'rgba(255,100,28,0.38)';
      c.lineWidth = 1;
      c.beginPath();
      c.arc(cx, cy, R, 0, Math.PI * 2);
      c.stroke();

      // graticule
      c.strokeStyle = 'rgba(255,140,70,0.16)';
      c.lineWidth = 0.7;
      c.beginPath();
      for (const line of GRATICULE) {
        let pen = false;
        for (const p of line) {
          const v = rotate(p, yw, pitch);
          if (v[2] > 0) {
            const x = cx + v[0] * R;
            const y = cy - v[1] * R;
            if (pen) c.lineTo(x, y);
            else c.moveTo(x, y);
            pen = true;
          } else {
            pen = false;
          }
        }
      }
      c.stroke();

      c.globalCompositeOperation = 'lighter';
      c.lineCap = 'round';
      c.lineJoin = 'round';

      // arc from home to the active client
      const target = pointV[active];
      if (target) {
        const prog = Math.min(1, arcT / 1.3);
        const eased = 1 - Math.pow(1 - prog, 3);
        const steps = 56;
        c.beginPath();
        let pen = false;
        for (let s = 0; s <= steps; s++) {
          const f = (s / steps) * eased;
          const lift = 1 + 0.22 * Math.sin(Math.PI * (s / steps));
          const sv = slerp(homeV, target, f);
          const v = rotate([sv[0] * lift, sv[1] * lift, sv[2] * lift], yw, pitch);
          if (v[2] > 0.02) {
            const x = cx + v[0] * R;
            const y = cy - v[1] * R;
            if (pen) c.lineTo(x, y);
            else c.moveTo(x, y);
            pen = true;
          } else {
            pen = false;
          }
        }
        c.strokeStyle = 'rgb(255,100,28)';
        c.globalAlpha = 0.16;
        c.lineWidth = 4;
        c.stroke();
        c.globalAlpha = 0.9;
        c.lineWidth = 1.2;
        c.stroke();
      }

      // home dot
      {
        const v = rotate(homeV, yw, pitch);
        if (v[2] > 0) {
          const x = cx + v[0] * R;
          const y = cy - v[1] * R;
          c.fillStyle = 'rgb(255,176,82)';
          c.globalAlpha = 0.9;
          c.beginPath();
          c.arc(x, y, 3, 0, Math.PI * 2);
          c.fill();
          c.globalAlpha = 0.25;
          c.beginPath();
          c.arc(x, y, 7, 0, Math.PI * 2);
          c.fill();
        }
      }

      // client dots
      hits = [];
      for (let i = 0; i < pointV.length; i++) {
        const pv = pointV[i];
        if (!pv) continue;
        const v = rotate(pv, yw, pitch);
        if (v[2] <= 0) continue;
        const x = cx + v[0] * R;
        const y = cy - v[1] * R;
        hits.push({ i, x, y });
        if (i === active) {
          const ph = reduced ? 0.5 : (time * 0.7) % 1;
          c.fillStyle = 'rgb(255,100,28)';
          c.globalAlpha = 0.95;
          c.beginPath();
          c.arc(x, y, 4.5, 0, Math.PI * 2);
          c.fill();
          c.globalAlpha = 0.5 * (1 - ph);
          c.strokeStyle = 'rgb(255,100,28)';
          c.lineWidth = 1;
          c.beginPath();
          c.arc(x, y, 4.5 + ph * 14, 0, Math.PI * 2);
          c.stroke();
        } else {
          c.fillStyle = 'rgb(160,185,210)';
          c.globalAlpha = 0.7;
          c.beginPath();
          c.arc(x, y, 2.8, 0, Math.PI * 2);
          c.fill();
        }
      }

      c.globalAlpha = 1;
      c.globalCompositeOperation = 'source-over';
    };

    const safeDraw = () => {
      if (failed) return;
      try {
        draw();
      } catch {
        failed = true;
        stop();
        c.clearRect(0, 0, size, size);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!running) return;
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      time += dt;
      arcT += dt;
      const k = 1 - Math.exp(-dt * 4.5);
      let d = tYaw - yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      yaw += d * k;
      pitch += (tPitch - pitch) * k;
      safeDraw();
      if (running) raf = requestAnimationFrame(frame);
    };

    function start() {
      if (running || failed) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    const sync = () => {
      if (!reduced && visible && !document.hidden) {
        start();
      } else {
        stop();
        if (reduced) {
          yaw = tYaw;
          pitch = tPitch;
          arcT = 99;
          safeDraw();
        }
      }
    };

    const resize = () => {
      const w = Math.round(host.getBoundingClientRect().width);
      if (w < 2) return;
      size = w;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = size / 2;
      const R = size * 0.43;
      glow = c.createRadialGradient(cx, cx, R * 0.2, cx, cx, R * 1.3);
      glow.addColorStop(0, 'rgba(255,100,28,0.10)');
      glow.addColorStop(0.7, 'rgba(255,100,28,0.03)');
      glow.addColorStop(1, 'rgba(255,100,28,0)');
      body = c.createRadialGradient(cx - R * 0.3, cx - R * 0.35, R * 0.1, cx, cx, R);
      body.addColorStop(0, 'rgba(20,30,42,0.95)');
      body.addColorStop(1, 'rgba(6,10,15,0.95)');
      rim = c.createRadialGradient(cx, cx, R * 0.82, cx, cx, R);
      rim.addColorStop(0, 'rgba(255,100,28,0)');
      rim.addColorStop(1, 'rgba(255,100,28,0.2)');
      if (!running) safeDraw();
    };

    apiRef.current = {
      select: (i: number) => {
        active = i;
        aim(i);
        arcT = 0;
        if (first || reduced) {
          yaw = tYaw;
          pitch = tPitch;
          if (reduced) arcT = 99;
          first = false;
        }
        if (!running) safeDraw();
      },
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      let best = -1;
      let bestD = 16;
      for (const h of hits) {
        const dist = Math.hypot(h.x - x, h.y - y);
        if (dist < bestD) {
          bestD = dist;
          best = h.i;
        }
      }
      if (best >= 0) selectRef.current(best);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      canvas.style.cursor = hits.some((h) => Math.hypot(h.x - x, h.y - y) < 16) ? 'pointer' : 'default';
    };
    const onVisibility = () => sync();
    const onMotion = () => {
      reduced = motionQuery.matches;
      sync();
    };

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotion);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(host);
    } else {
      window.addEventListener('resize', resize);
    }
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];
        if (e) {
          visible = e.isIntersecting;
          sync();
        }
      });
      io.observe(host);
    }

    resize();
    sync();

    return () => {
      stop();
      apiRef.current = null;
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotion);
      window.removeEventListener('resize', resize);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [points]);

  useEffect(() => {
    apiRef.current?.select(activeIndex);
  }, [activeIndex]);

  return (
    <div className="relative w-full max-w-[420px] mx-auto aspect-square">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D12]';

export const TestimonialSection: React.FC = () => {
  const { t, locale, dir } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const headingId = useId();

  const isRtl = dir === 'rtl';

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = useCallback((idx: number) => setCurrentIndex(idx), []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const forward = (e.key === 'ArrowRight') !== isRtl;
    if (forward) handleNext();
    else handlePrev();
  };

  // Entrance: 'idle' (static, SSR-safe) -> 'armed' (hidden, waiting) -> 'shown' (plays once on first view)
  const sectionRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'armed' | 'shown'>('idle');
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setState('armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cursor spotlight: written straight to CSS variables, never through React state.
  const handleSpotlight = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };

  const current = ITEMS[currentIndex];
  const cityLabel = current.location?.label?.[locale];
  const total = testimonialsData.length;
  const canAutoplay = total > 1;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      data-state={state}
      aria-labelledby={headingId}
      className="ts-sec relative w-full py-20 bg-[#080D12] text-white overflow-hidden border-b border-[#1E2630]"
    >
      <style>{`
        @keyframes tsRing { from { stroke-dashoffset: ${RING_C.toFixed(2)}; } to { stroke-dashoffset: 0; } }
        @keyframes tsReveal { from { clip-path: inset(0 0 100% 0); opacity: 0; } to { clip-path: inset(0 0 0 0); opacity: 1; } }
        .ts-reveal { animation: tsReveal 700ms cubic-bezier(0.22, 1, 0.36, 1) both; }

        [data-state='armed'] .ts-in { opacity: 0; transform: translateY(18px); }
        [data-state='shown'] .ts-in { animation: tsIn .8s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--i, 0) * 130ms + 100ms); }
        @keyframes tsIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }

        .ts-spot { opacity: 0; transition: opacity .3s ease;
          background: radial-gradient(460px circle at var(--sx, 50%) var(--sy, 0%), rgba(255,100,28,.10), transparent 60%); }
        @media (hover: hover) { .ts-card:hover .ts-spot { opacity: 1; } }

        .ts-orbit { animation: tsSpin 90s linear infinite; }
        .ts-orbit-rev { animation: tsSpin 140s linear infinite reverse; }
        @keyframes tsSpin { to { transform: rotate(360deg); } }
        .ts-pop { animation: tsPop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes tsPop { from { opacity: 0; transform: translateY(6px) scale(.92); } to { opacity: 1; transform: none; } }

        @media (prefers-reduced-motion: reduce) {
          [data-state] .ts-in { opacity: 1 !important; transform: none !important; animation: none !important; }
          .ts-reveal, .ts-ring, .ts-orbit, .ts-orbit-rev, .ts-pop { animation: none !important; }
          .ts-spot { display: none; }
        }
      `}</style>

      {/* Ambient background: soft glows + faint masked grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(50% 60% at 85% 40%, rgba(255,100,28,0.10), transparent 70%),' +
            'radial-gradient(40% 50% at 5% 100%, rgba(112,146,184,0.07), transparent 70%)',
        }}
      ></div>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 75% 50%, #000, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 75% 50%, #000, transparent 70%)',
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="ts-in mb-12" style={{ '--i': 0 } as React.CSSProperties}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-full bg-[#FF641C]/15 border border-[#FF641C]/30 flex items-center justify-center text-[#FF641C] shadow-[0_0_24px_-4px_rgba(255,100,28,0.5)]">
              <Quote className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 id={headingId} className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {t('testimonials.heading')}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-400">
            {t('testimonials.subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Testimonial Card & Controls */}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={t('testimonials.heading')}
            className="ts-in ts-card lg:col-span-7 order-2 lg:order-1 relative overflow-hidden bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/40"
            style={{ '--i': 1 } as React.CSSProperties}
            onKeyDown={handleKeyDown}
            onPointerMove={handleSpotlight}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="ts-spot absolute inset-0 pointer-events-none" aria-hidden="true"></div>
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF641C]/70 to-transparent pointer-events-none"
              aria-hidden="true"
            ></div>

            <div className="relative">
              {/* Top row: quote glyph + counter */}
              <div className="flex items-start justify-between mb-4">
                <span
                  className="text-7xl sm:text-8xl font-serif leading-[0.7] select-none bg-gradient-to-b from-[#FF8A4C] to-[#FF641C]/20 bg-clip-text text-transparent"
                  aria-hidden="true"
                >
                  “
                </span>
                <span
                  className="font-mono text-xs tabular-nums text-gray-400 pt-1"
                  dir="ltr"
                  aria-label={`${currentIndex + 1} / ${total}`}
                >
                  <span className="text-white font-semibold">{pad(currentIndex + 1)}</span>
                  <span className="mx-1 text-gray-600">/</span>
                  {pad(total)}
                </span>
              </div>

              {/* Quote */}
              <div key={current.id} className="ts-reveal" aria-live="polite">
                <p
                  className="text-lg sm:text-2xl text-gray-100 font-medium leading-snug sm:leading-snug mb-8"
                  style={{ textWrap: 'balance' } as React.CSSProperties}
                >
                  {current.quote[locale]}
                </p>
              </div>

              {/* Author + controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <img
                      src={current.avatar}
                      alt={current.name[locale]}
                      className="w-[3.4rem] h-[3.4rem] rounded-full object-cover border-2 border-white/10"
                    />
                    <svg
                      viewBox="0 0 56 56"
                      className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                      aria-hidden="true"
                    >
                      <circle cx="28" cy="28" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                      {canAutoplay && (
                        <circle
                          key={`${current.id}-${currentIndex}`}
                          className="ts-ring"
                          cx="28"
                          cy="28"
                          r={RING_R}
                          fill="none"
                          stroke="#FF641C"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray={RING_C}
                          style={{
                            animation: `tsRing ${AUTOPLAY_MS}ms linear forwards`,
                            animationPlayState: paused ? 'paused' : 'running',
                            filter: 'drop-shadow(0 0 3px rgba(255,100,28,0.7))',
                          }}
                          onAnimationEnd={handleNext}
                        />
                      )}
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white truncate">
                      {current.name[locale]}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {current.role[locale]}
                    </p>
                  </div>
                </div>

                {/* Carousel Navigation Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={isRtl ? handleNext : handlePrev}
                    className={`w-11 h-11 rounded-full bg-white/5 hover:bg-[#FF641C]/15 border border-white/10 hover:border-[#FF641C] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer ${FOCUS}`}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={isRtl ? handlePrev : handleNext}
                    className={`w-11 h-11 rounded-full bg-white/5 hover:bg-[#FF641C]/15 border border-white/10 hover:border-[#FF641C] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer ${FOCUS}`}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Dots Indicator (24px hit area, 8px visual) */}
              <div className="flex items-center justify-center mt-6">
                {testimonialsData.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    aria-current={currentIndex === idx ? 'true' : undefined}
                    className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer ${FOCUS}`}
                  >
                    <span
                      className={`block h-2 rounded-full transition-all duration-300 ${
                        currentIndex === idx
                          ? 'w-6 bg-[#FF641C] shadow-[0_0_10px_rgba(255,100,28,0.7)]'
                          : 'w-2 bg-white/15 hover:bg-white/30'
                      }`}
                    ></span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Globe: rotates to the active client's location */}
          <div
            className="ts-in lg:col-span-5 order-1 lg:order-2 w-full max-w-[300px] sm:max-w-[420px] mx-auto"
            style={{ '--i': 2 } as React.CSSProperties}
          >
            <div className="relative">
              {/* Slow decorative orbit rings */}
              <div
                className="ts-orbit absolute -inset-[3%] rounded-full border border-dashed border-[#FF641C]/25 pointer-events-none"
                aria-hidden="true"
              ></div>
              <div
                className="ts-orbit-rev absolute inset-[6%] rounded-full border border-white/[0.06] pointer-events-none"
                aria-hidden="true"
              ></div>
              <TestimonialGlobe points={POINTS} activeIndex={currentIndex} onSelect={handleSelect} />
            </div>

            {/* Location chip for the active client (space reserved to avoid layout shift) */}
            <div className="mt-5 min-h-9 flex items-center justify-center">
              {cityLabel && (
                <span
                  key={current.id}
                  className="ts-pop inline-flex items-center gap-1.5 rounded-full bg-[#FF641C]/10 border border-[#FF641C]/30 px-3.5 py-1.5 text-xs font-semibold text-[#FF8A4C] backdrop-blur-sm"
                >
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {cityLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};