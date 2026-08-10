import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ButtonLink } from '@/components/ui/button-link';
import { ContentCard } from '@/components/ui/content-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterBar, type UrlQuery } from '@/components/ui/filter-bar';
import { Pagination } from '@/components/ui/pagination';
import type { PageDefinition } from '@/content/pages';
import type { ContentSummary, PaginatedResult } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import { EDITORIAL_EMPTY_COPY } from './editorial-empty-copy';
import { PublicationIndex } from './publication-index';
import { InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';
import listingStyles from './listing-template.module.css';
import styles from './templates.module.css';

type ListingDefinition = Extract<PageDefinition, { template: 'listing' }>;

interface ListingTemplateProps {
  definition: ListingDefinition;
  path: string;
  result: PaginatedResult<ContentSummary>;
  searchParams: UrlQuery;
}

export function ListingTemplate({
  definition,
  path,
  result,
  searchParams,
}: ListingTemplateProps) {
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
  const isPublications = definition.collection === 'publications';
  const resultCount = result.total.toLocaleString('vi-VN');
  const profile = profileForPath(path);

  return (
    <main id="main-content" tabIndex={-1}>
      <div
        className={`${styles.pageContainer} ${styles.sectionTheme}`}
        data-section={profile.section}
      >
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { label: definition.title },
          ]}
        />
        <InnerPageHero
          description={definition.description}
          eyebrow={isPublications ? 'Thư viện học thuật' : 'Danh mục chuyên môn'}
          meta={<p aria-live="polite"><strong>{resultCount}</strong> nội dung</p>}
          path={path}
          title={definition.title}
        />
        <SectionSubnav path={path} />
        {hasAvailableFilters ? (
          <section
            aria-labelledby="listing-filter-title"
            className={listingStyles.toolbar}
          >
            <div className={listingStyles.toolbarCopy}>
              <p className={listingStyles.eyebrow}>Công cụ khám phá</p>
              <h2 id="listing-filter-title">Thu hẹp danh sách theo nhu cầu</h2>
              <p>Sử dụng các tiêu chí dưới đây để tìm nội dung phù hợp.</p>
            </div>
            <div className={listingStyles.filterPanel}>
              <FilterBar filters={availableFilters} path={path} query={searchParams} />
            </div>
          </section>
        ) : null}
        {result.items.length > 0 ? (
          // Ấn phẩm dùng mục lục dạng dòng thay vì lưới thẻ: người đọc quét
          // theo năm và tác giả, và hơn nửa số bài không có ảnh bìa.
          isPublications ? (
            <PublicationIndex items={result.items} />
          ) : (
            <section
              aria-labelledby="listing-results-title"
              className={listingStyles.collectionShell}
            >
              <header className={listingStyles.resultsHeader}>
                <div>
                  <p className={listingStyles.eyebrow}>Khám phá nội dung</p>
                  <h2 id="listing-results-title">
                    {bindPhrases(`Danh sách ${definition.title.toLocaleLowerCase('vi')}`)}
                  </h2>
                </div>
                <p aria-live="polite" className={listingStyles.resultCount}>
                  <strong>{resultCount}</strong>
                  <span>kết quả phù hợp</span>
                </p>
              </header>
              <ol
                className={listingStyles.editorialList}
                data-collection={definition.collection}
              >
                {result.items.map((item, index) => (
                  <li
                    className={
                      index === 0
                        ? listingStyles.featuredEntry
                        : listingStyles.supportingEntry
                    }
                    key={item.id}
                  >
                    {index === 0 ? (
                      <div aria-hidden="true" className={listingStyles.featuredRail}>
                        <span>01</span>
                        <i />
                        <small>Nội dung nổi bật</small>
                      </div>
                    ) : (
                      <span aria-hidden="true" className={listingStyles.itemNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                    <div
                      className={
                        index === 0
                          ? listingStyles.featuredCard
                          : listingStyles.supportingCard
                      }
                    >
                      <ContentCard headingLevel={3} item={item} />
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )
        ) : hasQuery || hasFilters ? (
          <EmptyState
            action={<ButtonLink href={path}>{bindPhrases("Xóa bộ lọc")}</ButtonLink>}
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
      </div>
    </main>
  );
}
