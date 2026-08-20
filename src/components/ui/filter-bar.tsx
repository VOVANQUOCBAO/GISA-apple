import Link from 'next/link';

import styles from './ui.module.css';

export type UrlQuery = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function buildQueryHref(
  path: string,
  query: UrlQuery,
  changes: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(query)) {
    const value = firstValue(rawValue);
    if (value && key !== 'page') params.set(key, value);
  }

  for (const [key, value] of Object.entries(changes)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }

  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

// Khóa lọc lấy từ `metadata` của bản ghi nên là tiếng Anh; legend hiển thị cho
// người đọc thì phải là tiếng Việt. Khóa chưa có trong bảng vẫn hiện nguyên văn.
const FILTER_LABELS: Record<string, string> = {
  format: 'Hình thức',
  pillar: 'Trụ cột',
  topic: 'Chủ đề',
  type: 'Loại nội dung',
};

interface FilterBarProps {
  filters: Record<string, string[]>;
  hideLegends?: boolean;
  path: string;
  query: UrlQuery;
}

export function FilterBar({ filters, hideLegends = false, path, query }: FilterBarProps) {
  const entries = Object.entries(filters).filter(([, values]) => values.length > 0);
  if (entries.length === 0) return null;
  const allowedKeys = new Set(['q', ...entries.map(([key]) => key)]);
  const safeQuery = Object.fromEntries(
    Object.entries(query).filter(([key]) => allowedKeys.has(key)),
  );

  return (
    <section aria-label="Bộ lọc nội dung" className={styles.filterBar}>
      {entries.map(([key, values]) => (
        <fieldset key={key}>
          <legend className={hideLegends ? styles.visuallyHidden : undefined}>
            {FILTER_LABELS[key] ?? key}
          </legend>
          <div className={styles.filterOptions}>
            {values.map((value) => {
              const isCurrent = firstValue(safeQuery[key]) === value;
              return (
                <Link
                  aria-current={isCurrent ? 'true' : undefined}
                  href={buildQueryHref(path, safeQuery, {
                    [key]: isCurrent ? undefined : value,
                  })}
                  key={value}
                >
                  {value}
                </Link>
              );
            })}
          </div>
        </fieldset>
      ))}
    </section>
  );
}
