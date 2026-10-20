'use client';

import { LANGUAGE_COOKIE, useLanguage } from '@/lib/i18n/language-provider';
import styles from './site-shell.module.css';

export function LanguageControl() {
  const language = useLanguage();
  function selectLanguage(next: 'vi' | 'en') {
    if (next === language) return;
    document.cookie = `${LANGUAGE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.reload();
  }
  return (
    <div aria-label={language === 'en' ? 'Language' : 'Ngôn ngữ'} className={styles.languageControl} role="group">
      <button aria-label="Tiếng Việt" aria-pressed={language === 'vi'} onClick={() => selectLanguage('vi')} type="button">VI</button>
      <button aria-label="English" aria-pressed={language === 'en'} onClick={() => selectLanguage('en')} type="button">EN</button>
    </div>
  );
}
