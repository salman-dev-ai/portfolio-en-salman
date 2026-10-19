// File: StrandsBackground.tsx
// Purpose: "Interactive Interwoven Strands" animated Hero background (Canvas 2D, no dependencies)
// Responsibilities:
//   - Scene generation (deterministic, seeded)      -> buildScene / mulberry32
//   - Per-frame weave + pointer + ripple physics    -> draw()
//   - Lifecycle, resize, visibility, reduced motion -> useEffect
// All high-frequency work stays inside the canvas loop: no React state updates per frame.
import React, { useEffect, useRef } from 'react';

interface StrandsBackgroundProps {
  className?: string;
  /** Dim the strands behind the text column so the heading stays readable. */
  protectText?: boolean;
  /** Draw a deep espresso base in dark mode (the strands still work without it). */
  showBase?: boolean;
}

interface Bundle {
  baseY: number; // fraction of height
  amp: number; // fraction of height
  f1: number;
  f2: number;
  s1: number;
  s2: number;
  p1: number;
  p2: number;
  spread: number; // fraction of height
  twist: number; // cycles across the width
}

interface Strand {
  bundle: number;
  phase: number;
  tw: number;
  ts: number;
  spreadK: number;
  f3: number;
  s3: number;
  p3: number;
  fine: number;
  alpha: number;
  width: number;
  warm: number; // 0 amber .. 1 burnt orange
  gold: boolean;
  glow: boolean;
  style: string;
}

interface Ripple {
  x: number;
  y: number;
  age: number;
  amp: number;
  front: number;
  fade: number;
}

const TAU = Math.PI * 2;

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

function strandColor(s: Pick<Strand, 'warm' | 'gold'>, dark: boolean): string {
  if (dark) {
    if (s.gold) return 'rgb(255,214,140)';
    const g = Math.round(176 - 76 * s.warm);
    const b = Math.round(64 - 36 * s.warm);
    return `rgb(255,${g},${b})`;
  }
  if (s.gold) return 'rgb(196,122,24)';
  const r = Math.round(214 - 54 * s.warm);
  const g = Math.round(84 - 24 * s.warm);
  return `rgb(${r},${g},16)`;
}

function buildScene(strandCount: number, bundleCount: number, dark: boolean) {
  const rnd = mulberry32(20261019);
  const bundles: Bundle[] = [];
  for (let b = 0; b < bundleCount; b++) {
    bundles.push({
      baseY: 0.16 + ((b + 0.5) / bundleCount) * 0.68 + (rnd() - 0.5) * 0.05,
      amp: 0.06 + rnd() * 0.07,
      f1: 0.6 + rnd() * 0.6,
      f2: 1.3 + rnd() * 1.1,
      s1: 0.12 + rnd() * 0.18,
      s2: 0.1 + rnd() * 0.2,
      p1: rnd() * TAU,
      p2: rnd() * TAU,
      spread: 0.035 + rnd() * 0.04,
      twist: 1.4 + rnd() * 1.2,
    });
  }
  const strands: Strand[] = [];
  for (let i = 0; i < strandCount; i++) {
    const bundle = i % bundleCount;
    const bd = bundles[bundle];
    const warm = rnd();
    const gold = rnd() < 0.12;
    const strand: Strand = {
      bundle,
      phase: rnd() * TAU,
      tw: (bd ? bd.twist : 2) * (0.85 + rnd() * 0.3),
      ts: (rnd() < 0.5 ? -1 : 1) * (0.18 + rnd() * 0.3),
      spreadK: 0.5 + rnd() * 0.75,
      f3: 3 + rnd() * 4,
      s3: 0.3 + rnd() * 0.5,
      p3: rnd() * TAU,
      fine: rnd() * 0.8,
      alpha: 0.14 + Math.pow(rnd(), 2) * 0.36,
      width: 0.5 + rnd() * 0.6,
      warm,
      gold,
      glow: rnd() < 0.35,
      style: '',
    };
    strand.style = strandColor(strand, dark);
    strands.push(strand);
  }
  return { bundles, strands };
}

export const StrandsBackground: React.FC<StrandsBackgroundProps> = ({
  className = '',
  protectText = true,
  showBase = true,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const host: HTMLElement = wrapper.parentElement ?? wrapper;
    const root = document.documentElement;
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ---- mutable state (lives outside React) ----
    let w = 1;
    let h = 1;
    let dpr = 1;
    let mobile = false;
    let lowPower = false;
    let dark = root.classList.contains('dark');
    let reduced = reducedMq.matches;
    let visible = true;
    let rtl = getComputedStyle(host).direction === 'rtl';
    let intensity = 1;
    let quality = 1;

    let bundles: Bundle[] = [];
    let strands: Strand[] = [];
    let xs = new Float32Array(0);
    let xb = new Float32Array(0);
    let yb = new Float32Array(0);
    let db = new Float32Array(0);
    let centers = new Float32Array(0);

    const ptr = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      tx: 0,
      ty: 0,
      active: false,
      presence: 0,
      energy: 0,
    };
    const ripples: Ripple[] = [];

    let time = 8;
    let raf = 0;
    let last = 0;
    let running = false;
    let emaDt = 16;
    let slowFrames = 0;

    // ---- sizing / scene ----
    const resize = () => {
      const r = wrapper.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      mobile = w < 640;
      const nav = navigator as Navigator & { deviceMemory?: number };
      lowPower =
        (navigator.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4);
      intensity = mobile ? 0.8 : 1;
      rtl = getComputedStyle(host).direction === 'rtl';

      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2) * (lowPower ? 0.8 : 1);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));

      const step = mobile ? 18 : lowPower ? 14 : 10;
      const cols = Math.ceil(w / step) + 1;
      xs = new Float32Array(cols);
      for (let i = 0; i < cols; i++) xs[i] = Math.min(w, i * step);
      xb = new Float32Array(cols);
      yb = new Float32Array(cols);
      db = new Float32Array(cols);

      const strandCount = mobile ? 42 : lowPower ? 64 : 96;
      const bundleCount = mobile ? 3 : 5;
      const scene = buildScene(strandCount, bundleCount, dark);
      bundles = scene.bundles;
      strands = scene.strands;
      centers = new Float32Array(bundleCount * cols);
    };

    const recolor = () => {
      for (const s of strands) s.style = strandColor(s, dark);
    };

    // ---- drawing ----
    const draw = (dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const cols = xs.length;

      // update interaction state
      if (dt > 0) {
        const k = 140;
        const c = 15;
        ptr.vx += ((ptr.tx - ptr.x) * k - ptr.vx * c) * dt;
        ptr.vy += ((ptr.ty - ptr.y) * k - ptr.vy * c) * dt;
        ptr.x += ptr.vx * dt;
        ptr.y += ptr.vy * dt;
        ptr.presence += ((ptr.active ? 1 : 0) - ptr.presence) * (1 - Math.exp(-dt * (ptr.active ? 6 : 2.2)));
        ptr.energy *= Math.exp(-dt * 2.2);
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];
          if (!rp) continue;
          rp.age += dt;
          rp.front = rp.age * 340;
          rp.fade = Math.exp(-rp.age * 1.5);
          if (rp.age > 2.6) ripples.splice(i, 1);
        }
      }

      // bundle centrelines, shared by all strands in the bundle
      for (let b = 0; b < bundles.length; b++) {
        const bd = bundles[b];
        if (!bd) continue;
        const off = b * cols;
        for (let i = 0; i < cols; i++) {
          const u = (xs[i] ?? 0) / w;
          centers[off + i] =
            (bd.baseY +
              bd.amp *
                (Math.sin(u * bd.f1 * TAU + time * bd.s1 + bd.p1) +
                  0.5 * Math.sin(u * bd.f2 * TAU - time * bd.s2 + bd.p2))) *
            h;
        }
      }

      const hasPtr = ptr.presence > 0.01;
      const pa = ptr.presence * intensity;
      const pe = ptr.energy;
      const R = Math.max(130, Math.min(w, h) * 0.24);
      const R2 = R * R;
      const sig = R2 * 0.38;
      const nRip = ripples.length;
      const active = Math.max(12, Math.ceil(strands.length * quality));
      const doGlow = dark && !lowPower && quality > 0.6;
      const CH = 10;
      const alphaMul = dark ? 1 : 0.8;

      for (let si = 0; si < active && si < strands.length; si++) {
        const s = strands[si];
        if (!s) continue;
        const bd = bundles[s.bundle];
        if (!bd) continue;
        const off = s.bundle * cols;
        const spread = bd.spread * s.spreadK * h;

        for (let i = 0; i < cols; i++) {
          const x = xs[i] ?? 0;
          const u = x / w;
          const ang = u * s.tw * TAU + time * s.ts + s.phase;
          const depth = Math.cos(ang);
          let y =
            (centers[off + i] ?? 0) +
            spread * Math.sin(ang) * (1 + 0.15 * depth) +
            s.fine * h * 0.01 * Math.sin(u * s.f3 * TAU + time * s.s3 + s.p3);
          let px = x;

          if (hasPtr) {
            const dx = px - ptr.x;
            const dy = y - ptr.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2 * 1.6) {
              const f = Math.exp(-d2 / sig) * pa;
              const d = Math.sqrt(d2) + 0.001;
              const nx = dx / d;
              const ny = dy / d;
              const wave = Math.sin(d * 0.05 - time * 6) * (3 + 16 * pe) * f;
              px += (-nx * 9 - ny * 16) * f + nx * wave;
              y += (-ny * 9 + nx * 16) * f + ny * wave;
            }
          }

          for (let r = 0; r < nRip; r++) {
            const rp = ripples[r];
            if (!rp) continue;
            const dx = px - rp.x;
            const dy = y - rp.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const diff = d - rp.front;
            if (diff > 220 || diff < -220) continue;
            const ring = Math.exp(-(diff * diff) / 7200) * rp.fade * rp.amp * intensity;
            px += (dx / d) * ring;
            y += (dy / d) * ring;
          }

          xb[i] = px;
          yb[i] = y;
          db[i] = depth;
        }

        ctx.strokeStyle = s.style;
        const glow = doGlow && s.glow;
        for (let i0 = 0; i0 < cols - 1; i0 += CH) {
          const i1 = Math.min(i0 + CH, cols - 1);
          const mid = (i0 + i1) >> 1;
          const depth01 = ((db[mid] ?? 0) + 1) / 2;
          const xm = xb[mid] ?? 0;
          const edge = Math.max(0, Math.min(1, xm / (w * 0.08), (w - xm) / (w * 0.08)));
          const a = s.alpha * (0.25 + 0.75 * depth01) * edge * alphaMul;
          if (a < 0.005) continue;
          ctx.beginPath();
          ctx.moveTo(xb[i0] ?? 0, yb[i0] ?? 0);
          for (let j = i0 + 1; j <= i1; j++) ctx.lineTo(xb[j] ?? 0, yb[j] ?? 0);
          if (glow) {
            ctx.globalAlpha = a * 0.14;
            ctx.lineWidth = s.width * 5;
            ctx.stroke();
          }
          ctx.globalAlpha = a;
          ctx.lineWidth = s.width * (0.7 + 0.5 * depth01);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // keep the text column calm
      if (protectText) {
        ctx.globalCompositeOperation = 'destination-out';
        if (w >= 1024) {
          const cx = rtl ? w * 0.71 : w * 0.29;
          const rx = w * 0.34;
          const ry = h * 0.62;
          ctx.save();
          ctx.translate(cx, h * 0.5);
          ctx.scale(1, ry / rx);
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
          g.addColorStop(0, 'rgba(0,0,0,0.85)');
          g.addColorStop(0.55, 'rgba(0,0,0,0.6)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(-2 * w, -2 * w, 4 * w, 4 * w);
          ctx.restore();
        } else {
          ctx.fillStyle = 'rgba(0,0,0,0.45)';
          ctx.fillRect(0, 0, w, h);
        }
      }

      // pointer glow + click pulses (drawn after the mask so they stay visible)
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
      const rgb = dark ? '255,176,70' : '214,84,16';
      if (hasPtr) {
        const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 130);
        g.addColorStop(0, `rgba(${rgb},${(0.1 * ptr.presence * intensity).toFixed(3)})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(ptr.x - 130, ptr.y - 130, 260, 260);
      }
      for (let i = 0; i < nRip; i++) {
        const rp = ripples[i];
        if (!rp) continue;
        const fade = Math.exp(-rp.age * 2.0);
        const rad = 30 + rp.front * 0.35;
        const g = ctx.createRadialGradient(rp.x, rp.y, 0, rp.x, rp.y, rad);
        g.addColorStop(0, `rgba(${rgb},${(0.34 * fade).toFixed(3)})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(rp.x - rad, rp.y - rad, rad * 2, rad * 2);
        ctx.strokeStyle = `rgba(${rgb},${(0.26 * fade).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, Math.max(1, rp.front), 0, TAU);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    // ---- loop control ----
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      time += dt;
      draw(dt);

      // adaptive quality: step down if the device cannot hold ~40fps
      emaDt += (dt * 1000 - emaDt) * 0.1;
      if (emaDt > 26) slowFrames++;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 90 && quality > 0.4) {
        quality = Math.max(0.4, quality - 0.2);
        slowFrames = 0;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => {
      if (reduced) {
        stop();
        ripples.length = 0;
        ptr.active = false;
        ptr.presence = 0;
        draw(0); // single static frame
      } else if (visible && !document.hidden) {
        start();
      } else {
        stop();
      }
    };

    // ---- pointer input (listeners on the Hero, canvas itself never intercepts) ----
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const p = local(e);
      if (!ptr.active) {
        ptr.x = p.x;
        ptr.y = p.y;
        ptr.vx = 0;
        ptr.vy = 0;
        ptr.active = true;
      } else {
        ptr.energy = Math.min(1, ptr.energy + Math.min(0.25, Math.hypot(p.x - ptr.tx, p.y - ptr.ty) / 200));
      }
      ptr.tx = p.x;
      ptr.ty = p.y;
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      const p = local(e);
      if (e.pointerType !== 'mouse') {
        ptr.x = ptr.tx = p.x;
        ptr.y = ptr.ty = p.y;
        ptr.vx = ptr.vy = 0;
        ptr.active = true;
      }
      ripples.push({ x: p.x, y: p.y, age: 0, amp: 30, front: 0, fade: 1 });
      if (ripples.length > 8) ripples.shift();
      ptr.energy = Math.min(1, ptr.energy + 0.5);
    };
    const onLeave = () => {
      ptr.active = false;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') ptr.active = false;
    };

    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerdown', onDown, { passive: true });
    host.addEventListener('pointerup', onUp, { passive: true });
    host.addEventListener('pointerleave', onLeave, { passive: true });
    host.addEventListener('pointercancel', onLeave, { passive: true });

    // ---- observers ----
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || !running) draw(0);
    });
    ro.observe(wrapper);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((en) => en.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    io.observe(wrapper);

    const mo = new MutationObserver(() => {
      const next = root.classList.contains('dark');
      if (next !== dark) {
        dark = next;
        recolor();
        if (reduced || !running) draw(0);
      }
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });

    const onReduced = () => {
      reduced = reducedMq.matches;
      sync();
    };
    reducedMq.addEventListener('change', onReduced);
    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    sync();

    return () => {
      stop();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointerup', onUp);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointercancel', onLeave);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      reducedMq.removeEventListener('change', onReduced);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [protectText]);

  const fade =
    'linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)';

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      {showBase && (
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              'radial-gradient(120% 90% at 70% 40%, #1a0f08 0%, #0b0705 55%, #060403 100%)',
          }}
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
};

export default StrandsBackground;