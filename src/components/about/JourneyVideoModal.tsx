// الملف: JourneyVideoModal.tsx
// الوظيفة: نافذة منبثقة لمشغّل فيديو وهمي يعرض مسيرة المهندس مع شريط تقدم وتحكم.
// المحتوى: مكوّن JourneyVideoModal مع حالة isPlaying وprogress، وفصول القصة، ومؤقّت عبر setInterval.
// الاعتماديات: مكوّن عميل يعتمد useLanguage للترجمة ويستورد Play وPause وRotateCcw وX من lucide-react.
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import { X, Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface JourneyVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JourneyVideoModal: React.FC<JourneyVideoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, locale } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1.2;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const currentSeconds = Math.floor((progress / 100) * 89);
  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-video-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#080D12] border border-[#1E2630] rounded-2xl p-6 text-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1E2630] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF641C]/20 text-[#FF641C] flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 id="journey-video-title" className="text-lg font-bold text-white">
                {t('about.myJourney')} — Salman Al-Ansi
              </h2>
              <p className="text-xs text-gray-400">
                {t('about.watchVideo')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#131D2A] border border-[#1E2630] hover:border-[#FF641C] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Canvas / Player Showcase */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#1E2630] flex flex-col justify-between p-4 group">
          <img
            src="/assets/images/about_developer_work_1792383940477.jpg"
            alt="Salman developer workspace"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          {/* Top badge */}
          <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
            <span className="px-2.5 py-1 rounded bg-[#080D12]/80 backdrop-blur-md text-[#FF641C] border border-white/10">
              {locale === 'ar' ? 'فيديو مسيرة التطوير' : 'Developer Journey Documentary'}
            </span>
            <span className="font-mono text-gray-300">
              {timeFormatted} / 1:29
            </span>
          </div>

          {/* Center Play Button Overlay */}
          <div className="relative z-10 self-center my-auto">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-[#FF641C] hover:bg-[#E05312] text-white flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 active:scale-95 cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ms-1" />
              )}
            </button>
          </div>

          {/* Bottom Progress Bar & Controls */}
          <div className="relative z-10 space-y-2">
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = Math.min(Math.max((clickX / rect.width) * 100, 0), 100);
                setProgress(percent);
              }}
            >
              <div
                className="bg-[#FF641C] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className="hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-handwriting text-base">
                Code · Learn · Build · Repeat
              </div>
            </div>
          </div>
        </div>

        {/* Story chapters */}
        <div className="mt-4 pt-4 border-t border-[#1E2630] grid grid-cols-3 gap-2 text-center text-xs text-gray-400">
          <div className="p-2 rounded-lg bg-[#0E151E] border border-[#1E2630]">
            <span className="block text-[#FF641C] font-bold">0:00 - 0:30</span>
            <span className="text-[11px]">{locale === 'ar' ? 'البدايات والشغف' : 'Early Passion'}</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0E151E] border border-[#1E2630]">
            <span className="block text-[#FF641C] font-bold">0:30 - 1:00</span>
            <span className="text-[11px]">{locale === 'ar' ? 'المشاريع والأنظمة' : 'Building Systems'}</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0E151E] border border-[#1E2630]">
            <span className="block text-[#FF641C] font-bold">1:00 - 1:29</span>
            <span className="text-[11px]">{locale === 'ar' ? 'المستقبل والفرص' : 'What is Next'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
