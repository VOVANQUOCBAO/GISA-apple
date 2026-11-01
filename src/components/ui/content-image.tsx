'use client';

import NextImage, { type ImageProps } from 'next/image';
import { useLanguage } from '@/lib/i18n/language-provider';
import { translate } from '@/lib/i18n/language';

/** Retain detail in supplied photographs while Next serves responsive sizes. */
export default function ContentImage({ quality = 95, alt, ...props }: ImageProps) {
  const language = useLanguage();
  return <NextImage quality={quality} {...props} alt={translate(alt, language)} />;
}
