import type { Metadata } from 'next';
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
  icons: {
    icon: '/brand/gisa-logo-temp.png',
  },
  title: {
    default: 'GISA',
    template: '%s | GISA'
  },
  description: 'Website nội dung của GISA.'
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" data-site-intro="pending" lang="vi">
      <body>
        <SiteIntro />
        <a className="skip-link" href="#main-content">
          Bỏ qua đến nội dung chính
        </a>
        <SiteHeader />
        <ScrollMotionDirector />
        {PageViewTransition ? (
          <PageViewTransition name="page-content">{children}</PageViewTransition>
        ) : children}
        <SiteFooter />
      </body>
    </html>
  );
}
