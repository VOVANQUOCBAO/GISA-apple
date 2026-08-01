import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@/components/ui/icon';
import type { ContentSummary } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './ui.module.css';

interface ResearchCardProps {
  headingLevel?: 2 | 3;
  item: ContentSummary;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Thẻ bài nghiên cứu dùng cho khối "bài liên quan" dưới trang chi tiết.
 *
 * Chỉ 5/14 bài có ảnh cục bộ. Thẻ không ảnh không mượn ảnh của bài khác — như
 * vậy là gán sai hình cho nội dung — mà dùng một bìa chữ: chủ đề đặt trên nền
 * navy theo lối bìa ấn phẩm, nên hàng thẻ vẫn đều nhịp dù thiếu ảnh.
 */
export function ResearchCard({ headingLevel = 3, item }: ResearchCardProps) {
  const Heading = `h${headingLevel}` as const;
  const topic = firstValue(item.metadata?.topic) ?? item.tags[0];
  const year = firstValue(item.metadata?.year);

  return (
    <article className={styles.researchCard}>
      <div className={styles.researchMedia}>
        {item.image ? (
          <Image
            alt={item.image.alt}
            height={item.image.height}
            sizes="(max-width: 42rem) 92vw, (max-width: 64rem) 46vw, 30vw"
            src={item.image.src}
            width={item.image.width}
          />
        ) : (
          <span className={styles.researchMediaFallback}>
            {bindPhrases(topic ?? 'Nghiên cứu')}
          </span>
        )}
      </div>
      <div className={styles.researchBody}>
        <p className={styles.researchMeta}>
          {[topic, year].filter(Boolean).join(' · ')}
        </p>
        <Heading className={styles.researchTitle}>
          <Link href={item.path}>{bindPhrases(item.title)}</Link>
        </Heading>
        <p className={styles.researchSummary}>{bindPhrases(item.summary)}</p>
        <span aria-hidden="true" className={styles.researchArrow}>
          <Icon name="arrow" size={18} />
        </span>
      </div>
    </article>
  );
}
