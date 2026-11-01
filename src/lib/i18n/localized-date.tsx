'use client';

import { useLanguage } from './language-provider';

/** Formats the same publication date without changing the underlying record. */
export function LocalizedDate({ value, dateStyle = 'long' }: {
  value: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
}) {
  const language = useLanguage();
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'vi-VN', {
    dateStyle,
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
