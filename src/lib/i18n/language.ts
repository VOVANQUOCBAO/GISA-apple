import english from './english.json';
import interfaceEnglish from './english-interface.json';
import ecosystemEnglish from './english-ecosystem.json';
import trainingEnglish from './english-training.json';
import editorialEnglish from './english-editorial.json';
import landingEnglish from './english-landing.json';
import supplementalEnglish from './english-supplemental.json';
import landingUiEnglish from './english-landing-ui.json';
// Approved English copy deck (DOCX) for the editorial body of each main section.
// These files are imported last so the deck wording wins over the earlier
// translation pass while every untouched UI string keeps its existing value.
import docxIntroduction from './docx-introduction.json';
import docxResearch from './docx-research.json';
import docxConsulting from './docx-consulting.json';
import docxTrainingA from './docx-training-a.json';
import docxTrainingB from './docx-training-b.json';
import docxNetwork from './docx-network.json';
import docxCommunity from './docx-community.json';
import docxApplication from './docx-application.json';

export type Language = 'vi' | 'en';
export const LANGUAGE_COOKIE = 'gisa-language';

// Every public route uses the selected language, including forms and search.
// URL slugs and filter values remain stable in both languages.
export function hasEnglishContent(path: string) {
  return path.startsWith('/');
}

export function normalizeCopy(text: string) {
  return text.normalize('NFC').replace(/[–—]/g, '-').replace(/\s+/g, ' ').replace(/\s*-\s*/g, '-').trim();
}

const dictionary: Record<string, string> = Object.fromEntries(
  [
    supplementalEnglish,
    interfaceEnglish,
    ecosystemEnglish,
    trainingEnglish,
    editorialEnglish,
    landingEnglish,
    landingUiEnglish,
    english,
    docxIntroduction,
    docxResearch,
    docxConsulting,
    docxTrainingA,
    docxTrainingB,
    docxNetwork,
    docxCommunity,
    docxApplication,
  ].flatMap((section) =>
    Object.entries(section).map(([key, value]) => [normalizeCopy(key), value]),
  ),
);

export function translate(text: string, language: Language): string {
  if (language === 'vi') return text;
  const key = normalizeCopy(text);
  const translated = dictionary[key];
  if (translated === undefined) return text;
  return `${text.match(/^\s*/)?.[0] ?? ''}${translated}${text.match(/\s*$/)?.[0] ?? ''}`;
}
