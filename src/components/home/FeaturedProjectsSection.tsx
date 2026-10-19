// الملف: FeaturedProjectsSection.tsx
// الوظيفة: "مسرح المشروع": المشروع النشط داخل نافذة متصفح كبيرة مع قائمة تشغيل للمشاريع المميزة
// المحتوى: مكوّن FeaturedProjectsSection مع featuredProjects ونافذة المعاينة وسطر التقنيات الشبيه بالطرفية
// الاعتماديات: useLanguage وprojectsData ونوع Project وأيقونات lucide-react
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { projectsData } from '../../data/projects.ts';
import { Project } from '../../types/portfolio.ts';
import { FolderGit2, ArrowRight } from 'lucide-react';

interface FeaturedProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  onViewAllProjects: () => void;
}

const AUTOPLAY_MS = 7500;
const CHAR_MS = 55;

export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  onSelectProject,
  onViewAllProjects,
}) => {
  const { t, locale, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const featuredProjects = projectsData.filter((p) => p.featured).slice(0, 3);
  const count = featuredProjects.length;

  // active: shown project; prev: the one being wiped away (null when idle)
  const [scene, setScene] = useState<{ active: number; prev: number | null }>({ active: 0, prev: null });
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tiltRef = useRef<HTMLDivElement>(null);

  const activeIndex = Math.min(scene.active, Math.max(count - 1, 0));
  const active = featuredProjects[activeIndex];
  const prevProject = scene.prev !== null ? featuredProjects[scene.prev] : undefined;

  const select = (idx: number, focus = false) => {
    setScene((s) => (s.active === idx ? s : { active: idx, prev: s.active }));
    if (focus) tabRefs.current[idx]?.focus();
  };
  const next = () => select((activeIndex + 1) % count);

  // 'idle' (static, SSR-safe) -> 'armed' (hidden, waiting) -> 'shown' (plays once on first view)
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

  // Tilt + sheen: written straight to CSS variables, never through React state.
  const handleStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (window.matchMedia('(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    const tilt = tiltRef.current;
    if (!tilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    tilt.style.setProperty('--ry', `${((px - 0.5) * 10).toFixed(2)}deg`);
    tilt.style.setProperty('--rx', `${((0.5 - py) * 8).toFixed(2)}deg`);
    tilt.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    tilt.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };
  const handleStageLeave = () => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    tilt.style.setProperty('--rx', '0deg');
    tilt.style.setProperty('--ry', '0deg');
  };

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    let forward: boolean;
    if (e.key === 'ArrowDown') forward = true;
    else if (e.key === 'ArrowUp') forward = false;
    else forward = (e.key === 'ArrowRight') !== isRtl;
    select((activeIndex + (forward ? 1 : -1) + count) % count, true);
  };

  // Cumulative delays so technologies are "typed" one after another.
  const techDelays: number[] = [];
  let cursorDelay = 250;
  if (active) {
    for (const tech of active.technologies) {
      techDelays.push(cursorDelay);
      cursorDelay += tech.length * CHAR_MS + 140;
    }
  }

  return (
    <section
      id="featured-projects"
      ref={sectionRef}
      data-state={state}
      data-rtl={isRtl ? 'true' : 'false'}
      className="ps-sec w-full py-14 bg-[#080D12] text-white border-b border-[#1E2630]"
    >
      <style>{`
        .ps-sec { --shift: 20px; }
        .ps-sec[data-rtl='true'] { --shift: -20px; }

        [data-state='armed'] .ps-win { opacity: 0; transform: translateY(14px) scale(.96); }
        [data-state='shown'] .ps-win { animation: psWin .9s cubic-bezier(.22,1,.36,1) .1s both; }
        @keyframes psWin { from { opacity: 0; transform: translateY(14px) scale(.96); } to { opacity: 1; transform: none; } }
        [data-state='armed'] .ps-item { opacity: 0; transform: translateX(var(--shift)); }
        [data-state='shown'] .ps-item { animation: psItem .6s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--i) * 120ms + 350ms); }
        @keyframes psItem { from { opacity: 0; transform: translateX(var(--shift)); } to { opacity: 1; transform: none; } }

        .ps-tilt { transform: perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform .25s ease-out; will-change: transform; }
        .ps-sheen { background: radial-gradient(520px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,.07), transparent 60%); opacity: 0; transition: opacity .3s ease; }
        .ps-tilt:hover .ps-sheen { opacity: 1; }

        .ps-prev { animation: psWipe .9s cubic-bezier(.65,0,.35,1) both; }
        @keyframes psWipe { from { clip-path: inset(0 0 0 0); } to { clip-path: inset(0 0 0 100%); } }
        .ps-sec[data-rtl='true'] .ps-prev { animation-name: psWipeRtl; }
        @keyframes psWipeRtl { from { clip-path: inset(0 0 0 0); } to { clip-path: inset(0 100% 0 0); } }
        .ps-beam { position: absolute; top: 0; bottom: 0; left: 0; width: 2px; pointer-events: none;
          background: linear-gradient(to bottom, transparent, #FF641C, transparent);
          box-shadow: 0 0 16px 3px rgba(255,100,28,.7);
          animation: psBeam .9s cubic-bezier(.65,0,.35,1) both; }
        @keyframes psBeam { 0% { left: 0; opacity: 0; } 10%, 90% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
        .ps-sec[data-rtl='true'] .ps-beam { left: auto; right: 0; animation-name: psBeamRtl; }
        @keyframes psBeamRtl { 0% { right: 0; opacity: 0; } 10%, 90% { opacity: 1; } 100% { right: 100%; opacity: 0; } }

        .ps-img { animation: psImg .9s cubic-bezier(.22,1,.36,1) both; }
        @keyframes psImg { from { transform: scale(1.06); } to { transform: none; } }
        .ps-rise { animation: psRise .6s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--r) * 80ms + 150ms); }
        @keyframes psRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

        .ps-type { display: inline-block; overflow: hidden; white-space: nowrap; vertical-align: bottom; width: 0;
          animation: psType calc(var(--n) * ${CHAR_MS}ms) steps(var(--n), end) forwards; animation-delay: var(--d); }
        @keyframes psType { from { width: 0; } to { width: calc(var(--n) * 1ch); } }
        .ps-cursor { display: inline-block; width: .55em; height: 1em; margin-inline-start: 2px; vertical-align: text-bottom;
          background: #FF641C; opacity: 0; animation: psBlink 1s steps(1) infinite; animation-delay: var(--d); }
        @keyframes psBlink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }

        .ps-prog { transform-origin: left; animation: psProg ${AUTOPLAY_MS}ms linear forwards; }
        .ps-sec[data-rtl='true'] .ps-prog { transform-origin: right; }
        @keyframes psProg { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        @media (prefers-reduced-motion: reduce) {
          [data-state] .ps-win, [data-state] .ps-item { opacity: 1 !important; transform: none !important; animation: none !important; }
          .ps-tilt { transform: none !important; transition: none !important; }
          .ps-sheen, .ps-beam, .ps-cursor, .ps-prog { display: none !important; }
          .ps-prev { animation: none !important; display: none; }
          .ps-img, .ps-rise { animation: none !important; }
          .ps-type { width: auto !important; animation: none !important; }
        }
      `}</style>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF641C]/15 border border-[#FF641C]/30 flex items-center justify-center text-[#FF641C]">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t('projects.heading')}
            </h2>
          </div>

          <button
            type="button"
            onClick={onViewAllProjects}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF641C] hover:text-[#E05312] transition-colors cursor-pointer"
          >
            <span>{t('projects.viewAll')}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {count > 0 && active && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Stage */}
            <div className={count > 1 ? 'lg:col-span-8' : 'lg:col-span-12'}>
              <div
                className="ps-win"
                onPointerMove={handleStageMove}
                onPointerLeave={handleStageLeave}
              >
                <div
                  ref={tiltRef}
                  onClick={() => onSelectProject(active)}
                  className="ps-tilt relative rounded-2xl overflow-hidden border border-[#1E2630] hover:border-[#FF641C]/50 bg-[#0E151E] shadow-2xl shadow-black/50 cursor-pointer transition-colors group"
                >
                  {/* Window chrome */}
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0A1017] border-b border-[#1E2630]">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></span>
                    </div>
                    <div className="flex-1 min-w-0 text-center">
                      <span className="inline-block max-w-full truncate px-4 py-0.5 rounded-md bg-[#131D2A] text-[11px] text-gray-400">
                        {active.title[locale]}
                      </span>
                    </div>
                    <span className="w-12 shrink-0" aria-hidden="true"></span>
                  </div>

                  {/* Screen */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                    <img
                      key={active.id}
                      src={active.thumbnail}
                      alt={active.title[locale]}
                      className="ps-img absolute inset-0 w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    {prevProject && (
                      <>
                        <div
                          key={`prev-${prevProject.id}-${active.id}`}
                          className="ps-prev absolute inset-0"
                          onAnimationEnd={() => setScene((s) => ({ ...s, prev: null }))}
                          aria-hidden="true"
                        >
                          <img
                            src={prevProject.thumbnail}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover object-center"
                          />
                        </div>
                        <span key={`beam-${prevProject.id}-${active.id}`} className="ps-beam" aria-hidden="true"></span>
                      </>
                    )}
                    <div className="ps-sheen absolute inset-0 pointer-events-none" aria-hidden="true"></div>

                    {/* Orange circular arrow overlay */}
                    <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#FF641C] text-white flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Info for the active project */}
              <div key={active.id} className="mt-6">
                <span
                  className="ps-rise text-[11px] font-semibold text-[#FF641C] uppercase tracking-wider block mb-1"
                  style={{ '--r': 0 } as React.CSSProperties}
                >
                  {active.category[locale]}
                </span>
                <h3
                  className="ps-rise text-xl sm:text-2xl font-bold text-white mb-2"
                  style={{ '--r': 1 } as React.CSSProperties}
                  aria-live="polite"
                >
                  {active.title[locale]}
                </h3>
                <p
                  className="ps-rise text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4 max-w-2xl"
                  style={{ '--r': 2 } as React.CSSProperties}
                >
                  {active.shortDescription[locale]}
                </p>

                {/* Terminal-style tech line */}
                <div
                  className="ps-rise bg-black/40 border border-[#1E2630] rounded-lg px-3 py-2 font-mono text-xs text-gray-300 mb-5"
                  style={{ '--r': 3 } as React.CSSProperties}
                  dir="ltr"
                >
                  <span className="text-[#FF641C] me-2 select-none" aria-hidden="true">$</span>
                  <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 align-middle">
                    {active.technologies.map((tech, i) => (
                      <span
                        key={tech}
                        className="ps-type"
                        style={{ '--n': tech.length, '--d': `${techDelays[i]}ms` } as React.CSSProperties}
                      >
                        {tech}
                      </span>
                    ))}
                    <span className="ps-cursor" style={{ '--d': `${cursorDelay}ms` } as React.CSSProperties} aria-hidden="true"></span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProject(active)}
                  className="ps-rise inline-flex items-center gap-2 text-sm font-semibold text-[#FF641C] hover:text-white transition-colors cursor-pointer"
                  style={{ '--r': 4 } as React.CSSProperties}
                >
                  <span>{t('projects.viewProject')}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Playlist */}
            {count > 1 && (
              <div
                role="tablist"
                aria-orientation="vertical"
                aria-label={t('projects.heading')}
                className="lg:col-span-4 flex flex-col gap-3"
                onKeyDown={handleTabKeyDown}
              >
                {featuredProjects.map((project, index) => {
                  const selected = index === activeIndex;
                  return (
                    <button
                      key={project.id}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => select(index)}
                      className={`ps-item relative overflow-hidden text-start flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641C]/60 ${
                        selected
                          ? 'bg-[#0E151E] border-[#FF641C]/60'
                          : 'bg-[#0A1017] border-[#1E2630] opacity-70 hover:opacity-100 hover:border-[#FF641C]/30'
                      }`}
                      style={{ '--i': index } as React.CSSProperties}
                    >
                      <span
                        className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
                          selected ? 'bg-[#FF641C] border-[#FF641C] text-white' : 'border-[#1E2630] text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="text-[11px] font-semibold text-[#FF641C] uppercase tracking-wider block truncate">
                          {project.category[locale]}
                        </span>
                        <span className="text-sm font-bold text-white block truncate">
                          {project.title[locale]}
                        </span>
                      </span>
                      {selected && (
                        <span
                          key={`prog-${project.id}`}
                          className="ps-prog absolute bottom-0 inset-x-0 h-0.5 bg-[#FF641C] pointer-events-none"
                          style={{ animationPlayState: paused ? 'paused' : 'running' }}
                          onAnimationEnd={next}
                          aria-hidden="true"
                        ></span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};