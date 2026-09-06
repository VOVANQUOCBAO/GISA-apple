import Image from 'next/image';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { Icon } from '@/components/ui/icon';
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

function displayValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    const joined = value.filter(Boolean).join(', ');
    return joined || undefined;
  }

  return value || undefined;
}

/** Wide academic masthead and cover, followed by one centered reading flow. */
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
  const sameTypeRelated = publicationType
    ? related.filter(
        (item) => firstValue(item.metadata.type) === publicationType,
      )
    : related;
  const relatedInSection = sameTypeRelated.length > 0 ? sameTypeRelated : related;
  const citation = firstValue(record.metadata.citation);
  const authors = displayValue(record.metadata.authors);
  const year =
    firstValue(record.metadata.year) ?? record.publication?.year?.toString();
  const journal = record.publication?.journal;
  const doi = record.publication?.doi;
  const facts = [
    authors ? { label: 'Tác giả', value: authors, wide: true } : null,
    year ? { label: 'Năm công bố', value: year, wide: false } : null,
    journal ? { label: 'Công bố tại', value: journal, wide: true } : null,
    publicationType ? { label: 'Loại ấn phẩm', value: publicationType, wide: false } : null,
  ].filter(
    (fact): fact is { label: string; value: string; wide: boolean } => fact !== null,
  );

  return (
    <main id="main-content" tabIndex={-1}>
      <article
        className={`${styles.pageContainer} ${styles.publicationDetail} ${styles.sectionTheme}`}
        data-editorial-layout="publication"
        data-section="research"
      >
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { href: '/nghien-cuu', label: 'Nghiên cứu' },
            { href: publicationSection.href, label: publicationSection.label },
            { label: record.title },
          ]}
        />

        <header className={styles.articleMasthead}>
          <div className={styles.articleOverline}>
            <p>{bindPhrases(publicationSection.label)}</p>
            {topic ? <span>{bindPhrases(topic)}</span> : null}
          </div>
          <h1>{bindPhrases(record.title)}</h1>
        </header>

        {facts.length > 0 ? (
          <section aria-label="Thông tin xuất bản" className={styles.articleFactsPanel} data-publication-facts="band">
            <dl className={styles.articleFacts}>
              {facts.map((fact) => (
                <div className={fact.wide ? styles.articleFactWide : undefined} key={fact.label}>
                  <dt>{bindPhrases(fact.label)}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {record.image ? (
          <figure className={styles.articleCover}>
            <Image
              alt={record.image.alt}
              height={record.image.height}
              priority
              sizes="(max-width: 75rem) 94vw, 75rem"
              src={record.image.src}
              width={record.image.width}
            />
          </figure>
        ) : null}

        <div className={styles.articleReading} data-publication-reading>
          <section aria-labelledby="publication-abstract" className={styles.articleAbstract}>
            <h2 id="publication-abstract">Tóm tắt</h2>
            <p className={styles.articleLede}>{bindPhrases(record.summary)}</p>
          </section>
          <section aria-labelledby="trich-dan" className={styles.citationCard} data-citation-layout="inline">
            <h2 className={styles.citationHeading} id="trich-dan">
              {bindPhrases('Trích dẫn và nguồn')}
            </h2>
            {citation ? (
              <p className={styles.citationText}>{citation}</p>
            ) : null}
            <div className={styles.citationLinks}>
              <a
                className={styles.citationSource}
                href={record.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {bindPhrases('Đọc bản công bố tại GISA')}
                <Icon name="arrowUp" size={17} />
              </a>
              {doi ? (
                <a
                  className={styles.citationDoi}
                  href={doi}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>DOI: {doi.replace(/^https?:\/\/(?:dx\.)?doi\.org\//, '')}</span>
                  <Icon name="arrowUp" size={17} />
                </a>
              ) : null}
            </div>
          </section>
          <div className={styles.articleBody} data-publication-body>
            <ContentBlocks blocks={record.body} />
          </div>
          {record.tags.length > 0 ? (
            <ul aria-label="Từ khóa" className={styles.articleTags}>
              {record.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
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
