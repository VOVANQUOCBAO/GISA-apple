import type { Metadata } from 'next';

import { Studio } from '@/components/studio/studio';
import { emptyDoc } from '@/components/studio/types';
import { requireAdminPage } from '@/lib/admin/auth';
import { getPageTemplate } from '@/lib/admin/page-templates';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Tạo bài mới',
};

/** Trang trắng, hoặc mở một trang có sẵn trên website thành bản dựng tự do. */
export default async function NewStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ bai?: string }>;
}) {
  await requireAdminPage('/admin/studio');

  const { bai } = await searchParams;
  if (bai) {
    const template = await getPageTemplate(bai);
    if (template) {
      return <Studio initialDoc={template.doc} initialSourcePath={template.summary.path} />;
    }
  }

  return <Studio initialDoc={emptyDoc()} />;
}
