import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ButtonLink } from '@/components/ui/button-link';
import { ContentCard } from '@/components/ui/content-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterBar, type UrlQuery } from '@/components/ui/filter-bar';
import { Pagination } from '@/components/ui/pagination';
import type { PageDefinition } from '@/content/pages';
import type { ContentSummary, PaginatedResult } from '@/content/types';

import { PublicationIndex } from './publication-index';
import styles from './templates.module.css';
import { bindPhrases } from '@/lib/vietnamese-text';

type ListingDefinition = Extract<PageDefinition, { template: 'listing' }>;

interface ListingTemplateProps {
  definition: ListingDefinition;
  path: string;
  result: PaginatedResult<ContentSummary>;
  searchParams: UrlQuery;
}

export function ListingTemplate({
  definition,
  path,
  result,
  searchParams,
}: ListingTemplateProps) {
  const availableFilters = Object.fromEntries(
    definition.filters
      .filter((key) => result.availableFilters[key]?.length)
      .map((key) => [key, result.availableFilters[key]]),
  );
  const hasQuery = Boolean(
    typeof searchParams.q === 'string' && searchParams.q.trim(),
  );
  const hasFilters = definition.filters.some((key) => Boolean(searchParams[key]));
  const isPublications = definition.collection === 'publications';

  return (
    <main id="main-content" tabIndex={-1}>
      <div className={styles.pageContainer}>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { label: definition.title },
          ]}
        />
        {/* Mục ấn phẩm dùng đầu trang phẳng, không hộp: hộp trắng có đổ bóng
            đứng ngay trên một mục lục dựng bằng đường kẻ mảnh sẽ nặng hơn hẳn
            phần nội dung mà nó giới thiệu. Các collection khác giữ nguyên. */}
        <header
          className={
            isPublications ? styles.listingMasthead : styles.pageHeader
          }
        >
          {isPublications ? null : (
            <p className={styles.eyebrow}>{bindPhrases('Danh sách nội dung')}</p>
          )}
          <h1>{definition.title}</h1>
          <p>{definition.description}</p>
          <p aria-live="polite">
            <strong>{result.total}</strong> kết quả
          </p>
        </header>
        <FilterBar filters={availableFilters} path={path} query={searchParams} />
        {result.items.length > 0 ? (
          // Ấn phẩm dùng mục lục dạng dòng thay vì lưới thẻ: người đọc quét
          // theo năm và tác giả, và hơn nửa số bài không có ảnh bìa.
          isPublications ? (
            <PublicationIndex items={result.items} />
          ) : (
            <div className={styles.contentGrid}>
              {result.items.map((item) => (
                <ContentCard item={item} key={item.id} />
              ))}
            </div>
          )
        ) : hasQuery || hasFilters ? (
          <EmptyState
            action={<ButtonLink href={path}>{bindPhrases("Xóa bộ lọc")}</ButtonLink>}
            description="Thử một từ khóa hoặc bộ lọc khác."
            title="Không có kết quả phù hợp"
          />
        ) : (
          <EmptyState
            description="Collection này chưa có bản ghi đáp ứng cổng bằng chứng để công bố."
            title="Chưa có nội dung được phép công bố"
          />
        )}
        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          path={path}
          query={searchParams}
        />
      </div>
    </main>
  );
}
