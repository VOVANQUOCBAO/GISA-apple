import type { Metadata } from 'next';

import { PageCopyProvider } from '@/components/admin/page-copy';
import { buildLocalizedMetadata } from '@/components/seo/localized-metadata';
import { HomeTemplate } from '@/components/templates/home-template';
import { getHomePageModel } from '@/content/home';
import { getContentRepository } from '@/content/repositories';
import { getPageCopy } from '@/lib/admin/pages';

export async function generateMetadata(): Promise<Metadata> {
  return buildLocalizedMetadata({
  description: 'Kiến tạo tri thức, lan tỏa giá trị.',
  path: '/',
  title: 'GISA',
});
}

export default async function HomePage() {
  const [model, copy] = await Promise.all([
    getHomePageModel(getContentRepository()),
    getPageCopy('/'),
  ]);

  return (
    <PageCopyProvider copy={copy} pagePath="/">
      <HomeTemplate model={model} />
    </PageCopyProvider>
  );
}
