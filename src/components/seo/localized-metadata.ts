import { cookies } from 'next/headers';

import { LANGUAGE_COOKIE, translate } from '@/lib/i18n/language';
import { buildMetadata } from './build-metadata';

export async function buildLocalizedMetadata(input: Parameters<typeof buildMetadata>[0]) {
  const language = (await cookies()).get(LANGUAGE_COOKIE)?.value === 'en' ? 'en' : 'vi';
  const metadata = buildMetadata({
    ...input,
    title: translate(input.title, language),
    description: translate(input.description, language),
  });
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, locale: language === 'en' ? 'en_GB' : 'vi_VN' },
  };
}
