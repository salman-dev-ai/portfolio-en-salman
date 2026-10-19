// الملف: AllProjectsModal.tsx
// الوظيفة: نافذة منبثقة لعرض كل المشاريع مع البحث والتصفية حسب التصنيف.
// المحتوى: مكوّن AllProjectsModal مع حالة البحث والتصنيف، ودوال handleClearFilters وgetUniqueProjectCategories.
// الاعتماديات: مكوّن عميل يعتمد useLanguage ويستورد projectsData وfilterProjects وProject وlucide-react.
import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { projectsData } from '../../data/projects.ts';
import { Project } from '../../types/portfolio.ts';
import { filterProjects, getUniqueProjectCategories } from '../../lib/filters.ts';
import { X, Search, Filter, RotateCcw, ArrowRight } from 'lucide-react';

interface AllProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const AllProjectsModal: React.FC<AllProjectsModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const { t, locale, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const categories = getUniqueProjectCategories(projectsData, 'en');

  const filteredProjects = filterProjects(projectsData, {
    category: selectedCategory,
    searchQuery,
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-projects-title"
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
            <h2 id="all-projects-title" className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('projects.allProjectsTitle')}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {filteredProjects.length} {t('projects.resultsFound')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('projects.closeModal')}
            className="w-9 h-9 rounded-full bg-[#131D2A] border border-[#1E2630] hover:border-[#FF641C] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls: Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('projects.searchPlaceholder')}
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

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#FF641C] text-white'
                  : 'bg-[#0E151E] border border-[#1E2630] text-gray-400 hover:text-white'
              }`}
            >
              {t('projects.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FF641C] text-white'
                    : 'bg-[#0E151E] border border-[#1E2630] text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}

            {(searchQuery || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="p-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-[#131D2A] transition-colors cursor-pointer shrink-0"
                title={t('projects.clearFilters')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400 mb-4">
              {t('projects.noResults')}
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 bg-[#FF641C] text-white text-xs font-semibold rounded-full"
            >
              {t('projects.clearFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  onClose();
                  onSelectProject(project);
                }}
                className="bg-[#0E151E] border border-[#1E2630] rounded-xl overflow-hidden hover:border-[#FF641C]/50 transition-all duration-300 group flex flex-col cursor-pointer shadow-md"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={project.thumbnail}
                    alt={project.title[locale]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#080D12]/90 rounded border border-[#1E2630] text-[10px] font-bold text-[#FF641C]">
                    {project.category[locale]}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#FF641C] transition-colors mb-1.5">
                      {project.title[locale]}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                      {project.shortDescription[locale]}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#131D2A] text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-[#FF641C]">
                      <span>{t('projects.viewProject')}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </div>
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
