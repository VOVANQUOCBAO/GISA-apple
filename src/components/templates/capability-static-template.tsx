import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { Icon, type IconName } from '@/components/ui/icon';
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

type ListBlock = Extract<ContentBlock, { type: 'list' }>;
type LinkGroupBlock = Extract<ContentBlock, { type: 'linkGroup' }>;
type ParagraphBlock = Extract<ContentBlock, { type: 'paragraph' }>;
type QuoteBlock = Extract<ContentBlock, { type: 'quote' }>;

const TRAINING_ICONS: IconName[] = ['graduation', 'training', 'presentation', 'book'];
const APPLICATION_ICONS: IconName[] = ['lightbulb', 'clipboard', 'chart', 'leaf'];

const TRAINING_VISUALS = [
  {
    alt: 'Giảng viên chia sẻ trong chương trình phát triển năng lực dành cho người đi làm',
    src: '/images/knowledge-journey/training-session-editorial.png',
  },
  {
    alt: 'Chương trình đào tạo quản trị tài chính cho doanh nghiệp vừa và nhỏ',
    src: '/images/course-sme-financial-management.png',
  },
  {
    alt: 'Chương trình đào tạo marketing số và ứng dụng trí tuệ nhân tạo',
    src: '/images/course-digital-ai-marketing.png',
  },
  {
    alt: 'Chương trình đào tạo quản trị nhân sự chiến lược',
    src: '/images/course-strategic-human-resources.png',
  },
  {
    alt: 'Chương trình đào tạo chuỗi cung ứng và logistics số',
    src: '/images/course-digital-supply-chain-logistics.png',
  },
  {
    alt: 'Chương trình phát triển năng lực kinh doanh đa kênh',
    src: '/images/course-multichannel-effective-sales.png',
  },
] as const;

const APPLICATION_VISUALS = [
  {
    alt: 'Chuyên gia và người dân trao đổi giải pháp ứng dụng tại thực địa',
    src: '/images/knowledge-journey/transfer-field-editorial.png',
  },
  {
    alt: 'Bảng phân tích dữ liệu hỗ trợ quản trị và ra quyết định',
    src: '/images/article-performance-benchmarking.png',
  },
  {
    alt: 'Minh họa giải pháp trí tuệ nhân tạo trong hoạt động tổ chức',
    src: '/images/article-ai-chatbot.png',
  },
  {
    alt: 'Các mục tiêu phát triển bền vững định hướng giải pháp ứng dụng',
    src: '/images/banner-sustainable-development-goals.png',
  },
] as const;

function normalizeVisibleText(text: string) {
  return text;
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

function trainingIconFor(title: string, index: number): IconName {
  const normalized = title.toLocaleLowerCase('vi');
  if (/gisa core|chuyên môn/.test(normalized)) return 'graduation';
  if (/gisa edge|thực chiến|trải nghiệm/.test(normalized)) return 'compass';
  if (/gisa rise|bứt phá/.test(normalized)) return 'rocket';
  if (/gisa ascend|lãnh đạo thành công/.test(normalized)) return 'chart';
  if (/gisa legacy|viên mãn|kế thừa/.test(normalized)) return 'mountains';
  if (/mục tiêu|định hướng|lộ trình/.test(normalized)) return 'target';
  if (/dành cho|đối tượng|học viên|con người/.test(normalized)) return 'users';
  if (/lãnh đạo|quản trị|chiến lược|sự nghiệp/.test(normalized)) return 'chart';
  if (/công nghệ|kỹ thuật số|\bai\b|đổi mới/.test(normalized)) return 'cpu';
  if (/bền vững|môi trường|esg/.test(normalized)) return 'leaf';
  if (/giá trị|lợi ích|kết quả/.test(normalized)) return 'handHeart';
  if (/khóa học|nội dung|chương trình/.test(normalized)) return 'book';
  return TRAINING_ICONS[index % TRAINING_ICONS.length] ?? 'graduation';
}

function applicationIconFor(title: string, index: number): IconName {
  const normalized = title.toLocaleLowerCase('vi');
  if (/mục tiêu|định hướng|lộ trình|chiến lược/.test(normalized)) return 'target';
  if (/con người|tâm lý|hành vi|đối tượng|khách hàng|nhân sự/.test(normalized)) return 'users';
  if (/nội dung|kiến thức|học tập|giáo dục/.test(normalized)) return 'book';
  if (/hợp tác|mạng lưới|chuỗi cung ứng|đồng thuận/.test(normalized)) return 'network';
  if (/bền vững|môi trường|xanh|tuần hoàn|nông nghiệp|esg/.test(normalized)) return 'leaf';
  if (/công nghệ|kỹ thuật số|\bai\b|iot|blockchain|dữ liệu/.test(normalized)) return 'cpu';
  if (/kết quả|tăng trưởng|hiệu quả|kinh tế|kinh doanh|tài chính/.test(normalized)) return 'chart';
  if (/cộng đồng|giá trị xã hội|trách nhiệm/.test(normalized)) return 'handHeart';
  if (/ý tưởng|giải pháp|đổi mới|thiết kế/.test(normalized)) return 'lightbulb';
  return APPLICATION_ICONS[index % APPLICATION_ICONS.length] ?? 'lightbulb';
}

function trainingVisualFor(title: string, index: number) {
  const normalized = title.toLocaleLowerCase('vi');
  if (/nhân sự|tổ chức|con người|đối tượng|dành cho/.test(normalized)) return TRAINING_VISUALS[3];
  if (/chuỗi cung ứng|logistics|vận hành/.test(normalized)) return TRAINING_VISUALS[4];
  if (/marketing|kinh doanh|bán hàng|thị trường/.test(normalized)) return TRAINING_VISUALS[5];
  if (/tài chính|quản trị|lãnh đạo|chiến lược/.test(normalized)) return TRAINING_VISUALS[1];
  if (/công nghệ|kỹ thuật số|\bai\b|đổi mới/.test(normalized)) return TRAINING_VISUALS[2];
  return TRAINING_VISUALS[index % TRAINING_VISUALS.length] ?? TRAINING_VISUALS[0];
}

function TrainingFieldGrid({ block }: { block: ListBlock }) {
  return (
    <ul className={styles.trainingFieldGrid} data-scroll-motion="reveal">
      {block.items.map((item, index) => (
        <li key={item}>
          <span aria-hidden="true" className={styles.trainingFieldIcon}>
            <Icon name={trainingIconFor(item, index)} size={30} weight="duotone" />
          </span>
          <span className={styles.trainingFieldNumber}>{String(index + 1).padStart(2, '0')}</span>
          <strong>{bindPhrases(item)}</strong>
        </li>
      ))}
    </ul>
  );
}

function TrainingPhilosophy({ paragraph, quote }: { paragraph?: ParagraphBlock; quote?: QuoteBlock }) {
  if (!paragraph && !quote) return null;

  return (
    <aside className={styles.trainingPhilosophy} data-scroll-motion="reveal">
      {quote ? (
        <blockquote>
          <span aria-hidden="true" className={styles.philosophyIcon}>
            <Icon name="lightbulb" size={30} weight="duotone" />
          </span>
          <p>{bindPhrases(quote.text)}</p>
          {quote.attribution ? <cite>{bindPhrases(quote.attribution)}</cite> : null}
        </blockquote>
      ) : null}
      {paragraph ? <p>{bindPhrases(paragraph.text)}</p> : null}
    </aside>
  );
}

function TrainingPathway({ list, links }: { links: LinkGroupBlock; list: ListBlock }) {
  return (
    <ol className={styles.trainingPathwayGrid}>
      {list.items.map((item, index) => {
        const [heading = item, ...descriptionParts] = item.split('. ');
        const link = links.links[index];
        const icon = trainingIconFor(heading, index);

        if (!link) return null;

        return (
          <li key={link.href}>
            <Link href={link.href}>
              <span className={styles.pathwayCardTop}>
                <span aria-hidden="true" className={styles.pathwayIcon}>
                  <Icon name={icon} size={28} weight="duotone" />
                </span>
                <span className={styles.pathwayNumber}>{String(index + 1).padStart(2, '0')}</span>
              </span>
              <h3>{bindPhrases(heading.replace(/\.$/, ''))}</h3>
              {descriptionParts.length > 0 ? <p>{bindPhrases(descriptionParts.join('. '))}</p> : null}
              <span className={styles.pathwayCta}>
                Khám phá lộ trình
                <Icon name="arrow" size={20} weight="bold" />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function TrainingChapter({
  chapter,
  chapterCount,
  index,
}: {
  chapter: Chapter;
  chapterCount: number;
  index: number;
}) {
  const { introduction, subtopics } = splitSubtopics(chapter.blocks);
  const hasCurriculum = subtopics.length > 0;
  const icon = trainingIconFor(chapter.title, index);
  const visual = trainingVisualFor(chapter.title, index);
  const isFieldChapter = chapter.title === 'Các lĩnh vực đào tạo';
  const isPathwayChapter = chapter.title === 'Năm lộ trình phát triển nghề nghiệp';
  const fieldList = isFieldChapter
    ? introduction.find((block): block is ListBlock => block.type === 'list')
    : undefined;
  const philosophyQuote = isFieldChapter
    ? introduction.find((block): block is QuoteBlock => block.type === 'quote')
    : undefined;
  const philosophyParagraph = isFieldChapter
    ? introduction.find((block): block is ParagraphBlock => block.type === 'paragraph')
    : undefined;
  const pathwayList = isPathwayChapter
    ? introduction.find((block): block is ListBlock => block.type === 'list')
    : undefined;
  const pathwayLinks = isPathwayChapter
    ? introduction.find((block): block is LinkGroupBlock => block.type === 'linkGroup')
    : undefined;
  const usesEditorialChapterContent = Boolean(fieldList || (pathwayList && pathwayLinks));
  const mastheadLead = !usesEditorialChapterContent
    ? introduction.find((block): block is ParagraphBlock => block.type === 'paragraph')
    : undefined;
  const bodyIntroduction = mastheadLead
    ? introduction.filter((block) => block !== mastheadLead)
    : introduction;
  const hasHighlightedLead = chapter.title === 'Nội dung chính'
    && bodyIntroduction.some((block) => block.type === 'paragraph');
  const chapterList = introduction.find((block): block is ListBlock => block.type === 'list');
  const chapterMeasure = hasCurriculum
    ? `${subtopics.length} nhóm nội dung`
    : chapterList
      ? `${chapterList.items.length} nội dung trọng tâm`
      : undefined;

  return (
    <section
      className={styles.trainingChapter}
      data-curriculum={hasCurriculum ? 'true' : 'false'}
      data-reverse={index % 2 === 1 ? 'true' : 'false'}
      data-scroll-motion="reveal"
      id={toAnchorId(chapter.title)}
    >
      <div className={styles.chapterMasthead}>
        <div className={styles.chapterHeadingCopy}>
          <p className={styles.chapterKicker}>
            <span aria-hidden="true"><Icon name={icon} size={30} weight="duotone" /></span>
            <span className={styles.chapterSequence}>
              Chương {String(index + 1).padStart(2, '0')}
              <small>/ {String(chapterCount).padStart(2, '0')}</small>
            </span>
          </p>
          <h2>{bindPhrases(chapter.title)}</h2>
          {mastheadLead ? (
            <p className={styles.chapterHeadingLead}>{bindPhrases(mastheadLead.text)}</p>
          ) : chapterMeasure ? (
            <p className={styles.chapterMeasure}>{chapterMeasure}</p>
          ) : null}
        </div>
        <figure className={styles.chapterVisual}>
          <Image alt={visual.alt} fill sizes="(max-width: 56rem) 94vw, 26rem" src={visual.src} />
        </figure>
      </div>
      {isFieldChapter && fieldList ? (
        <div className={styles.chapterContent}>
          <TrainingFieldGrid block={fieldList} />
          <TrainingPhilosophy paragraph={philosophyParagraph} quote={philosophyQuote} />
        </div>
      ) : null}
      {isPathwayChapter && pathwayList && pathwayLinks ? (
        <div className={styles.chapterContent}>
          <TrainingPathway links={pathwayLinks} list={pathwayList} />
        </div>
      ) : null}
      {bodyIntroduction.length > 0 && !usesEditorialChapterContent ? (
        <div className={`${styles.chapterContent} ${hasHighlightedLead ? styles.chapterHighlight : ''}`}>
          <ContentBlocks blocks={bodyIntroduction} />
        </div>
      ) : null}
      {hasCurriculum ? (
        <div className={styles.curriculumGrid}>
          {subtopics.map((subtopic, subtopicIndex) => (
            <article className={styles.curriculumItem} key={subtopic.title}>
              <span aria-hidden="true" className={styles.cardIcon}>
                <Icon name={trainingIconFor(subtopic.title, subtopicIndex)} size={24} weight="duotone" />
              </span>
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
      <div className={styles.trainingBody}>
        {introduction.length > 0 ? (
          <div className={styles.trainingOpening} data-scroll-motion="reveal">
            <ContentBlocks blocks={introduction} />
          </div>
        ) : null}
        {chapters.map((chapter, index) => (
          <TrainingChapter
            chapter={chapter}
            chapterCount={chapters.length}
            index={index}
            key={chapter.title}
          />
        ))}
      </div>
    </section>
  );
}

function ApplicationChapter({
  chapter,
  chapterCount,
  index,
}: {
  chapter: Chapter;
  chapterCount: number;
  index: number;
}) {
  const { introduction, subtopics } = splitSubtopics(chapter.blocks);
  const icon = applicationIconFor(chapter.title, index);
  const visual = APPLICATION_VISUALS[index % APPLICATION_VISUALS.length] ?? APPLICATION_VISUALS[0];

  return (
    <section
      className={styles.applicationChapter}
      data-reverse={index % 2 === 1 ? 'true' : 'false'}
      data-scroll-motion="reveal"
      id={toAnchorId(chapter.title)}
    >
      <header className={`${styles.applicationChapterHeader} ${styles.chapterMasthead}`}>
        <div className={styles.applicationChapterCopy}>
          <p className={styles.chapterKicker}>
            <span aria-hidden="true"><Icon name={icon} size={30} weight="duotone" /></span>
            <span className={styles.chapterSequence}>
              Chương {String(index + 1).padStart(2, '0')}
              <small>/ {String(chapterCount).padStart(2, '0')}</small>
            </span>
          </p>
          <h2>{bindPhrases(chapter.title)}</h2>
          {introduction.length > 0 ? (
            <div className={styles.applicationChapterLead}>
              <ContentBlocks blocks={introduction} />
            </div>
          ) : subtopics.length > 0 ? (
            <p className={styles.chapterMeasure}>{subtopics.length} nhóm nội dung</p>
          ) : null}
        </div>
        <figure className={styles.chapterVisual}>
          <Image alt={visual.alt} fill sizes="(max-width: 56rem) 94vw, 26rem" src={visual.src} />
        </figure>
      </header>
      {subtopics.length > 0 ? (
        <div className={styles.applicationGrid}>
          {subtopics.map((subtopic, subtopicIndex) => (
            <article className={styles.applicationItem} key={subtopic.title}>
              <span aria-hidden="true" className={styles.cardIcon}>
                <Icon name={applicationIconFor(subtopic.title, subtopicIndex)} size={24} weight="duotone" />
              </span>
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
            <dt><span aria-hidden="true"><Icon name="compass" size={24} weight="duotone" /></span>Bối cảnh</dt>
            <dd>Nhìn rõ nhu cầu và điều kiện thực tế.</dd>
          </div>
          <div>
            <dt><span aria-hidden="true"><Icon name="lightbulb" size={24} weight="duotone" /></span>Cách tiếp cận</dt>
            <dd>Kết nối tri thức với công cụ triển khai.</dd>
          </div>
          <div>
            <dt><span aria-hidden="true"><Icon name="chart" size={24} weight="duotone" /></span>Giá trị</dt>
            <dd>Theo dõi thay đổi trong tổ chức và cộng đồng.</dd>
          </div>
        </dl>
      </div>
      <div className={styles.applicationChapters}>
        {chapters.map((chapter, index) => (
          <ApplicationChapter
            chapter={chapter}
            chapterCount={chapters.length}
            index={index}
            key={chapter.title}
          />
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
