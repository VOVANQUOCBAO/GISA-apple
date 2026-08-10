import Image from 'next/image';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { Icon } from '@/components/ui/icon';
import { SourceNote } from '@/components/ui/source-note';
import type { ContentRecord, ContentSummary } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import { ContentBlocks } from './content-blocks';
import { RelatedResearch } from './related-research';
import styles from './templates.module.css';

interface PublicationTemplateProps {
  record: ContentRecord;
  related?: ContentSummary[];
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Trang chi tiết bài nghiên cứu.
 *
 * Không dùng `ContentDetailLayout` như các loại nội dung khác: bố cục ở đó giới
 * hạn mọi khối con ở 70ch nên đầu bài và ảnh bìa không thể chạy rộng.
 *
 * Bố cục ở đây theo lối trang ấn phẩm học thuật: đầu bài chạy hết khung, một
 * thanh thông tin xuất bản nằm trên đường kẻ, rồi thân bài giữ khổ đọc hẹp với
 * khối trích dẫn dính bên phải — đó là thứ người đọc học thuật cần lấy đầu tiên,
 * nên nó theo họ suốt bài thay vì nằm cuối trang.
 */
export function PublicationTemplate({
  record,
  related = [],
}: PublicationTemplateProps) {
  const topic = firstValue(record.metadata.topic) ?? record.tags[0];
  const publicationType = firstValue(record.metadata.type);
  const isAppliedPublication = publicationType === 'Chuyên khảo';
  const publicationSection = isAppliedPublication
    ? {
        href: '/nghien-cuu/bai-bao-ung-dung',
        label: 'Bài báo ứng dụng',
        relatedLabel: 'Xem tất cả bài ứng dụng',
      }
    : {
        href: '/nghien-cuu/bai-bao-khoa-hoc',
        label: 'Bài báo khoa học',
        relatedLabel: 'Xem tất cả bài nghiên cứu',
      };
  const relatedInSection = publicationType
    ? related.filter(
        (item) => firstValue(item.metadata.type) === publicationType,
      )
    : related;
  const citation = firstValue(record.metadata.citation);
  const year =
    firstValue(record.metadata.year) ?? record.publication?.year?.toString();
  const journal = record.publication?.journal;
  const doi = record.publication?.doi;
  const facts = [
    year ? { label: 'Năm công bố', value: year } : null,
    journal ? { label: 'Công bố tại', value: journal } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <main id="main-content" tabIndex={-1}>
      <article className={styles.pageContainer}>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { href: '/nghien-cuu', label: 'Nghiên cứu' },
            { href: publicationSection.href, label: publicationSection.label },
            { label: record.title },
          ]}
        />

        <header className={styles.articleMasthead}>
          {topic ? <p className={styles.eyebrow}>{bindPhrases(topic)}</p> : null}
          <h1>{bindPhrases(record.title)}</h1>
          <p className={styles.articleLede}>{bindPhrases(record.summary)}</p>
          {facts.length > 0 ? (
            <dl className={styles.articleFacts}>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{bindPhrases(fact.label)}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </header>

        {record.image ? (
          <figure className={styles.articleCover}>
            <Image
              alt={record.image.alt}
              height={record.image.height}
              priority
              sizes="(max-width: 70rem) 92vw, 70rem"
              src={record.image.src}
              width={record.image.width}
            />
          </figure>
        ) : null}

        <div className={styles.articleColumns}>
          <div className={styles.articleBody}>
            <ContentBlocks blocks={record.body} />
            {record.tags.length > 0 ? (
              <ul aria-label="Từ khóa" className={styles.articleTags}>
                {record.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <aside aria-labelledby="trich-dan" className={styles.articleAside}>
            <div className={styles.citationCard}>
              <h2 className={styles.citationHeading} id="trich-dan">
                {bindPhrases('Trích dẫn')}
              </h2>
              {citation ? (
                <p className={styles.citationText}>{citation}</p>
              ) : null}
              <div className={styles.citationLinks}>
                <a
                  className={styles.citationPrimary}
                  href={record.sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {bindPhrases('Bản công bố trên gisa.edu.vn')}
                  <Icon name="arrowUp" size={17} />
                </a>
                {doi ? (
                  <a
                    className={styles.citationSecondary}
                    href={doi}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {bindPhrases('Bản gốc theo DOI')}
                    <Icon name="arrowUp" size={17} />
                  </a>
                ) : null}
              </div>
            </div>
            <SourceNote
              checkedAt={record.checkedAt}
              sourceLabel={record.sourceLabel}
              sourceUrl={record.sourceUrl}
            />
          </aside>
        </div>
      </article>

      <RelatedResearch
        allHref={publicationSection.href}
        allLabel={publicationSection.relatedLabel}
        items={relatedInSection}
      />
    </main>
  );
}
