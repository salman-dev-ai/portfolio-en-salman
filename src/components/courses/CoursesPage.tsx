import React from 'react';
import { ArrowLeft, Sparkles, Bot, Workflow } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { upcomingCourses } from '../../data/courses.ts';

interface CoursesPageProps {
  onBackToHome: () => void;
}

const iconMap = {
  python: Sparkles,
  ai: Bot,
  automation: Workflow,
};

export const CoursesPage: React.FC<CoursesPageProps> = ({ onBackToHome }) => {
  const { locale, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF641C]">
            {locale === 'ar' ? 'الدورات' : 'Courses'}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black text-[#080D12] dark:text-white">
            {locale === 'ar' ? 'نحن نعمل على محتوى جديد' : 'We are building new learning content'}
          </h1>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 rounded-full border border-[#E8E0D5] bg-white px-4 py-2 text-sm font-semibold text-[#080D12] hover:border-[#FF641C] hover:text-[#FF641C] transition-colors"
        >
          <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          {locale === 'ar' ? 'الرئيسية' : 'Home'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {upcomingCourses.map((course) => {
          const Icon = iconMap[course.id as keyof typeof iconMap] ?? Sparkles;
          const title = course.title[locale];
          const badge = course.badge[locale];
          const description = course.description[locale];

          return (
            <article
              key={course.id}
              className="group rounded-3xl border border-[#E8E0D5] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-[#1E2630] dark:bg-[#0E151E]"
            >
              <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-r ${course.accent} p-[1px]`}>
                <div className="rounded-2xl bg-[#FDFBF7] px-3 py-2 dark:bg-[#0E151E]">
                  <Icon className="h-5 w-5 text-[#FF641C]" />
                </div>
              </div>

              <div className="mb-4 inline-flex rounded-full border border-[#FF641C]/20 bg-[#FF641C]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF641C]">
                {badge}
              </div>

              <h2 className="text-2xl font-extrabold text-[#080D12] dark:text-white">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#4B5563] dark:text-[#9CA3AF]">{description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};