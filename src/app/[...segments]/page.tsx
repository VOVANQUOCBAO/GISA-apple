import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { VisualEditing } from 'next-sanity/visual-editing';

import { buildMetadata } from '@/components/seo/build-metadata';
import { StructuredData } from '@/components/seo/structured-data.tsx';
import { TemplateRouter } from '@/components/templates/template-router';
import { EcosystemDetailTemplate } from '@/components/templates/ecosystem-detail-template';
import { PreviewRefresh } from '@/components/sanity/preview-refresh';
import type { UrlQuery } from '@/components/ui/filter-bar';
import { PAGE_REGISTRY, resolvePage } from '@/content/pages';
import { getContentRepository } from '@/content/repositories';
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

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { segments } = await params;
  const path = toPath(segments);
  const definition = resolvePage(path);
  if (!definition) return {};

  if (definition.template === 'detail') {
    const record = await getContentRepository().getByPath(path);
    return record
      ? buildMetadata({
          description: record.summary,
          path: record.path,
          title: record.title,
        })
      : {};
  }

  return buildMetadata({
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
