import type { Metadata } from 'next';

import { buildMetadata } from '@/components/seo/build-metadata';

import { LandingClient } from './landing-client';

/**
 * Standalone landing page for the Leadership Psychology programme.
 *
 * Self-contained like `landing-bdt`: move the folder to give it its final route.
 * Not registered in `PAGE_REGISTRY`, navigation or the sitemap, and `noindex`
 * until the mock enrolment data in `data.ts` is confirmed.
 */
export const metadata: Metadata = buildMetadata({
  description:
    'Chương trình phát triển lãnh đạo của GISA: tiếp cận từ tâm lý học và khoa học hành vi để chuyển hóa từ bên trong, dẫn dắt người khác và kiến tạo ảnh hưởng.',
  indexable: false,
  path: '/landing-lp',
  title: 'Tâm lý học Lãnh đạo — Chuyển hóa từ bên trong',
});

export default function LandingLpPage() {
  return <LandingClient />;
}
