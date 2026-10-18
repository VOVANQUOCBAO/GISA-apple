import Link from 'next/link';

import styles from './site-shell.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const visibleItems = items.length > 2
    ? [items[0], items[items.length - 1]].filter((item): item is BreadcrumbItem => Boolean(item))
    : items;

  return (
    <nav aria-label="Đường dẫn" className={styles.breadcrumbs}>
      <ol>
        {visibleItems.map((item, index) => {
          const isCurrent = index === visibleItems.length - 1;
          return (
            <li aria-current={isCurrent ? 'page' : undefined} key={`${item.label}-${index}`}>
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
