import type { Metadata } from 'next';

import { buildMetadata } from '@/components/seo/build-metadata';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SearchForm } from '@/components/search/search-form';
import {
  SEARCH_COLLECTION_OPTIONS,
  SearchResults,
} from '@/components/search/search-results';
import { getContentRepository } from '@/content/repositories';
import type { Collection } from '@/content/types';

import styles from '../../components/search/search.module.css';

export const metadata: Metadata = buildMetadata({
  description: 'Tìm nội dung công khai trên website GISA.',
  indexable: false,
  path: '/tim-kiem',
  title: 'Tìm kiếm',
});

type SearchParams = Record<string, string | string[] | undefined>;

const collectionValues = new Set<Collection>(
  SEARCH_COLLECTION_OPTIONS.map((option) => option.value),
);

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

function parseCollection(value: string): Collection | undefined {
  return collectionValues.has(value as Collection)
    ? (value as Collection)
    : undefined;
}

function parsePage(value: string): number {
  const page = Number.parseInt(value, 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = firstValue(params.q).trim().slice(0, 100);
  const selectedCollection = parseCollection(firstValue(params.type));
  const repository = getContentRepository();
  const result = query
    ? await repository.search({
        collection: selectedCollection,
        filters: {},
        page: parsePage(firstValue(params.page)),
        pageSize: 12,
        query,
      })
    : null;

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <Breadcrumbs
        items={[{ href: '/', label: 'Trang chủ' }, { label: 'Tìm kiếm' }]}
      />
      <header className={styles.pageHeader}>
        <h1>Tìm kiếm</h1>
        <p>
          Tìm nhanh trong các bài viết, chương trình và tài liệu đang được công
          khai trên website GISA.
        </p>
      </header>
      <SearchForm query={query} selectedCollection={selectedCollection} />
      <SearchResults
        query={query}
        result={result}
        selectedCollection={selectedCollection}
      />
    </main>
  );
}
