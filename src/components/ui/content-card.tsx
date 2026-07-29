import Link from 'next/link';

import type { ContentSummary } from '@/content/types';

import styles from './ui.module.css';

interface ContentCardProps {
  item: Pick<ContentSummary, 'path' | 'summary' | 'title' | 'publishedAt'>;
  headingLevel?: 2 | 3;
}

export function ContentCard({ item, headingLevel = 2 }: ContentCardProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <article className={styles.contentCard}>
      {item.publishedAt ? (
        <time dateTime={item.publishedAt}>
          {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(
            new Date(`${item.publishedAt}T00:00:00Z`),
          )}
        </time>
      ) : null}
      <Heading>
        <Link href={item.path}>{item.title}</Link>
      </Heading>
      <p>{item.summary}</p>
    </article>
  );
}
