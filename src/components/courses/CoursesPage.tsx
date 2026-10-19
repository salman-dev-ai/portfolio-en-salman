// الملف: CoursesPage.tsx
// الوظيفة: صفحة منصة الدورات بعرض البانر والإحصائيات وبطاقات الدورات مع البحث والتصفية.
// المحتوى: مكوّن CoursesPage مع حالة البحث والمستوى والدورة المختارة، ودوال getDifficultyBadge وgetDifficultyLabel.
// الاعتماديات: مكوّن عميل يعتمد useLanguage ويستورد coursesData وCourseModal وfilterCourses وlucide-react.
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { coursesData } from '../../data/courses.ts';
import { Course, CourseDifficulty } from '../../types/portfolio.ts';
import { filterCourses } from '../../lib/filters.ts';
import { CourseModal } from './CourseModal';
import { LearningPathMap, AnimatedNumber, Reveal } from './LearningPathMap';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  BookOpen,
  Clock,
  Award,
  Users,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

interface CoursesPageProps {
  onBackToHome: () => void;
  onOpenAgent?: () => void;
  onOpenCvModal?: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  onBackToHome,
  onOpenAgent,
  onOpenCvModal,
}) => {
  const { t, locale, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<CourseDifficulty | 'all'>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // الدورة المضيئة حاليًا (تمرير الماوس على محطة في الخريطة أو على بطاقة، أو بعد الضغط على محطة)
  const [activeId, setActiveId] = useState<Course['id'] | null>(null);
  const flashTimer = useRef<number | undefined>(undefined);

  const isRtl = dir === 'rtl';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => window.clearTimeout(flashTimer.current);
  }, []);

  const filteredCourses = filterCourses(coursesData, {
    difficulty: selectedDifficulty,
    searchQuery,
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
  };

  // الضغط على محطة في الخريطة: يعيد ضبط التصفية إن كانت الدورة مخفية، ثم ينتقل إلى بطاقتها ويضيئها لثانيتين
  const handleSelectCourse = (id: Course['id']) => {
    const visible = filteredCourses.some((c) => c.id === id);
    if (!visible) handleClearFilters();
    window.setTimeout(
      () => document.getElementById(`course-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      visible ? 0 : 120,
    );
    setActiveId(id);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setActiveId(null), 2200);
  };

  const totalLessons = coursesData.reduce((acc, c) => acc + c.lessonsCount, 0);
  const totalHours = coursesData.reduce((acc, c) => acc + c.durationHours, 0);

  const getDifficultyBadge = (difficulty: CourseDifficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Advanced':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getDifficultyLabel = (difficulty: CourseDifficulty) => {
    if (locale === 'ar') {
      switch (difficulty) {
        case 'Beginner':
          return 'مبتدئ';
        case 'Intermediate':
          return 'متوسط';
        case 'Advanced':
          return 'متقدم';
        default:
          return difficulty;
      }
    }
    return difficulty;
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] dark:bg-[#03070B] text-[#080D12] dark:text-[#F3F4F6] transition-colors pb-24">
      {/* Top Breadcrumb & Return Bar */}
      <div className="w-full border-b border-[#E8E0D5]/80 dark:border-[#1E2630] bg-[#FAF7F0]/60 dark:bg-[#060B10]/60 backdrop-blur-sm sticky top-18 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#FF641C] hover:text-[#E05312] transition-colors cursor-pointer group"
          >
            {isRtl ? (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            ) : (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            )}
            <span>{isRtl ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            <span>{isRtl ? 'الرئيسية' : 'Home'}</span>
            <span>/</span>
            <span className="font-semibold text-[#080D12] dark:text-white">
              {isRtl ? 'منصة الدورات والمسارات التعليمية' : 'Courses & Learning Platform'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Banner for Courses */}
      <div className="relative overflow-hidden pt-10 pb-12 sm:pb-16 border-b border-[#E8E0D5]/70 dark:border-[#1E2630]/70">
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(#FF641C_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF641C]/10 text-[#FF641C] border border-[#FF641C]/20 mb-4">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isRtl ? 'التعلم والتطوير المهني المستمر' : 'Continuous Learning & Mentorship'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#080D12] dark:text-white mb-4">
              {isRtl ? 'الدورات وورش العمل التقنية' : 'Engineering Courses & Workshops'}
            </h1>

            <p className="text-base sm:text-lg text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
              {isRtl
                ? 'مناهج برمجية تطبيقية ومسارات متقدمة يقدمها المهندس سلمان الانسي لمساعدة المطورين وفرق العمل على إتقان هندسة النظم، وتطوير الويب الحديث، والحلول السحابية.'
                : 'Deep-dive engineering curricula and workshops designed by Salman Al-Ansi to empower engineers in system design, cloud backends, and modern full-stack craftsmanship.'}
            </p>
          </div>

          {/* Animated Learning Path Map */}
          <LearningPathMap
            courses={coursesData}
            activeId={activeId}
            onHover={setActiveId}
            onSelect={handleSelectCourse}
            isRtl={isRtl}
          />

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E8E0D5]/60 dark:border-[#1E2630]/60">
            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#FF641C]"><AnimatedNumber value={coursesData.length} /></p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                {isRtl ? 'دورات متخصصة' : 'Specialized Courses'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#080D12] dark:text-white"><AnimatedNumber value={totalHours} suffix="+" /></p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                {isRtl ? 'ساعة تدريبية' : 'Training Hours'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#080D12] dark:text-white"><AnimatedNumber value={totalLessons} /></p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                {isRtl ? 'درس تطبيقي عملي' : 'Hands-on Lessons'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630]">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500"><AnimatedNumber value={4.9} decimals={1} suffix="/5" /></p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                {isRtl ? 'تقييم المتدربين' : 'Student Rating'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Filter and Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls: Search and Difficulty */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث في محتوى الدورات والدروس...' : 'Search courses, topics, or lessons...'}
              className={`w-full py-2.5 bg-white dark:bg-[#0A1017] border border-[#E8E0D5] dark:border-[#1E2630] focus:border-[#FF641C] dark:focus:border-[#FF641C] rounded-xl text-xs sm:text-sm text-[#080D12] dark:text-white placeholder-gray-400 focus:outline-none transition-colors shadow-sm ${
                isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs ${
                  isRtl ? 'left-3' : 'right-3'
                }`}
              >
                ✕
              </button>
            )}
          </div>

          {/* Difficulty Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => {
              const label =
                diff === 'all'
                  ? isRtl ? 'كافة المستويات' : 'All Levels'
                  : getDifficultyLabel(diff as CourseDifficulty);

              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-[#FF641C] text-white shadow-sm shadow-[#FF641C]/25'
                      : 'bg-white dark:bg-[#0A1017] border border-[#E8E0D5] dark:border-[#1E2630] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#080D12] dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Clear */}
        <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-6">
          <span>
            {isRtl
              ? `عرض ${filteredCourses.length} دورة تدريبية`
              : `Showing ${filteredCourses.length} of ${coursesData.length} courses`}
          </span>
          {(searchQuery || selectedDifficulty !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-[#FF641C] hover:underline font-medium cursor-pointer"
            >
              {isRtl ? 'إعادة تعيين التصفية' : 'Reset filters'}
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#080D12] rounded-2xl border border-[#E8E0D5] dark:border-[#1E2630] p-8">
            <BookOpen className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#080D12] dark:text-white mb-1">
              {isRtl ? 'لا توجد دورات تطابق البحث' : 'No matching courses found'}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-4">
              {isRtl
                ? 'جرب البحث بكلمات أخرى أو اختر مستوى صعوبة مختلف'
                : 'Try searching with different terms or selecting another difficulty level'}
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#FF641C] rounded-lg"
            >
              {isRtl ? 'عرض كافة الدورات' : 'Show all courses'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => {
              const courseTitle = locale === 'ar' ? course.title.ar : course.title.en;
              const courseDesc = locale === 'ar' ? course.shortDescription.ar : course.shortDescription.en;
              const categoryLabel = locale === 'ar' ? course.category.ar : course.category.en;
              const syllabusItems = locale === 'ar' ? course.syllabus.ar : course.syllabus.en;

              const isActive = activeId === course.id;

              return (
                <Reveal key={course.id} delay={Math.min(idx, 5) * 80} className="h-full">
                <div
                  id={`course-${course.id}`}
                  onMouseEnter={() => setActiveId(course.id)}
                  onMouseLeave={() => setActiveId(null)}
                  className={`group flex h-full flex-col bg-white dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630] rounded-2xl overflow-hidden hover:border-[#FF641C]/60 dark:hover:border-[#FF641C]/60 hover:shadow-xl transition-all duration-300 ${
                    isActive ? 'ring-2 ring-[#FF641C]/50 shadow-xl' : ''
                  }`}
                >
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#1E2630]">
                    <img
                      src={course.thumbnail}
                      alt={courseTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Difficulty Badge */}
                    <span
                      className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${getDifficultyBadge(
                        course.difficulty
                      )}`}
                    >
                      {getDifficultyLabel(course.difficulty)}
                    </span>

                    {course.featured && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FF641C] text-white shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>{isRtl ? 'مسار مميز' : 'Featured Track'}</span>
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                      <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                        <Clock className="w-3.5 h-3.5 text-[#FF641C]" />
                        <span>{course.durationHours} {isRtl ? 'ساعة' : 'hours'}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                        <BookOpen className="w-3.5 h-3.5 text-[#FF641C]" />
                        <span>{course.lessonsCount} {isRtl ? 'درس' : 'lessons'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-[#FF641C] uppercase tracking-wider mb-1">
                        {categoryLabel}
                      </div>

                      <h3 className="text-lg font-bold text-[#080D12] dark:text-white mb-2 group-hover:text-[#FF641C] transition-colors">
                        {courseTitle}
                      </h3>

                      <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed mb-4 line-clamp-3">
                        {courseDesc}
                      </p>

                      {/* Syllabus preview pills */}
                      <div className="space-y-1.5 mb-5 bg-[#FAF7F0] dark:bg-[#0A1017] p-3 rounded-xl border border-[#E8E0D5]/70 dark:border-[#1E2630]">
                        <p className="text-[11px] font-bold text-[#080D12] dark:text-white mb-1">
                          {isRtl ? 'أبرز محاور المسار:' : 'Key Syllabus Modules:'}
                        </p>
                        {syllabusItems.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#4B5563] dark:text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 border-t border-[#E8E0D5]/70 dark:border-[#1E2630] flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedCourse(course)}
                        className="text-xs font-semibold text-[#FF641C] hover:text-[#E05312] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>{isRtl ? 'استعراض تفاصيل الدورة' : 'View Syllabus Details'}</span>
                        {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </button>

                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                        {isRtl ? 'شهادة إتمام' : 'Certificate'}
                      </span>
                    </div>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#080D12] to-[#131D2A] text-white border border-[#1E2630] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-start">
            <h3 className="text-xl font-extrabold text-white">
              {isRtl ? 'هل ترغب في دورة تدريبية مخصصة لفريق عملك التقني؟' : 'Interested in custom training for your tech team?'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              {isRtl
                ? 'يقدم المهندس سلمان برامج تدريبية وتأهيلية موجهة للشركات الناشئة والمؤسسات التقنية في مجالات تطوير البرمجيات وتصميم المعماريات الحديثة.'
                : 'Salman delivers corporate engineering workshops and architectural mentorship for teams and organizations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenAgent && (
              <button
                type="button"
                onClick={onOpenAgent}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#FF641C] hover:bg-[#E05312] rounded-full shadow-lg shadow-[#FF641C]/30 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isRtl ? 'استفسر من الوكيل الذكي' : 'Inquire via AI Agent'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBackToHome}
              className="px-5 py-2.5 text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-full transition-all cursor-pointer"
            >
              {isRtl ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
            </button>
          </div>
        </div>
      </div>

      {/* Standalone Course Detail Modal */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
};