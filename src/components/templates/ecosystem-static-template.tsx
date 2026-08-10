import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { resolvePublishableAsset } from '@/content/assets';
import type { PageDefinition } from '@/content/pages';
import type { ContentBlock } from '@/content/types';
import { toAnchorId } from '@/lib/anchor-id';
import { bindPhrases } from '@/lib/vietnamese-text';

import { EDITORIAL_EMPTY_COPY } from './editorial-empty-copy';
import { profileForPath, SectionSubnav } from './inner-page-chrome';
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
    actionTitle: 'Bắt đầu từ vấn đề tổ chức đang cần giải quyết',
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
  return text.replace(/\s*[—–]\s*/g, ' - ').replace(/\s{2,}/g, ' ').trim();
}

function vietnameseText(text: string) {
  return bindPhrases(normalizeVisibleText(text));
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
  const separator = normalized.match(/\s+-\s+|:\s+/);
  if (!separator?.index) return { detail: '', title: normalized };

  const detailStart = separator.index + separator[0].length;
  return {
    detail: normalized.slice(detailStart).trim(),
    title: normalized.slice(0, separator.index).trim(),
  };
}

function EditorialList({ items, ordered }: { items: string[]; ordered: boolean }) {
  const List = ordered ? 'ol' : 'ul';

  return (
    <List className={styles.editorialList} data-count={items.length}>
      {items.map((item) => {
        const { detail, title } = splitListItem(item);
        return (
          <li key={item}>
            <strong>{vietnameseText(title)}</strong>
            {detail ? <span>{vietnameseText(detail)}</span> : null}
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

function ChapterSubsections({ subsections }: { subsections: EditorialSubsection[] }) {
  if (subsections.length === 0) return null;

  return (
    <div className={styles.subsectionGrid}>
      {subsections.map((subsection) => (
        <section className={styles.subsection} key={subsection.title}>
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
  const profile = profileForPath(path);

  return (
    <header className={styles.hero} data-scroll-motion="reveal">
      <div className={styles.heroCopy}>
        <p className={styles.heroTopic}>{vietnameseText(topic)}</p>
        <h1>{vietnameseText(definition.title)}</h1>
        <p className={styles.heroDescription}>{vietnameseText(description)}</p>
      </div>
      <figure className={styles.heroVisual} data-scroll-motion="media">
        <Image alt="" fill priority sizes="(max-width: 48rem) 100vw, 34vw" src={profile.image} />
      </figure>
    </header>
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

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <div className={styles.container} data-mode={direction.mode} data-section={profile.section}>
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
          data-has-navigation={chapters.length >= 2 ? 'true' : 'false'}
        >
          <ContentNavigation chapters={chapters} />
          <div className={styles.storyColumn}>
            {introduction.length ? (
              <section className={styles.introduction} aria-label="Giới thiệu">
                <EditorialBlocks blocks={introduction} />
              </section>
            ) : null}

            {chapters.length ? (
              <div className={styles.chapterList}>
                {chapters.map((chapter) => (
                  <section
                    className={styles.chapter}
                    id={toAnchorId(chapter.title)}
                    key={chapter.title}
                  >
                    <header className={styles.chapterHeader}>
                      <h2>{vietnameseText(chapter.title)}</h2>
                    </header>
                    <div className={styles.chapterBody}>
                      <EditorialBlocks blocks={chapter.blocks} />
                      <ChapterSubsections subsections={chapter.subsections} />
                    </div>
                  </section>
                ))}
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
