import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { VisualEditing } from 'next-sanity/visual-editing';

import { buildLocalizedMetadata } from '@/components/seo/localized-metadata';
import { StructuredData } from '@/components/seo/structured-data.tsx';
import { StaticPageShell } from '@/components/studio/static-page-shell';
import { TemplateRouter } from '@/components/templates/template-router';
import { EcosystemDetailTemplate } from '@/components/templates/ecosystem-detail-template';
import { PreviewRefresh } from '@/components/sanity/preview-refresh';
import type { UrlQuery } from '@/components/ui/filter-bar';
import { PAGE_REGISTRY, resolvePage } from '@/content/pages';
import { getContentRepository } from '@/content/repositories';
import type { StudioDoc } from '@/components/studio/types';
import { findPublishedStudioPage } from '@/lib/admin/studio-store';
import { getDraftPost } from '@/sanity/draft-post';

export const revalidate = 60;

interface ContentPageProps {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<UrlQuery>;
}

function toPath(segments: string[]): string {
  return `/${segments.join('/')}`;
}

export default async function ContentPage({
  params,
  searchParams,
}: ContentPageProps) {
  const { segments } = await params;
  const query = await searchParams;
  const path = toPath(segments);
  const definition = resolvePage(path);

  if (!definition) notFound();

  if (definition.template === 'hub') {
    redirect(definition.childPaths[0] ?? '/');
  }

  // Trang đã được dựng lại trong studio: hiển thị bản dựng thay cho template gốc.
  const studioPage = await findPublishedStudioPage(path);
  if (studioPage) {
    return <StaticPageShell doc={studioPage.doc} />;
  }

  if (definition.template === 'detail') {
    if (definition.collection === 'news' && (await draftMode()).isEnabled) {
      const preview = await getDraftPost(segments.at(-1) ?? '');
      if (preview?.record) {
        return (
          <>
            <EcosystemDetailTemplate
              record={preview.record}
              editDocumentId={preview.documentId}
            />
            <VisualEditing />
            <PreviewRefresh />
          </>
        );
      }
    }
    const record = await getContentRepository().getByPath(path);
    if (!record) notFound();

    return (
      <>
        <TemplateRouter
          definition={definition}
          path={path}
          searchParams={query}
        />
        <StructuredData record={record} />
      </>
    );
  }

  return (
    <TemplateRouter
      definition={definition}
      path={path}
      searchParams={query}
    />
  );
}

function studioDescription(doc: StudioDoc): string {
  const text =
    doc.elements.find(
      (element) => element.kind === 'text' && element.role === 'body' && element.text.trim().length > 40,
    ) ?? doc.elements.find((element) => element.kind === 'text' && element.text.trim().length > 0);

  return text && text.kind === 'text'
    ? text.text.replace(/\s+/gu, ' ').slice(0, 160)
    : doc.title;
}

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { segments } = await params;
  const path = toPath(segments);
  const definition = resolvePage(path);
  if (!definition) return {};

  const studioPage = await findPublishedStudioPage(path);
  if (studioPage) {
    return buildLocalizedMetadata({
      description: studioDescription(studioPage.doc),
      path,
      title: studioPage.title,
    });
  }

  if (definition.template === 'detail') {
    const record = await getContentRepository().getByPath(path);
    if (!record) return {};

    const isArticle = record.kind === 'news' || record.kind === 'publication';
    const author =
      typeof record.metadata.author === 'string'
        ? record.metadata.author.trim()
        : '';
    const updatedAt =
      typeof record.metadata.updatedAt === 'string'
        ? record.metadata.updatedAt
        : '';
    const seoTitle = (record.seo?.title ?? '')
      .replace(/\s*\|\s*GISA\s*$/i, '')
      .trim();

    return buildLocalizedMetadata({
      description: record.seo?.description?.trim() || record.summary,
      path: record.path,
      title: seoTitle || record.title,
      ...(record.image ? { image: record.image } : {}),
      type: isArticle ? 'article' : 'website',
      ...(record.publishedAt ? { publishedTime: record.publishedAt } : {}),
      ...(updatedAt ? { modifiedTime: updatedAt } : {}),
      ...(author ? { authors: [author] } : {}),
    });
  }

  return buildLocalizedMetadata({
    description: definition.description,
    path,
    title: definition.title,
  });
}

export async function generateStaticParams() {
  const fixedPaths = PAGE_REGISTRY.flatMap((definition) =>
    'path' in definition && definition.path !== '/'
      ? [definition.path]
      : [],
  );
  const detailPaths = await getContentRepository().listIndexablePaths();

  return [...new Set([...fixedPaths, ...detailPaths])].map((path) => ({
    segments: path.split('/').filter(Boolean),
  }));
}
