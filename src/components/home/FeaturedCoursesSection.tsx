// الملف: FeaturedCoursesSection.tsx
// الوظيفة: "خريطة التعلّم": مسار واحد من المبتدئ إلى المتقدم، كل دورة محطة عليه مع بطاقة معاينة للمحطة النشطة
// المحتوى: مكوّن FeaturedCoursesSection مع featuredCourses وgetDifficultyBadge ومسار المحطات وبطاقة المعاينة
// الاعتماديات: useLanguage وcoursesData ونوع Course وأيقونات lucide-react
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { coursesData } from '../../data/courses.ts';
import { Course } from '../../types/portfolio.ts';
import { GraduationCap, ArrowRight, BookOpen, Clock } from 'lucide-react';

interface FeaturedCoursesSectionProps {
  onSelectCourse: (course: Course) => void;
  onViewAllCourses: () => void;
}

const UI = {
  startHere: { en: 'Start here', ar: 'ابدأ من هنا' },
  fullPath: { en: 'Full path', ar: 'المسار كاملاً' },
};

const LEVEL_ORDER: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };
const AUTOPLAY_MS = 7000;

/** Counts up once when `play` turns true; always renders the final value in markup (SSR-safe). */
const CountUp: React.FC<{ value: number; play: boolean }> = ({ value, play }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = Number.isInteger(value) ? 0 : 1;
  useEffect(() => {
    const el = ref.current;
    if (!el || !play) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1000);
      el.textContent = (value * (1 - Math.pow(1 - p, 3))).toFixed(decimals);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = value.toFixed(decimals);
    };
  }, [play, value, decimals]);
  return <span ref={ref}>{value.toFixed(decimals)}</span>;
};

export const FeaturedCoursesSection: React.FC<FeaturedCoursesSectionProps> = ({
  onSelectCourse,
  onViewAllCourses,
}) => {
  const { t, locale, dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const lang: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';

  // Same selection as before, ordered along the path from beginner to advanced (stable sort).
  const featuredCourses = coursesData
    .filter((c: Course) => c.featured)
    .slice(0, 3)
    .map((c: Course, i: number) => ({ c, i }))
    .sort((a: { c: Course; i: number }, b: { c: Course; i: number }) => (LEVEL_ORDER[a.c.difficulty] ?? 99) - (LEVEL_ORDER[b.c.difficulty] ?? 99) || a.i - b.i)
    .map((x: { c: Course; i: number }) => x.c);

  const count = featuredCourses.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Advanced':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
    }
  };

  const safeIndex = Math.min(activeIndex, Math.max(count - 1, 0));
  const active = featuredCourses[safeIndex];
  const progressPct = count > 1 ? (safeIndex / (count - 1)) * 100 : 0;

  const totalLessons = featuredCourses.reduce((sum: number, c: Course) => sum + (Number(c.lessonsCount) || 0), 0);
  const totalHours = Math.round(featuredCourses.reduce((sum: number, c: Course) => sum + (Number(c.durationHours) || 0), 0) * 10) / 10;

  const goTo = (idx: number, focus = false) => {
    setActiveIndex(idx);
    if (focus) tabRefs.current[idx]?.focus();
  };
  const next = () => setActiveIndex((i) => (i + 1) % count);

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const forward = (e.key === 'ArrowRight') !== isRtl;
    goTo((safeIndex + (forward ? 1 : -1) + count) % count, true);
  };

  return (
    <section
      id="learn-and-grow"
      ref={sectionRef}
      data-state={state}
      data-rtl={isRtl ? 'true' : 'false'}
      className="lm-sec w-full py-14 bg-[#FDFBF7] dark:bg-[#03070B] border-b border-[#E8E0D5] dark:border-[#1E2630] transition-colors"
    >
      <style>{`
        .lm-base { transform-origin: left; }
        .lm-sec[data-rtl='true'] .lm-base, .lm-sec[data-rtl='true'] .lm-prog { transform-origin: right; }
        [data-state='armed'] .lm-base { transform: scaleX(0); }
        [data-state='shown'] .lm-base { animation: lmDraw 1s cubic-bezier(.22,1,.36,1) .1s both; }
        @keyframes lmDraw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        [data-state='armed'] .lm-station, [data-state='armed'] .lm-fade { opacity: 0; transform: translateY(8px); }
        [data-state='shown'] .lm-station { animation: lmIn .6s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--i) * 140ms + 300ms); }
        [data-state='shown'] .lm-fade { animation: lmIn .7s cubic-bezier(.22,1,.36,1) .9s both; }
        @keyframes lmIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .lm-fill { transition: width .8s cubic-bezier(.22,1,.36,1); }
        .lm-orb { transition: inset-inline-start .8s cubic-bezier(.22,1,.36,1); box-shadow: 0 0 12px 3px rgba(255,100,28,.65); }
        .lm-pulse { animation: lmPulse 2.2s ease-out infinite; }
        @keyframes lmPulse { 0% { transform: scale(1); opacity: .6; } 100% { transform: scale(1.9); opacity: 0; } }
        .lm-bob { animation: lmBob 2s ease-in-out infinite; }
        @keyframes lmBob { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -3px); } }
        .lm-img { animation: lmImg .9s cubic-bezier(.22,1,.36,1) both; }
        @keyframes lmImg { from { opacity: 0; transform: scale(1.08); } to { opacity: 1; transform: none; } }
        .lm-rise { animation: lmRise .6s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--r) * 80ms + 120ms); }
        @keyframes lmRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .lm-prog { transform-origin: left; animation: lmProg ${AUTOPLAY_MS}ms linear forwards; }
        @keyframes lmProg { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) {
          [data-state] .lm-base, [data-state] .lm-station, [data-state] .lm-fade { opacity: 1 !important; transform: none !important; animation: none !important; }
          .lm-pulse, .lm-bob, .lm-img, .lm-rise { animation: none !important; }
          .lm-bob { transform: translate(-50%, 0); }
          .lm-prog { display: none; }
          .lm-fill, .lm-orb { transition: none !important; }
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-10 h-10 rounded-full bg-[#FF641C]/15 border border-[#FF641C]/30 flex items-center justify-center text-[#FF641C]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#080D12] dark:text-white">
                {t('courses.heading')}
              </h2>
            </div>
            <p className="text-sm text-[#4B5563] dark:text-[#9CA3AF]">
              {t('courses.subheading')}
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllCourses}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF641C] hover:text-[#E05312] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>{t('courses.viewAll')}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {count > 0 && (
          <>
            {/* Learning path */}
            <div className="relative pt-8 mb-4">
              {count > 1 && (
                <div
                  className="absolute pointer-events-none"
                  style={{ top: 50, insetInlineStart: `${50 / count}%`, insetInlineEnd: `${50 / count}%` }}
                  aria-hidden="true"
                >
                  <div className="lm-base absolute inset-x-0 top-0 h-px bg-[#E8E0D5] dark:bg-[#1E2630]"></div>
                  <div
                    className="lm-fill absolute top-0 h-px bg-[#FF641C]"
                    style={{ insetInlineStart: 0, width: `${progressPct}%` }}
                  ></div>
                  <div
                    className="lm-orb absolute top-0 w-3 h-3 -mt-1.5 rounded-full bg-[#FF641C]"
                    style={{ insetInlineStart: `${progressPct}%`, marginInlineStart: -6 }}
                  ></div>
                </div>
              )}

              <div
                role="tablist"
                aria-label={t('courses.heading')}
                className="relative z-10 grid"
                style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
                onKeyDown={handleTabKeyDown}
              >
                {featuredCourses.map((course: Course, index: number) => {
                  const selected = index === safeIndex;
                  const done = index < safeIndex;
                  return (
                    <button
                      key={course.id}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      id={`lm-tab-${course.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="lm-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => goTo(index)}
                      className="lm-station relative flex flex-col items-center text-center gap-2 px-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641C]/60 rounded-xl"
                      style={{ '--i': index } as React.CSSProperties}
                    >
                      {index === 0 && (
                        <span className="lm-bob absolute left-1/2 -top-7 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF641C] text-white pointer-events-none">
                          {UI.startHere[lang]}
                        </span>
                      )}
                      <span
                        className={`relative w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors duration-500 ${
                          selected
                            ? 'border-[#FF641C] bg-[#FF641C] text-white'
                            : done
                              ? 'border-[#FF641C] bg-[#FDFBF7] dark:bg-[#03070B] text-[#FF641C]'
                              : 'border-[#E8E0D5] dark:border-[#1E2630] bg-[#FDFBF7] dark:bg-[#03070B] text-[#6B7280] dark:text-[#9CA3AF]'
                        }`}
                      >
                        {selected && (
                          <span className="lm-pulse absolute inset-0 rounded-full border border-[#FF641C]" aria-hidden="true"></span>
                        )}
                        {index + 1}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(course.difficulty)}`}
                      >
                        {course.difficulty}
                      </span>
                      <span
                        className={`hidden sm:block text-xs font-semibold line-clamp-1 max-w-[12rem] transition-colors ${
                          selected ? 'text-[#FF641C]' : 'text-[#4B5563] dark:text-[#9CA3AF]'
                        }`}
                      >
                        {course.title[locale]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Path totals, computed from the courses themselves */}
            <div className="lm-fade flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-6">
              <span className="font-bold uppercase tracking-wider text-[#4B5563] dark:text-[#9CA3AF]">
                {UI.fullPath[lang]}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  <CountUp value={totalLessons} play={state === 'shown'} /> {t('courses.lessons')}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  <CountUp value={totalHours} play={state === 'shown'} /> {t('courses.hours')}
                </span>
              </span>
            </div>

            {/* Active station preview */}
            <div
              id="lm-panel"
              role="tabpanel"
              aria-labelledby={`lm-tab-${active.id}`}
              key={active.id}
              onClick={() => onSelectCourse(active)}
              className="relative bg-white dark:bg-[#0E151E] border border-[#E8E0D5] dark:border-[#1E2630] rounded-2xl overflow-hidden hover:border-[#FF641C]/50 transition-colors duration-300 group grid grid-cols-1 md:grid-cols-5 cursor-pointer shadow-sm hover:shadow-md"
            >
              {count > 1 && (
                <span
                  key={`prog-${active.id}`}
                  className="lm-prog absolute top-0 inset-x-0 h-0.5 bg-[#FF641C] z-10 pointer-events-none"
                  style={{ animationPlayState: paused ? 'paused' : 'running' }}
                  onAnimationEnd={next}
                  aria-hidden="true"
                ></span>
              )}

              {/* Thumbnail */}
              <div className="relative md:col-span-2 aspect-video md:aspect-auto md:min-h-[260px] w-full overflow-hidden bg-slate-900">
                <img
                  src={active.thumbnail}
                  alt={active.title[locale]}
                  className="lm-img absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${getDifficultyBadge(
                      active.difficulty
                    )}`}
                  >
                    {active.difficulty}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div>
                  <h3
                    className="lm-rise text-xl sm:text-2xl font-bold text-[#080D12] dark:text-white group-hover:text-[#FF641C] transition-colors mb-3"
                    style={{ '--r': 0 } as React.CSSProperties}
                  >
                    {active.title[locale]}
                  </h3>
                  <div
                    className="lm-rise flex items-center gap-4 text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-4"
                    style={{ '--r': 1 } as React.CSSProperties}
                  >
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{active.lessonsCount} {t('courses.lessons')}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{active.durationHours} {t('courses.hours')}</span>
                    </span>
                  </div>
                  <p
                    className="lm-rise text-sm text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed line-clamp-4"
                    style={{ '--r': 2 } as React.CSSProperties}
                  >
                    {active.shortDescription[locale]}
                  </p>
                </div>

                <div
                  className="lm-rise pt-4 border-t border-[#E8E0D5] dark:border-[#1E2630]"
                  style={{ '--r': 3 } as React.CSSProperties}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF641C] group-hover:text-[#080D12] dark:group-hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{t('courses.viewCourse')}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};