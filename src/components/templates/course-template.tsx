import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { ButtonLink } from '@/components/ui/button-link';
import { SourceNote } from '@/components/ui/source-note';
import type { ContentBlock, ContentRecord } from '@/content/types';
import { toAnchorId } from '@/lib/anchor-id';
import { bindPhrases } from '@/lib/vietnamese-text';

import { ContentBlocks } from './content-blocks';
import { InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';
import styles from './course-template.module.css';
import layoutStyles from './templates.module.css';

interface CourseChapter {
  blocks: ContentBlock[];
  title: string;
}

const FACT_LABELS: Record<string, string> = {
  audience: 'Người học phù hợp',
  fee: 'Học phí',
  format: 'Hình thức',
  instructor: 'Giảng viên',
  objectives: 'Trọng tâm học tập',
  program: 'Dòng chương trình',
  schedule: 'Lịch học',
};

const FACT_ORDER = [
  'program',
  'format',
  'audience',
  'objectives',
  'schedule',
  'fee',
  'instructor',
] as const;

function normalizeText(text: string) {
  return text.replace(/\s*[–—]\s*/g, ' - ');
}

function normalizeBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((block) => {
    if (block.type === 'paragraph' || block.type === 'heading') {
      return { ...block, text: normalizeText(block.text) };
    }
    if (block.type === 'list') {
      return { ...block, items: block.items.map(normalizeText) };
    }
    if (block.type === 'quote') {
      return {
        ...block,
        attribution: block.attribution ? normalizeText(block.attribution) : undefined,
        text: normalizeText(block.text),
      };
    }
    if (block.type === 'table') {
      return {
        ...block,
        headers: block.headers.map(normalizeText),
        rows: block.rows.map((row) => row.map(normalizeText)),
      };
    }
    if (block.type === 'linkGroup') {
      return {
        ...block,
        links: block.links.map((link) => ({
          ...link,
          label: normalizeText(link.label),
        })),
      };
    }
    if (block.type === 'image') {
      return {
        ...block,
        caption: block.caption ? normalizeText(block.caption) : undefined,
      };
    }
    return { ...block, title: normalizeText(block.title) };
  });
}

function splitCourseBody(blocks: ContentBlock[]) {
  const introduction: ContentBlock[] = [];
  const chapters: CourseChapter[] = [];
  let current: CourseChapter | null = null;

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

function CourseFacts({ metadata }: { metadata: ContentRecord['metadata'] }) {
  const facts = FACT_ORDER.flatMap((key) => {
    const value = metadata[key];
    return value ? [{ key, label: FACT_LABELS[key], value }] : [];
  });

  if (facts.length === 0) return null;

  return (
    <dl className={styles.courseFacts}>
      {facts.map(({ key, label, value }) => (
        <div key={key}>
          <dt>{label}</dt>
          <dd>
            {bindPhrases(
              normalizeText(Array.isArray(value) ? value.join(', ') : value),
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CourseTemplate({ record }: { record: ContentRecord }) {
  const { chapters, introduction } = splitCourseBody(record.body);
  const registrationHref = `/dang-ky/khoa-hoc?course=${encodeURIComponent(record.slug)}`;
  const profile = profileForPath(record.path);

  return (
    <main id="main-content" tabIndex={-1}>
      <article
        className={`${styles.coursePage} ${layoutStyles.sectionTheme}`}
        data-section={profile.section}
      >
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { href: '/dao-tao', label: 'Đào tạo' },
            { href: '/khoa-hoc', label: 'Danh sách khóa học' },
            { label: record.title },
          ]}
        />
        <InnerPageHero
          description={normalizeText(record.summary)}
          eyebrow="Khóa học"
          image={record.image ? { alt: record.image.alt, src: record.image.src } : undefined}
          path={record.path}
          title={normalizeText(record.title)}
        />
        <SectionSubnav path={record.path} />

        <section className={styles.decisionStage} aria-label="Thông tin trước khi đăng ký">
          <CourseFacts metadata={record.metadata} />
          <aside className={styles.registrationPanel}>
            <h2>Tìm hiểu bước đăng ký</h2>
            <p>
              Xem biểu mẫu để cung cấp khóa học quan tâm và thông tin liên hệ khi bạn sẵn sàng.
            </p>
            <div className={styles.registrationActions}>
              <ButtonLink href={registrationHref}>Đăng ký quan tâm khóa học</ButtonLink>
              <ButtonLink href="/khoa-hoc" variant="secondary">Xem khóa học khác</ButtonLink>
            </div>
          </aside>
        </section>

        <section className={styles.courseReading} aria-label="Nội dung khóa học">
          <aside className={styles.readingRail}>
            <p>Nội dung khóa học</p>
            {chapters.length > 1 ? (
              <nav aria-label="Mục lục khóa học">
                <ul>
                  {chapters.map((chapter) => (
                    <li key={chapter.title}>
                      <a href={`#${toAnchorId(chapter.title)}`}>{bindPhrases(chapter.title)}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </aside>
          <div className={styles.readingBody}>
            {introduction.length > 0 ? (
              <div className={styles.courseOpening} data-scroll-motion="reveal">
                <ContentBlocks blocks={introduction} />
              </div>
            ) : null}
            {chapters.map((chapter) => (
              <section
                className={styles.courseChapter}
                data-scroll-motion="reveal"
                id={toAnchorId(chapter.title)}
                key={chapter.title}
              >
                <h2>{bindPhrases(chapter.title)}</h2>
                <ContentBlocks blocks={chapter.blocks} />
              </section>
            ))}
            <div className={styles.sourceStage}>
              <SourceNote
                checkedAt={record.checkedAt}
                sourceLabel={record.sourceLabel}
                sourceUrl={record.sourceUrl}
              />
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
