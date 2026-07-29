import type { Metadata } from 'next';

import { FormPage } from '@/components/forms/form-page';
import { buildMetadata } from '@/components/seo/build-metadata';

export const metadata: Metadata = buildMetadata({
  description: 'Kết nối với GISA qua biểu mẫu mô phỏng.',
  indexable: false,
  path: '/lien-he',
  title: 'Liên hệ',
});

export default function ContactPage() {
  return <FormPage kind="lien-he" />;
}
