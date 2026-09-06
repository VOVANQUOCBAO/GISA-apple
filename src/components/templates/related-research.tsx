import Link from 'next/link';

import { Icon } from '@/components/ui/icon';
import { ResearchCard } from '@/components/ui/research-card';
import type { ContentSummary } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './templates.module.css';

interface RelatedResearchProps {
  allHref: string;
  allLabel: string;
  items: ContentSummary[];
  title?: string;
}

export function RelatedResearch({
  allHref,
  allLabel,
  items,
  title = 'Bài nghiên cứu liên quan',
}: RelatedResearchProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="bai-goi-y" className={styles.relatedSection}>
      <div className={styles.pageContainer}>
        {/* Không đặt eyebrow phía trên tiêu đề khối: trang chi tiết đã có một
            eyebrow ở đầu bài, thêm nữa là lặp nhịp không mang thông tin mới. */}
        <div className={styles.relatedHeading}>
          <h2 id="bai-goi-y">{bindPhrases(title)}</h2>
          <Link className={styles.relatedAllLink} href={allHref}>
            {bindPhrases(allLabel)} <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className={styles.relatedGrid}>
          {items.map((item) => (
            <ResearchCard
              item={item}
              key={item.id}
              summaryClassName={styles.relatedResearchSummary}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
