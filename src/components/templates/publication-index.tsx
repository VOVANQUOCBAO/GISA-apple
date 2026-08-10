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

/**
 * Danh sách ấn phẩm được trình bày như mục lục của một viện nghiên cứu chứ không
 * phải lưới thẻ ảnh: bài đầu tiên chạy rộng làm bài dẫn, phần còn lại là các
 * dòng chỉ mục có cột năm bên trái, tiêu đề, tác giả và nơi công bố.
 *
 * Lý do: người đọc mục ấn phẩm quét theo năm và tác giả, không quét theo ảnh —
 * và chỉ 5/14 bài có ảnh nên lưới thẻ ảnh sẽ khuyết một nửa. Mỗi dòng chỉ có một
 * đường kẻ dưới, không kẻ cả trên lẫn dưới.
 */
export function PublicationIndex({ items }: { items: ContentSummary[] }) {
  const [lead, ...rest] = items;
  if (!lead) return null;

  const leadMeta = meta(lead);

  return (
    <div className={styles.publicationIndex}>
      <article className={styles.leadEntry}>
        {lead.image ? (
          <Link
            aria-hidden="true"
            className={styles.leadMedia}
            href={lead.path}
            tabIndex={-1}
          >
            <Image
              alt={lead.image.alt}
              height={lead.image.height}
              priority
              sizes="(max-width: 64rem) 92vw, 44vw"
              src={lead.image.src}
              width={lead.image.width}
            />
          </Link>
        ) : null}
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
        {rest.map((item) => {
          const { topic, year } = meta(item);
          return (
            <li className={styles.entryRow} key={item.id}>
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
