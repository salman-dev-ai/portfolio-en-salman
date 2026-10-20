// الملف: CourseModal.tsx
// الوظيفة: نافذة منبثقة تعرض تفاصيل دورة تدريبية واحدة مع الوصف والمنهج والمدة.
// المحتوى: مكوّن CourseModal يستقبل course وonClose ويعرض الصورة وcourse.syllabus وزر بدء الدورة.
// الاعتماديات: مكوّن عميل يعتمد useLanguage للترجمة ويستورد Course من types/portfolio وlucide-react.
import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { Course } from '../../types/portfolio.ts';
import { X, BookOpen, Clock, Award, CheckCircle2, Play } from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose }) => {
  const { t, locale } = useLanguage();

  React.useEffect(() => {
    if (!course) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [course, onClose]);

  if (!course) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0E151E] border border-[#1E2630] rounded-2xl p-6 sm:p-8 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t('courses.closeModal')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-[#131D2A] border border-[#1E2630] hover:border-[#FF641C] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Course Thumbnail */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-6 bg-black border border-[#1E2630]">
          <img
            src={course.thumbnail}
            alt={course.title[locale]}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#080D12]/90 backdrop-blur-md rounded-md border border-[#1E2630] text-xs font-bold text-[#FF641C]">
            {course.difficulty}
          </div>
        </div>

        {/* Title */}
        <h2 id="course-title" className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {course.title[locale]}
        </h2>

        {/* Metadata info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-5">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#FF641C]" />
            <span>{course.lessonsCount} {t('courses.lessons')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#FF641C]" />
            <span>{course.durationHours} {t('courses.hours')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#FF641C]" />
            <span>{t('courses.modalLevel')}: {course.difficulty}</span>
          </div>
        </div>

        {/* Full Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          {course.fullDescription[locale]}
        </p>

        {/* Syllabus / Curriculum */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-[#FF641C] uppercase tracking-wider mb-3">
            {t('courses.modalSyllabus')}
          </h3>
          <div className="space-y-2">
            {course.syllabus[locale].map((item: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#131D2A] border border-[#1E2630] text-xs text-gray-200"
              >
                <div className="w-5 h-5 rounded-full bg-[#FF641C]/20 text-[#FF641C] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1E2630]">
          <button
            type="button"
            onClick={() => {
              alert(locale === 'ar' ? 'تم بدء التسجيل في الدورة بنجاح!' : 'Enrolled in course successfully!');
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF641C] hover:bg-[#E05312] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t('courses.startCourse')}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {t('courses.closeModal')}
          </button>
        </div>
      </div>
    </div>
  );
};
