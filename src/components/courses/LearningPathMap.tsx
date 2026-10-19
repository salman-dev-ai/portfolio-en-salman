// الملف: LearningPathMap.tsx
// الوظيفة: خريطة المسار التعليمي المتحركة (مبتدئ ← متوسط ← متقدم) لبانر صفحة الدورات، مع مكوّنات مساعدة للحركة.
// المحتوى: LearningPathMap (مسار SVG يُرسم تدريجيًا + محطات تفاعلية)، AnimatedNumber (عدّاد تصاعدي)، Reveal (ظهور تدريجي).
// الاعتماديات: React فقط + أنواع Course؛ بدون أي مكتبة إضافية، ويحترم prefers-reduced-motion.
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Course, CourseDifficulty } from '../../types/portfolio.ts';

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

/** Becomes true once (and stays true) when the element first enters the viewport. */
function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* ------------------------------------------------------------------ */
/* AnimatedNumber: counts up when it scrolls into view                 */
/* ------------------------------------------------------------------ */

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  suffix = '',
  duration = 1400,
}) => {
  const [ref, inView] = useInView<HTMLSpanElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const fmt = (v: number) => v.toFixed(decimals) + suffix;

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduced) {
      el.textContent = fmt(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(value * eased); // direct DOM write: no React state per frame
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value, decimals, suffix, duration]);

  return <span ref={ref}>{fmt(0)}</span>;
};

/* ------------------------------------------------------------------ */
/* Reveal: fade + rise when scrolled into view                         */
/* ------------------------------------------------------------------ */

interface RevealProps {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export const Reveal: React.FC<RevealProps> = ({ delay = 0, className = '', children }) => {
  const [ref, inView] = useInView<HTMLDivElement>(0.12);
  const reduced = usePrefersReducedMotion();
  const shown = inView || reduced;
  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* LearningPathMap                                                     */
/* ------------------------------------------------------------------ */

interface Pt {
  x: number;
  y: number;
}

const DIFF_RANK: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };

const DIFF_NODE: Record<string, string> = {
  Beginner: 'border-amber-500 text-amber-600 dark:text-amber-400',
  Intermediate: 'border-blue-500 text-blue-600 dark:text-blue-400',
  Advanced: 'border-emerald-500 text-emerald-600 dark:text-emerald-400',
};

const DIFF_LABEL_AR: Record<string, string> = {
  Beginner: 'مبتدئ',
  Intermediate: 'متوسط',
  Advanced: 'متقدم',
};

function rankOf(d: CourseDifficulty) {
  return DIFF_RANK[String(d)] ?? 3;
}

/** Catmull-Rom spline through the points, converted to cubic Béziers. */
function smoothPath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))] as Pt;
  const f = (n: number) => n.toFixed(1);
  const first = at(0);
  let d = `M ${f(first.x)} ${f(first.y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

interface LearningPathMapProps {
  courses: Course[];
  activeId: Course['id'] | null;
  onHover: (id: Course['id'] | null) => void;
  onSelect: (id: Course['id']) => void;
  isRtl: boolean;
}

export const LearningPathMap: React.FC<LearningPathMapProps> = ({
  courses,
  activeId,
  onHover,
  onSelect,
  isRtl,
}) => {
  const [boxRef, inView] = useInView<HTMLDivElement>(0.25);
  const reduced = usePrefersReducedMotion();
  const gid = useId().replace(/:/g, '');
  const [width, setWidth] = useState(0);
  const [settled, setSettled] = useState(false);

  // measure container (the only state that changes on resize)
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = (w: number) => {
      const r = Math.round(w);
      setWidth((prev) => (prev === r ? prev : r));
    };
    measure(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) measure(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [boxRef]);

  // after the entrance animation, node transitions lose their stagger delay
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setSettled(true), reduced ? 0 : 2900);
    return () => window.clearTimeout(t);
  }, [inView, reduced]);

  const sorted = useMemo(
    () =>
      courses
        .map((c, i) => ({ c, i }))
        .sort((a, b) => rankOf(a.c.difficulty) - rankOf(b.c.difficulty) || a.i - b.i)
        .map((x) => x.c),
    [courses],
  );
  const n = sorted.length;
  const vertical = width > 0 && width < 640;

  const layout = useMemo(() => {
    if (!width || n === 0) return null;
    const pts: Pt[] = [];
    let height: number;
    let step: number;
    if (vertical) {
      const rowH = 92;
      height = n * rowH + 24;
      step = rowH;
      for (let i = 0; i < n; i++) {
        const x = width * (i % 2 === 0 ? 0.3 : 0.7);
        pts.push({ x: isRtl ? width - x : x, y: 36 + i * rowH });
      }
    } else {
      height = 260;
      const pad = 56;
      const dx = n > 1 ? (width - pad * 2) / (n - 1) : 0;
      step = dx;
      for (let i = 0; i < n; i++) {
        const x = n > 1 ? pad + i * dx : width / 2;
        pts.push({
          x: isRtl ? width - x : x,
          y: n > 1 ? height / 2 + (i % 2 === 0 ? 46 : -46) : height / 2,
        });
      }
    }
    return { pts, height, step, d: smoothPath(pts) };
  }, [width, n, vertical, isRtl]);

  const activeIdx = sorted.findIndex((c) => c.id === activeId);
  const activeFrac = n > 1 && activeIdx >= 0 ? Math.max(0.02, activeIdx / (n - 1)) : 0;
  const drawn = inView || reduced;

  const title = isRtl ? 'رحلتك التعليمية خطوة بخطوة' : 'Your learning journey, step by step';
  const hint = isRtl ? 'اضغط على أي محطة للانتقال إلى الدورة' : 'Tap any stop to jump to its course';
  const legend: { key: string; dot: string; label: string }[] = [
    { key: 'Beginner', dot: 'bg-amber-500', label: isRtl ? 'مبتدئ' : 'Beginner' },
    { key: 'Intermediate', dot: 'bg-blue-500', label: isRtl ? 'متوسط' : 'Intermediate' },
    { key: 'Advanced', dot: 'bg-emerald-500', label: isRtl ? 'متقدم' : 'Advanced' },
  ];

  if (n === 0) return null;

  return (
    <div className="mt-10 rounded-2xl border border-[#E8E0D5] bg-white/70 p-4 backdrop-blur-sm dark:border-[#1E2630] dark:bg-[#080D12]/80 sm:p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#080D12] dark:text-white sm:text-base">{title}</h2>
          <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">{hint}</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF]">
          {legend.map((l, i) => (
            <React.Fragment key={l.key}>
              {i > 0 && <span aria-hidden="true" className="text-[#9CA3AF]">{isRtl ? '←' : '→'}</span>}
              <span className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${l.dot}`} />
                {l.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div
        ref={boxRef}
        role="group"
        aria-label={title}
        className="relative w-full"
        style={{ height: layout ? layout.height : 260 }}
      >
        {layout && (
          <>
            <svg
              width={width}
              height={layout.height}
              viewBox={`0 0 ${width} ${layout.height}`}
              className="pointer-events-none absolute inset-0 overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id={`lpm-${gid}`}
                  gradientUnits="userSpaceOnUse"
                  x1={vertical ? 0 : isRtl ? width : 0}
                  y1={0}
                  x2={vertical ? 0 : isRtl ? 0 : width}
                  y2={vertical ? layout.height : 0}
                >
                  <stop offset="0" stopColor="#F59E0B" />
                  <stop offset="0.55" stopColor="#FF641C" />
                  <stop offset="1" stopColor="#FF8A3D" />
                </linearGradient>
              </defs>

              {/* faint dashed track (always visible) */}
              <path
                d={layout.d}
                fill="none"
                strokeWidth={2}
                strokeDasharray="4 8"
                strokeLinecap="round"
                className="stroke-[#E8E0D5] dark:stroke-[#1E2630]"
              />

              {/* soft glow under the drawn line */}
              <path
                d={layout.d}
                fill="none"
                stroke={`url(#lpm-${gid})`}
                strokeWidth={8}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={drawn ? 0 : 1}
                opacity={0.16}
                style={{
                  filter: 'blur(4px)',
                  transition: reduced ? 'none' : 'stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1)',
                }}
              />

              {/* the line that draws itself */}
              <path
                d={layout.d}
                fill="none"
                stroke={`url(#lpm-${gid})`}
                strokeWidth={2.5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={drawn ? 0 : 1}
                style={{
                  transition: reduced ? 'none' : 'stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1)',
                }}
              />

              {/* bright progress up to the hovered / selected stop */}
              <path
                d={layout.d}
                fill="none"
                stroke="#FFC9A3"
                strokeWidth={4}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - activeFrac}
                opacity={activeIdx >= 0 && drawn ? 0.95 : 0}
                style={{
                  transition: reduced ? 'none' : 'stroke-dashoffset 0.6s ease, opacity 0.3s ease',
                }}
              />

              {/* travelling light: a "student" moving along the path */}
              {drawn && !reduced && n > 1 && (
                <g>
                  {[9, 4].map((r) => (
                    <circle key={r} r={r} fill="#FF641C" opacity={0} fillOpacity={r === 9 ? 0.25 : 1}>
                      <animateMotion dur="10s" begin="2.4s" repeatCount="indefinite" path={layout.d} />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.06;0.94;1"
                        dur="10s"
                        begin="2.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                </g>
              )}
            </svg>

            {/* stops */}
            {sorted.map((c, i) => {
              const p = layout.pts[i];
              if (!p) return null;
              const isActive = activeId === c.id;
              const level = String(c.difficulty);
              const courseTitle = isRtl ? c.title.ar : c.title.en;
              const levelLabel = isRtl ? DIFF_LABEL_AR[level] ?? level : level;
              const delay = n > 1 ? (i / (n - 1)) * 2200 : 0;
              const showLabel = vertical || layout.step >= 84 || isActive;
              const up = !vertical && i % 2 === 1;
              const leftHalf = p.x < width / 2;
              const labelW = vertical
                ? Math.max(100, width * 0.5 - 48)
                : Math.max(72, Math.min(130, layout.step * 0.92 || 130));

              const labelStyle: React.CSSProperties = vertical
                ? leftHalf
                  ? { left: p.x + 30, top: p.y, width: labelW, transform: 'translateY(-50%)', textAlign: 'left' }
                  : { left: p.x - 30, top: p.y, width: labelW, transform: 'translate(-100%,-50%)', textAlign: 'right' }
                : {
                    left: p.x,
                    top: up ? p.y - 28 : p.y + 28,
                    width: labelW,
                    transform: up ? 'translate(-50%,-100%)' : 'translate(-50%,0)',
                    textAlign: 'center',
                  };

              return (
                <React.Fragment key={c.id}>
                  <div
                    className={`absolute -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-20' : 'z-10'}`}
                    style={{ left: p.x, top: p.y }}
                  >
                    <button
                      type="button"
                      aria-label={`${courseTitle} — ${levelLabel}`}
                      title={courseTitle}
                      onClick={() => onSelect(c.id)}
                      onMouseEnter={() => onHover(c.id)}
                      onMouseLeave={() => onHover(null)}
                      onFocus={() => onHover(c.id)}
                      onBlur={() => onHover(null)}
                      style={{ transitionDelay: settled ? '0ms' : `${delay}ms` }}
                      className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 bg-white text-xs font-extrabold shadow-md transition-all duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF641C]/40 motion-reduce:transition-none dark:bg-[#0A1017] ${
                        DIFF_NODE[level] ?? 'border-gray-400 text-gray-500'
                      } ${
                        drawn ? (isActive ? 'scale-125 opacity-100 ring-4 ring-[#FF641C]/30' : 'scale-100 opacity-100') : 'scale-50 opacity-0'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute inset-0 animate-ping rounded-full bg-[#FF641C]/30 motion-reduce:animate-none" />
                      )}
                      <span className="relative">{i + 1}</span>
                      {c.featured && (
                        <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#FF641C] dark:border-[#0A1017]" />
                      )}
                    </button>
                  </div>

                  {showLabel && (
                    <div
                      aria-hidden="true"
                      style={{ ...labelStyle, transitionDelay: settled ? '0ms' : `${delay + 200}ms` }}
                      className={`pointer-events-none absolute rounded px-1.5 py-0.5 text-[11px] font-semibold leading-tight backdrop-blur-sm transition-all duration-500 motion-reduce:transition-none ${
                        isActive
                          ? 'z-20 bg-[#FF641C]/10 text-[#FF641C]'
                          : 'z-10 bg-white/70 text-[#374151] dark:bg-[#080D12]/70 dark:text-[#D1D5DB]'
                      } ${drawn ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <span className="line-clamp-2">{courseTitle}</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default LearningPathMap;