import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { LanguageProvider } from '@/lib/i18n/language-provider';
import { LANGUAGE_COOKIE } from '@/lib/i18n/language';
import { bindPhrases } from '@/lib/vietnamese-text';
import * as React from 'react';

import '@fontsource/source-sans-3/vietnamese-400.css';
import '@fontsource/source-sans-3/vietnamese-600.css';
import '@fontsource/source-sans-3/vietnamese-700.css';
import '@fontsource/source-serif-4/vietnamese-400.css';
import '@fontsource/source-serif-4/vietnamese-600.css';
import '@fontsource/source-serif-4/vietnamese-700.css';

import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { ScrollMotionDirector } from '@/components/motion/scroll-motion-director';
import { SiteIntro } from '@/components/motion/site-intro';

import './globals.css';

const PageViewTransition = (
  React as typeof React & {
    ViewTransition?: React.ComponentType<{
      children: React.ReactNode;
      name: string;
    }>;
  }
).ViewTransition;

export const metadata: Metadata = {
  metadataBase: new URL('https://gisa.edu.vn'),
  applicationName: 'GISA',
  icons: {
    icon: '/brand/gisa-logo-temp.png',
  },
  title: {
    default: 'GISA',
    template: '%s | GISA',
  },
  description:
    'GISA kết nối tri thức liên ngành để thúc đẩy phát triển bền vững.',
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const language = (await cookies()).get(LANGUAGE_COOKIE)?.value === 'en' ? 'en' : 'vi';
  return (
    <html data-scroll-behavior="smooth" data-site-intro="pending" lang={language}>
      <body>
        <LanguageProvider language={language}>
        <SiteIntro />
        <a className="skip-link" href="#main-content">
          {bindPhrases('Bỏ qua đến nội dung chính')}
        </a>
        <SiteHeader />
        <ScrollMotionDirector />
        {PageViewTransition ? (
          <PageViewTransition name="page-content">{children}</PageViewTransition>
        ) : children}
        <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
