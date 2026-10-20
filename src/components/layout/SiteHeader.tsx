// الملف: SiteHeader.tsx
// الوظيفة: رأس موقع "جزيرة عائمة": شريط كامل العرض في الأعلى يتحول عند التمرير لأعلى إلى كبسولة زجاجية تطفو في مكانها، ويختفي عند النزول
// المحتوى: مكوّن SiteHeader ونوع ActiveView ومنطق handleNavClick وقائمة الجوّال + مؤشر تنقل منزلق وتتبع للأقسام وشريط تقدم القراءة
// الاعتماديات: useState/useEffect وuseLanguage وuseTheme وsiteConfig وأيقونات lucide-react
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { siteConfig } from '../../config/site.ts';
import { Download, Sun, Moon, Menu, X } from 'lucide-react';

export type ActiveView = 'home' | 'projects' | 'courses';

interface SiteHeaderProps {
  currentView?: ActiveView;
  onNavigateHome: () => void;
  onNavigateProjects: () => void;
  onNavigateCourses: () => void;
  onOpenCvModal: () => void;
}

type NavKey = 'home' | 'projects' | 'courses' | 'about' | 'contact';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] dark:focus-visible:ring-offset-[#03070B]';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentView = 'home',
  onNavigateHome,
  onNavigateProjects,
  onNavigateCourses,
  onOpenCvModal,
}) => {
  const { locale, toggleLocale, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isRtl = dir === 'rtl';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll detection: float ("يطفو") as a glass island on scroll UP, hide on scroll DOWN
  const [isFloating, setIsFloating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [focusInside, setFocusInside] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;

      // Reading progress goes straight to a CSS variable: no React render per scroll event.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      headerRef.current?.style.setProperty('--p', max > 0 ? String(Math.min(1, Math.max(0, y / max))) : '0');

      const dy = y - lastY;
      if (y <= 25) {
        // At or near top: stay docked naturally
        setIsFloating(false);
        setIsVisible(true);
        lastY = y;
      } else if (Math.abs(dy) >= 6) {
        if (dy > 0 && y > 70) {
          // Scrolling down past 70px -> hide smoothly
          setIsVisible(false);
          setIsFloating(true);
        } else if (dy < 0) {
          // Scrolling UP -> float in place with glassmorphism
          setIsVisible(true);
          setIsFloating(true);
        }
        lastY = y;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Never hide while the menu is open or while keyboard focus is inside the header.
  const hidden = !isVisible && !mobileMenuOpen && !focusInside;

  const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');

  const handleNavClick = (target: ActiveView, sectionId?: string) => {
    setMobileMenuOpen(false);
    if (target === 'projects') {
      onNavigateProjects();
      return;
    }
    if (target === 'courses') {
      onNavigateCourses();
      return;
    }

    // Target is home
    if (currentView !== 'home') {
      onNavigateHome();
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: scrollBehavior() });
        }, 150);
      }
    } else {
      if (sectionId) {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: scrollBehavior() });
      } else {
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
      }
    }
  };

  /* ---------------- scroll-spy for the in-page sections ---------------- */
  const [spy, setSpy] = useState<'about' | 'contact' | null>(null);
  useEffect(() => {
    if (currentView !== 'home' || typeof IntersectionObserver === 'undefined') {
      setSpy(null);
      return;
    }
    const map: Record<string, 'about' | 'contact'> = { 'about-me': 'about', 'contact-banner': 'contact' };
    const inView = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target.id);
          else inView.delete(e.target.id);
        }
        const first = Object.keys(map).find((id) => inView.has(id));
        setSpy(first ? map[first] : null);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    Object.keys(map).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [currentView]);

  const activeKey: NavKey = currentView === 'home' ? (spy ?? 'home') : currentView;

  const navItems: { key: NavKey; label: string; onClick: () => void }[] = [
    { key: 'home', label: t('nav.home'), onClick: () => handleNavClick('home') },
    { key: 'projects', label: t('nav.projects'), onClick: () => handleNavClick('projects') },
    { key: 'courses', label: t('nav.courses'), onClick: () => handleNavClick('courses') },
    { key: 'about', label: t('nav.about'), onClick: () => handleNavClick('home', 'about-me') },
    { key: 'contact', label: t('nav.contact'), onClick: () => handleNavClick('home', 'contact-banner') },
  ];

  /* ---------------- sliding indicator (CSS variables, no state) ---------------- */
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Partial<Record<NavKey, HTMLButtonElement | null>>>({});
  const activeKeyRef = useRef<NavKey>(activeKey);
  activeKeyRef.current = activeKey;

  const placeIndicator = useCallback((key: NavKey | null) => {
    const nav = navRef.current;
    if (!nav) return;
    const el = key ? itemRefs.current[key] : null;
    if (!el || !el.offsetWidth) {
      nav.style.setProperty('--io', '0');
      return;
    }
    nav.style.setProperty('--ix', `${el.offsetLeft}px`);
    nav.style.setProperty('--iw', `${el.offsetWidth}px`);
    nav.style.setProperty('--io', '1');
  }, []);

  useEffect(() => {
    placeIndicator(activeKey);
  }, [activeKey, placeIndicator, locale, isFloating]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => placeIndicator(activeKeyRef.current));
    ro.observe(nav);
    return () => ro.disconnect();
  }, [placeIndicator]);

  /* ---------------- mobile menu: Escape, outside click, resize ---------------- */
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMobileMenuOpen(false);
    };
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    mq.addEventListener('change', onMq);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      mq.removeEventListener('change', onMq);
    };
  }, [mobileMenuOpen]);

  // Cursor spotlight on the island: written straight to CSS variables.
  const handleSpotlight = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };

  const linkClass = (key: NavKey) =>
    `relative z-10 px-3.5 py-2 rounded-full cursor-pointer transition-colors duration-300 ${FOCUS} ${
      activeKey === key
        ? 'text-[#FF641C] font-semibold'
        : 'text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#080D12] dark:hover:text-white'
    }`;

  const mobileLinkClass = (key: NavKey) =>
    `block w-full text-start py-3 px-2 rounded-lg font-medium ${FOCUS} ${
      activeKey === key ? 'text-[#FF641C] font-bold' : 'text-[#4B5563] dark:text-[#9CA3AF]'
    }`;

  const isPageKey = (k: NavKey) => k === 'home' || k === 'projects' || k === 'courses';

  return (
    <header
      ref={headerRef}
      data-floating={isFloating ? 'true' : 'false'}
      className="sh-root fixed top-0 inset-x-0 z-40 w-full pointer-events-none"
      onFocusCapture={() => setFocusInside(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusInside(false);
      }}
    >
      <style>{`
        .sh-island { transition:
            transform .6s cubic-bezier(.34,1.35,.64,1), opacity .4s ease,
            width .55s cubic-bezier(.22,1,.36,1), margin-top .55s cubic-bezier(.22,1,.36,1),
            height .55s cubic-bezier(.22,1,.36,1), border-radius .55s cubic-bezier(.22,1,.36,1),
            background-color .4s ease, border-color .4s ease, box-shadow .5s ease; }
        .sh-island[data-hidden='true'] { transform: translateY(-160%); opacity: 0; pointer-events: none;
          transition: transform .35s ease-in, opacity .3s ease-in, width .55s ease, margin-top .55s ease, height .55s ease, border-radius .55s ease; }

        .sh-spot { opacity: 0; transition: opacity .3s ease;
          background: radial-gradient(260px circle at var(--sx, 50%) var(--sy, 0%), rgba(255,100,28,.13), transparent 65%); }
        @media (hover: hover) { .sh-island:hover .sh-spot { opacity: 1; } }
        .sh-edge { opacity: 0; transition: opacity .5s ease; }
        .sh-root[data-floating='true'] .sh-edge { opacity: 1; }

        .sh-progress { transform: scaleX(var(--p, 0)); }

        .sh-indicator { left: var(--ix, 0px); width: var(--iw, 0px); opacity: var(--io, 0);
          transition: left .5s cubic-bezier(.34,1.3,.64,1), width .5s cubic-bezier(.34,1.3,.64,1), opacity .3s ease; }

        .sh-logo-ring { position: absolute; inset: -3px; border-radius: 9999px; opacity: 0; transition: opacity .3s ease;
          background: conic-gradient(from 0deg, #FF641C, transparent 40%, #FFB052 70%, #FF641C);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px));
                  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px));
          animation: shSpin 3s linear infinite; }
        .sh-brand:hover .sh-logo-ring, .sh-brand:focus-visible .sh-logo-ring { opacity: 1; }
        @keyframes shSpin { to { transform: rotate(360deg); } }

        .sh-cta { position: relative; overflow: hidden; }
        .sh-cta::after { content: ''; position: absolute; inset: 0; transform: translateX(-120%);
          background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%); }
        @media (hover: hover) { .sh-cta:hover::after { transform: translateX(120%); transition: transform .8s ease; } }

        .sh-drawer { animation: shDrawer .35s cubic-bezier(.22,1,.36,1) both; transform-origin: top center; }
        @keyframes shDrawer { from { opacity: 0; transform: translateY(-8px) scale(.98); } to { opacity: 1; transform: none; } }
        .sh-di { animation: shItem .4s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--i, 0) * 50ms + 80ms); }
        @keyframes shItem { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        @media (prefers-reduced-motion: reduce) {
          .sh-island, .sh-island[data-hidden='true'], .sh-indicator, .sh-spot, .sh-edge { transition: none !important; }
          .sh-logo-ring, .sh-drawer, .sh-di { animation: none !important; }
          .sh-cta::after { display: none; }
        }
      `}</style>

      <div
        data-hidden={hidden ? 'true' : 'false'}
        onPointerMove={handleSpotlight}
        className={`sh-island pointer-events-auto relative mx-auto border backdrop-blur-xl ${
          isFloating
            ? 'bg-[#FDFBF7]/75 dark:bg-[#080D12]/70 border-[#E8E0D5]/80 dark:border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] dark:shadow-[0_12px_50px_-12px_rgba(0,0,0,0.75)]'
            : 'bg-[#FDFBF7]/90 dark:bg-[#03070B]/90 border-transparent border-b-[#E8E0D5]/70 dark:border-b-[#1E2630]/80'
        }`}
        style={{
          width: isFloating ? 'min(94vw, 66rem)' : '100%',
          marginTop: isFloating ? 12 : 0,
          height: isFloating ? 56 : 72,
          borderRadius: isFloating ? 28 : 0,
        }}
      >
        {/* Decorative layer: spotlight, top highlight edge, reading progress (clipped to the island shape) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: 'inherit' }} aria-hidden="true">
          <div className="sh-spot absolute inset-0"></div>
          <div className="sh-edge absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#FF641C]/70 to-transparent"></div>
          <div
            className="sh-progress absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#FF641C] to-[#FFB052]"
            style={{ transformOrigin: isRtl ? 'right' : 'left' }}
          ></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand / Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`sh-brand flex items-center gap-3 group shrink-0 cursor-pointer text-start rounded-full ${FOCUS}`}
          >
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#FF7A3A] to-[#FF641C] flex items-center justify-center text-white shadow-md shadow-[#FF641C]/25 transition-transform duration-200 group-hover:scale-[1.06]">
              <span className="sh-logo-ring" aria-hidden="true"></span>
              <svg
                className="relative w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 18l6-6-6-6" />
                <path d="M8 6l-6 6 6 6" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#080D12] dark:text-white">
              {siteConfig.shortName}
            </span>
          </button>

          {/* Desktop Navigation with sliding indicator */}
          <nav
            ref={navRef}
            aria-label="Main Navigation"
            className="hidden md:flex relative items-center gap-1 text-sm font-medium"
            onPointerLeave={() => placeIndicator(activeKey)}
            onBlur={() => placeIndicator(activeKey)}
          >
            <span
              className="sh-indicator absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-[#FF641C]/10 border border-[#FF641C]/25 pointer-events-none"
              aria-hidden="true"
            ></span>

            {navItems.map((item) => (
              <button
                key={item.key}
                ref={(el) => {
                  itemRefs.current[item.key] = el;
                }}
                type="button"
                onClick={item.onClick}
                onPointerEnter={() => placeIndicator(item.key)}
                onFocus={() => placeIndicator(item.key)}
                aria-current={activeKey === item.key ? (isPageKey(item.key) ? 'page' : 'location') : undefined}
                className={linkClass(item.key)}
              >
                {item.label}
              </button>
            ))}

           
          </nav>

          {/* Action Controls (Lang, Theme, Download CV) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLocale}
              className={`text-xs font-semibold px-2.5 min-h-9 rounded-lg text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#080D12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-[#E8E0D5] dark:hover:border-[#1E2630] ${FOCUS}`}
              aria-label={`Switch language to ${locale === 'ar' ? 'English' : 'Arabic'}`}
            >
              {locale === 'ar' ? 'EN / AR' : 'AR / EN'}
            </button>

            {/* Theme Toggle (Day & Night) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`group w-9 h-9 flex items-center justify-center rounded-full text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#080D12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border border-[#E8E0D5]/70 dark:border-[#1E2630] ${FOCUS}`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={theme === 'dark' ? (locale === 'ar' ? 'تفعيل الإضاءة النهارية' : 'Switch to Day Light') : (locale === 'ar' ? 'تفعيل الإضاءة الليلية' : 'Switch to Night Mode')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-500 group-hover:rotate-90" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-[#4B5563] transition-transform duration-500 group-hover:-rotate-12" aria-hidden="true" />
              )}
            </button>

            {/* Download CV button */}
            <button
              type="button"
              onClick={onOpenCvModal}
              className={`sh-cta flex items-center gap-1.5 px-4 min-h-9 text-xs font-semibold text-white bg-gradient-to-br from-[#FF7A3A] to-[#FF641C] hover:from-[#FF641C] hover:to-[#E05312] active:scale-[0.98] rounded-full shadow-sm shadow-[#FF641C]/25 transition-all cursor-pointer whitespace-nowrap ${FOCUS}`}
            >
              <span className="relative z-10">{t('nav.downloadCv')}</span>
              <Download className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={toggleLocale}
              className={`text-xs font-bold min-w-11 min-h-11 rounded-lg text-[#4B5563] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5 ${FOCUS}`}
              aria-label="Toggle language"
            >
              {locale.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`w-11 h-11 flex items-center justify-center rounded-full text-[#4B5563] dark:text-[#9CA3AF] ${FOCUS}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-11 h-11 flex items-center justify-center rounded-full text-[#080D12] dark:text-white ${FOCUS}`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="sh-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer: opens as a glass panel right under the island */}
        {mobileMenuOpen && (
          <div
            id="sh-mobile-menu"
            className={`sh-drawer md:hidden absolute inset-x-0 top-full px-4 pt-3 pb-6 space-y-1 border backdrop-blur-xl bg-[#FDFBF7]/95 dark:bg-[#080D12]/95 border-[#E8E0D5] dark:border-[#1E2630] ${
              isFloating ? 'mt-2 rounded-3xl shadow-2xl shadow-black/30' : 'rounded-b-3xl border-t-0'
            }`}
          >
            {navItems.map((item, i) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                aria-current={activeKey === item.key ? (isPageKey(item.key) ? 'page' : 'location') : undefined}
                className={`sh-di ${mobileLinkClass(item.key)}`}
                style={{ '--i': i } as React.CSSProperties}
              >
                {item.label}
                {item.key === 'projects' || item.key === 'courses' ? ` ${locale === 'ar' ? ' ' : '(Page)'}` : ''}
              </button>
            ))}

            <div
              className="sh-di pt-3 mt-2 border-t border-[#E8E0D5] dark:border-[#1E2630]"
              style={{ '--i': navItems.length + 1 } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCvModal();
                }}
                className={`w-full flex items-center justify-center gap-2 min-h-12 text-sm font-semibold text-white bg-gradient-to-br from-[#FF7A3A] to-[#FF641C] rounded-full ${FOCUS}`}
              >
                <span>{t('nav.downloadCv')}</span>
                <Download className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};