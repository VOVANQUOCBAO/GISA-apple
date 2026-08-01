import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import type { UrlQuery } from '@/components/ui/filter-bar';
import type { PageDefinition } from '@/content/pages';
import { selectRelatedContent } from '@/content/related';
import {
  getContentRepository,
  type ContentRepository,
} from '@/content/repositories';

import { DetailTemplate } from './detail-template';
import { ContentBlocks } from './content-blocks';
import { HubTemplate } from './hub-template';
import { ListingTemplate } from './listing-template';
import styles from './templates.module.css';

interface TemplateRouterProps {
  definition: PageDefinition;
  path: string;
  repository?: ContentRepository;
  searchParams: UrlQuery;
}

function positiveInteger(value: string | string[] | undefined): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export async function TemplateRouter({
  definition,
  path,
  repository = getContentRepository(),
  searchParams,
}: TemplateRouterProps) {
  if (definition.template === 'hub') {
    return <HubTemplate definition={definition} />;
  }

  if (definition.template === 'listing') {
    const query =
      typeof searchParams.q === 'string'
        ? searchParams.q.trim().slice(0, 100)
        : '';
    const filters = Object.fromEntries(
      definition.filters.flatMap((key) => {
        const rawValue = searchParams[key];
        const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
        return value ? [[key, value] as const] : [];
      }),
    );
    const contentQuery = {
      collection: definition.collection,
      filters,
      page: positiveInteger(searchParams.page),
      pageSize: 12,
      query,
    };
    const result = query
      ? await repository.search(contentQuery)
      : await repository.list(contentQuery);
    const normalizedSearchParams: UrlQuery = {
      ...(query ? { q: query } : {}),
      ...(result.page > 1 ? { page: String(result.page) } : {}),
      ...filters,
    };

    return (
      <ListingTemplate
        definition={definition}
        path={path}
        result={result}
        searchParams={normalizedSearchParams}
      />
    );
  }

  if (definition.template === 'detail') {
    const record = await repository.getByPath(path);
    if (!record) notFound();

    // Ấn phẩm là loại duy nhất có khối "bài gợi ý" dưới trang chi tiết, nên chỉ
    // truy vấn danh sách cùng collection cho loại này.
    const related =
      record.kind === 'publication'
        ? selectRelatedContent(
            record,
            (
              await repository.list({
                collection: definition.collection,
                filters: {},
                page: 1,
                pageSize: 24,
                query: '',
              })
            ).items,
          )
        : undefined;

    return <DetailTemplate record={record} related={related} />;
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <div className={styles.pageContainer}>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { label: definition.title },
          ]}
        />
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>Thông tin GISA</p>
          <h1>{definition.title}</h1>
          <p>{definition.description}</p>
        </header>
        <ContentBlocks blocks={definition.blocks} />
      </div>
    </main>
  );
}
