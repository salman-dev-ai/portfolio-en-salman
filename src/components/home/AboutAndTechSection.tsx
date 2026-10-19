// الملف: AboutAndTechSection.tsx
// الوظيفة: قسم نبذة عن المطوّر + "باني الستاك": يختار العميل نوع مشروعه فتضيء التقنيات المناسبة ويتدفق طلب حي عبر الطبقات
// المحتوى: AboutAndTechSection مع aboutPoints ومجموعات frontendTech وbackendTech وdevopsTech
// الاعتماديات: useLanguage وtechStackData وsiteConfig وأيقونات lucide-react
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { techStackData } from '../../data/technologies.ts';
import { siteConfig } from '../../config/site.ts';
import { User, Code, Play, ArrowRight } from 'lucide-react';

interface AboutAndTechSectionProps {
  onOpenVideo: () => void;
  onOpenAllTech: () => void;
}

type TechItem = (typeof techStackData)[number];

interface ProjectType {
  id: string;
  label: { en: string; ar: string };
  reason: { en: string; ar: string };
  /** lowercase fragments matched against technology names in each category */
  picks: { front: string[]; back: string[]; devops: string[] };
}

/**
 * عدّل الأسماء في picks لتطابق أسماء تقنياتك في technologies.ts (المطابقة جزئية وغير حساسة لحالة الأحرف).
 * إن لم يُطابق أي اسم في طبقة معينة تُضاء أول 3 تقنيات منها تلقائياً.
 */
const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'store',
    label: { en: 'Online store', ar: 'متجر إلكتروني' },
    reason: {
      en: 'A fast, search-friendly storefront, a backend that handles orders and payments safely, and automated deploys so updates never take the shop offline.',
      ar: 'واجهة سريعة وصديقة لمحركات البحث، وخادم يعالج الطلبات والمدفوعات بأمان، ونشر آلي يحدّث المتجر دون أن يتوقف.',
    },
    picks: { front: ['react', 'next', 'typescript', 'tailwind'], back: ['node', 'postgres', 'redis', 'express'], devops: ['docker', 'git', 'vercel', 'ci'] },
  },
  {
    id: 'dashboard',
    label: { en: 'Dashboard', ar: 'لوحة تحكم' },
    reason: {
      en: 'Interactive screens that stay responsive with heavy data, a backend that serves clean, secured queries, and monitoring so problems surface before users notice.',
      ar: 'شاشات تفاعلية تبقى سلسة مع البيانات الكبيرة، وخادم يقدّم استعلامات نظيفة ومحمية، ومراقبة تكشف المشكلات قبل أن يلاحظها المستخدمون.',
    },
    picks: { front: ['react', 'typescript', 'vite', 'tailwind'], back: ['node', 'postgres', 'graphql', 'nest'], devops: ['docker', 'git', 'github', 'linux'] },
  },
  {
    id: 'mobile',
    label: { en: 'Mobile app', ar: 'تطبيق جوال' },
    reason: {
      en: 'One codebase that feels native on every phone, a backend built for real-time sync and notifications, and a release pipeline that ships updates quickly.',
      ar: 'كود واحد يبدو أصيلاً على كل هاتف، وخادم مهيّأ للمزامنة اللحظية والإشعارات، وخط إصدار يوصل التحديثات بسرعة.',
    },
    picks: { front: ['react', 'native', 'typescript', 'flutter'], back: ['node', 'firebase', 'mongo', 'express'], devops: ['git', 'docker', 'github', 'ci'] },
  },
  {
    id: 'api',
    label: { en: 'API & services', ar: 'واجهة API وخدمات' },
    reason: {
      en: 'Well-documented endpoints that other systems can rely on, a database layer designed for growth, and containers that deploy the same way everywhere.',
      ar: 'نقاط وصول موثقة تعتمد عليها الأنظمة الأخرى، وطبقة بيانات مصممة للنمو، وحاويات تُنشر بالطريقة نفسها في كل مكان.',
    },
    picks: { front: ['typescript', 'react'], back: ['node', 'express', 'nest', 'postgres', 'python', 'redis'], devops: ['docker', 'kubernetes', 'linux', 'nginx', 'git'] },
  },
];

const UI = {
  pickLabel: { en: 'What are you building?', ar: 'ماذا تريد أن تبني؟' },
  cta: { en: 'Talk to me about this project', ar: 'تحدّث معي عن هذا المشروع' },
  used: { en: 'Used in this project', ar: 'مستخدمة في هذا المشروع' },
};

const AUTOPLAY_MS = 6500;

export const AboutAndTechSection: React.FC<AboutAndTechSectionProps> = ({
  onOpenVideo,
  onOpenAllTech,
}) => {
  const { t, dir, locale } = useLanguage();
  const isRtl = dir === 'rtl';
  const lang: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';

  const [projectIndex, setProjectIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // About card entrance: 'idle' (static, SSR-safe) -> 'armed' (hidden, waiting) -> 'shown' (plays once).
  const aboutRef = useRef<HTMLDivElement>(null);
  const [aboutState, setAboutState] = useState<'idle' | 'armed' | 'shown'>('idle');
  useEffect(() => {
    const el = aboutRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setAboutState('armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setAboutState('shown');
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const aboutPoints = [
    t('about.point1'),
    t('about.point2'),
    t('about.point3'),
    t('about.point4'),
    t('about.point5'),
  ];

  const frontendTech = techStackData.filter((i) => i.category === 'Frontend');
  const backendTech = techStackData.filter((i) => i.category === 'Backend');
  const devopsTech = techStackData.filter((i) => i.category === 'DevOps & Tools');

  const project = PROJECT_TYPES[projectIndex];

  const activeNames = useMemo(() => {
    const pick = (list: TechItem[], fragments: string[]) => {
      const set = new Set<string>();
      for (const f of fragments) {
        const hit = list.find((i) => i.name.toLowerCase().includes(f));
        if (hit) set.add(hit.name);
      }
      if (set.size === 0) list.slice(0, 3).forEach((i) => set.add(i.name));
      return set;
    };
    return [
      pick(frontendTech, project.picks.front),
      pick(backendTech, project.picks.back),
      pick(devopsTech, project.picks.devops),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIndex]);

  const layers = [
    { key: 'frontend', label: t('techStack.frontend'), items: frontendTech, color: '#FF641C', glow: 'rgba(255,100,28,0.45)' },
    { key: 'backend', label: t('techStack.backend'), items: backendTech, color: '#10B981', glow: 'rgba(16,185,129,0.4)' },
    { key: 'devops', label: t('techStack.devopsTools'), items: devopsTech, color: '#3B82F6', glow: 'rgba(59,130,246,0.4)' },
  ];

  const nextProject = () => setProjectIndex((p) => (p + 1) % PROJECT_TYPES.length);

  const handleProjectContact = () => {
    const subject = encodeURIComponent(`Project Inquiry: ${project.label.en}`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}`;
  };

  return (
    <section id="about-me" className="w-full py-12 bg-[#FDFBF7] dark:bg-[#03070B] transition-colors">
      <style>{`
        .tb-pill { opacity: 0.28; transform: translateY(2px) scale(0.97);
          transition: opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1), border-color .5s ease; }
        .tb-pill.tb-on { opacity: 1; transform: none; border-color: var(--c);
          transition-delay: calc(var(--i) * 70ms);
          animation: tbGlow 3.6s ease-in-out infinite;
          animation-delay: calc(var(--layer) * 0.9s + var(--i) * 0.12s); }
        @keyframes tbGlow { 0%, 100% { box-shadow: 0 0 0 0 transparent; } 40% { box-shadow: 0 0 16px 1px var(--cg); } }
        .tb-conn { position: relative; width: 1px; height: 26px; margin: 0 auto; }
        .tb-pkt { position: absolute; left: 50%; width: 5px; height: 5px; margin-left: -2.5px; border-radius: 9999px; opacity: 0; }
        .tb-down { background: #FF641C; box-shadow: 0 0 8px 2px rgba(255,100,28,.7); animation: tbDown 1.8s ease-in-out infinite; animation-delay: calc(var(--layer) * 0.9s); }
        .tb-up { background: #FFB052; box-shadow: 0 0 8px 2px rgba(255,176,82,.6); animation: tbUp 1.8s ease-in-out infinite; animation-delay: calc(var(--layer) * 0.9s + 0.9s); }
        @keyframes tbDown { 0% { top: -4px; opacity: 0; } 20%, 80% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes tbUp { 0% { top: 100%; opacity: 0; } 20%, 80% { opacity: 1; } 100% { top: -4px; opacity: 0; } }
        .tb-prog { transform-origin: left center; animation: tbProg ${AUTOPLAY_MS}ms linear forwards; }
        [dir='rtl'] .tb-prog { transform-origin: right center; }
        @keyframes tbProg { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .tb-reveal { animation: tbReveal .6s cubic-bezier(.22,1,.36,1) both; }
        @keyframes tbReveal { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        .ab-card { --shift: 18px; --hx: 3px; }
        .ab-card[data-rtl='true'] { --shift: -18px; --hx: -3px; }

        [data-state='armed'] .ab-item { opacity: 0; transform: translateX(var(--shift)); }
        [data-state='armed'] .ab-bio { opacity: 0; transform: translateY(8px); }
        [data-state='shown'] .ab-item { animation: abIn .7s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--i) * 110ms + 250ms); }
        [data-state='shown'] .ab-bio { animation: abUp .7s cubic-bezier(.22,1,.36,1) both; }
        @keyframes abIn { from { opacity: 0; transform: translateX(var(--shift)); } to { opacity: 1; transform: none; } }
        @keyframes abUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        .ab-line { transform-origin: top; }
        [data-state='armed'] .ab-line { transform: scaleY(0); }
        [data-state='shown'] .ab-line { animation: abLine 1.1s cubic-bezier(.22,1,.36,1) .2s both; }
        @keyframes abLine { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .ab-spark { display: none; }
        [data-state='shown'] .ab-spark { display: block; animation: abSpark 4.5s linear 1.8s infinite; }
        @keyframes abSpark { 0% { top: -30px; opacity: 0; } 15%, 85% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

        .ab-ring circle { stroke-dasharray: 60; stroke-dashoffset: 0; }
        [data-state='armed'] .ab-ring circle { stroke-dashoffset: 60; }
        [data-state='shown'] .ab-ring circle { animation: abRing .9s ease-out both; animation-delay: calc(var(--i) * 110ms + 450ms); }
        @keyframes abRing { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }
        [data-state='armed'] .ab-dotwrap { transform: scale(0); }
        [data-state='shown'] .ab-dotwrap { animation: abPop .55s cubic-bezier(.34,1.56,.64,1) both; animation-delay: calc(var(--i) * 110ms + 350ms); }
        @keyframes abPop { from { transform: scale(0); } to { transform: scale(1); } }

        .ab-dot { transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s ease; }
        .ab-item:hover .ab-dot { transform: scale(1.4) !important; box-shadow: 0 0 10px 1px rgba(255,100,28,.7) !important; }
        [data-state='shown'] .ab-dot { animation: abWalk 12.5s ease-in-out infinite; animation-delay: calc(2.2s + var(--i) * 2.5s); }
        @keyframes abWalk {
          0%, 18%, 100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
          4%, 12% { transform: scale(1.4); box-shadow: 0 0 10px 1px rgba(255,100,28,.7); }
        }

        .ab-text { display: inline-block; padding-bottom: 2px;
          background-image: linear-gradient(#FF641C, #FF641C); background-repeat: no-repeat; background-size: 0 1px; background-position: 0 100%;
          transition: background-size .45s cubic-bezier(.22,1,.36,1), transform .4s cubic-bezier(.22,1,.36,1); }
        .ab-card[data-rtl='true'] .ab-text { background-position: 100% 100%; }
        .ab-item:hover .ab-text { background-size: 100% 1px; transform: translateX(var(--hx)); }

        @media (prefers-reduced-motion: reduce) {
          [data-state] .ab-item, [data-state] .ab-bio, [data-state] .ab-dotwrap, [data-state] .ab-line { opacity: 1 !important; transform: none !important; animation: none !important; }
          [data-state] .ab-ring circle { stroke-dashoffset: 0 !important; animation: none !important; }
          [data-state] .ab-dot { animation: none !important; }
          .ab-spark { display: none !important; }
          .ab-text, .ab-dot { transition: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tb-pill, .tb-pill.tb-on, .tb-prog, .tb-reveal { animation: none !important; transition: none !important; }
          .tb-pkt { display: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: About Me */}
          <div
            ref={aboutRef}
            data-state={aboutState}
            data-rtl={isRtl ? 'true' : 'false'}
            className="ab-card lg:col-span-6 bg-white dark:bg-[#0E151E] border border-[#E8E0D5] dark:border-[#1E2630] rounded-2xl p-6 sm:p-7 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FF641C]/10 border border-[#FF641C]/30 flex items-center justify-center text-[#FF641C]">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[#080D12] dark:text-white">
                  {t('about.heading')}
                </h2>
              </div>
              <button
                type="button"
                onClick={onOpenVideo}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF641C] hover:text-[#E05312] transition-colors cursor-pointer"
              >
                <span>{t('about.getToKnowMe')}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <p className="ab-bio text-sm text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed mb-6">
              {t('about.bio')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Bullet Points */}
              <div className="sm:col-span-7 relative">
                {/* Connecting path: draws downward, a soft light travels along it */}
                <div
                  className="absolute top-2.5 bottom-2.5 w-px overflow-hidden pointer-events-none"
                  style={{ insetInlineStart: '9.5px' }}
                  aria-hidden="true"
                >
                  <div className="ab-line absolute inset-0 bg-[#FF641C]/25"></div>
                  <div className="ab-spark absolute left-0 w-full h-8 bg-gradient-to-b from-transparent via-[#FF641C] to-transparent"></div>
                </div>

                <div className="space-y-2.5 relative">
                  {aboutPoints.map((point, index) => (
                    <div
                      key={index}
                      className="ab-item flex items-center gap-2.5"
                      style={{ '--i': index } as React.CSSProperties}
                    >
                      <span className="ab-dotwrap relative z-10 w-5 h-5 rounded-full bg-white dark:bg-[#0E151E] shrink-0">
                        <span className="absolute inset-0 rounded-full bg-[#FF641C]/15 flex items-center justify-center">
                          <span className="ab-dot block w-2 h-2 rounded-full bg-[#FF641C]"></span>
                        </span>
                        <svg viewBox="0 0 20 20" className="ab-ring absolute inset-0 w-full h-full -rotate-90" aria-hidden="true">
                          <circle cx="10" cy="10" r="9.5" fill="none" stroke="#FF641C" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span className="ab-text text-xs sm:text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB]">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Developer Journey Photo Card */}
              <div className="sm:col-span-5 relative">
                <div className="relative rounded-xl overflow-hidden border border-[#E8E0D5] dark:border-[#1E2630] group bg-[#080D12]">
                  <img
                    src="/assets/images/about_developer_work_1792383940477.jpg"
                    alt="Salman Al-Ansi at work"
                    className="w-full h-44 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3">
                    <button
                      type="button"
                      onClick={onOpenVideo}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF641C] hover:bg-[#E05312] text-white text-[11px] font-bold rounded-full shadow cursor-pointer transition-transform active:scale-95 w-fit"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{t('about.myJourney')}</span>
                    </button>
                    <span className="text-[10px] text-gray-300 mt-1 font-medium">
                      {t('about.watchVideo')}
                    </span>
                  </div>
                </div>

                {/* Handwritten Arrow Annotation matching screenshot */}
                <div className="mt-2 text-center select-none pointer-events-none">
                  <span className="font-handwriting text-lg sm:text-xl text-[#080D12] dark:text-amber-300 font-bold tracking-wide block leading-tight">
                    Code<br />Learn<br />Build<br />Repeat ⤹
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Stack Builder */}
          <div
            className="lg:col-span-6 bg-white dark:bg-[#0E151E] border border-[#E8E0D5] dark:border-[#1E2630] rounded-2xl p-6 sm:p-7 shadow-sm"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FF641C]/10 border border-[#FF641C]/30 flex items-center justify-center text-[#FF641C]">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#080D12] dark:text-white leading-tight">
                    {t('techStack.heading')}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenAllTech}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF641C] hover:text-[#E05312] transition-colors cursor-pointer"
              >
                <span>{t('techStack.viewAll')}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-4">
              {t('techStack.subheading')}
            </p>

            {/* Project type picker */}
            <p className="text-xs font-semibold text-[#4B5563] dark:text-[#9CA3AF] mb-2">
              {UI.pickLabel[lang]}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {PROJECT_TYPES.map((p, idx) => {
                const selected = idx === projectIndex;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setProjectIndex(idx)}
                    className={`relative overflow-hidden px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#FF641C] text-[#FF641C] bg-[#FF641C]/10'
                        : 'border-[#E8E0D5] dark:border-[#1E2630] text-[#4B5563] dark:text-[#9CA3AF] hover:border-[#FF641C]/50'
                    }`}
                  >
                    <span className="relative z-10">{p.label[lang]}</span>
                    {selected && (
                      <span
                        key={`prog-${projectIndex}`}
                        className="tb-prog absolute bottom-0 inset-x-0 h-0.5 bg-[#FF641C] pointer-events-none"
                        style={{ animationPlayState: paused ? 'paused' : 'running' }}
                        onAnimationEnd={nextProject}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live architecture: layers light up, a request flows through them */}
            <div>
              {layers.map((layer, layerIdx) => (
                <React.Fragment key={layer.key}>
                  <div>
                    <span className="text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] uppercase tracking-wider block mb-2">
                      {layer.label}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {layer.items.map((item, i) => {
                        const on = activeNames[layerIdx].has(item.name);
                        return (
                          <div
                            key={item.name}
                            className={`tb-pill ${on ? 'tb-on' : ''} flex items-center gap-2 p-2 rounded-lg border border-[#E8E0D5] dark:border-[#1E2630] bg-[#FDFBF7] dark:bg-[#131D2A] text-xs font-semibold text-[#1F2937] dark:text-[#E5E7EB]`}
                            style={
                              {
                                '--c': layer.color,
                                '--cg': layer.glow,
                                '--i': i,
                                '--layer': layerIdx,
                              } as React.CSSProperties
                            }
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: layer.color }}></span>
                            <span className="truncate">{item.name}</span>
                            {on && <span className="sr-only">{UI.used[lang]}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {layerIdx < layers.length - 1 && (
                    <div
                      className="tb-conn bg-[#E8E0D5] dark:bg-[#1E2630] my-1"
                      style={{ '--layer': layerIdx } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      <span className="tb-pkt tb-down" />
                      <span className="tb-pkt tb-up" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Why this stack + CTA */}
            <div className="mt-5 pt-4 border-t border-[#E8E0D5] dark:border-[#1E2630] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p
                key={project.id}
                className="tb-reveal text-xs text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed flex-1"
                aria-live="polite"
              >
                {project.reason[lang]}
              </p>
              <button
                type="button"
                onClick={handleProjectContact}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#FF641C] hover:bg-[#E05312] rounded-full shadow shadow-[#FF641C]/30 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <span>{UI.cta[lang]}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};