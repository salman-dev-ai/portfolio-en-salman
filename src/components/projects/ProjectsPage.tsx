// الملف: ProjectsPage.tsx
// الوظيفة: صفحة معرض المشاريع بعرض البانر والإحصائيات وبطاقات المشاريع مع البحث والتصنيف.
// المحتوى: مكوّن ProjectsPage مع حالة البحث والتصنيف والمشروع المختار، ويستخدم categories وfilteredProjects.
// الاعتماديات: مكوّن عميل يعتمد useLanguage ويستورد projectsData وProjectModal وfilterProjects وlucide-react.
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { projectsData } from '../../data/projects.ts';
import { Project } from '../../types/portfolio.ts';
import { filterProjects, getUniqueProjectCategories } from '../../lib/filters.ts';
import { ProjectModal } from './ProjectModal';
import { SpotlightCard } from './ProjectCardFx';
import { AnimatedNumber, Reveal } from '../courses/LearningPathMap';
import {
  ArrowLeft,
  ArrowRight,
  Search,
   ExternalLink,
  Github,
  Sparkles,
  Layers,
  Code2,
  FolderGit2,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

interface ProjectsPageProps {
  onBackToHome: () => void;
  onOpenAgent?: () => void;
  onOpenCvModal?: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onBackToHome,
  onOpenAgent,
  onOpenCvModal,
}) => {
  const { t, locale, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // ربط التقنيات: التمرير على اسم تقنية يضيء كل المشاريع التي تستخدمها، والضغط عليها يثبّتها (مفيد للّمس)
  const [hoverTech, setHoverTech] = useState<string | null>(null);
  const [pinnedTech, setPinnedTech] = useState<string | null>(null);
  const activeTech = pinnedTech ?? hoverTech;
  const techUsageCount = activeTech
    ? projectsData.filter((p) => p.technologies.includes(activeTech)).length
    : 0;

  const isRtl = dir === 'rtl';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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
              {isRtl ? 'معرض المشاريع  ' : 'Projects Showcase'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Banner for Projects */}
      <div className="relative overflow-hidden pt-10 pb-12 sm:pb-16 border-b border-[#E8E0D5]/70 dark:border-[#1E2630]/70">
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(#FF641C_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF641C]/10 text-[#FF641C] border border-[#FF641C]/20 mb-4">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>{isRtl ? 'سجل الأعمال والابتكارات البرمجية' : 'Engineering Portfolio & Works'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#080D12] dark:text-white mb-4">
              {isRtl ? 'كافة المشاريع والحلول الرقمية' : 'All Projects & Software Solutions'}
            </h1>

            <p className="text-base sm:text-lg text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
              {isRtl
                ? 'استكشف مجموعة شاملة من المشاريع التطبيقية، ومنصات الويب السحابية، وتطبيقات الهاتف الذكية، وحلول الذكاء الاصطناعي التي طورها المهندس سلمان بمعايير هندسية متقدمة.'
                : 'Explore a curated collection of production web platforms, cloud architectures, mobile systems, and AI workflows engineered by Salman Al-Ansi.'}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E8E0D5]/60 dark:border-[#1E2630]/60">
            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#FF641C]"><AnimatedNumber value={projectsData.length} suffix="+" /></p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                {isRtl ? 'مشاريع مكتملة' : 'Completed Projects'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#080D12] dark:text-white"><AnimatedNumber value={100} suffix="%" /></p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                {isRtl ? 'كود إنتاجي نظيف' : 'Production-Ready Code'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#080D12] dark:text-white"><AnimatedNumber value={15} suffix="+" /></p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                {isRtl ? 'تقنية وإطار عمل' : 'Tech Frameworks'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630]">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500"><AnimatedNumber value={99.9} decimals={1} suffix="%" /></p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                {isRtl ? 'جاهزية واستقرار' : 'Uptime & Reliability'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Filter and Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls: Search and Categories */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث بالاسم، التقنية، أو الكلمات المفتاحية...' : 'Search by name, technology, or keywords...'}
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

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#FF641C] text-white shadow-sm shadow-[#FF641C]/25'
                  : 'bg-white dark:bg-[#0A1017] border border-[#E8E0D5] dark:border-[#1E2630] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#080D12] dark:hover:text-white'
              }`}
            >
              {isRtl ? 'كافة التصنيفات' : 'All Categories'}
            </button>
            {categories.map((cat) => {
              const count = projectsData.filter((p) => p.category.en === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#FF641C] text-white shadow-sm shadow-[#FF641C]/25'
                      : 'bg-white dark:bg-[#0A1017] border border-[#E8E0D5] dark:border-[#1E2630] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#080D12] dark:hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="ms-1.5 opacity-60 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Clear */}
        <div className="flex items-center justify-between gap-3 min-h-[28px] text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-6">
          <span>
            {isRtl
              ? `عرض ${filteredProjects.length} مشروع من أصل ${projectsData.length}`
              : `Showing ${filteredProjects.length} of ${projectsData.length} projects`}
          </span>
          <span aria-live="polite" className="flex-1 text-center">
            {activeTech && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF641C]/30 bg-[#FF641C]/10 px-3 py-1 text-[11px] font-semibold text-[#FF641C]">
                <span>{activeTech}</span>
                <span className="opacity-60">·</span>
                <span>
                  {isRtl
                    ? `مستخدمة في ${techUsageCount} من ${projectsData.length} مشروع`
                    : `used in ${techUsageCount} of ${projectsData.length} projects`}
                </span>
              </span>
            )}
          </span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-[#FF641C] hover:underline font-medium cursor-pointer"
            >
              {isRtl ? 'إعادة تعيين التصفية' : 'Reset filters'}
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#080D12] rounded-2xl border border-[#E8E0D5] dark:border-[#1E2630] p-8">
            <Layers className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#080D12] dark:text-white mb-1">
              {isRtl ? 'لا توجد مشاريع تطابق البحث' : 'No matching projects found'}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-4">
              {isRtl
                ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً'
                : 'Try searching with different terms or selecting another category'}
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#FF641C] rounded-lg"
            >
              {isRtl ? 'عرض كافة المشاريع' : 'Show all projects'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => {
              const projectTitle = locale === 'ar' ? project.title.ar : project.title.en;
              const projectDesc = locale === 'ar' ? project.shortDescription.ar : project.shortDescription.en;
              const categoryLabel = locale === 'ar' ? project.category.ar : project.category.en;

              const isMatch = activeTech !== null && project.technologies.includes(activeTech);
              const isDimmed = activeTech !== null && !isMatch;

              return (
                <Reveal key={project.id} delay={Math.min(idx, 5) * 80} className="h-full">
                <SpotlightCard
                  dimmed={isDimmed}
                  highlighted={isMatch}
                  className="flex h-full flex-col bg-white dark:bg-[#080D12] border border-[#E8E0D5] dark:border-[#1E2630] rounded-2xl overflow-hidden hover:border-[#FF641C]/60 dark:hover:border-[#FF641C]/60 hover:shadow-xl transition-all duration-300"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#1E2630]">
                    <img
                      src={project.thumbnail}
                      alt={projectTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {categoryLabel}
                    </span>

                    {project.featured && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FF641C] text-white shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>{isRtl ? 'مميز' : 'Featured'}</span>
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#080D12] dark:text-white mb-2 group-hover:text-[#FF641C] transition-colors">
                        {projectTitle}
                      </h3>
                      <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed mb-4 line-clamp-3">
                        {projectDesc}
                      </p>

                      {/* Tech stack pills */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.technologies.map((tech) => {
                          const on = activeTech === tech;
                          return (
                            <button
                              key={tech}
                              type="button"
                              aria-pressed={pinnedTech === tech}
                              onMouseEnter={() => setHoverTech(tech)}
                              onMouseLeave={() => setHoverTech(null)}
                              onFocus={() => setHoverTech(tech)}
                              onBlur={() => setHoverTech(null)}
                              onClick={() => setPinnedTech((cur) => (cur === tech ? null : tech))}
                              className={`relative z-[3] cursor-pointer text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                                on
                                  ? 'bg-[#FF641C] text-white border-[#FF641C]'
                                  : 'bg-[#F3F4F6] dark:bg-[#131D2A] text-[#4B5563] dark:text-gray-300 border-[#E5E7EB] dark:border-[#1E2630] hover:border-[#FF641C]/60'
                              }`}
                            >
                              {tech}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 border-t border-[#E8E0D5]/70 dark:border-[#1E2630] flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="text-xs font-semibold text-[#FF641C] hover:text-[#E05312] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>{isRtl ? 'تفاصيل المشروع' : 'View Details'}</span>
                        {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#080D12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            title="GitHub Repository"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-[#FF641C] hover:bg-[#FF641C]/10 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#080D12] to-[#131D2A] text-white border border-[#1E2630] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-start">
            <h3 className="text-xl font-extrabold text-white">
              {isRtl ? 'هل لديك فكرة مشروع أو منصة برمجية تريد تنفيذها؟' : 'Have a project or software system in mind?'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              {isRtl
                ? 'يمكنك التحدث مباشرة مع وكيل سلمان الذكي للاستفسار عن الإتاحة ونطاق العمل، أو طلب استشارة تقنية.'
                : 'Connect with Salman Al-Ansi or inquire through the AI Agent regarding availability, project scopes, and engineering consulting.'}
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
                <span>{isRtl ? 'اسأل الوكيل الذكي' : 'Talk with AI Agent'}</span>
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

      {/* Standalone Project Detail Modal for in-depth view */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};