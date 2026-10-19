// الملف: ValuePropositionSection.tsx
// الوظيفة: قسم يعرض أربع نقاط قيمة أساسية؛ تضيء تباعاً على "دارة" حية ولكل نقطة رسم مصغّر يتحرك عند تفعيلها
// المحتوى: مكوّن ValuePropositionSection مع مصفوفة propositions وأيقونات ونصوص مترجمة
// الاعتماديات: useLanguage وأيقونات Code2 وLayers وLightbulb وTrendingUp من lucide-react
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { Code2, Layers, Lightbulb, TrendingUp } from 'lucide-react';

const CYCLE_MS = 3200;

const CLEAN_CODE_STRIP = (
  <div className="flex flex-col justify-center gap-1.5 h-full">
    <i className="vp-b vp-b1 block h-1.5 rounded-full bg-[#FF641C]/60" />
    <i className="vp-b vp-b2 block h-1.5 rounded-full bg-[#FF641C]/60" />
    <i className="vp-b vp-b3 block h-1.5 rounded-full bg-[#FF641C]/60" />
  </div>
);

const MODERN_STACK_STRIP = (
  <div className="relative h-full">
    <i className="vp-l vp-l1 absolute inset-x-3 top-1/2 -mt-[5px] h-2.5 rounded bg-[#FF641C]/70 border border-[#FF641C]/50" />
    <i className="vp-l vp-l2 absolute inset-x-3 top-1/2 -mt-[5px] h-2.5 rounded bg-[#FF641C]/40 border border-[#FF641C]/40" />
    <i className="vp-l vp-l3 absolute inset-x-3 top-1/2 -mt-[5px] h-2.5 rounded bg-[#FF641C]/20 border border-[#FF641C]/30" />
  </div>
);

const PROBLEM_SOLVER_STRIP = (
  <div className="flex items-center h-full">
    <span className="vp-d vp-d1 relative w-3 h-3 rounded-full border border-[#2A3542] shrink-0"><i className="absolute inset-0 rounded-full bg-[#FF641C]" /></span>
    <span className="relative flex-1 h-px bg-[#1E2630]"><i className="vp-fill vp-f1 absolute inset-0 bg-[#FF641C]" /></span>
    <span className="vp-d vp-d2 relative w-3 h-3 rounded-full border border-[#2A3542] shrink-0"><i className="absolute inset-0 rounded-full bg-[#FF641C]" /></span>
    <span className="relative flex-1 h-px bg-[#1E2630]"><i className="vp-fill vp-f2 absolute inset-0 bg-[#FF641C]" /></span>
    <span className="vp-d vp-d3 relative w-3 h-3 rounded-full border border-[#2A3542] shrink-0">
      <i className="absolute inset-0 rounded-full bg-[#FF641C]" />
      <i className="vp-ping absolute -inset-1 rounded-full border border-[#FF641C] opacity-0" />
    </span>
  </div>
);

const GROWTH = [15, 30, 45, 60, 75];
const LEARNER_STRIP = (
  <div className="flex items-end gap-1.5 h-full">
    {GROWTH.map((g, i) => (
      <i
        key={g}
        className="vp-r block flex-1 rounded-t bg-[#FF641C]/60"
        style={{ '--g': `${g}%`, '--k': i } as React.CSSProperties}
      />
    ))}
  </div>
);

export const ValuePropositionSection: React.FC = () => {
  const { t, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const propositions = [
    {
      id: 'clean-code',
      icon: Code2,
      strip: CLEAN_CODE_STRIP,
      title: t('valueProps.prop1Title'),
      subtitle: t('valueProps.prop1Subtitle'),
      description: t('valueProps.prop1Desc'),
    },
    {
      id: 'modern-stack',
      icon: Layers,
      strip: MODERN_STACK_STRIP,
      title: t('valueProps.prop2Title'),
      subtitle: t('valueProps.prop2Subtitle'),
      description: t('valueProps.prop2Desc'),
    },
    {
      id: 'problem-solver',
      icon: Lightbulb,
      strip: PROBLEM_SOLVER_STRIP,
      title: t('valueProps.prop3Title'),
      subtitle: t('valueProps.prop3Subtitle'),
      description: t('valueProps.prop3Desc'),
    },
    {
      id: 'continuous-learner',
      icon: TrendingUp,
      strip: LEARNER_STRIP,
      title: t('valueProps.prop4Title'),
      subtitle: t('valueProps.prop4Subtitle'),
      description: t('valueProps.prop4Desc'),
    },
  ];

  // 'idle' (static, SSR-safe) -> 'armed' (hidden, waiting) -> 'shown' (plays once on first view)
  const sectionRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'armed' | 'shown'>('idle');
  const [active, setActive] = useState(-1);
  const [hovering, setHovering] = useState(false);

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
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Signal walks card to card; pauses while hovering or when the tab is hidden.
  useEffect(() => {
    if (state !== 'shown') return;
    setActive((a) => (a < 0 ? 0 : a));
    if (hovering) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((a) => (a + 1) % propositions.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, hovering]);

  const step = Math.max(active, 0);

  return (
    <section
      ref={sectionRef}
      data-state={state}
      data-rtl={isRtl ? 'true' : 'false'}
      className="vp-sec w-full bg-[#080D12] py-8 text-white border-y border-[#1E2630]"
    >
      <style>{`
        .vp-card { --p: 0; }
        .vp-card.vp-on { --p: 1; }

        /* entrance */
        [data-state='armed'] .vp-card { opacity: 0; transform: translateY(16px); }
        [data-state='shown'] .vp-card { animation: vpIn .7s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--i) * 110ms + 150ms); }
        @keyframes vpIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .vp-base { transform-origin: left; }
        .vp-sec[data-rtl='true'] .vp-base { transform-origin: right; }
        [data-state='armed'] .vp-base { transform: scaleX(0); }
        [data-state='shown'] .vp-base { animation: vpDraw 1s cubic-bezier(.22,1,.36,1) .1s both; }
        @keyframes vpDraw { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        /* circuit track: fill + orb slide to the active card's centre */
        .vp-fill-line { width: calc(var(--a) * (100% + 1rem) / 4); transition: width .9s cubic-bezier(.22,1,.36,1); }
        .vp-orb { inset-inline-start: calc((100% - 3rem) / 8 + var(--a) * (100% + 1rem) / 4); transition: inset-inline-start .9s cubic-bezier(.22,1,.36,1), opacity .4s; box-shadow: 0 0 12px 3px rgba(255,100,28,.65); }

        /* active card */
        .vp-card { transition: border-color .5s ease, background-color .5s ease, box-shadow .5s ease; }
        .vp-card.vp-on { border-color: rgba(255,100,28,.55); background-color: #131D2A; box-shadow: 0 0 28px -8px rgba(255,100,28,.4); }
        .vp-ico { transition: transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .5s ease, background-color .5s ease; }
        .vp-card.vp-on .vp-ico { transform: scale(1.08); background-color: rgba(255,100,28,.2); box-shadow: 0 0 16px rgba(255,100,28,.5); }
        .vp-card.vp-on .vp-title { color: #FF641C; }
        .vp-stub { transition: background-color .5s ease; }
        .vp-card.vp-on .vp-stub, .vp-card.vp-on .vp-node { background-color: #FF641C; }
        .vp-node { transition: background-color .5s ease, box-shadow .5s ease; }
        .vp-card.vp-on .vp-node { box-shadow: 0 0 10px 2px rgba(255,100,28,.7); }

        /* mini illustrations, driven by --p (0 idle, 1 active) */
        .vp-b { transition: width .8s cubic-bezier(.22,1,.36,1); }
        .vp-b1 { width: calc(30% + var(--p) * 40%); }
        .vp-b2 { width: calc(85% - var(--p) * 15%); transition-delay: 80ms; }
        .vp-b3 { width: calc(55% + var(--p) * 15%); transition-delay: 160ms; }
        .vp-l { transition: transform .8s cubic-bezier(.34,1.56,.64,1); }
        .vp-l1 { transform: translateY(calc(var(--p) * -10px)); }
        .vp-l3 { transform: translateY(calc(var(--p) * 10px)); transition-delay: 80ms; }
        .vp-d i { opacity: var(--p); transition: opacity .4s ease; }
        .vp-d1 i { transition-delay: 0ms; } .vp-d2 i { transition-delay: 450ms; } .vp-d3 i { transition-delay: 850ms; }
        .vp-fill { transform: scaleX(var(--p)); transform-origin: left; transition: transform .45s ease; }
        .vp-f1 { transition-delay: 150ms; } .vp-f2 { transition-delay: 550ms; }
        .vp-card.vp-on .vp-ping { animation: vpPing 1.3s ease-out 1s both; }
        @keyframes vpPing { 0% { transform: scale(.6); opacity: .8; } 100% { transform: scale(1.8); opacity: 0; } }
        .vp-r { height: calc(20% + var(--p) * var(--g)); transition: height .7s cubic-bezier(.22,1,.36,1); transition-delay: calc(var(--k) * 90ms); }

        @media (prefers-reduced-motion: reduce) {
          [data-state] .vp-card, [data-state] .vp-base { opacity: 1 !important; transform: none !important; animation: none !important; }
          .vp-card { --p: 1 !important; }
          .vp-card, .vp-card * { transition: none !important; animation: none !important; }
          .vp-orb, .vp-ping { display: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative lg:pt-6"
          style={{ '--a': step } as React.CSSProperties}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Circuit track (desktop): nodes sit on each card, a signal travels between them */}
          <div className="hidden lg:block absolute inset-x-0 top-0 pointer-events-none" aria-hidden="true">
            <div
              className="vp-base absolute h-px bg-[#1E2630]"
              style={{ top: 10, insetInlineStart: 'calc((100% - 3rem) / 8)', width: 'calc(3 * (100% + 1rem) / 4)' }}
            ></div>
            <div
              className="vp-fill-line absolute h-px bg-[#FF641C]"
              style={{ top: 10, insetInlineStart: 'calc((100% - 3rem) / 8)' }}
            ></div>
            <div
              className="vp-orb absolute w-3 h-3 rounded-full bg-[#FF641C]"
              style={{ top: 4, marginInlineStart: -6, opacity: active < 0 ? 0 : 1 }}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {propositions.map((item, index) => {
              const Icon = item.icon;
              const on = active === index;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setHovering(true);
                    setActive(index);
                  }}
                  className={`vp-card ${on ? 'vp-on' : ''} relative bg-[#0E151E] border border-[#1E2630] rounded-xl p-5 flex flex-col`}
                  style={{ '--i': index } as React.CSSProperties}
                >
                  {/* stub + node linking the card to the circuit track */}
                  <span
                    className="vp-stub hidden lg:block absolute w-px h-[14px] -top-[14px] bg-[#1E2630]"
                    style={{ insetInlineStart: '50%' }}
                    aria-hidden="true"
                  ></span>
                  <span
                    className="vp-node hidden lg:block absolute w-2 h-2 -top-[18px] rounded-full bg-[#2A3542]"
                    style={{ insetInlineStart: '50%', marginInlineStart: -4 }}
                    aria-hidden="true"
                  ></span>

                  <div className="flex items-start gap-4">
                    <div className="vp-ico w-10 h-10 rounded-lg bg-[#FF641C]/10 border border-[#FF641C]/30 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#FF641C]" />
                    </div>
                    <div>
                      <h3 className="vp-title text-sm font-bold text-white transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-300 mt-0.5 mb-1.5">
                        {item.subtitle}
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Mini illustration: plays while this card is active */}
                  <div className="h-9 mt-4 pt-3 border-t border-[#1E2630]/70 box-content" aria-hidden="true" dir="ltr">
                    {item.strip}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};