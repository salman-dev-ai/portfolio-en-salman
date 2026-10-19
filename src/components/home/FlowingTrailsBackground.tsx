// الملف: FlowingTrailsBackground.tsx
// الوظيفة: خلفية Canvas لمسارات ضوئية رفيعة متدفقة مع parallax خفيف للماوس
// ملاحظات: الرسم يتم خارج دورة React؛ لا يوجد setState داخل الإطارات.
import React, { useEffect, useRef } from 'react';

export type TrailsStatus = 'ready' | 'failed';

interface FlowingTrailsBackgroundProps {
  /** Called once: 'ready' after the first frame is drawn, 'failed' if Canvas is unavailable. */
  onStatusChange?: (status: TrailsStatus) => void;
}

type Tone = readonly [number, number, number];

const TAU = Math.PI * 2;
const ORANGE: Tone = [255, 100, 28]; // brand accent #FF641C
const AMBER: Tone = [255, 176, 82];
const STEEL: Tone = [112, 146, 184];

interface Ribbon {
  baseY: number;
  amp: number;
  amp2: number;
  freq: number;
  freq2: number;
  speed: number;
  speed2: number;
  phase: number;
  phase2: number;
  depth: number;
  tone: Tone;
  alpha: number;
  strands: number;
  spread: number;
  gradient: CanvasGradient | null;
}

interface Mote {
  ribbon: number;
  strand: number;
  offset: number;
  speed: number;
  size: number;
}

// Seeded PRNG: the scene is identical on every load (no Math.random, SSR-safe).
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TONE_CYCLE: Tone[] = [ORANGE, STEEL, AMBER, STEEL, ORANGE, AMBER, STEEL, ORANGE, STEEL];
const TONE_ALPHA = new Map<Tone, number>([
  [ORANGE, 0.6],
  [AMBER, 0.42],
  [STEEL, 0.3],
]);

function buildScene(ribbonCount: number, moteCount: number) {
  const rng = mulberry32(20260619);
  const ribbons: Ribbon[] = [];
  for (let i = 0; i < ribbonCount; i++) {
    const f = ribbonCount > 1 ? i / (ribbonCount - 1) : 0.5;
    const tone = TONE_CYCLE[i % TONE_CYCLE.length];
    ribbons.push({
      baseY: 0.14 + f * 0.72 + (rng() - 0.5) * 0.06,
      amp: 0.05 + rng() * 0.09,
      amp2: 0.02 + rng() * 0.04,
      freq: 0.6 + rng() * 0.9,
      freq2: 1.4 + rng() * 1.3,
      speed: 0.2 + rng() * 0.3,
      speed2: 0.15 + rng() * 0.25,
      phase: rng() * TAU,
      phase2: rng() * TAU,
      depth: 0.3 + rng() * 0.9,
      tone,
      alpha: TONE_ALPHA.get(tone) ?? 0.4,
      strands: 2 + Math.floor(rng() * 2),
      spread: 0.35 + rng() * 0.4,
      gradient: null,
    });
  }
  const motes: Mote[] = [];
  for (let i = 0; i < moteCount; i++) {
    const ribbon = Math.floor(rng() * ribbonCount);
    motes.push({
      ribbon,
      strand: Math.floor(rng() * ribbons[ribbon].strands),
      offset: rng(),
      speed: 0.012 + rng() * 0.02,
      size: 0.7 + rng() * 0.9,
    });
  }
  return { ribbons, motes };
}

function yAt(r: Ribbon, strand: number, u: number, t: number, h: number) {
  const sp = strand * r.spread;
  return (
    h *
    (r.baseY +
      r.amp * Math.sin(u * r.freq * TAU + r.phase + t * r.speed + sp) +
      r.amp2 * Math.sin(u * r.freq2 * TAU + r.phase2 - t * r.speed2 - sp * 1.7))
  );
}

export const FlowingTrailsBackground: React.FC<FlowingTrailsBackgroundProps> = ({ onStatusChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef(onStatusChange);

  useEffect(() => {
    statusRef.current = onStatusChange;
  }, [onStatusChange]);

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
    if (!ctx) {
      statusRef.current?.('failed');
      return;
    }
    const c: CanvasRenderingContext2D = ctx;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarseQuery = window.matchMedia('(hover: none), (pointer: coarse)');

    let w = 0;
    let h = 0;
    let small = false;
    let scene = buildScene(9, 18);
    let sceneSmall = false;
    let t = 0;
    let last = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let reduced = motionQuery.matches;
    let failed = false;
    let announced = false;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const STATIC_T = 8;

    const buildGradients = () => {
      for (const r of scene.ribbons) {
        const [R, G, B] = r.tone;
        const g = c.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, `rgba(${R},${G},${B},0)`);
        g.addColorStop(0.2, `rgba(${R},${G},${B},0.7)`);
        g.addColorStop(0.55, `rgba(${R},${G},${B},1)`);
        g.addColorStop(0.85, `rgba(${R},${G},${B},0.7)`);
        g.addColorStop(1, `rgba(${R},${G},${B},0)`);
        r.gradient = g;
      }
    };

    const draw = (time: number, px: number, py: number) => {
      c.clearRect(0, 0, w, h);
      c.globalCompositeOperation = 'lighter';
      c.lineCap = 'round';
      c.lineJoin = 'round';

      const n = Math.max(24, Math.ceil(w / 12));

      for (const r of scene.ribbons) {
        const ox = px * r.depth * 22;
        const oy = py * r.depth * 12;
        if (r.gradient) c.strokeStyle = r.gradient;
        for (let s = 0; s < r.strands; s++) {
          c.beginPath();
          for (let i = 0; i <= n; i++) {
            const u = i / n;
            const x = u * w + ox;
            const y = yAt(r, s, u, time, h) + oy;
            if (i === 0) c.moveTo(x, y);
            else c.lineTo(x, y);
          }
          // soft bloom pass, then thin bright core
          c.globalAlpha = r.alpha * 0.16;
          c.lineWidth = 3 + r.depth * 3;
          c.stroke();
          c.globalAlpha = r.alpha * (0.5 + 0.2 * r.depth);
          c.lineWidth = 0.6 + r.depth * 0.5;
          c.stroke();
        }
      }

      // sparse motes riding the trails
      for (const m of scene.motes) {
        const r = scene.ribbons[m.ribbon];
        const p = (m.offset + time * m.speed) % 1;
        const x = p * w + px * r.depth * 22;
        const y = yAt(r, m.strand, p, time, h) + py * r.depth * 12;
        const fade = Math.sin(p * Math.PI);
        const [R, G, B] = r.tone;
        c.fillStyle = `rgb(${R},${G},${B})`;
        c.globalAlpha = 0.08 * fade;
        c.beginPath();
        c.arc(x, y, m.size * 4, 0, TAU);
        c.fill();
        c.globalAlpha = 0.7 * fade;
        c.beginPath();
        c.arc(x, y, m.size, 0, TAU);
        c.fill();
      }

      c.globalAlpha = 1;
      c.globalCompositeOperation = 'source-over';
    };

    const fail = () => {
      if (failed) return;
      failed = true;
      stop();
      c.clearRect(0, 0, w, h);
      canvas.style.opacity = '0';
      statusRef.current?.('failed');
    };

    const safeDraw = (time: number, px: number, py: number) => {
      if (failed) return;
      try {
        draw(time, px, py);
        if (!announced) {
          announced = true;
          canvas.style.opacity = '1';
          statusRef.current?.('ready');
        }
      } catch {
        fail();
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!running) return;
      const dt = now - last;
      const minInterval = small ? 33 : 0; // ~30fps on narrow screens
      if (dt < minInterval) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = now;
      t += Math.min(dt, 64) / 1000;
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      safeDraw(t, curX, curY);
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
      const shouldRun = !reduced && visible && !document.hidden;
      if (shouldRun) {
        start();
      } else {
        stop();
        if (reduced) safeDraw(STATIC_T, 0, 0);
      }
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const nw = Math.round(rect.width);
      const nh = Math.round(rect.height);
      if (nw < 2 || nh < 2) return;
      w = nw;
      h = nh;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = w < 640;
      if (small !== sceneSmall || !scene.ribbons.length) {
        scene = small ? buildScene(6, 10) : buildScene(9, 18);
        sceneSmall = small;
      }
      buildGradients();
      if (!running) safeDraw(reduced ? STATIC_T : t, 0, 0);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (reduced || e.pointerType === 'touch' || coarseQuery.matches) return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    const onVisibility = () => sync();
    const onMotionChange = () => {
      reduced = motionQuery.matches;
      if (reduced) {
        targetX = targetY = curX = curY = 0;
      }
      sync();
    };

    host.addEventListener('pointermove', onPointerMove, { passive: true });
    host.addEventListener('pointerleave', onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotionChange);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
    } else {
      window.addEventListener('resize', resize);
    }

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (entry) {
          visible = entry.isIntersecting;
          sync();
        }
      });
      intersectionObserver.observe(host);
    }

    resize();
    sync();

    return () => {
      stop();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', resize);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0, transition: 'opacity 1200ms ease' }}
    />
  );
};