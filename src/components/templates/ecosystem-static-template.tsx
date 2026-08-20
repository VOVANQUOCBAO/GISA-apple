import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { Icon, type IconName } from '@/components/ui/icon';
import { resolvePublishableAsset } from '@/content/assets';
import type { PageDefinition } from '@/content/pages';
import type { ContentBlock } from '@/content/types';
import { toAnchorId } from '@/lib/anchor-id';
import { bindPhrases } from '@/lib/vietnamese-text';

import { EDITORIAL_EMPTY_COPY } from './editorial-empty-copy';
import { InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';
import styles from './ecosystem-static-template.module.css';

type StaticDefinition = Extract<PageDefinition, { template: 'static' }>;

export interface EcosystemStaticTemplateProps {
  definition: StaticDefinition;
  path: string;
}

type PageMode = 'atlas' | 'community' | 'evidence' | 'network' | 'supporters';

interface PageDirection {
  action: { href: string; label: string };
  actionTitle: string;
  description?: string;
  mode: PageMode;
  topic: string;
}

interface EditorialSubsection {
  blocks: ContentBlock[];
  title: string;
}

interface EditorialChapter {
  blocks: ContentBlock[];
  subsections: EditorialSubsection[];
  title: string;
}

const PAGE_DIRECTIONS: Record<string, PageDirection> = {
  '/nghien-cuu/linh-vuc': {
    action: { href: '/nghien-cuu/du-an', label: 'Xem dự án nghiên cứu' },
    actionTitle: 'Đưa nghiên cứu vào những bài toán thực tế',
    mode: 'atlas',
    topic: 'Nghiên cứu liên ngành',
  },
  '/tu-van/linh-vuc': {
    action: { href: '/dang-ky/tu-van', label: 'Gửi nhu cầu tư vấn' },
    actionTitle: 'Cùng xác định đúng vấn đề, lựa chọn giải pháp và xây dựng lộ trình phù hợp với tổ chức',
    mode: 'atlas',
    topic: 'Năng lực tư vấn',
  },
  '/tu-van/thanh-qua': {
    action: { href: '/tu-van/du-an', label: 'Xem dự án tư vấn' },
    actionTitle: 'Khám phá những dự án tiêu biểu từ hoạt động tư vấn',
    mode: 'evidence',
    topic: 'Kết quả được xác nhận',
  },
  '/mang-luoi/thuc-day-hop-tac': {
    action: { href: '/dang-ky/hop-tac', label: 'Đề nghị hợp tác' },
    actionTitle: 'Cùng mở một hướng hợp tác phù hợp',
    description:
      'Kết nối tri thức, chuyên gia và nguồn lực để cùng phát triển những sáng kiến có giá trị thực tiễn.',
    mode: 'network',
    topic: 'Hệ sinh thái hợp tác',
  },
  '/mang-luoi/quy-nha-tai-tro': {
    action: { href: '/dang-ky/hop-tac', label: 'Đề nghị hợp tác' },
    actionTitle: 'Cùng tạo nguồn lực cho các sáng kiến có tác động',
    mode: 'supporters',
    topic: 'Nguồn lực đồng hành',
  },
  '/cong-dong/trach-nhiem-xa-hoi': {
    action: { href: '/cong-dong/kinh-te-ben-vung', label: 'Khám phá sáng kiến cộng đồng' },
    actionTitle: 'Cùng biến tri thức thành hành động cộng đồng',
    description:
      'Kết nối tri thức và hành động để mở rộng cơ hội, nâng cao an sinh và củng cố năng lực cộng đồng.',
    mode: 'community',
    topic: 'Con người và xã hội',
  },
  '/cong-dong/bao-ve-moi-truong': {
    action: { href: '/cong-dong/kinh-te-ben-vung', label: 'Khám phá sáng kiến cộng đồng' },
    actionTitle: 'Cùng đưa lựa chọn xanh vào đời sống hằng ngày',
    description:
      'Thúc đẩy lựa chọn xanh, phục hồi hệ sinh thái và tăng khả năng thích ứng của cộng đồng trước biến đổi khí hậu.',
    mode: 'community',
    topic: 'Môi trường và khí hậu',
  },
  '/cong-dong/quan-tri-hieu-qua': {
    action: { href: '/cong-dong/kinh-te-ben-vung', label: 'Khám phá sáng kiến cộng đồng' },
    actionTitle: 'Cùng xây dựng cách quản trị minh bạch và bền vững',
    description:
      'Đưa minh bạch, dữ liệu và trách nhiệm vào cách tổ chức ra quyết định và tạo giá trị bền vững.',
    mode: 'community',
    topic: 'Quản trị bền vững',
  },
};

export const ECOSYSTEM_STATIC_PATHS = Object.freeze(Object.keys(PAGE_DIRECTIONS));

export function supportsEcosystemStaticTemplate(path: string) {
  return path in PAGE_DIRECTIONS;
}

function normalizeVisibleText(text: string) {
  return text.replace(/\s{2,}/g, ' ').trim();
}

function vietnameseText(text: string) {
  return bindPhrases(normalizeVisibleText(text));
}

function chapterHeadingText(text: string) {
  if (normalizeVisibleText(text) === 'Kinh tế quốc tế và năng lực cạnh tranh toàn cầu') {
    return (
      <>
        <span className={styles.chapterTitleLine}>Kinh tế quốc tế và</span>
        {' '}
        <span className={styles.chapterTitleLine}>năng lực cạnh tranh toàn cầu</span>
      </>
    );
  }

  return vietnameseText(text);
}

function splitEditorialBlocks(blocks: ContentBlock[]) {
  const introduction: ContentBlock[] = [];
  const chapters: EditorialChapter[] = [];
  let chapter: EditorialChapter | null = null;
  let subsection: EditorialSubsection | null = null;

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 2) {
      chapter = { blocks: [], subsections: [], title: block.text };
      chapters.push(chapter);
      subsection = null;
      continue;
    }

    if (block.type === 'heading' && block.level === 3 && chapter) {
      subsection = { blocks: [], title: block.text };
      chapter.subsections.push(subsection);
      continue;
    }

    if (subsection) subsection.blocks.push(block);
    else if (chapter) chapter.blocks.push(block);
    else introduction.push(block);
  }

  return { chapters, introduction };
}

function splitListItem(text: string) {
  const normalized = normalizeVisibleText(text);
  const separator = normalized.match(/\s+[—–-]\s+|:\s+/);
  if (!separator?.index) return { detail: '', separator: '', title: normalized };

  const detailStart = separator.index + separator[0].length;
  return {
    detail: normalized.slice(detailStart).trim(),
    separator: separator[0].trim(),
    title: normalized.slice(0, separator.index).trim(),
  };
}

/* Mỗi mục trong danh sách lĩnh vực nhận một biểu tượng theo đúng chủ đề của nó,
   bắt bằng từ khóa trong chính tiêu đề mục. Quy tắc xếp từ hẹp tới rộng và dừng
   ở cái khớp đầu tiên, nên "chuỗi cung ứng số" ăn luật chuỗi cung ứng chứ không
   rơi vào luật "số". Không khớp luật nào thì quay về la bàn — trung tính, không
   gợi sai chủ đề. */
const TOPIC_ICON_RULES: Array<{ accent: string; icon: IconName; match: RegExp }> = [
  { icon: 'network', accent: '#1765aa', match: /hợp tác|đối tác|chuỗi (giá trị|cung ứng)|logistics|phân phối|mạng lưới/i },
  { icon: 'leaf', accent: '#32a65a', match: /bền vững|môi trường|khí hậu|tuần hoàn|carbon|phát thải|xanh|sinh thái|nông nghiệp|hữu cơ/i },
  { icon: 'cpu', accent: '#7b3fd4', match: /công nghệ|chuyển đổi số|kỹ thuật số|AI|IoT|blockchain|dữ liệu|tự động/i },
  { icon: 'users', accent: '#e02f6b', match: /tâm lý|hành vi|nhân sự|tài năng|đội ngũ|cảm xúc|sức khỏe|con người|khách hàng|tiêu dùng|cộng đồng/i },
  { icon: 'chart', accent: '#ef7d18', match: /kinh tế|tài chính|đầu tư|thị trường|chi phí|giá|chỉ số|xếp hạng|hiệu suất|cạnh tranh|thương mại|FDI|FTA/i },
  { icon: 'lightbulb', accent: '#f15b2a', match: /đổi mới|sáng tạo|khởi nghiệp|đột phá|mô hình kinh doanh/i },
  { icon: 'book', accent: '#0f9d9d', match: /chính sách|pháp|quy định|tiêu chuẩn|đào tạo|giáo dục|tri thức|nghiên cứu/i },
  { icon: 'buildings', accent: '#3f5bd4', match: /doanh nghiệp|tổ chức|quản trị|quản lý|lãnh đạo|chiến lược|ESG|CSR|CSV/i },
  { icon: 'globe', accent: '#0b6a72', match: /toàn cầu|quốc tế|hợp tác|xuyên biên giới/i },
];

function topicIcon(title: string): { accent: string; icon: IconName } {
  const rule = TOPIC_ICON_RULES.find((candidate) => candidate.match.test(title));
  return rule ?? { accent: '#0b6a72', icon: 'compass' };
}

function EditorialList({ items, ordered }: { items: string[]; ordered: boolean }) {
  const List = ordered ? 'ol' : 'ul';

  return (
    <List className={styles.editorialList} data-count={items.length}>
      {items.map((item) => {
        const { detail, separator, title } = splitListItem(item);
        const { accent, icon } = topicIcon(title);
        return (
          <li key={item} style={{ '--topic-accent': accent } as CSSProperties}>
            <span aria-hidden="true" className={styles.topicIcon}>
              <Icon name={icon} size={20} weight="fill" />
            </span>
            <strong>{vietnameseText(title)}</strong>
            {detail ? (
              <span className={styles.topicDetail}>
                {` ${separator} `}
                {vietnameseText(detail)}
              </span>
            ) : null}
          </li>
        );
      })}
    </List>
  );
}

function LinkCollection({ links }: { links: Array<{ href: string; label: string }> }) {
  return (
    <ul className={styles.linkCollection}>
      {links.map((link) => {
        const external = /^https?:\/\//.test(link.href);
        return (
          <li key={link.href}>
            <a
              href={link.href}
              rel={external ? 'noreferrer' : undefined}
              target={external ? '_blank' : undefined}
            >
              <span>{vietnameseText(link.label)}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function EditorialBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === 'paragraph') {
          return <p key={key}>{vietnameseText(block.text)}</p>;
        }

        if (block.type === 'list') {
          return <EditorialList items={block.items} key={key} ordered={block.ordered} />;
        }

        if (block.type === 'quote') {
          return (
            <blockquote key={key}>
              <p>{vietnameseText(block.text)}</p>
              {block.attribution ? <cite>{vietnameseText(block.attribution)}</cite> : null}
            </blockquote>
          );
        }

        if (block.type === 'linkGroup') {
          return <LinkCollection key={key} links={block.links} />;
        }

        if (block.type === 'table') {
          return (
            <div className={styles.tableFrame} key={key}>
              <table>
                {block.headers.length ? (
                  <thead>
                    <tr>{block.headers.map((header) => <th key={header}>{vietnameseText(header)}</th>)}</tr>
                  </thead>
                ) : null}
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${key}-${rowIndex}`}>
                      {row.map((cell, cellIndex) => <td key={`${key}-${rowIndex}-${cellIndex}`}>{vietnameseText(cell)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'video') {
          return <p key={key}><a href={block.externalUrl}>{vietnameseText(block.title)}</a></p>;
        }

        if (block.type === 'image') {
          const asset = resolvePublishableAsset(block.assetId);
          if (!asset) return block.caption ? <p key={key}>{vietnameseText(block.caption)}</p> : null;

          return (
            <figure className={styles.figure} key={key}>
              {asset.width && asset.height ? (
                <Image
                  alt={asset.alt}
                  height={asset.height}
                  sizes="(max-width: 48rem) 100vw, 64rem"
                  src={asset.publicPath}
                  width={asset.width}
                />
              ) : (
                <span className={styles.figureFrame}>
                  <Image alt={asset.alt} fill sizes="(max-width: 48rem) 100vw, 64rem" src={asset.publicPath} />
                </span>
              )}
              {block.caption ? <figcaption>{vietnameseText(block.caption)}</figcaption> : null}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
}

const SUBSECTION_ICONS: Record<PageMode, IconName[]> = {
  atlas: ['microscope', 'chart', 'compass', 'lightbulb'],
  community: ['users', 'leaf', 'globe', 'chart'],
  evidence: ['check', 'chart', 'presentation', 'clipboard'],
  network: ['network', 'users', 'globe', 'buildings'],
  supporters: ['buildings', 'users', 'leaf', 'globe'],
};

const NETWORK_VISUALS = [
  {
    alt: 'Nhóm chuyên gia trao đổi để xây dựng định hướng hợp tác',
    src: '/images/knowledge-journey/consulting-workshop-editorial.png',
  },
  {
    alt: 'Đội ngũ GISA làm việc trong không gian kết nối tri thức',
    src: '/images/hero-gisa-team.png',
  },
  {
    alt: 'Chuyên gia quốc tế trao đổi trong chương trình hợp tác',
    src: '/images/gisa-consulting-hero.png',
  },
  {
    alt: 'Cộng đồng cùng tham gia hoạt động tạo tác động bền vững',
    src: '/images/knowledge-journey/community-action-editorial.png',
  },
] as const;

const COMMUNITY_VISUALS = [
  {
    alt: 'Cộng đồng cùng tham gia hoạt động tạo tác động bền vững',
    src: '/images/knowledge-journey/community-action-editorial.png',
  },
  {
    alt: 'Không gian đô thị xanh gắn với chất lượng sống cộng đồng',
    src: '/images/article-green-city.png',
  },
  {
    alt: 'Năng lượng tái tạo góp phần bảo vệ môi trường và khí hậu',
    src: '/images/article-renewables.png',
  },
  {
    alt: 'Báo cáo ESG hỗ trợ quản trị minh bạch và có trách nhiệm',
    src: '/images/article-esg-report.png',
  },
] as const;

function subsectionVisuals(mode: PageMode) {
  if (mode === 'network' || mode === 'supporters') return NETWORK_VISUALS;
  if (mode === 'community') return COMMUNITY_VISUALS;
  return undefined;
}

const ATLAS_VISUALS: Record<string, ReadonlyArray<{ alt: string; src: string }>> = {
  '/nghien-cuu/linh-vuc': [
    { alt: 'Đô thị xanh và các giải pháp phát triển bền vững', src: '/images/article-green-city.png' },
    { alt: 'Phân tích dữ liệu phục vụ quản lý và kinh doanh', src: '/images/article-performance-benchmarking.png' },
    { alt: 'Công nghệ trí tuệ nhân tạo và hành vi người dùng', src: '/images/article-ai-chatbot.png' },
    { alt: 'Chuỗi giá trị nông nghiệp và sinh kế nông thôn', src: '/images/article-da-xanh-pomelo.png' },
    { alt: 'Năng lượng tái tạo và kinh tế tài nguyên', src: '/images/article-renewables.png' },
    { alt: 'Báo cáo ESG và năng lực cạnh tranh toàn cầu', src: '/images/article-esg-report.png' },
  ],
  '/tu-van/linh-vuc': [
    { alt: 'Chuyên gia GISA trao đổi về chiến lược phát triển bền vững', src: '/images/gisa-consulting-hero.png' },
    { alt: 'Nhóm chuyên gia xây dựng chiến lược quản trị', src: '/images/hero-gisa-strategy-table.png' },
    { alt: 'Phiên làm việc tư vấn hành vi và phát triển tổ chức', src: '/images/knowledge-journey/consulting-workshop-editorial.png' },
    { alt: 'Đội ngũ cùng phát triển năng lực tổ chức', src: '/images/hero-gisa-team.png' },
    { alt: 'Phân tích chuỗi giá trị thực phẩm và nông nghiệp', src: '/images/article-food-quality-programs.png' },
    { alt: 'Tư vấn chính sách cho tăng trưởng xanh', src: '/images/article-green-city.png' },
  ],
};

function ChapterSubsections({
  mode,
  subsections,
}: {
  mode: PageMode;
  subsections: EditorialSubsection[];
}) {
  if (subsections.length === 0) return null;
  const visuals = subsectionVisuals(mode);

  return (
    <div className={styles.subsectionGrid}>
      {subsections.map((subsection, index) => (
        <section className={styles.subsection} data-index={index % 4} key={subsection.title}>
          {visuals ? (
            <figure className={styles.subsectionVisual}>
              <Image
                alt={visuals[index % visuals.length]?.alt ?? 'Hoạt động tạo tác động của GISA'}
                fill
                sizes="(max-width: 48rem) 94vw, 42rem"
                src={visuals[index % visuals.length]?.src ?? visuals[0].src}
              />
            </figure>
          ) : null}
          <span aria-hidden="true" className={styles.subsectionIcon}>
            <Icon name={SUBSECTION_ICONS[mode][index % SUBSECTION_ICONS[mode].length] ?? 'compass'} size={26} />
          </span>
          <h3>{vietnameseText(subsection.title)}</h3>
          <EditorialBlocks blocks={subsection.blocks} />
        </section>
      ))}
    </div>
  );
}

function PageHero({
  definition,
  description,
  path,
  topic,
}: {
  definition: StaticDefinition;
  description: string;
  path: string;
  topic: string;
}) {
  return (
    <InnerPageHero
      description={description}
      eyebrow={topic}
      path={path}
      title={definition.title}
    />
  );
}

function ContentNavigation({ chapters }: { chapters: EditorialChapter[] }) {
  if (chapters.length < 2) return null;

  return (
    <nav className={styles.contentNavigation} aria-label="Nội dung trong trang">
      <p>Khám phá nội dung</p>
      <ul>
        {chapters.map((chapter) => (
          <li key={chapter.title}>
            <a href={`#${toAnchorId(chapter.title)}`}>{vietnameseText(chapter.title)}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ActionClosure({
  action,
  title,
}: {
  action: PageDirection['action'];
  title: string;
}) {
  return (
    <section className={styles.actionClosure} aria-label="Bước tiếp theo">
      <div>
        <p>Tiếp tục cùng GISA</p>
        <h2>{vietnameseText(title)}</h2>
      </div>
      <Link href={action.href}>{vietnameseText(action.label)}</Link>
    </section>
  );
}

export function EcosystemStaticTemplate({
  definition,
  path,
}: EcosystemStaticTemplateProps) {
  const direction = PAGE_DIRECTIONS[path];
  if (!direction) return null;

  const profile = profileForPath(path);
  const { chapters, introduction } = splitEditorialBlocks(definition.blocks);
  const description = direction.description ?? definition.description;
  const showContentNavigation = direction.mode === 'evidence' && chapters.length >= 2;

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <div
        className={styles.container}
        data-mode={direction.mode}
        data-page={path.split('/').at(-1)}
        data-section={profile.section}
      >
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { href: profile.root, label: profile.label },
            { label: definition.title },
          ]}
        />
        <PageHero
          definition={definition}
          description={description}
          path={path}
          topic={direction.topic}
        />
        <SectionSubnav path={path} />

        <section
          className={styles.editorialStage}
          aria-label={`Nội dung ${definition.title}`}
          data-has-navigation={showContentNavigation ? 'true' : 'false'}
        >
          {showContentNavigation ? <ContentNavigation chapters={chapters} /> : null}
          <div className={styles.storyColumn}>
            {introduction.length ? (
              <section className={styles.introduction} aria-label="Giới thiệu">
                <EditorialBlocks blocks={introduction} />
              </section>
            ) : null}

            {chapters.length ? (
              <div className={styles.chapterList}>
                {chapters.map((chapter, index) => {
                  const visual = direction.mode === 'atlas'
                    ? ATLAS_VISUALS[path]?.[index]
                    : undefined;
                  const chapterLead = chapter.blocks[0]?.type === 'paragraph'
                    ? chapter.blocks[0]
                    : undefined;
                  const chapterBlocks = chapterLead
                    ? chapter.blocks.slice(1)
                    : chapter.blocks;
                  const chapterTopic = topicIcon(chapter.title);

                  return (
                  <section
                    className={styles.chapter}
                    data-chapter-index={index}
                    id={toAnchorId(chapter.title)}
                    key={chapter.title}
                  >
                    <header className={styles.chapterHeader}>
                      {visual ? (
                        <figure className={styles.chapterVisual}>
                          <Image
                            alt={visual.alt}
                            fill
                            sizes="(max-width: 72rem) 94vw, 46vw"
                            src={visual.src}
                          />
                        </figure>
                      ) : null}
                      <div
                        className={styles.chapterTitle}
                        style={{ '--topic-accent': chapterTopic.accent } as CSSProperties}
                      >
                        <span aria-hidden="true" className={styles.chapterTitleIcon}>
                          <Icon name={chapterTopic.icon} size={24} weight="duotone" />
                        </span>
                        <span aria-hidden="true" className={styles.chapterNumber}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2>{chapterHeadingText(chapter.title)}</h2>
                        {chapterLead ? (
                          <p className={styles.chapterLead}>{vietnameseText(chapterLead.text)}</p>
                        ) : null}
                      </div>
                    </header>
                    <div className={styles.chapterBody}>
                      <EditorialBlocks blocks={chapterBlocks} />
                      <ChapterSubsections mode={direction.mode} subsections={chapter.subsections} />
                    </div>
                  </section>
                  );
                })}
              </div>
            ) : null}

            {!introduction.length && !chapters.length ? (
              <p className={styles.emptyState}>{EDITORIAL_EMPTY_COPY.static}</p>
            ) : null}
          </div>
        </section>

        <ActionClosure action={direction.action} title={direction.actionTitle} />
      </div>
    </main>
  );
}
