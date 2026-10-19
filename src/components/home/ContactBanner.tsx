// الملف: ContactBanner.tsx
// الوظيفة: قسم تواصل عصري: بانر سينمائي بخلفية متحركة + لوحة تواصل زجاجية مع نسخ البريد بنقرة واحدة
// المحتوى: مكوّن ContactBanner مع handleContactClick وأزرار فتح السيرة وروابط البريد وLinkedIn وGitHub وWhatsApp
// الاعتماديات: useLanguage وuseTheme وsiteConfig وأيقونات lucide-react
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { siteConfig } from '../../config/site.ts';
import { FlowingTrailsBackground, type TrailsStatus } from './FlowingTrailsBackground.tsx';
import {
  Send,
  Mail,
  Linkedin,
  Github,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
} from 'lucide-react';

interface ContactBannerProps {
  onOpenCvModal: () => void;
}

const UI = {
  copy: { en: 'Copy email address', ar: 'نسخ عنوان البريد' },
  copied: { en: 'Copied', ar: 'تم النسخ' },
  newTab: { en: '(opens in a new tab)', ar: '(يفتح في تبويب جديد)' },
};

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF641C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070B]';

/** Clipboard API with a legacy fallback. Resolves false if both fail. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** "https://www.linkedin.com/in/x/" -> "linkedin.com/in/x" (single source of truth: siteConfig) */
const prettyUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

export const ContactBanner: React.FC<ContactBannerProps> = ({ onOpenCvModal }) => {
  const { t, locale, toggleLocale, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isRtl = dir === 'rtl';
  const lang: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';
  const headingId = useId();

  // Initial markup (server and client) always shows the static image; the canvas
  // fades in and the image fades out only after the first animated frame is drawn.
  const [trailsReady, setTrailsReady] = useState(false);
  const handleTrailsStatus = useCallback((status: TrailsStatus) => {
    setTrailsReady(status === 'ready');
  }, []);

  const handleContactClick = () => {
    window.location.href = `mailto:${siteConfig.email}?subject=Project%20Inquiry%20from%20Portfolio`;
  };

  // Copy email with inline confirmation (announced to screen readers via role="status").
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);
  const handleCopy = async () => {
    if (!(await copyText(siteConfig.email))) return;
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
  };
  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  // Entrance: 'idle' (static, SSR-safe) -> 'armed' (hidden, waiting) -> 'shown' (plays once on first view)
  const sectionRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'armed' | 'shown'>('idle');
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setState('armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cursor spotlight: written straight to CSS variables, never through React state.
  const handleSpotlight = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };

  const newTabLabel = UI.newTab[lang];

  return (
    <section
      id="contact-banner"
      ref={sectionRef}
      data-state={state}
      aria-labelledby={headingId}
      className="cb-sec w-full bg-[#03070B] text-white pt-12 pb-8"
    >
      <style>{`
        [data-state='armed'] .cb-item { opacity: 0; transform: translateY(14px); }
        [data-state='shown'] .cb-item { animation: cbIn .7s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--i, 0) * 90ms + 120ms); }
        @keyframes cbIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

        .cb-spot { opacity: 0; transition: opacity .3s ease;
          background: radial-gradient(440px circle at var(--sx, 50%) var(--sy, 0%), rgba(255,100,28,.11), transparent 60%); }
        @media (hover: hover) { .cb-card:hover .cb-spot { opacity: 1; } }

        .cb-cta { position: relative; overflow: hidden; }
        .cb-cta::after { content: ''; position: absolute; inset: 0; transform: translateX(-120%);
          background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%); }
        @media (hover: hover) { .cb-cta:hover::after { transform: translateX(120%); transition: transform .8s ease; } }

        .cb-arrow { opacity: 0; transform: translate(-4px, 4px); transition: opacity .25s ease, transform .25s ease; }
        .cb-row:hover .cb-arrow, .cb-row:focus-visible .cb-arrow { opacity: 1; transform: none; }

        .cb-pop { animation: cbPop .35s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes cbPop { from { opacity: 0; transform: scale(.8); } to { opacity: 1; transform: none; } }

        @media (prefers-reduced-motion: reduce) {
          [data-state] .cb-item { opacity: 1 !important; transform: none !important; animation: none !important; }
          .cb-spot { display: none; }
          .cb-cta::after { display: none; }
          .cb-arrow, .cb-pop { transition: none !important; animation: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Panoramic Banner */}
          <div
            className="cb-card lg:col-span-8 relative rounded-3xl overflow-hidden border border-white/10 bg-[#03070B] min-h-[420px] flex flex-col justify-between"
            onPointerMove={handleSpotlight}
          >
            {/* Fallback: original panoramic image (shown until/unless the animated background is ready) */}
            <img
              src="/assets/images/contact_mountains_1792383955920.jpg"
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
                trailsReady ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Cinematic base: navy to charcoal with faint orange / steel atmosphere */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
                trailsReady ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background:
                  'radial-gradient(60% 70% at 82% 18%, rgba(255,100,28,0.10), transparent 70%),' +
                  'radial-gradient(50% 60% at 12% 95%, rgba(112,146,184,0.08), transparent 70%),' +
                  'linear-gradient(135deg, #03070B 0%, #080D12 55%, #0C1218 100%)',
              }}
            />

            {/* Animated light trails (canvas, drawn outside React's render cycle) */}
            <FlowingTrailsBackground onStatusChange={handleTrailsStatus} />

            {/* Readability scrims: darker behind the text side, flips for RTL */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/45 to-black/20"
            ></div>
            <div
              aria-hidden="true"
              className={`absolute inset-0 pointer-events-none ${
                isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'
              } from-[#03070B]/80 via-[#03070B]/40 to-transparent`}
            ></div>

            {/* Cursor spotlight + top highlight edge */}
            <div className="cb-spot absolute inset-0 pointer-events-none" aria-hidden="true"></div>
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF641C]/70 to-transparent pointer-events-none"
              aria-hidden="true"
            ></div>

            {/* Top Motto Calligraphy */}
            <div className="relative z-10 p-6 sm:p-8 flex items-start justify-between">
              {/* Giant Outline 01 */}
              <div
                className="cb-item font-extrabold text-6xl sm:text-7xl font-sans tracking-tighter text-transparent select-none"
                style={{ WebkitTextStroke: '1.5px #FF641C', '--i': 0 } as React.CSSProperties}
                aria-hidden="true"
              >
                01
              </div>

              {/* Arabic & English Motto */}
              <div className="cb-item text-end" style={{ '--i': 1 } as React.CSSProperties}>
                <span className="font-arabic font-extrabold text-xl sm:text-2xl text-amber-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] block">
                  {t('contact.bannerArabicMotto')}
                </span>
                <span className="text-xs font-medium text-gray-300 drop-shadow">
                  {t('contact.bannerEnglishMotto')}
                </span>
              </div>
            </div>

            {/* Bottom Content / CTAs */}
            <div className="relative z-10 p-6 sm:p-8 max-w-xl">
              <div className="cb-item flex items-center gap-2 mb-2" style={{ '--i': 2 } as React.CSSProperties}>
                <h2
                  id={headingId}
                  className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
                  style={{ textWrap: 'balance' } as React.CSSProperties}
                >
                  {t('contact.bannerTitle')}
                </h2>
                <Send className="w-5 h-5 text-[#FF641C] -rotate-12 shrink-0" aria-hidden="true" />
              </div>

              <p
                className="cb-item text-sm sm:text-base text-gray-300 leading-relaxed mb-7"
                style={{ '--i': 3 } as React.CSSProperties}
              >
                {t('contact.bannerSubtitle')}
              </p>

              <div className="cb-item flex flex-wrap items-center gap-3" style={{ '--i': 4 } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={handleContactClick}
                  className={`cb-cta flex items-center gap-2 px-6 min-h-11 text-sm font-semibold text-white bg-gradient-to-br from-[#FF7A3A] to-[#FF641C] hover:from-[#FF641C] hover:to-[#E05312] rounded-full shadow-lg shadow-[#FF641C]/30 transition-all cursor-pointer active:scale-[0.98] ${FOCUS}`}
                >
                  <span className="relative z-10">{t('contact.contactMeBtn')}</span>
                  <ArrowRight className={`relative z-10 w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onOpenCvModal}
                  className={`flex items-center gap-2 px-6 min-h-11 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/60 rounded-full transition-all cursor-pointer active:scale-[0.98] ${FOCUS}`}
                >
                  <span>{t('contact.viewCvBtn')}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Contact Panel */}
          <div
            className="cb-card lg:col-span-4 relative overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl"
            onPointerMove={handleSpotlight}
          >
            <div className="cb-spot absolute inset-0 pointer-events-none" aria-hidden="true"></div>

            <div className="relative">
              {/* Header */}
              <div className="cb-item flex items-center gap-3 mb-2" style={{ '--i': 0 } as React.CSSProperties}>
                <div className="w-10 h-10 rounded-full bg-[#FF641C]/15 border border-[#FF641C]/30 flex items-center justify-center text-[#FF641C] shrink-0">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {t('contact.getInTouch')}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {t('contact.openToOpp')}
                  </p>
                </div>
              </div>

              {/* Contact Links */}
              <ul className="my-6 space-y-1 list-none p-0">
                {/* Email + copy */}
                <li className="cb-item flex items-center gap-1" style={{ '--i': 1 } as React.CSSProperties}>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className={`cb-row group flex-1 min-w-0 flex items-center gap-3 rounded-xl p-2 text-xs text-gray-300 hover:bg-white/5 hover:text-[#FF641C] transition-colors ${FOCUS}`}
                  >
                    <span className="w-9 h-9 rounded-lg bg-[#0E151E] border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#FF641C] group-hover:border-[#FF641C]/40 transition-colors shrink-0">
                      <Mail className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-[10px] text-gray-400 uppercase block font-semibold">
                        {t('contact.emailLabel')}
                      </span>
                      <span className="font-mono text-gray-200 group-hover:text-white block truncate">
                        {siteConfig.email}
                      </span>
                    </span>
                  </a>
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={handleCopy}
                      aria-label={UI.copy[lang]}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${FOCUS}`}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-400 cb-pop" aria-hidden="true" />
                      ) : (
                        <Copy className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                    {copied && (
                      <span
                        className="cb-pop absolute -top-7 end-0 whitespace-nowrap rounded-md bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 pointer-events-none"
                        aria-hidden="true"
                      >
                        {UI.copied[lang]}
                      </span>
                    )}
                    <span role="status" className="sr-only">
                      {copied ? UI.copied[lang] : ''}
                    </span>
                  </div>
                </li>

                {/* LinkedIn */}
                <li className="cb-item" style={{ '--i': 2 } as React.CSSProperties}>
                  <a
                    href={siteConfig.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`cb-row group flex items-center gap-3 rounded-xl p-2 text-xs text-gray-300 hover:bg-white/5 hover:text-[#FF641C] transition-colors ${FOCUS}`}
                  >
                    <span className="w-9 h-9 rounded-lg bg-[#0E151E] border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#FF641C] group-hover:border-[#FF641C]/40 transition-colors shrink-0">
                      <Linkedin className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="text-[10px] text-gray-400 uppercase block font-semibold">
                        {t('contact.linkedinLabel')}
                      </span>
                      <span className="text-gray-200 group-hover:text-white block truncate">
                        {prettyUrl(siteConfig.linkedinUrl)}
                      </span>
                    </span>
                    <span className="cb-arrow shrink-0" style={isRtl ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                    <span className="sr-only">{newTabLabel}</span>
                  </a>
                </li>

                {/* GitHub */}
                <li className="cb-item" style={{ '--i': 3 } as React.CSSProperties}>
                  <a
                    href={siteConfig.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`cb-row group flex items-center gap-3 rounded-xl p-2 text-xs text-gray-300 hover:bg-white/5 hover:text-[#FF641C] transition-colors ${FOCUS}`}
                  >
                    <span className="w-9 h-9 rounded-lg bg-[#0E151E] border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#FF641C] group-hover:border-[#FF641C]/40 transition-colors shrink-0">
                      <Github className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="text-[10px] text-gray-400 uppercase block font-semibold">
                        {t('contact.githubLabel')}
                      </span>
                      <span className="text-gray-200 group-hover:text-white block truncate">
                        {prettyUrl(siteConfig.githubUrl)}
                      </span>
                    </span>
                    <span className="cb-arrow shrink-0" style={isRtl ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                    <span className="sr-only">{newTabLabel}</span>
                  </a>
                </li>
              </ul>

              {/* WhatsApp direct action button */}
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`cb-item w-full flex items-center justify-center gap-2 min-h-12 px-4 bg-[#131D2A] hover:bg-[#1A2636] border border-white/10 hover:border-[#25D366]/50 text-white rounded-xl text-xs font-semibold transition-all group cursor-pointer ${FOCUS}`}
                style={{ '--i': 4 } as React.CSSProperties}
              >
                <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                <span className="group-hover:text-[#25D366] transition-colors">
                  {t('contact.chatWhatsApp')}
                </span>
                <span className="sr-only">{newTabLabel}</span>
              </a>
            </div>

            {/* Handwritten annotation (decorative) */}
            <div className="relative pt-6 border-t border-white/10 mt-6 flex flex-col justify-end" aria-hidden="true">
              <div className="text-center sm:text-end select-none pointer-events-none">
                <span className="font-handwriting text-2xl text-gray-300 font-bold -rotate-6 block tracking-wide">
                  Open to<br />Opportunities<br />Worldwide
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};