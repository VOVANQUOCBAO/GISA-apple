import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ButtonLink } from '@/components/ui/button-link';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterBar, type UrlQuery } from '@/components/ui/filter-bar';
import { Icon } from '@/components/ui/icon';
import { Pagination } from '@/components/ui/pagination';
import type { PageDefinition } from '@/content/pages';
import type { ContentSummary, PaginatedResult } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import { InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';
import styles from './course-listing-template.module.css';
import layoutStyles from './templates.module.css';

type ListingDefinition = Extract<PageDefinition, { template: 'listing' }>;

export interface CourseListingTemplateProps {
  definition: ListingDefinition;
  path: string;
  result: PaginatedResult<ContentSummary>;
  searchParams: UrlQuery;
}

interface CourseGroup {
  items: ContentSummary[];
  label: string;
}

function normalizeText(text: string) {
  return text.replace(/\s*[–—]\s*/g, ' - ');
}

function metadataText(item: ContentSummary, key: string) {
  const value = item.metadata[key];
  return Array.isArray(value) ? value.join(', ') : value;
}

function groupCourses(items: ContentSummary[]): CourseGroup[] {
  const groups = new Map<string, ContentSummary[]>();

  for (const item of items) {
    const label = metadataText(item, 'program') || 'Chương trình đào tạo';
    const group = groups.get(label) ?? [];
    group.push(item);
    groups.set(label, group);
  }

  return [...groups.entries()].map(([label, groupItems]) => ({
    items: groupItems,
    label,
  }));
}

function CourseEntry({ item }: { item: ContentSummary }) {
  const objective = metadataText(item, 'objectives');
  const format = metadataText(item, 'format');

  return (
    <article className={styles.courseEntry}>
      <div className={styles.courseEntryCopy}>
        {format ? <p className={styles.courseFormat}>{bindPhrases(normalizeText(format))}</p> : null}
        <h3>
          <Link href={item.path}>{bindPhrases(normalizeText(item.title))}</Link>
        </h3>
        <p className={styles.courseSummary}>{bindPhrases(normalizeText(item.summary))}</p>
      </div>
      <div className={styles.courseOutcome}>
        {objective ? (
          <>
            <span>Trọng tâm học tập</span>
            <p>{bindPhrases(normalizeText(objective))}</p>
          </>
        ) : (
          <p>Thông tin mục tiêu đang được cập nhật.</p>
        )}
        <span aria-hidden="true" className={styles.courseArrow}>
          <Icon name="arrow" size={20} />
        </span>
      </div>
    </article>
  );
}

export function CourseListingTemplate({
  definition,
  path,
  result,
  searchParams,
}: CourseListingTemplateProps) {
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
  const groups = groupCourses(result.items);
  const profile = profileForPath(path);

  return (
    <main id="main-content" tabIndex={-1}>
      <div
        className={`${styles.pageContainer} ${layoutStyles.sectionTheme}`}
        data-section={profile.section}
      >
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { href: '/dao-tao', label: 'Đào tạo' },
            { label: definition.title },
          ]}
        />
        <InnerPageHero
          description={definition.description}
          eyebrow="Hành trình học tập"
          meta={<p aria-live="polite"><strong>{resultCount}</strong> khóa học</p>}
          path={path}
          title={definition.title}
        />
        <SectionSubnav path={path} />

        <section className={styles.discovery} aria-labelledby="course-discovery-title">
          <div className={styles.discoveryCopy}>
            <h2 id="course-discovery-title">Chọn nội dung theo mục tiêu phát triển</h2>
            <p>
              Mỗi khóa học được đặt trong một dòng chương trình, giúp người học nhìn rõ
              trọng tâm trước khi xem chi tiết.
            </p>
          </div>
          <div className={styles.discoveryAction}>
            <ButtonLink href="/dang-ky/khoa-hoc">Xem biểu mẫu đăng ký</ButtonLink>
          </div>
        </section>

        {hasAvailableFilters ? (
          <section className={styles.filterStage} aria-label="Lọc danh sách khóa học">
            <div>
              <h2>Tìm theo hình thức học</h2>
              <p>Chọn một tiêu chí để thu hẹp danh sách hiện có.</p>
            </div>
            <FilterBar filters={availableFilters} path={path} query={searchParams} />
          </section>
        ) : null}

        {groups.length > 0 ? (
          <div className={styles.programGroups}>
            {groups.map((group) => (
              <section
                aria-labelledby={`program-${group.label.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`}
                className={styles.programGroup}
                data-scroll-motion="reveal"
                key={group.label}
              >
                <header className={styles.programHeader}>
                  <h2 id={`program-${group.label.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`}>
                    {bindPhrases(normalizeText(group.label))}
                  </h2>
                  <p aria-live="polite">{group.items.length.toLocaleString('vi-VN')} khóa học đang hiển thị</p>
                </header>
                <ol className={styles.courseList}>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <CourseEntry item={item} />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        ) : hasQuery || hasFilters ? (
          <EmptyState
            action={<ButtonLink href={path}>Xóa bộ lọc</ButtonLink>}
            description="Hãy thử từ khóa khác hoặc điều chỉnh hình thức học đang chọn."
            title="Không có khóa học phù hợp"
          />
        ) : scopeValues.length > 0 ? (
          <EmptyState
            description="Hiện chưa có khóa học phù hợp để hiển thị trong phạm vi này."
            title="Chưa có khóa học trong phạm vi này"
          />
        ) : (
          <EmptyState
            description="Danh sách khóa học đang được cập nhật. Vui lòng quay lại sau."
            title="Danh mục đang được cập nhật"
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
