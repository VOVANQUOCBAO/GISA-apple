import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SourceNote } from '@/components/ui/source-note';
import { resolvePublishableAsset } from '@/content/assets';
import { resolvePage } from '@/content/pages';
import type { ContentBlock, ContentRecord } from '@/content/types';
import { toAnchorId } from '@/lib/anchor-id';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './templates.module.css';
import detailStyles from './detail-page.module.css';
import { ContentIndex, InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';

const DETAIL_FACT_KEYS: Partial<Record<ContentRecord['kind'], readonly string[]>> = {
  course: ['audience', 'objectives', 'schedule', 'fee', 'instructor'],
  expert: ['title', 'degree', 'specialty', 'biography'],
  initiative: ['context', 'problem', 'evidence', 'role', 'application', 'impact'],
  project: ['context', 'method', 'role', 'result'],
};

function hasValue(value: ContentRecord['metadata'][string]) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function detailFactCount(record: ContentRecord) {
  const metadataCount = (DETAIL_FACT_KEYS[record.kind] ?? []).filter((key) =>
    hasValue(record.metadata[key]),
  ).length;
  const publicationDateCount =
    (record.kind === 'news' || record.kind === 'notice') && record.publishedAt ? 1 : 0;
  const archiveNoticeCount = record.kind === 'notice' ? 1 : 0;
  const missingPortraitCount = record.kind === 'expert' && !record.image ? 1 : 0;

  return metadataCount + publicationDateCount + archiveNoticeCount + missingPortraitCount;
}

function precedingHeadingId(blocks: ContentBlock[], index: number) {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const block = blocks[cursor];
    if (block?.type === 'heading') return toAnchorId(block.text);
  }
  return '';
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return <p className={styles.proseParagraph} data-scroll-motion="item" key={`${block.type}-${index}`}>{bindPhrases(block.text)}</p>;
        }
        if (block.type === 'list') {
          const List = block.ordered ? 'ol' : 'ul';
          const activeHeadingId = precedingHeadingId(blocks, index);
          return (
            <List className={styles.proseList} data-scroll-motion="reveal" key={`${block.type}-${index}`}>
              {block.items.map((item) => (
                <li id={activeHeadingId ? `${activeHeadingId}-${toAnchorId(item)}` : undefined} key={item}>{item}</li>
              ))}
            </List>
          );
        }
        if (block.type === 'heading') {
          const Heading = block.level === 2 ? 'h2' : 'h3';
          return <Heading className={styles.proseHeading} id={toAnchorId(block.text)} key={`${block.type}-${index}`}>{bindPhrases(block.text)}</Heading>;
        }
        if (block.type === 'quote') {
          return (
            <blockquote className={styles.proseQuote} data-scroll-motion="reveal" key={`${block.type}-${index}`}>
              <p>{bindPhrases(block.text)}</p>
              {block.attribution ? <cite>{block.attribution}</cite> : null}
            </blockquote>
          );
        }
        if (block.type === 'table') {
          return (
            <div className={styles.proseTableFrame} data-scroll-motion="reveal" key={`${block.type}-${index}`}>
            <table className={styles.proseTable}>
              {block.headers.length ? (
                <thead><tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
              ) : null}
              <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
            </table>
            </div>
          );
        }
        if (block.type === 'linkGroup') {
          return (
            <ul className={styles.proseLinkList} data-scroll-motion="reveal" key={`${block.type}-${index}`}>
              {block.links.map((link) => <li key={link.href}><a href={link.href}>{bindPhrases(link.label)}</a></li>)}
            </ul>
          );
        }
        if (block.type === 'video') {
          return <p className={styles.proseVideoLink} key={`${block.type}-${index}`}><a href={block.externalUrl}>{block.title}</a></p>;
        }
        if (block.type === 'image') {
          const asset = resolvePublishableAsset(block.assetId);
          // Chưa có dòng manifest, hoặc có mà quyền đăng chưa được xác nhận: chỉ
          // hiển thị chú thích. Không dựng khung ảnh trống vì trang sẽ có một ô xám
          // không bao giờ được lấp.
          if (!asset) {
            return block.caption ? <p key={`${block.type}-${index}`}>{block.caption}</p> : null;
          }
          return (
            <figure className={styles.blockFigure} data-scroll-motion="media" key={`${block.type}-${index}`}>
              {asset.width && asset.height ? (
                <Image
                  alt={asset.alt}
                  height={asset.height}
                  sizes="(max-width: 48rem) 94vw, 44rem"
                  src={asset.publicPath}
                  width={asset.width}
                />
              ) : (
                <span className={styles.blockFigureFrame}>
                  <Image alt={asset.alt} fill sizes="(max-width: 48rem) 94vw, 44rem" src={asset.publicPath} />
                </span>
              )}
              {block.caption ? <figcaption>{bindPhrases(block.caption)}</figcaption> : null}
            </figure>
          );
        }
        return null;
      })}
    </div>
  );
}

interface ContentDetailLayoutProps {
  actions?: ReactNode;
  details?: ReactNode;
  label: string;
  record: ContentRecord;
}

export function ContentDetailLayout({
  actions,
  details,
  label,
  record,
}: ContentDetailLayoutProps) {
  const parentPath = record.path.split('/').slice(0, -1).join('/') || '/';
  const parentDefinition = resolvePage(parentPath);
  const parentTitle =
    parentDefinition && 'title' in parentDefinition ? parentDefinition.title : 'Nội dung liên quan';
  const factCount = details ? detailFactCount(record) : 0;
  const hasContentIndex =
    record.body.filter((block) => block.type === 'heading' && block.level === 2).length >= 2;
  const profile = profileForPath(record.path);

  return (
    <main id="main-content" tabIndex={-1}>
      <article
        className={`${detailStyles.detailPage} ${styles.sectionTheme}`}
        data-section={profile.section}
      >
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            ...(parentPath !== '/' ? [{ href: parentPath, label: parentTitle }] : []),
            { label: record.title },
          ]}
        />
        <InnerPageHero
          description={record.summary}
          eyebrow={bindPhrases(label)}
          image={record.image ? { alt: record.image.alt, src: record.image.src } : undefined}
          path={record.path}
          title={record.title}
        />
        <SectionSubnav path={record.path} />
        {details && factCount > 0 ? (
          <section className={detailStyles.factsStage} aria-label="Thông tin chính">
            <p className={detailStyles.factsLabel}>
              Thông tin chính
              <span aria-hidden="true">{String(factCount).padStart(2, '0')}</span>
            </p>
            <div className={`${styles.detailFactsPanel} ${detailStyles.factsContent}`}>
              {details}
            </div>
          </section>
        ) : null}
        <div
          className={`${detailStyles.readingStage} ${
            hasContentIndex ? '' : detailStyles.readingStageWithoutIndex
          }`}
        >
          {hasContentIndex ? (
            <aside className={detailStyles.readingAside} aria-label="Điều hướng bài viết">
              <p className={detailStyles.readingLabel}>Trong nội dung này</p>
              <ContentIndex blocks={record.body} />
            </aside>
          ) : null}
          <div className={detailStyles.bodyColumn}>
            <ContentBlocks blocks={record.body} />
            <section className={detailStyles.endcap} aria-label="Bước tiếp theo">
              <div className={detailStyles.endcapCopy}>
                <p className={detailStyles.endcapLabel}>Tiếp tục khám phá</p>
                <p>{bindPhrases(`Khám phá thêm trong chuyên mục ${parentTitle}`)}</p>
              </div>
              <div className={detailStyles.endcapActions}>
                {actions ? <div className={styles.detailActions}>{actions}</div> : null}
                <Link className={detailStyles.backLink} href={parentPath}>
                  {bindPhrases(`Trở về ${parentTitle}`)}
                </Link>
              </div>
            </section>
            <div className={detailStyles.sourceStage}>
              <SourceNote
                checkedAt={record.checkedAt}
                sourceLabel={record.sourceLabel}
                sourceUrl={record.sourceUrl}
              />
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

interface MetadataFactsProps {
  fields: Array<{ key: string; label: string }>;
  metadata: ContentRecord['metadata'];
}

export function MetadataFacts({ fields, metadata }: MetadataFactsProps) {
  const available = fields.flatMap(({ key, label }) => {
    const value = metadata[key];
    return value ? [{ key, label, value }] : [];
  });
  if (available.length === 0) return null;

  return (
    <dl className={styles.factList}>
      {available.map(({ key, label, value }) => (
        <div key={key}>
          <dt>{bindPhrases(label)}</dt>
          <dd>{Array.isArray(value) ? value.join(', ') : value}</dd>
        </div>
      ))}
    </dl>
  );
}
