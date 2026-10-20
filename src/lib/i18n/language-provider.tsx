'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { hasEnglishContent, translate, type Language } from './language';
export { LANGUAGE_COOKIE, hasEnglishContent, translate } from './language';

const LanguageContext = createContext<Language>('vi');

export function LanguageProvider({ language, children }: { language: Language; children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const contentLanguage = hasEnglishContent(pathname) ? language : 'vi';
  useEffect(() => {
    document.documentElement.lang = contentLanguage;
  }, [contentLanguage]);
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LocalizedText({ text, children, as: Tag }: { text: string; children: ReactNode; as?: 'strong' | 'span' }) {
  const language = useLanguage();
  const pathname = usePathname() ?? '/';
  if (language !== 'en' || !hasEnglishContent(pathname)) return children;
  const translated = translate(text, language);
  return Tag ? <Tag>{translated}</Tag> : translated;
}
