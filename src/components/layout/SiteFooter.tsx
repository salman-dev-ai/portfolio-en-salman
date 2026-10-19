// الملف: SiteFooter.tsx
// الوظيفة: تذييل احترافي: هوية، روابط تنقل، قنوات تواصل، حقوق النشر والسنة الحالية، وزر عودة للأعلى
// المحتوى: مكوّن SiteFooter مع currentYear ونصوص مترجمة للملكية والصنع
// الاعتماديات: useLanguage وsiteConfig وأيقونات lucide-react
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { siteConfig } from '../../config/site.ts';
import { Mail, Linkedin, Github, MessageCircle, ArrowUp, ArrowUpRight } from 'lucide-react';

const UI = {
  explore: { en: 'Explore', ar: 'استكشف' },
  navLabel: { en: 'Footer navigation', ar: 'تنقل التذييل' },
  top: { en: 'Back to top', ar: 'العودة للأعلى' },
  newTab: { en: '(opens in a new tab)', ar: '(يفتح في تبويب جديد)' },
};

// Section ids that already exist on the page.
const NAV_LINKS = [
  { id: 'about-me', label: { en: 'About', ar: 'نبذة عني' } },
  { id: 'featured-projects', label: { en: 'Projects', ar: 'المشاريع' } },
  { id: 'learn-and-grow', label: { en: 'Courses', ar: 'الدورات' } },
  { id: 'contact-banner', label: { en: 'Contact', ar: 'تواصل' } },
];

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070B]';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const SiteFooter: React.FC = () => {
  const { t, locale, dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const lang: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';
  const currentYear = new Date().getFullYear();
  const monogram = Array.from(siteConfig.name)[0] ?? '';

  // Entrance: 'idle' (static, SSR-safe) -> 'armed' (hidden, waiting) -> 'shown' (plays once on first view)
  const footerRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'armed' | 'shown'>('idle');
  useEffect(() => {
    const el = footerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (prefersReducedMotion()) return;
    setState('armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target || prefersReducedMotion()) return; // default anchor jump
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  const socials = [
    { key: 'email', href: `mailto:${siteConfig.email}`, label: t('contact.emailLabel'), icon: Mail, external: false },
    { key: 'linkedin', href: siteConfig.linkedinUrl, label: t('contact.linkedinLabel'), icon: Linkedin, external: true },
    { key: 'github', href: siteConfig.githubUrl, label: t('contact.githubLabel'), icon: Github, external: true },
    { key: 'whatsapp', href: siteConfig.whatsappUrl, label: t('contact.chatWhatsApp'), icon: MessageCircle, external: true },
  ];

  return (
    <footer
      ref={footerRef}
      data-state={state}
      data-rtl={isRtl ? 'true' : 'false'}
      className="sf-root relative w-full bg-[#03070B] text-gray-400 overflow-hidden transition-colors"
    >
      <style>{`
        [data-state='armed'] .sf-in { opacity: 0; transform: translateY(14px); }
        [data-state='shown'] .sf-in { animation: sfIn .7s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--i, 0) * 100ms + 80ms); }
        @keyframes sfIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

        .sf-link { position: relative; }
        .sf-link::after { content: ''; position: absolute; inset-inline: 0; bottom: 4px; height: 1px; background: #FF641C;
          transform: scaleX(0); transform-origin: left; transition: transform .35s cubic-bezier(.22,1,.36,1); }
        .sf-root[data-rtl='true'] .sf-link::after { transform-origin: right; }
        .sf-link:hover::after, .sf-link:focus-visible::after { transform: scaleX(1); }

        .sf-top .sf-top-arrow { transition: transform .3s cubic-bezier(.34,1.56,.64,1); }
        .sf-top:hover .sf-top-arrow { transform: translateY(-3px); }

        .sf-pulse { animation: sfPulse 2s ease-out infinite; }
        @keyframes sfPulse { 0% { transform: scale(1); opacity: .6; } 100% { transform: scale(2.4); opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          [data-state] .sf-in { opacity: 1 !important; transform: none !important; animation: none !important; }
          .sf-link::after, .sf-top .sf-top-arrow { transition: none !important; }
          .sf-pulse { animation: none !important; display: none; }
        }
      `}</style>

      {/* Top highlight edge */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF641C]/60 to-transparent"
        aria-hidden="true"
      ></div>
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(50% 70% at 85% 0%, rgba(255,100,28,0.07), transparent 70%)' }}
      ></div>
      {/* Decorative watermark */}
      <div
        className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-extrabold leading-none tracking-tighter whitespace-nowrap bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text text-transparent translate-y-[-10%]"
          style={{ fontSize: 'clamp(3.5rem, 16vw, 13rem)' }}
        >
          {siteConfig.name}
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Brand */}
          <div className="sf-in md:col-span-5" style={{ '--i': 0 } as React.CSSProperties}>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF7A3A] to-[#FF641C] text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-[#FF641C]/30"
                aria-hidden="true"
              >
                {monogram}
              </span>
              <span className="text-lg font-bold text-white tracking-tight">{siteConfig.name}</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/25 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="relative flex w-2 h-2" aria-hidden="true">
                <span className="sf-pulse absolute inset-0 rounded-full bg-emerald-400"></span>
                <span className="relative w-2 h-2 rounded-full bg-emerald-400"></span>
              </span>
              {t('contact.openToOpp')}
            </span>
          </div>

       

        </div>

        {/* Bottom bar */}
        <div
          className="sf-in relative flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-white/10 py-0 text-xs"
          style={{ '--i': 3 } as React.CSSProperties}
        >
          <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-1 text-center sm:text-start">
            <span>
              © {currentYear} {siteConfig.name}. {t('footer.rights')}
            </span>
            <span className="text-[11px] text-gray-400">{t('footer.madeWith')}</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={`sf-top inline-flex items-center gap-2 min-h-11 px-4 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white font-semibold transition-colors cursor-pointer ${FOCUS}`}
          >
            <span>{UI.top[lang]}</span>
            <ArrowUp className="sf-top-arrow w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};