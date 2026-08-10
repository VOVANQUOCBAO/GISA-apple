import type { Metadata } from 'next';

import { FormPage } from '@/components/forms/form-page';
import { buildMetadata } from '@/components/seo/build-metadata';

export const metadata: Metadata = buildMetadata({
  description: 'Trao đổi với GISA về nghiên cứu, tư vấn, đào tạo và hợp tác.',
  indexable: false,
  path: '/lien-he',
  title: 'Liên hệ',
});

export default function ContactPage() {
  return <FormPage kind="lien-he" />;
}
