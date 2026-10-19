// الملف: ProjectCardFx.tsx
// الوظيفة: بطاقة مشروع "حيّة": وهج برتقالي يتبع المؤشر على سطح البطاقة وحوافها مع ميلان خفيف ثلاثي الأبعاد.
// المحتوى: مكوّن SpotlightCard فقط؛ كل الحركة عبر متغيرات CSS (--mx, --my, --rx, --ry) تُكتب مباشرة بدون حالة React.
// الاعتماديات: React فقط؛ بدون مكتبات. يعمل مع الماوس فقط ويتعطل على اللمس وعند تفعيل تقليل الحركة.
import React, { useEffect, useRef } from 'react';

interface SpotlightCardProps {
  className?: string;
  /** تُخفَّت البطاقة عندما لا تطابق التقنية المختارة. */
  dimmed?: boolean;
  /** تُبرز البطاقة عندما تطابق التقنية المختارة. */
  highlighted?: boolean;
  children: React.ReactNode;
}

const MAX_TILT_DEG = 7; // الميلان الأقصى ±3.5 درجة

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  className = '',
  dimmed = false,
  highlighted = false,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const enabled = useRef(false);
  const raf = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    const sync = () => {
      enabled.current = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // قراءة واحدة ثم كتابة واحدة في كل إطار (بدون layout thrashing)
  const paint = () => {
    raf.current = 0;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = pointer.current.x - r.left;
    const y = pointer.current.y - r.top;
    const px = x / r.width;
    const py = y / r.height;
    el.style.setProperty('--mx', `${x.toFixed(0)}px`);
    el.style.setProperty('--my', `${y.toFixed(0)}px`);
    el.style.setProperty('--ry', `${((px - 0.5) * MAX_TILT_DEG).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-(py - 0.5) * MAX_TILT_DEG).toFixed(2)}deg`);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled.current || e.pointerType !== 'mouse') return;
    pointer.current.x = e.clientX;
    pointer.current.y = e.clientY;
    if (!raf.current) raf.current = requestAnimationFrame(paint);
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`group relative hover:[transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] ${
        dimmed ? 'opacity-35 saturate-50' : ''
      } ${highlighted ? 'ring-1 ring-[#FF641C]/50 shadow-lg shadow-[#FF641C]/10' : ''} ${className}`}
    >
      {/* وهج السطح */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(255,100,28,0.15), transparent 65%)',
        }}
      />
      {/* وهج الحافة (حلقة بسُمك 1px تتبع المؤشر) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          padding: 1,
          background:
            'radial-gradient(190px circle at var(--mx, 50%) var(--my, 50%), rgba(255,100,28,0.95), transparent 70%)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;