import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SourceNote } from '@/components/ui/source-note';
import type { ContentBlock, ContentRecord } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import { ContentBlocks } from './content-blocks';
import { heroVisualForPath, profileForPath, SectionSubnav } from './inner-page-chrome';
import styles from './ecosystem-detail-template.module.css';

type EcosystemKind = Extract<ContentRecord['kind'], 'initiative' | 'news' | 'notice' | 'partner'>;

interface DetailDirection {
  action: { href: string; label: string };
  parent: { href: string; label: string };
  topic: string;
}

const DETAIL_DIRECTIONS: Record<EcosystemKind, DetailDirection> = {
  initiative: {
    action: { href: '/cong-dong/kinh-te-ben-vung', label: 'Xem các sáng kiến' },
    parent: { href: '/cong-dong/kinh-te-ben-vung', label: 'Kinh tế bền vững' },
    topic: 'Sáng kiến cộng đồng',
  },
  news: {
    action: { href: '/tin-tuc', label: 'Xem tin tức' },
    parent: { href: '/tin-tuc', label: 'Tin tức' },
    topic: 'Góc nhìn và cập nhật',
  },
  notice: {
    action: { href: '/tin-tuc/thong-bao-lich', label: 'Xem các thông báo' },
    parent: { href: '/tin-tuc/thong-bao-lich', label: 'Thông báo & lịch' },
    topic: 'Thông báo lưu trữ',
  },
  partner: {
    action: { href: '/dang-ky/hop-tac', label: 'Đề nghị hợp tác' },
    parent: { href: '/mang-luoi/doi-tac', label: 'Đối tác' },
    topic: 'Mạng lưới hợp tác',
  },
};

export function supportsEcosystemDetailTemplate(record: ContentRecord) {
  return record.kind in DETAIL_DIRECTIONS;
}

function normalizeVisibleText(text: string) {
  return text.replace(/\s*[—–]\s*/g, ' - ').replace(/\s{2,}/g, ' ').trim();
}

function vietnameseText(text: string) {
  return bindPhrases(normalizeVisibleText(text));
}

function normalizeBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((block) => {
    if (block.type === 'paragraph' || block.type === 'heading') {
      return { ...block, text: normalizeVisibleText(block.text) };
    }
    if (block.type === 'list') {
      return { ...block, items: block.items.map(normalizeVisibleText) };
    }
    if (block.type === 'quote') {
      return {
        ...block,
        attribution: block.attribution ? normalizeVisibleText(block.attribution) : undefined,
        text: normalizeVisibleText(block.text),
      };
    }
    if (block.type === 'image') {
      return { ...block, caption: block.caption ? normalizeVisibleText(block.caption) : undefined };
    }
    if (block.type === 'table') {
      return {
        ...block,
        headers: block.headers.map(normalizeVisibleText),
        rows: block.rows.map((row) => row.map(normalizeVisibleText)),
      };
    }
    if (block.type === 'linkGroup') {
      return {
        ...block,
        links: block.links.map((link) => ({ ...link, label: normalizeVisibleText(link.label) })),
      };
    }
    return { ...block, title: normalizeVisibleText(block.title) };
  });
}

function formattedDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function factEntries(record: ContentRecord) {
  const candidates: Array<[string, string | string[] | undefined]> = [];

  if (record.kind === 'initiative') {
    candidates.push(
      ['Trụ cột', record.metadata.pillar],
      ['Bối cảnh', record.metadata.context],
      ['Vai trò GISA', record.metadata.role],
      ['Tác động đã xác minh', record.metadata.impact],
    );
  }
  if (record.kind === 'news') candidates.push(['Chủ đề', record.metadata.topic]);
  if (record.kind === 'notice') candidates.push(['Trạng thái', record.metadata.status]);
  if (record.kind === 'partner') candidates.push(['Mạng lưới', record.metadata.network]);

  return candidates.flatMap(([label, value]) => value ? [{ label, value }] : []);
}

function DetailFacts({ record }: { record: ContentRecord }) {
  const entries = factEntries(record);
  if (!entries.length && !record.publishedAt) return null;

  return (
    <aside className={styles.facts} aria-label="Thông tin chính">
      {record.publishedAt ? (
        <div>
          <dt>Ngày công bố</dt>
          <dd><time dateTime={record.publishedAt}>{formattedDate(record.publishedAt)}</time></dd>
        </div>
      ) : null}
      {entries.map(({ label, value }) => (
        <div key={label}>
          <dt>{vietnameseText(label)}</dt>
          <dd>{vietnameseText(Array.isArray(value) ? value.join(', ') : value)}</dd>
        </div>
      ))}
    </aside>
  );
}

export function EcosystemDetailTemplate({ record }: { record: ContentRecord }) {
  if (!supportsEcosystemDetailTemplate(record)) return null;

  const direction = DETAIL_DIRECTIONS[record.kind as EcosystemKind];
  const profile = profileForPath(record.path);
  const partnerVisual = record.kind === 'partner' && record.image;
  const visual = partnerVisual
    ? { alt: normalizeVisibleText(record.image?.alt ?? record.title), src: record.image?.src ?? profile.image }
    : heroVisualForPath(record.path);

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <article className={styles.container} data-kind={record.kind} data-section={profile.section}>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            ...(direction.parent.href === profile.root
              ? []
              : [{ href: profile.root, label: profile.label }]),
            direction.parent,
            { label: normalizeVisibleText(record.title) },
          ]}
        />

        <header className={styles.hero} data-title-length={record.title.length > 52 ? 'long' : 'standard'}>
          <div className={styles.heroCopy}>
            <p className={styles.heroTopic}>{vietnameseText(direction.topic)}</p>
            <h1>{vietnameseText(record.title)}</h1>
            <p className={styles.heroDescription}>{vietnameseText(record.summary)}</p>
          </div>
          <figure className={styles.heroVisual} data-logo={partnerVisual ? 'true' : 'false'}>
            <Image
              alt={visual.alt}
              fill
              priority
              sizes="(max-width: 48rem) 100vw, 34vw"
              src={visual.src}
            />
          </figure>
        </header>
        <SectionSubnav path={record.path} />

        {record.kind === 'notice' ? (
          <p className={styles.archiveNotice}>
            Thông báo này thuộc kho lưu trữ. Vui lòng xác nhận trực tiếp với GISA nếu cần kiểm tra hiệu lực hiện tại.
          </p>
        ) : null}
        <div className={styles.readingStage}>
          <DetailFacts record={record} />
          <div className={styles.body}>
            {record.kind === 'partner' ? (
              <section className={styles.partnerEvidence} aria-labelledby="partner-information-scope">
                <p>Hồ sơ đối tác</p>
                <h2 id="partner-information-scope">Phạm vi thông tin hiện có</h2>
                <p>
                  Hiện hồ sơ chỉ ghi nhận <strong>{vietnameseText(record.title)}</strong> có mặt
                  trong bộ logo đối tác do GISA cung cấp.
                </p>
                <p>
                  Chưa có dữ liệu đã xác minh về dự án, vai trò hoặc giai đoạn hợp tác để
                  hiển thị trên website.
                </p>
              </section>
            ) : (
              <ContentBlocks blocks={normalizeBlocks(record.body)} />
            )}
            <section className={styles.actionClosure} aria-label="Bước tiếp theo">
              <h2>{vietnameseText(`Tiếp tục khám phá ${direction.parent.label.toLocaleLowerCase('vi')}`)}</h2>
              <Link href={direction.action.href}>{vietnameseText(direction.action.label)}</Link>
            </section>
            <div className={styles.source}>
              <SourceNote
                checkedAt={record.checkedAt}
                sourceLabel={normalizeVisibleText(record.sourceLabel)}
                sourceUrl={record.sourceUrl}
              />
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
