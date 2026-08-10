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

import { InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';
import styles from './expert-listing-template.module.css';
import layoutStyles from './templates.module.css';

type ListingDefinition = Extract<PageDefinition, { template: 'listing' }>;

export interface ExpertListingTemplateProps {
  definition: ListingDefinition;
  path: string;
  result: PaginatedResult<ContentSummary>;
  searchParams: UrlQuery;
}

const HONORIFICS = new Set(['gs', 'pgs', 'ts', 'ths', 'ncs.ts', 'dr', 'prof']);

export function expertInitials(title: string) {
  const words = title.split(/\s+/u).filter(Boolean);
  while (words.length > 0) {
    const first = words[0]?.replace(/\.$/u, '').toLocaleLowerCase('vi') ?? '';
    if (!HONORIFICS.has(first)) break;
    words.shift();
  }
  if (words.length === 0) return 'G';
  if (words.length === 1) return words[0]?.slice(0, 1).toLocaleUpperCase('vi') ?? 'G';
  return `${words[0]?.slice(0, 1) ?? ''}${words.at(-1)?.slice(0, 1) ?? ''}`.toLocaleUpperCase('vi');
}

function expertiseFor(item: ContentSummary) {
  const value = item.metadata.expertise;
  return Array.isArray(value) ? value : [];
}

function ExpertDirectoryCard({
  index,
  item,
}: {
  index: number;
  item: ContentSummary;
}) {
  const expertise = expertiseFor(item);

  return (
    <article className={styles.expertCard} data-tone={index % 4}>
      <div className={styles.portrait}>
        {item.image ? (
          <Image
            alt={item.image.alt}
            fill
            sizes="(max-width: 48rem) 94vw, (max-width: 80rem) 45vw, 38rem"
            src={item.image.src}
          />
        ) : (
          <div
            aria-label={`Hồ sơ ${item.title} chưa có ảnh được công bố`}
            className={styles.initialPortrait}
            role="img"
          >
            <span aria-hidden="true">{expertInitials(item.title)}</span>
          </div>
        )}
        <span aria-hidden="true" className={styles.directoryNumber}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className={styles.cardCopy}>
        <h3><Link href={item.path}>{bindPhrases(item.title)}</Link></h3>
        <p>{bindPhrases(item.summary)}</p>
        {expertise.length > 0 ? (
          <ul aria-label={`Chuyên môn của ${item.title}`}>
            {expertise.map((specialty) => <li key={specialty}>{bindPhrases(specialty)}</li>)}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function ExpertListingTemplate({
  definition,
  path,
  result,
  searchParams,
}: ExpertListingTemplateProps) {
  const availableFilters = Object.fromEntries(
    definition.filters
      .filter((key) => result.availableFilters[key]?.length)
      .map((key) => [key, result.availableFilters[key]]),
  );
  const hasAvailableFilters = Object.keys(availableFilters).length > 0;
  const hasQuery = Boolean(typeof searchParams.q === 'string' && searchParams.q.trim());
  const hasFilters = definition.filters.some((key) => Boolean(searchParams[key]));
  const profile = profileForPath(path);
  const resultCount = result.total.toLocaleString('vi-VN');
  const offset = (result.page - 1) * result.pageSize;

  return (
    <main id="main-content" tabIndex={-1}>
      <div className={`${styles.pageContainer} ${layoutStyles.sectionTheme}`} data-section={profile.section}>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { href: '/gioi-thieu', label: 'Giới thiệu' },
            { label: definition.title },
          ]}
        />
        <InnerPageHero
          description={definition.description}
          eyebrow="Mạng lưới chuyên môn"
          meta={<p aria-live="polite"><strong>{resultCount}</strong> hồ sơ</p>}
          path={path}
          title={definition.title}
        />
        <SectionSubnav path={path} />

        {hasAvailableFilters ? (
          <section aria-labelledby="expert-filter-title" className={styles.filterStage}>
            <div>
              <h2 id="expert-filter-title">Tìm theo lĩnh vực chuyên môn</h2>
              <p>Chọn lĩnh vực phù hợp để thu hẹp danh sách hồ sơ.</p>
            </div>
            <FilterBar filters={availableFilters} path={path} query={searchParams} />
          </section>
        ) : null}

        {result.items.length > 0 ? (
          <section aria-labelledby="expert-directory-title" className={styles.directory}>
            <header className={styles.directoryHeader}>
              <div>
                <p>Đội ngũ GISA</p>
                <h2 id="expert-directory-title">Tri thức được dẫn dắt bởi con người</h2>
              </div>
              <p aria-live="polite" className={styles.resultCount}>
                <strong>{resultCount}</strong>
                <span>hồ sơ được công bố</span>
              </p>
            </header>
            <ol className={styles.expertGrid}>
              {result.items.map((item, index) => (
                <li key={item.id}>
                  <ExpertDirectoryCard index={offset + index} item={item} />
                </li>
              ))}
            </ol>
          </section>
        ) : hasQuery || hasFilters ? (
          <EmptyState
            action={<ButtonLink href={path}>Xóa bộ lọc</ButtonLink>}
            description="Hãy thử từ khóa khác hoặc điều chỉnh lĩnh vực đang chọn."
            title="Không có hồ sơ phù hợp"
          />
        ) : (
          <EmptyState
            description="Danh sách chuyên gia đang được cập nhật từ các nguồn đã xác minh."
            title="Hồ sơ đang được cập nhật"
          />
        )}

        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          path={path}
          query={searchParams}
        />
      </div>
    </main>
  );
}
