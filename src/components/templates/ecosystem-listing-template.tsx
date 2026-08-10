import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ButtonLink } from '@/components/ui/button-link';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterBar, type UrlQuery } from '@/components/ui/filter-bar';
import { Pagination } from '@/components/ui/pagination';
import type { PageDefinition } from '@/content/pages';
import type { ContentSummary, PaginatedResult } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import { EDITORIAL_EMPTY_COPY } from './editorial-empty-copy';
import { heroVisualForPath, profileForPath, SectionSubnav } from './inner-page-chrome';
import styles from './ecosystem-listing-template.module.css';

type ListingDefinition = Extract<PageDefinition, { template: 'listing' }>;
type ListingMode = 'initiatives' | 'news' | 'notices' | 'partners';

interface ListingDirection {
  action: { href: string; label: string };
  actionTitle: string;
  description?: string;
  mode: ListingMode;
  topic: string;
}

export interface EcosystemListingTemplateProps {
  definition: ListingDefinition;
  path: string;
  result: PaginatedResult<ContentSummary>;
  searchParams: UrlQuery;
}

const LISTING_DIRECTIONS: Record<string, ListingDirection> = {
  '/mang-luoi/doi-tac': {
    action: { href: '/dang-ky/hop-tac', label: 'Đề nghị hợp tác' },
    actionTitle: 'Cùng mở rộng mạng lưới tri thức và hành động',
    description:
      'Khám phá các tổ chức có mặt trong bộ nhận diện mạng lưới hợp tác do GISA cung cấp.',
    mode: 'partners',
    topic: 'Mạng lưới tổ chức',
  },
  '/cong-dong/kinh-te-ben-vung': {
    action: { href: '/cong-dong', label: 'Khám phá cộng đồng' },
    actionTitle: 'Xem thêm những hướng hành động vì cộng đồng',
    description:
      'Khám phá các mô hình, công cụ và chương trình kết nối phát triển kinh tế với giá trị xã hội và môi trường.',
    mode: 'initiatives',
    topic: 'Sáng kiến kinh tế bền vững',
  },
  '/tin-tuc': {
    action: { href: '/tin-tuc/thong-bao-lich', label: 'Xem thông báo và lịch' },
    actionTitle: 'Theo dõi các thông tin cần lưu ý từ GISA',
    mode: 'news',
    topic: 'Góc nhìn và cập nhật',
  },
  '/tin-tuc/thong-bao-lich': {
    action: { href: '/tin-tuc', label: 'Xem tin tức' },
    actionTitle: 'Tiếp tục với những góc nhìn mới từ GISA',
    description:
      'Tra cứu thông báo và lịch hoạt động đã được GISA công bố; trạng thái hiện hành cần được xác nhận trực tiếp.',
    mode: 'notices',
    topic: 'Thông báo và lịch',
  },
};

export const ECOSYSTEM_LISTING_PATHS = Object.freeze(Object.keys(LISTING_DIRECTIONS));

export function supportsEcosystemListingTemplate(path: string) {
  return path in LISTING_DIRECTIONS;
}

function normalizeVisibleText(text: string) {
  return text.replace(/\s*[—–]\s*/g, ' - ').replace(/\s{2,}/g, ' ').trim();
}

function vietnameseText(text: string) {
  return bindPhrases(normalizeVisibleText(text));
}

function formattedDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function ListingHero({
  count,
  definition,
  description,
  path,
  topic,
}: {
  count: string;
  definition: ListingDefinition;
  description: string;
  path: string;
  topic: string;
}) {
  const visual = heroVisualForPath(path);

  return (
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.heroTopic}>{vietnameseText(topic)}</p>
        <h1>{vietnameseText(definition.title)}</h1>
        <p className={styles.heroDescription}>{vietnameseText(description)}</p>
        <p aria-live="polite" className={styles.heroCount}>
          <strong>{count}</strong>
          <span>nội dung trong danh mục</span>
        </p>
      </div>
      <figure className={styles.heroVisual}>
        <Image alt={visual.alt} fill priority sizes="(max-width: 48rem) 100vw, 34vw" src={visual.src} />
      </figure>
    </header>
  );
}

function PartnerDirectory({ items }: { items: ContentSummary[] }) {
  return (
    <ol className={styles.partnerGrid}>
      {items.map((item) => (
        <li key={item.id}>
          <article className={styles.partnerCard}>
            {item.image ? (
              <span className={styles.partnerLogo}>
                <Image
                  alt={normalizeVisibleText(item.image.alt)}
                  height={item.image.height}
                  sizes="(max-width: 36rem) 44vw, (max-width: 72rem) 28vw, 18vw"
                  src={item.image.src}
                  width={item.image.width}
                />
              </span>
            ) : null}
            <h3><Link href={item.path}>{vietnameseText(item.title)}</Link></h3>
          </article>
        </li>
      ))}
    </ol>
  );
}

function InitiativeDirectory({ items }: { items: ContentSummary[] }) {
  return (
    <ol className={styles.initiativeGrid}>
      {items.map((item, index) => (
        <li className={index === 0 ? styles.initiativeLead : undefined} key={item.id}>
          <article className={styles.initiativeCard}>
            <p className={styles.itemTopic}>{vietnameseText(item.tags[1] ?? item.tags[0] ?? 'Cộng đồng')}</p>
            <h3><Link href={item.path}>{vietnameseText(item.title)}</Link></h3>
            <p className={styles.itemSummary}>{vietnameseText(item.summary)}</p>
            <span aria-hidden="true" className={styles.readMore}>Khám phá</span>
          </article>
        </li>
      ))}
    </ol>
  );
}

function NewsIndex({ items }: { items: ContentSummary[] }) {
  return (
    <ol className={styles.newsIndex}>
      {items.map((item) => (
        <li key={item.id}>
          <article className={styles.newsEntry}>
            <div className={styles.newsMeta}>
              {item.publishedAt ? <time dateTime={item.publishedAt}>{formattedDate(item.publishedAt)}</time> : null}
              <span>{vietnameseText(String(item.metadata.topic ?? item.tags[1] ?? 'Tin tức'))}</span>
            </div>
            <div className={styles.newsCopy}>
              <h3><Link href={item.path}>{vietnameseText(item.title)}</Link></h3>
              <p>{vietnameseText(item.summary)}</p>
            </div>
            <span aria-hidden="true" className={styles.newsArrow}>→</span>
          </article>
        </li>
      ))}
    </ol>
  );
}

function NoticeTimeline({ items }: { items: ContentSummary[] }) {
  return (
    <ol className={styles.noticeTimeline}>
      {items.map((item) => (
        <li key={item.id}>
          <article className={styles.noticeEntry}>
            <div className={styles.noticeDate}>
              {item.publishedAt ? <time dateTime={item.publishedAt}>{formattedDate(item.publishedAt)}</time> : null}
              <span>{vietnameseText(String(item.metadata.status ?? 'Cần xác nhận trạng thái'))}</span>
            </div>
            <div className={styles.noticeCopy}>
              <h3><Link href={item.path}>{vietnameseText(item.title)}</Link></h3>
              <p>{vietnameseText(item.summary)}</p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

function Collection({ mode, items }: { mode: ListingMode; items: ContentSummary[] }) {
  if (mode === 'partners') return <PartnerDirectory items={items} />;
  if (mode === 'initiatives') return <InitiativeDirectory items={items} />;
  if (mode === 'notices') return <NoticeTimeline items={items} />;
  return <NewsIndex items={items} />;
}

function ActionClosure({ direction }: { direction: ListingDirection }) {
  return (
    <section className={styles.actionClosure} aria-label="Bước tiếp theo">
      <h2>{vietnameseText(direction.actionTitle)}</h2>
      <Link href={direction.action.href}>{vietnameseText(direction.action.label)}</Link>
    </section>
  );
}

export function EcosystemListingTemplate({
  definition,
  path,
  result,
  searchParams,
}: EcosystemListingTemplateProps) {
  const direction = LISTING_DIRECTIONS[path];
  if (!direction) return null;

  const profile = profileForPath(path);
  const availableFilters = Object.fromEntries(
    definition.filters
      .filter((key) => result.availableFilters[key]?.length)
      .map((key) => [key, result.availableFilters[key]]),
  );
  const hasAvailableFilters = Object.keys(availableFilters).length > 0;
  const hasQuery = Boolean(
    typeof searchParams.q === 'string' && searchParams.q.trim(),
  );
  const hasFilters = definition.filters.some((key) => Boolean(searchParams[key]));
  const scopeValues = Object.values(definition.fixedFilters ?? {});
  const resultCount = result.total.toLocaleString('vi-VN');

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <div className={styles.container} data-mode={direction.mode} data-section={profile.section}>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            ...(path === profile.root || definition.title === profile.label
              ? []
              : [{ href: profile.root, label: profile.label }]),
            { label: definition.title },
          ]}
        />
        <ListingHero
          count={resultCount}
          definition={definition}
          description={direction.description ?? definition.description}
          path={path}
          topic={direction.topic}
        />
        <SectionSubnav path={path} />

        {hasAvailableFilters ? (
          <section className={styles.filterStage} aria-labelledby="ecosystem-filter-title">
            <div>
              <h2 id="ecosystem-filter-title">Tìm theo nội dung bạn quan tâm</h2>
              <p>Chọn một tiêu chí để thu hẹp danh sách.</p>
            </div>
            <FilterBar filters={availableFilters} path={path} query={searchParams} />
          </section>
        ) : null}

        {result.items.length > 0 ? (
          <section className={styles.collection} aria-labelledby="ecosystem-results-title">
            <header className={styles.collectionHeader}>
              <h2 id="ecosystem-results-title">{vietnameseText(definition.title)}</h2>
              <p aria-live="polite">{resultCount} kết quả phù hợp</p>
            </header>
            <Collection items={result.items} mode={direction.mode} />
          </section>
        ) : hasQuery || hasFilters ? (
          <EmptyState
            action={<ButtonLink href={path}>Xóa bộ lọc</ButtonLink>}
            description={EDITORIAL_EMPTY_COPY.filtered.description}
            title={EDITORIAL_EMPTY_COPY.filtered.title}
          />
        ) : scopeValues.length > 0 ? (
          <EmptyState
            description={EDITORIAL_EMPTY_COPY.scope.description}
            title={EDITORIAL_EMPTY_COPY.scope.title}
          />
        ) : (
          <EmptyState
            description={EDITORIAL_EMPTY_COPY.pending.description}
            title={EDITORIAL_EMPTY_COPY.pending.title}
          />
        )}

        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          path={path}
          query={searchParams}
        />
        <ActionClosure direction={direction} />
      </div>
    </main>
  );
}
