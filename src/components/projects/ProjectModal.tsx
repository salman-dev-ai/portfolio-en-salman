// الملف: ProjectModal.tsx
// الوظيفة: نافذة منبثقة تعرض تفاصيل مشروع واحد مع الميزات والتقنيات والروابط.
// المحتوى: مكوّن ProjectModal يستقبل project وonClose ويعرض highlights وtechnologies وliveUrl/githubUrl.
// الاعتماديات: مكوّن عميل يعتمد useLanguage للترجمة ويستورد Project من types/portfolio وlucide-react.
import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { Project } from '../../types/portfolio.ts';
import { X, ExternalLink, Github, CheckCircle2, Tag } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { t, locale, dir } = useLanguage();

  React.useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
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
          aria-label={t('projects.closeModal')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-[#131D2A] border border-[#1E2630] hover:border-[#FF641C] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Thumbnail Banner */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-6 bg-black border border-[#1E2630]">
          <img
            src={project.thumbnail}
            alt={project.title[locale]}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#080D12]/90 backdrop-blur-md rounded-md border border-[#1E2630] text-xs font-bold text-[#FF641C]">
            {project.category[locale]}
          </div>
        </div>

        {/* Title */}
        <h2 id="project-title" className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          {project.title[locale]}
        </h2>

        {/* Full Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          {project.fullDescription[locale]}
        </p>

        {/* Key Highlights */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#FF641C] uppercase tracking-wider mb-3">
            {t('projects.modalHighlights')}
          </h3>
          <ul className="space-y-2">
            {project.highlights[locale].map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF641C] shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Used */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
            {t('projects.modalTechUsed')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#131D2A] border border-[#1E2630] text-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1E2630]">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF641C] hover:bg-[#E05312] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              <span>{t('projects.modalLiveDemo')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#131D2A] hover:bg-[#1A2636] border border-[#1E2630] text-gray-200 hover:text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>{t('projects.modalSourceCode')}</span>
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ms-auto px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {t('projects.closeModal')}
          </button>
        </div>
      </div>
    </div>
  );
};
