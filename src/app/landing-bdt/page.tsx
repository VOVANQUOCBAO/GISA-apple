import type { Metadata } from 'next';

import { buildMetadata } from '@/components/seo/build-metadata';

import { LandingClient } from './landing-client';

/**
 * Standalone landing page for the Behavioral Design Thinking programme.
 *
 * Everything this page needs lives inside this folder, so it can be moved to its
 * final route (for example `/khoa-hoc/[slug]` or `/dao-tao/...`) by renaming the
 * folder — nothing outside it was modified. It is not in `PAGE_REGISTRY`, the
 * navigation or the sitemap yet, and is marked `noindex` until the mock
 * commercial data in `data.ts` is replaced with confirmed information.
 */
export const metadata: Metadata = buildMetadata({
  description:
    'Chương trình đào tạo ứng dụng của GISA: kết hợp khoa học hành vi và tư duy thiết kế để thấu hiểu khách hàng, kiến tạo giá trị và tăng trưởng bền vững.',
  indexable: false,
  path: '/landing-bdt',
  title: 'Behavioral Design Thinking for Sustainable Sales & Marketing',
});

export default function LandingBdtPage() {
  return <LandingClient />;
}
