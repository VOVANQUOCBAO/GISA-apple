import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { StaticPageShell } from '@/components/studio/static-page-shell';
import { getStudioDraft } from '@/lib/admin/studio-store';

export const dynamic = 'force-dynamic';

async function loadPublished(id: string) {
  const draft = await getStudioDraft(id);
  if (!draft || draft.status !== 'published') return null;
  return draft;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const draft = await loadPublished(id);

  if (!draft) {
    return { robots: { index: false, follow: false }, title: 'Không tìm thấy bài' };
  }

  const firstText = draft.doc.elements.find(
    (element): element is Extract<typeof element, { kind: 'text' }> => element.kind === 'text' && element.text.trim().length > 0,
  );

  return {
    description: firstText?.text.replace(/\s+/gu, ' ').slice(0, 160),
    title: draft.title,
    ...(draft.sourcePath
      ? {
          alternates: { canonical: draft.sourcePath },
          robots: { index: false, follow: true },
        }
      : {}),
  };
}

export default async function PublishedStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const draft = await loadPublished(id);
  if (!draft) notFound();

  return <StaticPageShell doc={draft.doc} />;
}
