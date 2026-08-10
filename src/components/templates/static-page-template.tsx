import { Breadcrumbs } from '@/components/site/breadcrumbs';
import type { PageDefinition } from '@/content/pages';
import type { ContentBlock } from '@/content/types';
import { toAnchorId } from '@/lib/anchor-id';
import { bindPhrases } from '@/lib/vietnamese-text';

import { ContentBlocks } from './content-blocks';
import { EDITORIAL_EMPTY_COPY } from './editorial-empty-copy';
import { ContentIndex, InnerPageHero, profileForPath, SectionSubnav } from './inner-page-chrome';
import layoutStyles from './templates.module.css';
import styles from './static-page-template.module.css';

type StaticDefinition = Extract<PageDefinition, { template: 'static' }>;

interface EditorialChapter {
  blocks: ContentBlock[];
  title: string;
}

function splitEditorialBlocks(blocks: ContentBlock[]) {
  const introduction: ContentBlock[] = [];
  const chapters: EditorialChapter[] = [];
  let current: EditorialChapter | null = null;

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 2) {
      current = { blocks: [], title: block.text };
      chapters.push(current);
      continue;
    }

    if (current) current.blocks.push(block);
    else introduction.push(block);
  }

  return { chapters, introduction };
}

function chapterDensity(blocks: ContentBlock[]) {
  const itemCount = blocks.reduce(
    (total, block) => total + (block.type === 'list' ? block.items.length : 0),
    0,
  );
  return itemCount > 8 ? 'catalog' : itemCount > 4 ? 'structured' : 'narrative';
}

export function StaticPageTemplate({
  definition,
  path,
}: {
  definition: StaticDefinition;
  path: string;
}) {
  const { chapters, introduction } = splitEditorialBlocks(definition.blocks);
  const chapterCount = chapters.length;
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
            { label: definition.title },
          ]}
        />
        <InnerPageHero
          description={definition.description}
          eyebrow="Chuyên đề GISA"
          path={path}
          title={definition.title}
        />
        <SectionSubnav path={path} />

        <section className={styles.editorialFrame} aria-label={`Nội dung ${definition.title}`}>
          <aside className={styles.readingRail} aria-label="Mục lục trong trang">
            <div className={styles.railIntro}>
              <span aria-hidden="true">{String(chapterCount).padStart(2, '0')}</span>
              <p>{chapterCount > 0 ? 'Chương nội dung' : 'Nội dung chuyên đề'}</p>
            </div>
            <ContentIndex blocks={definition.blocks} />
          </aside>

          <div className={styles.editorialBody}>
            {introduction.length > 0 ? (
              <section className={styles.opening} data-scroll-motion="reveal">
                <p className={styles.openingLabel}>Dẫn nhập</p>
                <ContentBlocks blocks={introduction} />
              </section>
            ) : null}

            {chapters.length > 0 ? (
              <div className={styles.chapterList}>
                {chapters.map((chapter, index) => (
                  <section
                    className={styles.chapter}
                    data-density={chapterDensity(chapter.blocks)}
                    data-scroll-motion="reveal"
                    id={toAnchorId(chapter.title)}
                    key={`${chapter.title}-${index}`}
                  >
                    <div className={styles.chapterHeading}>
                      <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <h2>{bindPhrases(chapter.title)}</h2>
                    </div>
                    <div className={styles.chapterContent}>
                      <ContentBlocks blocks={chapter.blocks} />
                    </div>
                  </section>
                ))}
              </div>
            ) : introduction.length === 0 ? (
              <p className={styles.emptyCopy}>{EDITORIAL_EMPTY_COPY.static}</p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
