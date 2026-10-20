// الملف: App.tsx
// الوظيفة: المكوّن الجذر للمحفظة متعددة الصفحات (الرئيسية، المشاريع، الدورات).
// المحتوى: PortfolioApp مع مكونات الأقسام والنوافذ المنبثقة وتوجيه يعتمد على الـ hash.
// الاعتماديات: React و LanguageProvider/ThemeProvider ومكونات components و types/portfolio.
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext.tsx';
import { ThemeProvider } from './theme/ThemeContext.tsx';
import { SiteHeader, ActiveView } from './components/layout/SiteHeader.tsx';
import { SiteFooter } from './components/layout/SiteFooter.tsx';
import { HeroSection } from './components/home/HeroSection.tsx';
import { ValuePropositionSection } from './components/home/ValuePropositionSection.tsx';
import { AboutAndTechSection } from './components/home/AboutAndTechSection.tsx';
import { FeaturedProjectsSection } from './components/home/FeaturedProjectsSection.tsx';
import { TestimonialSection } from './components/home/TestimonialSection.tsx';
import { ContactBanner } from './components/home/ContactBanner.tsx';
import { ProjectsPage } from './components/projects/ProjectsPage.tsx';
import { CoursesPage } from './components/courses/CoursesPage.tsx';
import { ProjectModal } from './components/projects/ProjectModal.tsx';
import { CVModal } from './components/cv/CVModal.tsx';
import { JourneyVideoModal } from './components/about/JourneyVideoModal.tsx';
import { Project } from './types/portfolio.ts';

function PortfolioApp() {
  const { dir } = useLanguage();
  
  // Page routing state: Standalone pages for Home, Projects, and Courses
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('project')) return 'projects';
      if (hash.includes('course')) return 'courses';
    }
    return 'home';
  });

  // Modal detail states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isJourneyVideoOpen, setIsJourneyVideoOpen] = useState(false);

  // Sync hash routing with activeView
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('project')) {
        setActiveView('projects');
      } else if (hash.includes('course')) {
        setActiveView('courses');
      } else if (!hash || hash === '#home') {
        setActiveView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: ActiveView) => {
    setActiveView(view);
    if (view === 'projects') {
      window.location.hash = '#/projects';
    } else if (view === 'courses') {
      window.location.hash = '#/courses';
    } else {
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExploreWork = () => {
    navigateTo('projects');
  };

  const handleContactMe = () => {
    if (activeView !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const el = document.getElementById('contact-banner');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('contact-banner');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#03070B] text-[#080D12] dark:text-[#F3F4F6] transition-colors duration-200"
    >
      {/* Floating Glassmorphic Header */}
      <SiteHeader
        currentView={activeView}
        onNavigateHome={() => navigateTo('home')}
        onNavigateProjects={() => navigateTo('projects')}
        onNavigateCourses={() => navigateTo('courses')}
        onOpenCvModal={() => setIsCvModalOpen(true)}
      />

      {/* Main Content Area (padded for fixed header) */}
      <main className="flex-1 pt-18">
        {activeView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onExploreWork={handleExploreWork}
              onContactMe={handleContactMe}
              onOpenCvModal={() => setIsCvModalOpen(true)}
            />

            {/* 4-Card Value Proposition Strip */}
            <ValuePropositionSection />

            {/* About Me & Tech Stack 2-Column Section */}
            <AboutAndTechSection
              onOpenVideo={() => setIsJourneyVideoOpen(true)}
              onOpenAllTech={() => navigateTo('projects')}
            />

            {/* Featured Projects Section */}
            <FeaturedProjectsSection
              onSelectProject={(proj) => setSelectedProject(proj)}
              onViewAllProjects={() => navigateTo('projects')}
            />

            {/* Testimonial Section with Network Globe */}
            <TestimonialSection />

            {/* Dramatic Mountain Sunset Contact Banner & Get in Touch Panel */}
            <ContactBanner
              onOpenCvModal={() => setIsCvModalOpen(true)}
            />
          </>
        )}

        {/* Dedicated Standalone Projects Page */}
        {activeView === 'projects' && (
          <ProjectsPage
            onBackToHome={() => navigateTo('home')}
            onOpenCvModal={() => setIsCvModalOpen(true)}
          />
        )}

        {activeView === 'courses' && (
          <CoursesPage
            onBackToHome={() => navigateTo('home')}
          />
        )}

      </main>

      {/* Site Footer */}
      <SiteFooter />

      {/* Interactive Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CVModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
      />

      <JourneyVideoModal
        isOpen={isJourneyVideoOpen}
        onClose={() => setIsJourneyVideoOpen(false)}
      />

  
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <PortfolioApp />
      </ThemeProvider>
    </LanguageProvider>
  );
}
