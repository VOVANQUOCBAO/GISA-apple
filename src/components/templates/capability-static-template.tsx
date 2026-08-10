import { Breadcrumbs } from '@/components/site/breadcrumbs';
import type { PageDefinition } from '@/content/pages';
import type { ContentBlock } from '@/content/types';
import { toAnchorId } from '@/lib/anchor-id';
import { bindPhrases } from '@/lib/vietnamese-text';

import { ContentBlocks } from './content-blocks';
import { InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';
import layoutStyles from './templates.module.css';
import styles from './capability-static-template.module.css';

type StaticDefinition = Extract<PageDefinition, { template: 'static' }>;

interface Chapter {
  blocks: ContentBlock[];
  title: string;
}

interface Subtopic {
  blocks: ContentBlock[];
  title: string;
}

function normalizeVisibleText(text: string) {
  return text.replace(/\s*[–—]\s*/g, ' - ');
}

function normalizeBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((block) => {
    if (block.type === 'paragraph') {
      return { ...block, text: normalizeVisibleText(block.text) };
    }
    if (block.type === 'heading') {
      return { ...block, text: normalizeVisibleText(block.text) };
    }
    if (block.type === 'list') {
      return { ...block, items: block.items.map(normalizeVisibleText) };
    }
    if (block.type === 'quote') {
      return {
        ...block,
        attribution: block.attribution
          ? normalizeVisibleText(block.attribution)
          : undefined,
        text: normalizeVisibleText(block.text),
      };
    }
    if (block.type === 'image') {
      return {
        ...block,
        caption: block.caption ? normalizeVisibleText(block.caption) : undefined,
      };
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
        links: block.links.map((link) => ({
          ...link,
          label: normalizeVisibleText(link.label),
        })),
      };
    }
    return { ...block, title: normalizeVisibleText(block.title) };
  });
}

function splitChapters(blocks: ContentBlock[]) {
  const introduction: ContentBlock[] = [];
  const chapters: Chapter[] = [];
  let current: Chapter | null = null;

  for (const block of normalizeBlocks(blocks)) {
    if (block.type === 'heading' && block.level === 2) {
      current = { blocks: [], title: block.text };
      chapters.push(current);
    } else if (current) {
      current.blocks.push(block);
    } else {
      introduction.push(block);
    }
  }

  return { chapters, introduction };
}

function splitSubtopics(blocks: ContentBlock[]) {
  const introduction: ContentBlock[] = [];
  const subtopics: Subtopic[] = [];
  let current: Subtopic | null = null;

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 3) {
      current = { blocks: [], title: block.text };
      subtopics.push(current);
    } else if (current) {
      current.blocks.push(block);
    } else {
      introduction.push(block);
    }
  }

  return { introduction, subtopics };
}

function ChapterNavigation({ chapters }: { chapters: Chapter[] }) {
  if (chapters.length < 2) return null;

  return (
    <nav className={styles.chapterNavigation} aria-label="Nội dung trong trang">
      <p>Khám phá nội dung</p>
      <ul>
        {chapters.map((chapter) => (
          <li key={chapter.title}>
            <a href={`#${toAnchorId(chapter.title)}`}>{bindPhrases(chapter.title)}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TrainingChapter({ chapter }: { chapter: Chapter }) {
  const { introduction, subtopics } = splitSubtopics(chapter.blocks);
  const hasCurriculum = subtopics.length > 0;

  return (
    <section
      className={styles.trainingChapter}
      data-curriculum={hasCurriculum ? 'true' : 'false'}
      data-scroll-motion="reveal"
      id={toAnchorId(chapter.title)}
    >
      <h2>{bindPhrases(chapter.title)}</h2>
      {introduction.length > 0 ? (
        <div className={styles.chapterContent}>
          <ContentBlocks blocks={introduction} />
        </div>
      ) : null}
      {hasCurriculum ? (
        <div className={styles.curriculumGrid}>
          {subtopics.map((subtopic) => (
            <article className={styles.curriculumItem} key={subtopic.title}>
              <h3>{bindPhrases(subtopic.title)}</h3>
              <ContentBlocks blocks={subtopic.blocks} />
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function TrainingBody({ chapters, introduction }: ReturnType<typeof splitChapters>) {
  return (
    <section className={styles.capabilityFrame} aria-label="Hành trình phát triển năng lực">
      <aside className={styles.contextRail}>
        <p className={styles.contextTitle}>Hành trình năng lực</p>
        <p className={styles.contextCopy}>
          Từ nền tảng chuyên môn đến khả năng dẫn dắt và tạo giá trị dài hạn.
        </p>
        <ChapterNavigation chapters={chapters} />
      </aside>
      <div className={styles.trainingBody}>
        {introduction.length > 0 ? (
          <div className={styles.trainingOpening} data-scroll-motion="reveal">
            <ContentBlocks blocks={introduction} />
          </div>
        ) : null}
        {chapters.map((chapter) => (
          <TrainingChapter chapter={chapter} key={chapter.title} />
        ))}
      </div>
    </section>
  );
}

function ApplicationChapter({ chapter }: { chapter: Chapter }) {
  const { introduction, subtopics } = splitSubtopics(chapter.blocks);

  return (
    <section
      className={styles.applicationChapter}
      data-scroll-motion="reveal"
      id={toAnchorId(chapter.title)}
    >
      <header className={styles.applicationChapterHeader}>
        <h2>{bindPhrases(chapter.title)}</h2>
        {introduction.length > 0 ? <ContentBlocks blocks={introduction} /> : null}
      </header>
      {subtopics.length > 0 ? (
        <div className={styles.applicationGrid}>
          {subtopics.map((subtopic) => (
            <article className={styles.applicationItem} key={subtopic.title}>
              <h3>{bindPhrases(subtopic.title)}</h3>
              <ContentBlocks blocks={subtopic.blocks} />
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.applicationContent}>
          <ContentBlocks blocks={chapter.blocks} />
        </div>
      )}
    </section>
  );
}

function ApplicationBody({ chapters, introduction }: ReturnType<typeof splitChapters>) {
  return (
    <section className={styles.applicationBody} aria-label="Cách tri thức được đưa vào thực tiễn">
      <div className={styles.applicationLead} data-scroll-motion="reveal">
        {introduction.length > 0 ? <ContentBlocks blocks={introduction} /> : null}
        <dl className={styles.applicationLens}>
          <div>
            <dt>Bối cảnh</dt>
            <dd>Nhìn rõ nhu cầu và điều kiện thực tế.</dd>
          </div>
          <div>
            <dt>Cách tiếp cận</dt>
            <dd>Kết nối tri thức với công cụ triển khai.</dd>
          </div>
          <div>
            <dt>Giá trị</dt>
            <dd>Theo dõi thay đổi trong tổ chức và cộng đồng.</dd>
          </div>
        </dl>
      </div>
      <div className={styles.applicationChapters}>
        {chapters.map((chapter) => (
          <ApplicationChapter chapter={chapter} key={chapter.title} />
        ))}
      </div>
    </section>
  );
}

export function CapabilityStaticTemplate({
  definition,
  path,
}: {
  definition: StaticDefinition;
  path: string;
}) {
  const content = splitChapters(definition.blocks);
  const isTraining = path.startsWith('/dao-tao/');
  const root = isTraining
    ? { href: '/dao-tao', label: 'Đào tạo' }
    : { href: '/ung-dung', label: 'Ứng dụng' };
  const profile = profileForPath(path);

  return (
    <main id="main-content" tabIndex={-1}>
      <div
        className={`${styles.pageContainer} ${layoutStyles.sectionTheme}`}
        data-capability={isTraining ? 'training' : 'application'}
        data-page={path.split('/').at(-1)}
        data-section={profile.section}
      >
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            root,
            { label: definition.title },
          ]}
        />
        <InnerPageHero
          description={definition.description}
          eyebrow={isTraining ? 'Phát triển năng lực' : 'Tri thức trong thực tiễn'}
          path={path}
          title={definition.title}
        />
        <SectionSubnav path={path} />

        {isTraining ? <TrainingBody {...content} /> : <ApplicationBody {...content} />}
      </div>
    </main>
  );
}
