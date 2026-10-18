import english from './english.json';

export type Language = 'vi' | 'en';
export const LANGUAGE_COOKIE = 'gisa-language';

// Only the sections covered by the four supplied documents have English copy.
export function hasEnglishContent(path: string) {
  return ['/', '/gioi-thieu', '/gioi-thieu/cau-chuyen-gisa',
    '/gioi-thieu/linh-vuc-hoat-dong', '/chuyen-gia',
    '/nghien-cuu', '/nghien-cuu/linh-vuc', '/tu-van', '/tu-van/linh-vuc',
    '/tu-van/cong-cu', '/tu-van/thanh-qua', '/mang-luoi/quy-nha-tai-tro',
  ].includes(path) || path.startsWith('/tu-van/cong-cu/');
}

export function normalizeCopy(text: string) {
  return text.normalize('NFC').replace(/[–—]/g, '-').replace(/\s+/g, ' ').replace(/\s*-\s*/g, '-').trim();
}

const dictionary: Record<string, string> = Object.fromEntries(
  Object.entries(english).map(([key, value]) => [normalizeCopy(key), value]),
);

export function translate(text: string, language: Language): string {
  if (language === 'vi') return text;
  const key = normalizeCopy(text);
  const translated = dictionary[key];
  if (translated === undefined) return text;
  return `${text.match(/^\s*/)?.[0] ?? ''}${translated}${text.match(/\s*$/)?.[0] ?? ''}`;
}
