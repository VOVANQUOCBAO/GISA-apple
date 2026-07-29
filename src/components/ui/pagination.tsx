import Link from 'next/link';

import { buildQueryHref, type UrlQuery } from './filter-bar';
import styles from './ui.module.css';

interface PaginationProps {
  page: number;
  pageCount: number;
  path: string;
  query: UrlQuery;
}

function pageHref(path: string, query: UrlQuery, page: number): string {
  return buildQueryHref(path, query, {
    page: page > 1 ? String(page) : undefined,
  });
}

export function Pagination({ page, pageCount, path, query }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Phân trang" className={styles.pagination}>
      {page > 1 ? (
        <Link href={pageHref(path, query, page - 1)}>Trang trước</Link>
      ) : null}
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(
        (pageNumber) => (
          <Link
            aria-current={pageNumber === page ? 'page' : undefined}
            aria-label={`Trang ${pageNumber}`}
            href={pageHref(path, query, pageNumber)}
            key={pageNumber}
          >
            <span className={styles.visuallyHidden}>Trang </span>
            {pageNumber}
          </Link>
        ),
      )}
      {page < pageCount ? (
        <Link href={pageHref(path, query, page + 1)}>Trang sau</Link>
      ) : null}
    </nav>
  );
}
