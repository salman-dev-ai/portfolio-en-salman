// الملف: LanguageContext.tsx
// الوظيفة: سياق React لإدارة اللغة الحالية (ar/en) وتوفير الترجمة ودعم الاتجاه rtl/ltr
// المحتوى: LanguageContext و LanguageProvider و useLanguage والنوع Locale ودالة الترجمة t
// الاعتماديات: مكوّن عميل يعتمد على createContext/useContext ويستورد ar.json و en.json
import React, { createContext, useContext, useState, useEffect } from 'react';
import enMessages from './messages/en.json';
import arMessages from './messages/ar.json';

export type Locale = 'ar' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  dir: 'rtl' | 'ltr';
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred_locale') as Locale | null;
      if (stored === 'en' || stored === 'ar') return stored;
    }
    // Arabic is the default language as required
    return 'ar';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_locale', locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const toggleLocale = () => {
    setLocaleState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const messages = locale === 'ar' ? arMessages : enMessages;

  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = messages;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return keyPath;
      }
    }
    return typeof current === 'string' ? current : keyPath;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        dir: locale === 'ar' ? 'rtl' : 'ltr',
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
