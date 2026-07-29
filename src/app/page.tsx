import type { Metadata } from 'next';

import { buildMetadata } from '@/components/seo/build-metadata';
import { HomeTemplate } from '@/components/templates/home-template';
import { getHomePageModel } from '@/content/home';
import { getContentRepository } from '@/content/repositories';

export const metadata: Metadata = buildMetadata({
  description: 'Kiến tạo kiến thức, lan tỏa giá trị.',
  path: '/',
  title: 'GISA',
});

export default async function HomePage() {
  const model = await getHomePageModel(getContentRepository());
  return <HomeTemplate model={model} />;
}
