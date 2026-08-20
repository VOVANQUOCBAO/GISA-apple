import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ButtonLink } from '@/components/ui/button-link';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterBar, type UrlQuery } from '@/components/ui/filter-bar';
import { Icon, type IconName } from '@/components/ui/icon';
import { Pagination } from '@/components/ui/pagination';
import type { PageDefinition } from '@/content/pages';
import type { ContentSummary, PaginatedResult } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import { EDITORIAL_EMPTY_COPY } from './editorial-empty-copy';
import { InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';
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
    actionTitle: 'Xem thêm những hướng\nhành động vì cộng đồng',
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
      'Tra cứu thông báo và lịch hoạt động đã được GISA công bố. Trạng thái hiện hành cần được xác nhận trực tiếp.',
    mode: 'notices',
    topic: 'Thông báo và lịch',
  },
};

export const ECOSYSTEM_LISTING_PATHS = Object.freeze(Object.keys(LISTING_DIRECTIONS));

export function supportsEcosystemListingTemplate(path: string) {
  return path in LISTING_DIRECTIONS;
}

function normalizeVisibleText(text: string) {
  return text.replace(/\s{2,}/g, ' ').trim();
}

function vietnameseText(text: string) {
  return bindPhrases(normalizeVisibleText(text));
}

function formattedDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function listingIconFor(text: string): IconName {
  const normalized = text.toLocaleLowerCase('vi');
  if (/mục tiêu|định hướng|chính sách/.test(normalized)) return 'target';
  if (/con người|thanh niên|xã hội|cộng đồng|sức khỏe/.test(normalized)) return 'users';
  if (/kiến thức|học tập|giáo dục|nghiên cứu/.test(normalized)) return 'book';
  if (/hợp tác|mạng lưới|chuỗi/.test(normalized)) return 'network';
  if (/bền vững|môi trường|xanh|khí hậu|nông nghiệp/.test(normalized)) return 'leaf';
  if (/công nghệ|dữ liệu|số|ai|bản đồ|hệ thống/.test(normalized)) return 'cpu';
  if (/kết quả|tăng trưởng|kinh tế|doanh nghiệp/.test(normalized)) return 'chart';
  if (/giá trị|trách nhiệm|hỗ trợ/.test(normalized)) return 'handHeart';
  return 'lightbulb';
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
  return (
    <InnerPageHero
      description={description}
      eyebrow={topic}
      meta={(
        <p aria-live="polite">
          <strong>{count}</strong> nội dung trong danh mục
        </p>
      )}
      path={path}
      title={definition.title}
    />
  );
}

function PartnerCards({ items }: { items: ContentSummary[] }) {
  return (
    <ol className={styles.partnerGrid}>
      {items.map((item) => (
        <li key={item.id}>
          <article className={styles.partnerCard}>
            <span aria-hidden="true" className={styles.partnerMarker}>
              <Icon name="network" size={20} weight="duotone" />
            </span>
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

function PartnerDirectory({ items }: { items: ContentSummary[] }) {
  const domestic = items.filter((item) => item.metadata.partnerScope === 'domestic');
  const international = items.filter((item) => item.metadata.partnerScope !== 'domestic');

  return (
    <div className={styles.partnerDirectory}>
      {domestic.length > 0 ? (
        <section aria-labelledby="domestic-partners-title" className={styles.partnerGroup}>
          <h2 id="domestic-partners-title">Đối tác trong nước</h2>
          <PartnerCards items={domestic} />
        </section>
      ) : null}
      {international.length > 0 ? (
        <section aria-labelledby="international-partners-title" className={styles.partnerGroup}>
          <h2 id="international-partners-title">Đối tác quốc tế</h2>
          <PartnerCards items={international} />
        </section>
      ) : null}
    </div>
  );
}

const INITIATIVE_VISUALS = [
  { alt: 'Mô hình đô thị xanh và phát triển bền vững', src: '/images/article-green-city.png' },
  { alt: 'Chuỗi giá trị nông nghiệp gắn với sinh kế địa phương', src: '/images/article-da-xanh-pomelo.png' },
  { alt: 'Cộng đồng cùng tham gia hoạt động tạo tác động', src: '/images/knowledge-journey/community-action-editorial.png' },
  { alt: 'Mục tiêu phát triển bền vững định hướng sáng kiến cộng đồng', src: '/images/banner-sustainable-development-goals.png' },
  { alt: 'Năng lượng tái tạo và lựa chọn xanh cho cộng đồng', src: '/images/article-renewables.png' },
  { alt: 'Phân tích dữ liệu phục vụ đánh giá tác động địa phương', src: '/images/article-performance-benchmarking.png' },
] as const;

function InitiativeDirectory({ items }: { items: ContentSummary[] }) {
  return (
    <ol className={styles.initiativeGrid}>
      {items.map((item, index) => (
        <li className={index === 0 ? styles.initiativeLead : undefined} key={item.id}>
          <article className={styles.initiativeCard}>
            <span className={styles.initiativeVisual}>
              <Image
                alt={normalizeVisibleText(item.image?.alt ?? INITIATIVE_VISUALS[index % INITIATIVE_VISUALS.length]?.alt ?? 'Sáng kiến cộng đồng GISA')}
                fill
                sizes={index === 0 ? '(max-width: 48rem) 94vw, 46vw' : '(max-width: 48rem) 94vw, 42vw'}
                src={item.image?.src ?? INITIATIVE_VISUALS[index % INITIATIVE_VISUALS.length]?.src ?? INITIATIVE_VISUALS[0].src}
              />
            </span>
            <div className={styles.initiativeCopy}>
              <p className={styles.itemTopic}>
                <span aria-hidden="true" className={styles.itemTopicIcon}>
                  <Icon name={listingIconFor(`${item.title} ${item.tags.join(' ')}`)} size={20} weight="duotone" />
                </span>
                {vietnameseText(item.tags[1] ?? item.tags[0] ?? 'Cộng đồng')}
              </p>
              <h3><Link href={item.path}>{vietnameseText(item.title)}</Link></h3>
              <p className={styles.itemSummary}>{vietnameseText(item.summary)}</p>
              <span aria-hidden="true" className={styles.readMore}>Khám phá</span>
            </div>
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
              <span aria-hidden="true" className={styles.itemMetaIcon}>
                <Icon name="megaphone" size={20} weight="duotone" />
              </span>
              {item.publishedAt ? <time dateTime={item.publishedAt}>{formattedDate(item.publishedAt)}</time> : null}
              <span>{vietnameseText(String(item.metadata.topic ?? item.tags[1] ?? 'Tin tức'))}</span>
            </div>
            {item.image ? (
              <span className={styles.newsVisual}>
                <Image
                  alt={normalizeVisibleText(item.image.alt)}
                  fill
                  sizes="(max-width: 52rem) 94vw, (max-width: 80rem) 30vw, 22rem"
                  src={item.image.src}
                />
              </span>
            ) : (
              <span aria-hidden="true" className={styles.newsFallback}>
                <span>{vietnameseText(String(item.metadata.topic ?? 'GISA'))}</span>
              </span>
            )}
            <div className={styles.newsCopy}>
              <h3><Link href={item.path}>{vietnameseText(item.title)}</Link></h3>
              <p>{vietnameseText(item.summary)}</p>
            </div>
            <span aria-hidden="true" className={styles.newsArrow}>
              <Icon name="arrow" size={24} weight="bold" />
            </span>
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
              <span aria-hidden="true" className={styles.itemMetaIcon}>
                <Icon name="calendar" size={20} weight="duotone" />
              </span>
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
  const usesCompactCommunityFilters = direction.mode === 'initiatives';

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
          <section
            aria-label={usesCompactCommunityFilters ? 'Lọc sáng kiến cộng đồng' : undefined}
            aria-labelledby={usesCompactCommunityFilters ? undefined : 'ecosystem-filter-title'}
            className={styles.filterStage}
            data-compact={usesCompactCommunityFilters ? 'true' : undefined}
          >
            {!usesCompactCommunityFilters ? (
              <div>
                <h2 id="ecosystem-filter-title">Tìm theo nội dung bạn quan tâm</h2>
                <p>Chọn một tiêu chí để thu hẹp danh sách.</p>
              </div>
            ) : null}
            <FilterBar
              filters={availableFilters}
              hideLegends={usesCompactCommunityFilters}
              path={path}
              query={searchParams}
            />
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
