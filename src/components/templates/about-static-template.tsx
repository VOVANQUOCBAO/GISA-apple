import Link from 'next/link';
import type { CSSProperties } from 'react';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { Icon, type IconName } from '@/components/ui/icon';
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
  '/gioi-thieu/linh-vuc-hoat-dong',
] as const;

const STORY_PATH = ABOUT_PATHS[0];
const FIELDS_PATH = ABOUT_PATHS[1];
const STORY_CHAPTERS = new Set([
  'Bối cảnh và vấn đề đặt ra',
  'Động lực hình thành',
  'Giới thiệu về GISA',
]);
const STORY_ICONS: IconName[] = ['compass', 'rocket', 'buildings'];
const STORY_COLORS = ['#0b7a78', '#e66f2d', '#3469b0'];
/* Trùng bộ biểu tượng và bảng màu với sáu cam kết ở trang chủ, để hai nơi nói
   về cùng một thứ thì trông cũng phải là cùng một thứ. */
const MISSION_ICONS: IconName[] = [
  'atom',
  'rocket',
  'shareNetwork',
  'globe',
  'cpu',
  'handHeart',
];
const MISSION_COLORS = ['#006b75', '#f15b2a', '#1765aa', '#4f9be8', '#32a65a', '#6aa42a'];
const RISES_ICONS: IconName[] = ['check', 'lightbulb', 'microscope', 'chart', 'leaf'];

/* Sáu lĩnh vực dùng chung sáu biểu tượng với trang chủ, và mỗi lĩnh vực mang một
   màu riêng trong bảng màu GISA để phân biệt khi đọc lướt. */
const FIELD_ICONS: Record<string, IconName> = {
  'Nghiên cứu': 'microscope',
  'Tư vấn': 'chats',
  'Đào tạo': 'graduation',
  'Ứng dụng': 'clipboard',
  'Mạng lưới': 'network',
  'Cộng đồng': 'users',
};

const FIELD_COLORS: Record<string, string> = {
  'Nghiên cứu': '#00717b',
  'Tư vấn': '#1a4fa0',
  'Đào tạo': '#f28a2c',
  'Ứng dụng': '#4f9be8',
  'Mạng lưới': '#6aa42a',
  'Cộng đồng': '#32a65a',
};

const PAGE_LABELS: Record<string, string> = {
  '/gioi-thieu/cau-chuyen-gisa': 'Hành trình hình thành',
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

function splitSlogan(text: string) {
  const quotedLines = cleanText(text).match(/“[^”]+”/g);
  return quotedLines?.length === 2 ? quotedLines : [cleanText(text)];
}

function splitMissionItem(item: string) {
  const cleaned = cleanText(item);
  const separator = cleaned.indexOf('. ');
  if (separator < 0) return { detail: '', label: cleaned };
  return {
    detail: cleaned.slice(separator + 2).trim(),
    label: cleaned.slice(0, separator).trim(),
  };
}

function StoryLayout({ blocks }: { blocks: ContentBlock[] }) {
  const { chapters, introduction } = chaptersFrom(blocks);
  const leadQuote = firstBlock(introduction, 'quote');
  const promise = leadQuote ? splitPromise(leadQuote.text) : [];
  /* Triết lý cốt lõi tách khỏi thân chương "Giới thiệu về GISA": nó là tuyên
     ngôn của cả trang, đứng lẫn trong một chương thì đọc ra chỉ là câu trích
     minh họa cho chương đó. */
  const philosophyChapter = chapters.find((chapter) => chapter.heading.text === 'Giới thiệu về GISA');
  const philosophy = philosophyChapter ? firstBlock(philosophyChapter.blocks, 'quote') : undefined;
  const philosophyLines = philosophy ? philosophy.text.split('\n').filter(Boolean) : [];

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
        {chapters.filter((chapter) => STORY_CHAPTERS.has(chapter.heading.text)).map((chapter, index) => {
          const chapterQuote = firstBlock(chapter.blocks, 'quote');
          const quote = chapterQuote === philosophy ? undefined : chapterQuote;
          return (
            <section
              className={styles.storyChapter}
              data-scroll-motion="reveal"
              key={chapter.heading.text}
              style={{ '--story-accent': STORY_COLORS[index] ?? '#0b7a78' } as CSSProperties}
            >
              <div className={styles.storyChapterHeading}>
                <span aria-hidden="true" className={styles.storyChapterMark} data-story-icon>
                  <Icon name={STORY_ICONS[index] ?? 'leaf'} size={22} weight="duotone" />
                  <small>{String(index + 1).padStart(2, '0')}</small>
                </span>
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
      {philosophy ? (
        <aside className={styles.philosophyBand} data-scroll-motion="reveal">
          <span aria-hidden="true" className={styles.philosophyMark}>
            <Icon name="compass" size={30} weight="fill" />
          </span>
          <blockquote>
            <p aria-label={philosophyLines.join('. ')}>
              {philosophyLines.map((line, index) => (
                <span
                  aria-hidden="true"
                  key={line}
                  style={{ '--philosophy-index': index } as CSSProperties}
                >
                  {phrase(line)}
                </span>
              ))}
            </p>
            {philosophy.attribution ? <cite>{phrase(philosophy.attribution)}</cite> : null}
          </blockquote>
        </aside>
      ) : null}
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
  const sloganLines = sloganCopy ? splitSlogan(sloganCopy.text) : [];

  return (
    <div className={styles.visionLayout}>
      <div className={styles.visionColumn}>
        <aside className={styles.visionPanel} data-scroll-motion="reveal" id="tam-nhin">
          <h2>{phrase(vision?.heading.text ?? 'Tầm nhìn')}</h2>
          {visionQuote ? <blockquote>{phrase(visionQuote.text)}</blockquote> : null}
        </aside>
      </div>
      <section className={styles.missionPanel} data-scroll-motion="reveal" id="su-menh">
        <h2>{phrase(mission?.heading.text ?? 'Sứ mệnh')}</h2>
        {missionIntro ? <p className={styles.missionIntro}>{phrase(missionIntro.text)}</p> : null}
        {missionList ? (
          <ol className={styles.missionList}>
            {missionList.items.map((item, index) => {
              const { detail, label } = splitMissionItem(item);
              return (
                <li
                  key={item}
                  style={{ '--mission-accent': MISSION_COLORS[index] ?? '#006b75' } as CSSProperties}
                >
                  <span aria-hidden="true" className={styles.missionIcon}>
                    <Icon name={MISSION_ICONS[index] ?? 'leaf'} size={24} weight="fill" />
                  </span>
                  <h3>{phrase(label)}</h3>
                  {detail ? <p>{phrase(detail)}</p> : null}
                </li>
              );
            })}
          </ol>
        ) : null}
      </section>
      {/* Khẩu hiệu là đoạn riêng chạy hết bề ngang dưới Sứ mệnh và Tầm nhìn, để
          ba phần đọc ra thành ba khối tách bạch. */}
      {sloganCopy ? (
        <section className={styles.sloganPanel} data-scroll-motion="reveal" id="khau-hieu">
          <h2>{phrase(slogan?.heading.text ?? 'Khẩu hiệu')}</h2>
          <p aria-label={sloganLines.join('. ')}>
            {sloganLines.map((line) => (
              <span aria-hidden="true" key={line}>{phrase(line)}</span>
            ))}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function RisesLayout({ blocks }: { blocks: ContentBlock[] }) {
  const { chapters } = chaptersFrom(blocks);
  const values = chapters.find((chapter) => chapter.heading.text === 'Giá trị cốt lõi RISES');
  const intro = values ? firstBlock(values.blocks, 'paragraph') : undefined;
  const valueTable = values ? firstBlock(values.blocks, 'table') : undefined;

  return (
    <div className={styles.risesLayout} id="gia-tri-cot-loi-rises">
      <section className={styles.risesIntro} data-scroll-motion="reveal">
        <div>
          <h2>{phrase(values?.heading.text ?? 'Giá trị cốt lõi RISES')}</h2>
          {intro ? <p>{phrase(intro.text)}</p> : null}
        </div>
        {valueTable ? <ValueSequence table={valueTable} /> : null}
      </section>
    </div>
  );
}

function ValueSequence({ table }: { table: TableBlock }) {
  return (
    <ol className={styles.valueSequence}>
      {table.rows.map((row, index) => (
        <li key={row.join('-')}>
          <span aria-hidden="true" className={styles.valueIcon}>
            <Icon name={RISES_ICONS[index] ?? 'leaf'} size={24} />
          </span>
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
          const fieldName = cleanText(chapter.heading.text);
          return (
            <article
              className={styles.fieldCard}
              data-scroll-motion="reveal"
              key={chapter.heading.text}
              style={{ '--field-color': FIELD_COLORS[fieldName] ?? 'var(--section-accent)' } as CSSProperties}
            >
              <h2>
                <span aria-hidden="true" className={styles.fieldIcon}>
                  <Icon name={FIELD_ICONS[fieldName] ?? 'leaf'} size={26} />
                </span>
                {phrase(chapter.heading.text)}
              </h2>
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
  const nextPath = path === STORY_PATH ? FIELDS_PATH : STORY_PATH;
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
  const isConsolidatedStory = path === STORY_PATH;
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
            { label: isConsolidatedStory ? 'Câu chuyện GISA' : definition.title },
          ]}
        />
        <InnerPageHero
          description={
            isConsolidatedStory
              ? 'Hành trình hình thành, triết lý, tầm nhìn, sứ mệnh và hệ giá trị dẫn dắt GISA.'
              : definition.description
          }
          eyebrow={pageLabel}
          path={path}
          title={isConsolidatedStory ? 'Câu chuyện GISA' : definition.title}
        />
        <SectionSubnav path={path} />

        {isConsolidatedStory ? (
          <>
            <StoryLayout blocks={definition.blocks} />
            <VisionLayout blocks={definition.blocks} />
            <RisesLayout blocks={definition.blocks} />
          </>
        ) : null}
        {path === FIELDS_PATH ? <FieldsLayout blocks={definition.blocks} /> : null}

        <NextAboutPage path={path} />
      </article>
    </main>
  );
}

export function isAboutStaticPath(path: string) {
  return ABOUT_PATHS.includes(path as (typeof ABOUT_PATHS)[number]);
}
