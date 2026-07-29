import Link from 'next/link';

import { ContentCard } from '@/components/ui/content-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import type {
  Collection,
  ContentSummary,
  PaginatedResult,
} from '@/content/types';

import styles from './search.module.css';

export const SEARCH_COLLECTION_OPTIONS: ReadonlyArray<{
  label: string;
  value: Collection;
}> = [
  { label: 'Dự án', value: 'projects' },
  { label: 'Ấn phẩm', value: 'publications' },
  { label: 'Công cụ', value: 'tools' },
  { label: 'Khóa học', value: 'courses' },
  { label: 'Chuyên gia', value: 'experts' },
  { label: 'Sáng kiến', value: 'initiatives' },
  { label: 'Tin tức', value: 'news' },
  { label: 'Thông báo', value: 'notices' },
  { label: 'Đối tác', value: 'partners' },
];

interface SearchResultsProps {
  query: string;
  result: PaginatedResult<ContentSummary> | null;
  selectedCollection?: Collection;
}

function searchHref(query: string, collection?: Collection): string {
  const params = new URLSearchParams({ q: query });
  if (collection) params.set('type', collection);
  return `/tim-kiem?${params.toString()}`;
}

export function SearchResults({
  query,
  result,
  selectedCollection,
}: SearchResultsProps) {
  if (!query) {
    return (
      <EmptyState
        action={
          <div className={styles.suggestions}>
            <Link href="/nghien-cuu">Nghiên cứu</Link>
            <Link href="/dao-tao">Đào tạo</Link>
            <Link href="/cong-dong">Cộng đồng</Link>
            <Link href="/tin-tuc">Tin tức</Link>
          </div>
        }
        description="Nhập từ khóa ở trên hoặc bắt đầu từ một nhóm nội dung công khai. Kết quả chỉ gồm bản ghi vượt qua cổng bằng chứng."
        title="Tìm nội dung đã được xác minh"
      />
    );
  }

  if (!result) return null;

  return (
    <section aria-labelledby="search-results-heading" className={styles.results}>
      <div className={styles.resultsHeader}>
        <h2 id="search-results-heading">Kết quả tìm kiếm</h2>
        <p aria-live="polite">
          <strong>{result.total}</strong> kết quả cho “{query}”
        </p>
      </div>

      <fieldset className={styles.typeFilters}>
        <legend>Lọc theo loại nội dung</legend>
        <div>
          <Link
            aria-current={!selectedCollection ? 'true' : undefined}
            href={searchHref(query)}
          >
            Tất cả
          </Link>
          {SEARCH_COLLECTION_OPTIONS.map((option) => (
            <Link
              aria-current={
                selectedCollection === option.value ? 'true' : undefined
              }
              href={searchHref(query, option.value)}
              key={option.value}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </fieldset>

      {result.items.length > 0 ? (
        <div className={styles.resultGrid}>
          {result.items.map((item) => (
            <ContentCard headingLevel={3} item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={<Link href="/tim-kiem">Xóa tìm kiếm</Link>}
          description="Thử từ khóa ngắn hơn, chọn loại nội dung khác hoặc xóa tìm kiếm."
          title="Không tìm thấy kết quả"
        />
      )}

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        path="/tim-kiem"
        query={{ q: query, type: selectedCollection }}
      />
    </section>
  );
}
