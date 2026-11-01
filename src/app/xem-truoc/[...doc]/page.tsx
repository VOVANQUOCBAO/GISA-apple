import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EditorChrome } from '@/components/admin/editor-chrome';
import { EditorProvider } from '@/components/admin/editor-provider';
import { EcosystemDetailTemplate } from '@/components/templates/ecosystem-detail-template';
import { requireAdminPage } from '@/lib/admin/auth';
import { getDocument } from '@/lib/admin/store';

import '@/components/admin/preview.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Soạn bài',
};

/**
 * Đây chính là trang thật, chỉ khác nguồn dữ liệu: bản nháp thay vì bản đã đăng.
 * Mọi công cụ soạn thảo nằm ngay trên trang này, không có màn hình quản trị thứ hai.
 */
export default async function PreviewPage({ params }: { params: Promise<{ doc: string[] }> }) {
  await requireAdminPage('/admin');

  const { doc } = await params;
  const id = decodeURIComponent(doc.join('/'));
  const document = await getDocument(id);
  if (!document) notFound();

  return (
    <EditorProvider docId={id} record={document.record}>
      <EcosystemDetailTemplate editable record={document.record} />
      <EditorChrome />
    </EditorProvider>
  );
}
