import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import type { PageDefinition } from '@/content/pages';
import type { ContentBlock } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import { InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';
import layoutStyles from './templates.module.css';
import styles from './about-static-template.module.css';

type StaticDefinition = Extract<PageDefinition, { template: 'static' }>;
type HeadingBlock = Extract<ContentBlock, { type: 'heading' }>;
type ParagraphBlock = Extract<ContentBlock, { type: 'paragraph' }>;
type TableBlock = Extract<ContentBlock, { type: 'table' }>;

interface Chapter {
  blocks: ContentBlock[];
  heading: HeadingBlock;
}

const ABOUT_PATHS = [
  '/gioi-thieu/cau-chuyen-gisa',
  '/gioi-thieu/tam-nhin-su-menh',
  '/gioi-thieu/rises-va-sau-tru-cot',
  '/gioi-thieu/linh-vuc-hoat-dong',
] as const;

const PAGE_LABELS: Record<string, string> = {
  '/gioi-thieu/cau-chuyen-gisa': 'Hành trình hình thành',
  '/gioi-thieu/tam-nhin-su-menh': 'Định hướng phát triển',
  '/gioi-thieu/rises-va-sau-tru-cot': 'Hệ giá trị GISA',
  '/gioi-thieu/linh-vuc-hoat-dong': 'Hệ sinh thái hoạt động',
};

function cleanText(text: string) {
  return text.replace(/\s*[–—]\s*/g, ' - ').replace(/\s{2,}/g, ' ').trim();
}

function phrase(text: string) {
  return bindPhrases(cleanText(text));
}

function chaptersFrom(blocks: ContentBlock[]) {
  const introduction: ContentBlock[] = [];
  const chapters: Chapter[] = [];
  let current: Chapter | null = null;

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 2) {
      current = { blocks: [], heading: block };
      chapters.push(current);
    } else if (current) {
      current.blocks.push(block);
    } else {
      introduction.push(block);
    }
  }

  return { chapters, introduction };
}

function firstBlock<T extends ContentBlock['type']>(
  blocks: ContentBlock[],
  type: T,
): Extract<ContentBlock, { type: T }> | undefined {
  return blocks.find((block): block is Extract<ContentBlock, { type: T }> => block.type === type);
}

function renderParagraphs(blocks: ContentBlock[]) {
  return blocks
    .filter((block): block is ParagraphBlock => block.type === 'paragraph')
    .map((block, index) => <p key={`${block.text}-${index}`}>{phrase(block.text)}</p>);
}

function splitPromise(text: string) {
  return cleanText(text).split(/\s+-\s+/).filter(Boolean);
}

function splitLabeledItem(item: string) {
  const cleaned = cleanText(item);
  const separator = cleaned.indexOf(' - ');
  if (separator < 0) return { detail: '', label: cleaned };

  return {
    detail: cleaned.slice(separator + 3).trim(),
    label: cleaned.slice(0, separator).trim(),
  };
}

function StoryLayout({ blocks }: { blocks: ContentBlock[] }) {
  const { chapters, introduction } = chaptersFrom(blocks);
  const leadQuote = firstBlock(introduction, 'quote');
  const promise = leadQuote ? splitPromise(leadQuote.text) : [];

  return (
    <div className={styles.storyLayout}>
      {leadQuote ? (
        <blockquote className={styles.storyLead} data-scroll-motion="reveal">
          <p aria-label={`${promise.join('. ')}.`}>
            {promise.map((step, index) => (
              <span aria-hidden="true" className={styles.storyPromiseStep} key={step}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <strong>{phrase(step)}</strong>
              </span>
            ))}
          </p>
        </blockquote>
      ) : null}
      <div className={styles.storyTimeline}>
        {chapters.map((chapter, index) => {
          const quote = firstBlock(chapter.blocks, 'quote');
          return (
            <section className={styles.storyChapter} data-scroll-motion="reveal" key={chapter.heading.text}>
              <div className={styles.storyChapterHeading}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h2>{phrase(chapter.heading.text)}</h2>
              </div>
              <div className={styles.storyChapterBody}>
                {renderParagraphs(chapter.blocks)}
                {quote ? (
                  <blockquote>
                    <p>{phrase(quote.text)}</p>
                    {quote.attribution ? <cite>{phrase(quote.attribution)}</cite> : null}
                  </blockquote>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function VisionLayout({ blocks }: { blocks: ContentBlock[] }) {
  const { chapters } = chaptersFrom(blocks);
  const mission = chapters.find((chapter) => chapter.heading.text === 'Sứ mệnh');
  const vision = chapters.find((chapter) => chapter.heading.text === 'Tầm nhìn');
  const slogan = chapters.find((chapter) => chapter.heading.text === 'Khẩu hiệu');
  const missionList = mission ? firstBlock(mission.blocks, 'list') : undefined;
  const missionIntro = mission ? firstBlock(mission.blocks, 'paragraph') : undefined;
  const visionQuote = vision ? firstBlock(vision.blocks, 'quote') : undefined;
  const sloganCopy = slogan ? firstBlock(slogan.blocks, 'paragraph') : undefined;

  return (
    <div className={styles.visionLayout}>
      <section className={styles.missionPanel} data-scroll-motion="reveal">
        <h2>{phrase(mission?.heading.text ?? 'Sứ mệnh')}</h2>
        {missionIntro ? <p className={styles.missionIntro}>{phrase(missionIntro.text)}</p> : null}
        {missionList ? (
          <ol className={styles.missionList}>
            {missionList.items.map((item, index) => {
              const { detail, label } = splitLabeledItem(item.replace(':', ' - '));
              return (
                <li key={item}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{phrase(label)}</h3>
                  {detail ? <p>{phrase(detail)}</p> : null}
                </li>
              );
            })}
          </ol>
        ) : null}
      </section>
      <div className={styles.visionColumn}>
        <aside className={styles.visionPanel} data-scroll-motion="reveal">
          <h2>{phrase(vision?.heading.text ?? 'Tầm nhìn')}</h2>
          {visionQuote ? <blockquote>{phrase(visionQuote.text)}</blockquote> : null}
        </aside>
        {sloganCopy ? (
          <section className={styles.sloganPanel} data-scroll-motion="reveal">
            <h2>{phrase(slogan?.heading.text ?? 'Khẩu hiệu')}</h2>
            <p>{phrase(sloganCopy.text)}</p>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function RisesLayout({ blocks }: { blocks: ContentBlock[] }) {
  const { chapters } = chaptersFrom(blocks);
  const values = chapters[0];
  const pillars = chapters[1];
  const intro = values ? firstBlock(values.blocks, 'paragraph') : undefined;
  const valueTable = values ? firstBlock(values.blocks, 'table') : undefined;
  const pillarList = pillars ? firstBlock(pillars.blocks, 'list') : undefined;

  return (
    <div className={styles.risesLayout}>
      <section className={styles.risesIntro} data-scroll-motion="reveal">
        <div>
          <h2>{phrase(values?.heading.text ?? 'Giá trị cốt lõi RISES')}</h2>
          {intro ? <p>{phrase(intro.text)}</p> : null}
        </div>
        {valueTable ? <ValueSequence table={valueTable} /> : null}
      </section>
      {pillarList ? (
        <section className={styles.pillarsSection} data-scroll-motion="reveal">
          <h2>{phrase(pillars?.heading.text ?? 'Sáu trụ cột hoạt động')}</h2>
          <div className={styles.pillarGrid}>
            {pillarList.items.map((item) => {
              const { detail, label } = splitLabeledItem(item);
              return (
                <article key={item}>
                  <h3>{phrase(label)}</h3>
                  {detail ? <p>{phrase(detail)}</p> : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ValueSequence({ table }: { table: TableBlock }) {
  return (
    <ol className={styles.valueSequence}>
      {table.rows.map((row) => (
        <li key={row.join('-')}>
          <strong aria-hidden="true">{phrase(row[0] ?? '')}</strong>
          <div>
            <h3>{phrase(row[1] ?? '')}</h3>
            <p>{phrase(row[2] ?? '')}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function FieldsLayout({ blocks }: { blocks: ContentBlock[] }) {
  const { chapters, introduction } = chaptersFrom(blocks);
  const introductionCopy = firstBlock(introduction, 'paragraph');

  return (
    <div className={styles.fieldsLayout}>
      {introductionCopy ? (
        <p className={styles.fieldsIntro} data-scroll-motion="reveal">{phrase(introductionCopy.text)}</p>
      ) : null}
      <div className={styles.fieldGrid}>
        {chapters.map((chapter) => {
          const summary = firstBlock(chapter.blocks, 'paragraph');
          const tools = firstBlock(chapter.blocks, 'list');
          return (
            <article className={styles.fieldCard} data-scroll-motion="reveal" key={chapter.heading.text}>
              <h2>{phrase(chapter.heading.text)}</h2>
              {summary ? <p>{phrase(summary.text)}</p> : null}
              {tools ? (
                <ul aria-label={`Công cụ ${cleanText(chapter.heading.text).toLocaleLowerCase('vi')}`}>
                  {tools.items.map((item) => <li key={item}>{phrase(item)}</li>)}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function NextAboutPage({ path }: { path: string }) {
  const currentIndex = ABOUT_PATHS.indexOf(path as (typeof ABOUT_PATHS)[number]);
  const nextPath = ABOUT_PATHS[(currentIndex + 1) % ABOUT_PATHS.length] ?? ABOUT_PATHS[0];
  const nextLabel = PAGE_LABELS[nextPath];

  return (
    <nav className={styles.nextPage} aria-label="Nội dung giới thiệu tiếp theo">
      <p>Tiếp tục khám phá GISA</p>
      <Link href={nextPath}>{phrase(nextLabel)}</Link>
    </nav>
  );
}

export function AboutStaticTemplate({
  definition,
  path,
}: {
  definition: StaticDefinition;
  path: string;
}) {
  const profile = profileForPath(path);
  const pageLabel = PAGE_LABELS[path] ?? 'Giới thiệu GISA';

  return (
    <main id="main-content" tabIndex={-1}>
      <article
        className={`${styles.pageContainer} ${layoutStyles.sectionTheme}`}
        data-about-page={path.split('/').at(-1)}
        data-section={profile.section}
      >
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { href: '/gioi-thieu', label: 'Giới thiệu' },
            { label: definition.title },
          ]}
        />
        <InnerPageHero
          description={definition.description}
          eyebrow={pageLabel}
          path={path}
          title={definition.title}
        />
        <SectionSubnav path={path} />

        {path === ABOUT_PATHS[0] ? <StoryLayout blocks={definition.blocks} /> : null}
        {path === ABOUT_PATHS[1] ? <VisionLayout blocks={definition.blocks} /> : null}
        {path === ABOUT_PATHS[2] ? <RisesLayout blocks={definition.blocks} /> : null}
        {path === ABOUT_PATHS[3] ? <FieldsLayout blocks={definition.blocks} /> : null}

        <NextAboutPage path={path} />
      </article>
    </main>
  );
}

export function isAboutStaticPath(path: string) {
  return ABOUT_PATHS.includes(path as (typeof ABOUT_PATHS)[number]);
}
