// الملف: AllCoursesModal.tsx
// الوظيفة: نافذة منبثقة لعرض كل الدورات مع البحث والتصفية حسب مستوى الصعوبة.
// المحتوى: مكوّن AllCoursesModal مع حالة البحث والتصفية، ودوال handleClearFilters وgetDifficultyBadge.
// الاعتماديات: مكوّن عميل يعتمد useLanguage ويستورد coursesData وfilterCourses وCourse وlucide-react.
import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { coursesData } from '../../data/courses.ts';
import { Course, CourseDifficulty } from '../../types/portfolio.ts';
import { filterCourses } from '../../lib/filters.ts';
import { X, Search, BookOpen, Clock, RotateCcw, ArrowRight } from 'lucide-react';

interface AllCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (course: Course) => void;
}

export const AllCoursesModal: React.FC<AllCoursesModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
}) => {
  const { t, locale, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<CourseDifficulty | 'all'>('all');

  const isRtl = dir === 'rtl';

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCourses = filterCourses(coursesData, {
    difficulty: selectedDifficulty,
    searchQuery,
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Advanced':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-courses-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#080D12] border border-[#1E2630] rounded-2xl p-6 sm:p-8 text-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#1E2630] mb-6">
          <div>
            <h2 id="all-courses-title" className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('courses.allCoursesTitle')}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {filteredCourses.length} {t('courses.resultsFound')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('courses.closeModal')}
            className="w-9 h-9 rounded-full bg-[#131D2A] border border-[#1E2630] hover:border-[#FF641C] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('courses.searchPlaceholder')}
              className={`w-full py-2.5 bg-[#0E151E] border border-[#1E2630] focus:border-[#FF641C] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors ${
                isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs ${
                  isRtl ? 'left-3' : 'right-3'
                }`}
              >
                ✕
              </button>
            )}
          </div>

          {/* Difficulty Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedDifficulty('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedDifficulty === 'all'
                  ? 'bg-[#FF641C] text-white'
                  : 'bg-[#0E151E] border border-[#1E2630] text-gray-400 hover:text-white'
              }`}
            >
              {t('courses.allDifficulties')}
            </button>
            {(['Beginner', 'Intermediate', 'Advanced'] as CourseDifficulty[]).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-[#FF641C] text-white'
                    : 'bg-[#0E151E] border border-[#1E2630] text-gray-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}

            {(searchQuery || selectedDifficulty !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="p-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-[#131D2A] transition-colors cursor-pointer shrink-0"
                title={t('courses.clearFilters')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Courses Grid or Empty State */}
        {filteredCourses.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400 mb-4">
              {t('courses.noResults')}
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 bg-[#FF641C] text-white text-xs font-semibold rounded-full"
            >
              {t('courses.clearFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course: Course) => (
              <div
                key={course.id}
                onClick={() => {
                  onClose();
                  onSelectCourse(course);
                }}
                className="bg-[#0E151E] border border-[#1E2630] rounded-xl overflow-hidden hover:border-[#FF641C]/50 transition-all duration-300 group flex flex-col cursor-pointer shadow-md"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={course.thumbnail}
                    alt={course.title[locale]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2.5 right-2.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${getDifficultyBadge(
                        course.difficulty
                      )}`}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#FF641C] transition-colors mb-1.5">
                      {course.title[locale]}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{course.lessonsCount} {t('courses.lessons')}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.durationHours} {t('courses.hours')}</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                      {course.shortDescription[locale]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-[#FF641C]">
                    <span>{t('courses.viewCourse')}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
