import Image from 'next/image';
import Link from 'next/link';

import { Icon, type IconName } from '@/components/ui/icon';
import type { ContentSummary } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './ui.module.css';

interface ContentCardProps {
  item: Pick<ContentSummary, 'kind' | 'path' | 'summary' | 'tags' | 'title' | 'publishedAt' | 'image'>;
  headingLevel?: 2 | 3;
}

const KIND_PRESENTATION: Partial<Record<ContentSummary['kind'], { icon: IconName; label: string }>> = {
  course: { icon: 'graduation', label: 'Chương trình học' },
  expert: { icon: 'users', label: 'Chuyên gia' },
  initiative: { icon: 'leaf', label: 'Sáng kiến' },
  news: { icon: 'megaphone', label: 'Tin tức' },
  notice: { icon: 'calendar', label: 'Thông báo' },
  partner: { icon: 'network', label: 'Đối tác' },
  project: { icon: 'presentation', label: 'Dự án' },
  publication: { icon: 'book', label: 'Ấn phẩm' },
  tool: { icon: 'clipboard', label: 'Công cụ' },
};

export function ContentCard({ item, headingLevel = 2 }: ContentCardProps) {
  const Heading = `h${headingLevel}` as const;
  const presentation = KIND_PRESENTATION[item.kind] ?? { icon: 'compass' as const, label: 'Nội dung GISA' };

  return (
    <article className={styles.contentCard}>
      {item.image ? (
        <span aria-hidden="true" className={`${styles.contentCardMedia} ${item.kind === 'partner' ? styles.contentCardLogoMedia : ''}`}>
          <Image
            alt=""
            height={item.image.height}
            sizes="(max-width: 48rem) 90vw, 20rem"
            src={item.image.src}
            width={item.image.width}
          />
        </span>
      ) : (
        <span aria-hidden="true" className={styles.contentCardFallback} data-kind={item.kind}>
          <Icon name={presentation.icon} size={42} />
          <small>{bindPhrases(item.tags[0] ?? presentation.label)}</small>
        </span>
      )}
      <p className={styles.contentCardKicker}>{bindPhrases(presentation.label)}</p>
      {item.publishedAt ? (
        <time dateTime={item.publishedAt}>
          {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(
            new Date(`${item.publishedAt}T00:00:00Z`),
          )}
        </time>
      ) : null}
      <Heading>
        <Link href={item.path}>{bindPhrases(item.title)}</Link>
      </Heading>
      <p>{bindPhrases(item.summary)}</p>
      <span aria-hidden="true" className={styles.contentCardArrow}><Icon name="arrow" size={20} /></span>
    </article>
  );
}
