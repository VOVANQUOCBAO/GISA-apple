import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@/components/ui/icon';
import type { ContentSummary } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './templates.module.css';

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function meta(item: ContentSummary) {
  return {
    topic: firstValue(item.metadata?.topic) ?? item.tags[0],
    year: firstValue(item.metadata?.year),
  };
}

const PUBLICATION_FALLBACKS = [
  '/images/article-performance-benchmarking.png',
  '/images/article-food-quality-programs.png',
  '/images/article-da-xanh-pomelo.png',
  '/images/article-green-city.png',
  '/images/article-renewables.png',
  '/images/article-esg-report.png',
  '/images/article-ai-chatbot.png',
  '/images/hero-gisa-strategy-table.png',
] as const;

function publicationVisual(item: ContentSummary, index: number) {
  return {
    alt: item.image?.alt ?? `Minh họa cho bài viết ${item.title}`,
    src: item.image?.src ?? PUBLICATION_FALLBACKS[index % PUBLICATION_FALLBACKS.length],
  };
}

/**
 * Danh sách ấn phẩm được trình bày như mục lục của một viện nghiên cứu chứ không
 * phải lưới thẻ marketing: bài đầu chạy rộng làm bài dẫn, phần còn lại là các
 * dòng chỉ mục có ảnh nhận diện, năm, chủ đề và tóm tắt. Ảnh giúp người đọc phân
 * biệt bài nhanh hơn nhưng thứ bậc học thuật vẫn nằm ở tiêu đề và metadata.
 */
export function PublicationIndex({ items }: { items: ContentSummary[] }) {
  const [lead, ...rest] = items;
  if (!lead) return null;

  const leadMeta = meta(lead);
  const leadVisual = publicationVisual(lead, 0);

  return (
    <div className={styles.publicationIndex}>
      <article className={styles.leadEntry}>
        <Link className={styles.leadMedia} href={lead.path} tabIndex={-1}>
          <Image
            alt={leadVisual.alt}
            fill
            priority
            sizes="(max-width: 64rem) 92vw, 44vw"
            src={leadVisual.src}
          />
        </Link>
        <div className={styles.leadCopy}>
          <p className={styles.entryMeta}>
            {[leadMeta.topic, leadMeta.year].filter(Boolean).join(' · ')}
          </p>
          <h2 className={styles.leadTitle}>
            <Link href={lead.path}>{bindPhrases(lead.title)}</Link>
          </h2>
          <p className={styles.leadSummary}>{bindPhrases(lead.summary)}</p>
        </div>
      </article>

      <ol className={styles.entryList}>
        {rest.map((item, index) => {
          const { topic, year } = meta(item);
          const visual = publicationVisual(item, index + 1);
          return (
            <li className={styles.entryRow} key={item.id}>
              <Link className={styles.entryMedia} href={item.path} tabIndex={-1}>
                <Image
                  alt={visual.alt}
                  fill
                  sizes="(max-width: 48rem) 34vw, 13rem"
                  src={visual.src}
                />
              </Link>
              <div className={styles.entryRail}>
                {year ? (
                  <span className={styles.entryYear}>{year}</span>
                ) : null}
                {topic ? (
                  <span className={styles.entryTopic}>{bindPhrases(topic)}</span>
                ) : null}
              </div>
              <div className={styles.entryMain}>
                <h2 className={styles.entryTitle}>
                  <Link href={item.path}>{bindPhrases(item.title)}</Link>
                </h2>
                <p className={styles.entrySummary}>{bindPhrases(item.summary)}</p>
              </div>
              <span aria-hidden="true" className={styles.entryArrow}>
                <Icon name="arrow" size={18} />
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
