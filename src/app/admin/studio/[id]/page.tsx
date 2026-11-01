import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Studio } from '@/components/studio/studio';
import { requireAdminPage } from '@/lib/admin/auth';
import { getStudioDraft } from '@/lib/admin/studio-store';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Sửa bài tự do',
};

export default async function StudioDraftPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage('/admin');

  const { id } = await params;
  const draft = await getStudioDraft(id);
  if (!draft) notFound();

  return (
    <Studio
      draftId={draft.id}
      initialDoc={draft.doc}
      initialSavedAt={draft.updatedAt}
      initialSourcePath={draft.sourcePath}
      initialStatus={draft.status}
    />
  );
}
