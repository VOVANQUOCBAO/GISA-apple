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
import styles from './knowledge-practice-listing-template.module.css';
import layoutStyles from './templates.module.css';

type ListingDefinition = Extract<PageDefinition, { template: 'listing' }>;

export interface KnowledgePracticeListingTemplateProps {
  definition: ListingDefinition;
  path: string;
  result: PaginatedResult<ContentSummary>;
  searchParams: UrlQuery;
}

interface Direction {
  action?: { href: string; label: string };
  eyebrow: string;
  introduction?: string;
  sectionTitle: string;
  tone: 'consulting' | 'research' | 'tools';
}

const DIRECTIONS: Record<string, Direction> = {
  '/nghien-cuu/du-an': {
    eyebrow: 'Danh mục nghiên cứu',
    sectionTitle: 'Từ câu hỏi nghiên cứu đến bằng chứng ứng dụng',
    tone: 'research',
  },
  '/tu-van/du-an': {
    action: { href: '/dang-ky/tu-van', label: 'Trao đổi nhu cầu tư vấn' },
    eyebrow: 'Hồ sơ đồng hành',
    introduction:
      'Các dự án cho thấy cách GISA đọc bối cảnh, lựa chọn phương pháp và đồng hành cùng tổ chức trong quá trình đưa giải pháp vào thực tiễn.',
    sectionTitle: 'Từ vấn đề tổ chức đến thay đổi có thể kiểm chứng',
    tone: 'consulting',
  },
  '/tu-van/cong-cu': {
    eyebrow: 'Bộ công cụ thực hành',
    sectionTitle: 'Chọn công cụ theo quyết định cần hỗ trợ',
    tone: 'tools',
  },
};

export function supportsKnowledgePracticeListing(path: string) {
  return path in DIRECTIONS;
}

function visibleText(text: string) {
  return bindPhrases(text.replace(/\s*[—–]\s*/g, ' · ').replace(/\s{2,}/g, ' ').trim());
}

function metadataText(item: ContentSummary, key: string) {
  const value = item.metadata[key];
  return Array.isArray(value) ? value.join(', ') : value;
}

function ProjectEntry({ index, item }: { index: number; item: ContentSummary }) {
  const topic = metadataText(item, 'topic');
  const projectType = metadataText(item, 'projectType');
  const logo = metadataText(item, 'logo');
  const projectMeta = [projectType, topic].filter(Boolean).join(' · ');

  return (
    <article className={styles.projectEntry}>
      <div className={styles.projectVisual}>
        {item.image ? (
          <Image
            alt={item.image.alt}
            fill
            sizes="(max-width: 48rem) 94vw, (max-width: 72rem) 46vw, 34rem"
            src={item.image.src}
          />
        ) : (
          <div aria-hidden="true" className={styles.projectFallback}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <i />
          </div>
        )}
        {logo ? (
          <span aria-hidden="true" className={styles.projectLogo}>
            <Image alt="" fill sizes="10rem" src={logo} />
          </span>
        ) : null}
      </div>
      <div className={styles.projectCopy}>
        {projectMeta ? <p className={styles.projectMeta}>{visibleText(projectMeta)}</p> : null}
        <h3><Link href={item.path}>{visibleText(item.title)}</Link></h3>
        <p className={styles.projectSummary}>{visibleText(item.summary)}</p>
        <Link className={styles.textLink} href={item.path}>Đọc hồ sơ dự án</Link>
      </div>
    </article>
  );
}

const TOOL_ICONS: IconName[] = [
  'compass',
  'microscope',
  'users',
  'leaf',
  'training',
  'lightbulb',
];

const TOOL_VISUALS = [
  { alt: 'Nhóm chuyên gia phân tích chiến lược và hoạch định chính sách', src: '/images/hero-gisa-strategy-table.png' },
  { alt: 'Phân tích dữ liệu phục vụ nghiên cứu và đánh giá', src: '/images/article-performance-benchmarking.png' },
  { alt: 'Đội ngũ phát triển tổ chức và năng lực nhân sự', src: '/images/hero-gisa-team.png' },
  { alt: 'Phân tích ESG và giải pháp phát triển bền vững', src: '/images/article-esg-report.png' },
  { alt: 'Hoạt động huấn luyện và cố vấn chuyên môn', src: '/images/knowledge-journey/consulting-workshop-editorial.png' },
  { alt: 'Công nghệ hỗ trợ thiết kế và đổi mới sáng tạo', src: '/images/article-ai-chatbot.png' },
] as const;

function toolVisualFor(item: ContentSummary, group: string | undefined) {
  const label = `${group ?? ''} ${item.title}`.toLocaleLowerCase('vi');
  if (label.includes('nghiên cứu') || label.includes('đánh giá')) return TOOL_VISUALS[1];
  if (label.includes('tổ chức') || label.includes('nhân sự')) return TOOL_VISUALS[2];
  if (label.includes('bền vững') || label.includes('esg')) return TOOL_VISUALS[3];
  if (label.includes('huấn luyện') || label.includes('cố vấn')) return TOOL_VISUALS[4];
  if (label.includes('thiết kế') || label.includes('đổi mới')) return TOOL_VISUALS[5];
  return TOOL_VISUALS[0];
}

function ToolEntry({ index, item }: { index: number; item: ContentSummary }) {
  const count = metadataText(item, 'toolCount');
  const group = metadataText(item, 'group');
  const icon = TOOL_ICONS[index % TOOL_ICONS.length] ?? 'clipboard';
  const visual = toolVisualFor(item, group);

  return (
    <article className={styles.toolEntry}>
      <div className={styles.toolVisual}>
        <Image alt={visual.alt} fill sizes="(max-width: 48rem) 94vw, 46vw" src={visual.src} />
        <span aria-hidden="true" className={styles.toolVisualShade} />
        <span aria-hidden="true" className={styles.toolVisualIcon}><Icon name={icon} size={28} /></span>
        <span aria-hidden="true" className={styles.toolVisualNumber}>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <header>
        <span>{visibleText(group ?? 'Nhóm công cụ tư vấn')}</span>
        {count ? <p><strong>{count}</strong> công cụ</p> : null}
      </header>
      <div>
        <h3><Link href={item.path}>{visibleText(item.title)}</Link></h3>
        <p>{visibleText(item.summary)}</p>
      </div>
      <Link className={styles.textLink} href={item.path}>Xem cách sử dụng</Link>
    </article>
  );
}

export function KnowledgePracticeListingTemplate({
  definition,
  path,
  result,
  searchParams,
}: KnowledgePracticeListingTemplateProps) {
  const direction = DIRECTIONS[path];
  if (!direction) return null;

  const profile = profileForPath(path);
  const availableFilters = Object.fromEntries(
    definition.filters
      .filter((key) => result.availableFilters[key]?.length)
      .map((key) => [key, result.availableFilters[key]]),
  );
  const hasAvailableFilters = Object.keys(availableFilters).length > 0;
  const hasQuery = Boolean(typeof searchParams.q === 'string' && searchParams.q.trim());
  const hasFilters = definition.filters.some((key) => Boolean(searchParams[key]));
  const scopeValues = Object.values(definition.fixedFilters ?? {});
  const resultCount = result.total.toLocaleString('vi-VN');

  return (
    <main id="main-content" tabIndex={-1}>
      <div
        className={`${styles.pageContainer} ${layoutStyles.sectionTheme}`}
        data-section={profile.section}
        data-tone={direction.tone}
      >
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { href: profile.root, label: profile.label },
            { label: definition.title },
          ]}
        />
        <InnerPageHero
          description={definition.description}
          eyebrow={direction.eyebrow}
          meta={<p aria-live="polite"><strong>{resultCount}</strong> nội dung</p>}
          path={path}
          title={definition.title}
        />
        <SectionSubnav path={path} />

        <section
          className={styles.editorialLead}
          aria-labelledby="practice-listing-title"
          data-centered={!direction.introduction || !direction.action ? 'true' : undefined}
        >
          <div>
            <p>{direction.eyebrow}</p>
            <h2 id="practice-listing-title">{visibleText(direction.sectionTitle)}</h2>
          </div>
          {direction.introduction && direction.action ? (
            <div>
              <p>{visibleText(direction.introduction)}</p>
              <Link href={direction.action.href}>{direction.action.label}</Link>
            </div>
          ) : null}
        </section>

        {hasAvailableFilters ? (
          <section className={styles.filterStage} aria-label="Lọc nội dung">
            <FilterBar filters={availableFilters} path={path} query={searchParams} />
          </section>
        ) : null}

        {result.items.length > 0 ? (
          direction.tone === 'tools' ? (
            <ol className={styles.toolGrid} aria-label={definition.title}>
              {result.items.map((item, index) => (
                <li key={item.id}><ToolEntry index={index} item={item} /></li>
              ))}
            </ol>
          ) : (
            <ol className={styles.projectList} aria-label={definition.title}>
              {result.items.map((item, index) => (
                <li key={item.id}><ProjectEntry index={index} item={item} /></li>
              ))}
            </ol>
          )
        ) : hasQuery || hasFilters ? (
          <EmptyState
            action={<ButtonLink href={path}>Xóa bộ lọc</ButtonLink>}
            description={EDITORIAL_EMPTY_COPY.filtered.description}
            title={EDITORIAL_EMPTY_COPY.filtered.title}
          />
        ) : scopeValues.length > 0 ? (
          <EmptyState
            action={direction.action ? (
              <ButtonLink href={direction.action.href}>{direction.action.label}</ButtonLink>
            ) : undefined}
            description={EDITORIAL_EMPTY_COPY.scope.description}
            title={EDITORIAL_EMPTY_COPY.scope.title}
          />
        ) : (
          <EmptyState
            description={EDITORIAL_EMPTY_COPY.pending.description}
            title={EDITORIAL_EMPTY_COPY.pending.title}
          />
        )}

        <Pagination page={result.page} pageCount={result.pageCount} path={path} query={searchParams} />
      </div>
    </main>
  );
}
