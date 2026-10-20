// الملف: HeroSection.tsx
// الوظيفة: القسم الافتتاحي الرئيسي الذي يعرض الاسم والعنوان والإحصائيات وشريط التقنيات
// المحتوى: مكوّن HeroSection مع أزرار CTA وشبكة الإحصائيات وبطاقة مساحة العمل والعناصر اليدوية
// الاعتماديات: useLanguage وsiteConfig وأيقونات lucide-react مع props للتنقل وفتح السيرة
import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { siteConfig } from '../../config/site.ts';
import { ArrowRight, Mail, Briefcase, BookOpen, Clock, Sparkles } from 'lucide-react';
import { StrandsBackground } from './StrandsBackground.tsx';

interface HeroSectionProps {
  onExploreWork: () => void;
  onContactMe: () => void;
  onOpenCvModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreWork,
  onContactMe,
  onOpenCvModal,
}) => {
  const { t, locale, dir } = useLanguage();

  const isRtl = dir === 'rtl';

  return (
    <section id="home" className="relative isolate w-full pt-6 pb-12 overflow-hidden">
      {/* Animated background: Interactive Interwoven Strands (non-interactive layer, sits behind content) */}
      <StrandsBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bio & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Greeting */}
            <p className="text-sm font-semibold tracking-wide text-[#6B7280] dark:text-[#9CA3AF] mb-1.5">
              {t('hero.hello')}
            </p>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#080D12] dark:text-white leading-[1.1] mb-2.5">
              <span>{t('hero.nameFirst')} </span>
              <span className="text-[#FF641C]">{t('hero.nameLast')}</span>
            </h1>

            {/* Subtitle */}
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] dark:text-[#E5E7EB] mb-4">
              {locale === 'ar' ? siteConfig.titleAr : siteConfig.titleEn}
            </h2>

            {/* Intro Lead */}
            <p className="text-base text-[#4B5563] dark:text-[#9CA3AF] max-w-xl leading-relaxed mb-6">
              {locale === 'ar' ? siteConfig.taglineAr : siteConfig.taglineEn}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <button
                type="button"
                onClick={onExploreWork}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#FF641C] hover:bg-[#E05312] active:scale-98 rounded-full shadow-md shadow-[#FF641C]/30 transition-all cursor-pointer"
              >
                <span>{t('hero.exploreWork')}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onContactMe}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#080D12] dark:text-white bg-transparent border border-[#D1D5DB] dark:border-[#374151] hover:border-[#080D12] dark:hover:border-white rounded-full transition-all cursor-pointer"
              >
                <span>{t('hero.contactMe')}</span>
                <Mail className="w-4 h-4 text-[#4B5563] dark:text-[#9CA3AF]" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-[#E8E0D5] dark:border-[#1E2630] mb-8">
              <div>
                <div className="text-2xl font-extrabold text-[#080D12] dark:text-white tracking-tight tabular-nums">
                  {siteConfig.stats.projectsCount}
                </div>
                <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">
                  {t('hero.statProjects')}
                </div>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-[#080D12] dark:text-white tracking-tight tabular-nums">
                  {siteConfig.stats.coursesCount}
                </div>
                <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">
                  {t('hero.statCourses')}
                </div>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-[#080D12] dark:text-white tracking-tight tabular-nums">
                  {siteConfig.stats.yearsExperience}
                </div>
                <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium">
                  {t('hero.statExperience')}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF641C] mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF641C]"></span>
                  <span>{t('hero.statOpen')}</span>
                </div>
                <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  Full-time & Remote
                </div>
              </div>
            </div>

            {/* Tech Logo Strip */}
         <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
  {/* Next.js */}
  <div className="group flex items-center gap-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB] cursor-pointer">
    <div className="w-5 h-5 shrink-0 rounded-full bg-black text-white flex items-center justify-center">
      <svg className="w-4 h-4" viewBox="0 0 180 180" fill="none">
        <mask id="next-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="#fff" />
        </mask>
        <g mask="url(#next-mask)">
          <circle cx="90" cy="90" r="90" fill="#000" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#next-grad1)" />
          <rect x="115" y="54" width="12" height="72" fill="url(#next-grad2)" />
        </g>
        <defs>
          <linearGradient id="next-grad1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="next-grad2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:opacity-100 whitespace-nowrap">
      Next.js
    </span>
  </div>

  {/* React */}
  <div className="group flex items-center gap-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB] cursor-pointer">
    <svg className="w-5 h-5 shrink-0 text-[#00D8FF]" viewBox="0 0 115.3 100">
      <path fill="currentColor" d="M57.6 44.5c4.7 0 8.5 3.8 8.5 8.5s-3.8 8.5-8.5 8.5-8.5-3.8-8.5-8.5 3.8-8.5 8.5-8.5z"/>
      <ellipse cx="57.6" cy="53" rx="46" ry="17.7" fill="none" stroke="currentColor" strokeWidth="4.5" transform="rotate(30 57.6 53)"/>
      <ellipse cx="57.6" cy="53" rx="46" ry="17.7" fill="none" stroke="currentColor" strokeWidth="4.5" transform="rotate(90 57.6 53)"/>
      <ellipse cx="57.6" cy="53" rx="46" ry="17.7" fill="none" stroke="currentColor" strokeWidth="4.5" transform="rotate(150 57.6 53)"/>
    </svg>
    <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:opacity-100 whitespace-nowrap">
      React
    </span>
  </div>

  {/* TypeScript */}
  <div className="group flex items-center gap-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB] cursor-pointer">
    <div className="w-5 h-5 shrink-0 rounded bg-[#3178C6] text-white flex items-center justify-center text-[10px] font-bold">
      TS
    </div>
    <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:opacity-100 whitespace-nowrap">
      TypeScript
    </span>
  </div>

  {/* Tailwind CSS */}
  <div className="group flex items-center gap-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB] cursor-pointer">
    <svg className="w-5 h-5 shrink-0 text-[#38BDF8]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
    </svg>
    <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:opacity-100 whitespace-nowrap">
      Tailwind CSS
    </span>
  </div>

  {/* Laravel */}
  <div className="group flex items-center gap-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB] cursor-pointer">
    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M2 6.5 L12 1 L22 6.5 L22 17.5 L12 23 L2 17.5 Z" fill="#FF2D20" />
        <path d="M5.5 8.5 L7.5 9.5 L7.5 15 L10.5 13.5 L12 14.5 L12 17 L9 18.5 L5.5 17 Z" fill="#FFFFFF" />
        <path d="M12 6 L14 5 L17.5 7 L17.5 12 L15.5 11 L15.5 9 L13.5 8 L12 9 Z" fill="#FFFFFF" />
        <path d="M9 10.5 L12 9 L14 10 L12 11.5 Z" fill="#FFFFFF" />
      </svg>
    </div>
    <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:opacity-100 whitespace-nowrap">
      Laravel
    </span>
  </div>

  {/* PHP */}
  <div className="group flex items-center gap-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB] cursor-pointer">
    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="11" ry="7.5" fill="#777BB4" />
        <ellipse cx="12" cy="12" rx="8.5" ry="5.5" fill="#4F5B93" />
        <text x="12" y="14.2" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#fff" fontFamily="Arial, sans-serif">php</text>
      </svg>
    </div>
    <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:opacity-100 whitespace-nowrap">
      PHP
    </span>
  </div>

  {/* Python */}
  <div className="group flex items-center gap-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB] cursor-pointer">
    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.914 0zM8.708 1.85a1.06 1.06 0 110 2.121 1.06 1.06 0 010-2.12z" fill="#3776AB" />
        <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.42-3.35 3.42h-5.766s-3.24-.052-3.24 3.148v5.292S5.72 24 12.086 24zm3.206-2.85a1.06 1.06 0 110-2.121 1.06 1.06 0 010 2.12z" fill="#FFD43B" />
      </svg>
    </div>
    <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:opacity-100 whitespace-nowrap">
      Python
    </span>
  </div>

  {/* Docker */}
  <div className="group flex items-center gap-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB] cursor-pointer">
    <div className="w-5 h-5 shrink-0 text-[#2496ED] flex items-center justify-center">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185M23.959 9.87c-.31-.592-1.077-.852-1.89-.66-.465.11-.902.348-1.285.69-.17.153-.326.326-.466.516-.684-.452-1.545-.732-2.49-.773l-.066-.003-.06-.002H.186A.186.186 0 000 9.824c0 3.784 1.353 7.026 3.738 9.07 1.87 1.603 4.29 2.51 6.84 2.562 6.643.13 12.18-4.225 13.064-10.457.067-.47.165-.93.292-1.378.118-.415.22-.84.22-1.274 0-.173-.068-.337-.195-.477"/>
      </svg>
    </div>
    <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:opacity-100 whitespace-nowrap">
      Docker
    </span>
  </div>
</div>
          </div>

          {/* Right Column: Cinematic Workspace & Floating Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E8E0D5] dark:border-[#1E2630] bg-[#0E151E] group">
              {/* Cinematic Workspace Image */}
              <img
                src="/assets/images/hero_workspace_sunset_1792383939734.jpg"
                alt="Salman Al-Ansi Developer Workspace overlooking sunset mountains"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center transition-transform duration-700 group-hover:scale-102"
              />

              {/* Top-Right Handwritten Annotation */}
              <div className="absolute top-4 right-4 pointer-events-none select-none">
                <span className="font-handwriting text-2xl sm:text-3xl text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] -rotate-6 block font-bold tracking-wide">
                  Better Code<br />Better Products
                </span>
              </div>

              {/* Floating Dark Card: Currently Learning */}
              <div className="absolute bottom-16 right-4 sm:right-6 bg-[#080D12]/92 backdrop-blur-md border border-white/10 rounded-xl p-3.5 shadow-xl max-w-[210px] text-white">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF641C] mb-2.5 pb-1.5 border-b border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('hero.currentlyLearning')}</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-300">
                  {siteConfig.learningStack.map((tech) => (
                    <div key={tech} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF641C]/80"></span>
                      <span className="font-medium text-gray-200">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Signature Annotation */}
              <div className="absolute bottom-3 left-4 pointer-events-none select-none">
                <span className="font-handwriting text-3xl sm:text-4xl text-white/80 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] -rotate-3">
                  Salman
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};