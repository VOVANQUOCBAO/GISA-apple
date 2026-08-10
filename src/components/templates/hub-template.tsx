import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { Icon } from '@/components/ui/icon';
import type { PageDefinition } from '@/content/pages';
import { PAGE_REGISTRY } from '@/content/pages';
import { bindPhrases } from '@/lib/vietnamese-text';

import hubStyles from './hub-template.module.css';
import { InnerPageHero, profileForPath } from './inner-page-chrome';
import layoutStyles from './templates.module.css';

type HubDefinition = Extract<PageDefinition, { template: 'hub' }>;

interface HubEntry {
  description: string;
  path: string;
  title: string;
}

function getPage(path: string): HubEntry {
  const page = PAGE_REGISTRY.find(
    (entry) => 'path' in entry && entry.path === path,
  );

  return page && 'title' in page
    ? { description: page.description, path, title: page.title }
    : { description: '', path, title: path };
}

export function HubTemplate({ definition }: { definition: HubDefinition }) {
  const [featuredEntry, ...indexEntries] = definition.childPaths.map(getPage);
  const profile = profileForPath(definition.path);

  return (
    <main id="main-content" tabIndex={-1}>
      <div
        className={`${layoutStyles.pageContainer} ${layoutStyles.sectionTheme}`}
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
          eyebrow="Không gian chuyên đề"
          path={definition.path}
          title={definition.title}
        />

        {featuredEntry ? (
          <section
            aria-labelledby="hub-navigation-title"
            className={hubStyles.directory}
          >
            <header className={hubStyles.introduction}>
              <div>
                <p className={hubStyles.eyebrow}>Lộ trình nội dung</p>
                <h2 id="hub-navigation-title">
                  {bindPhrases(`Khám phá ${definition.title}`)}
                </h2>
              </div>
              <p className={hubStyles.introductionText}>
                {bindPhrases(
                  'Bắt đầu với nội dung được giới thiệu dưới đây, hoặc chọn một hướng phù hợp trong mục lục chuyên đề.',
                )}
              </p>
            </header>

            <div className={hubStyles.editorialLayout}>
              <article
                className={hubStyles.featuredEntry}
                data-scroll-motion="item"
              >
                <Link className={hubStyles.featuredLink} href={featuredEntry.path}>
                  <div className={hubStyles.featuredMeta}>
                    <span className={hubStyles.featuredIcon}>
                      <Icon
                        name={profile.icon}
                        size={24}
                      />
                    </span>
                    <span>Điểm bắt đầu · 01</span>
                  </div>
                  <div className={hubStyles.featuredCopy}>
                    <h3>{bindPhrases(featuredEntry.title)}</h3>
                    {featuredEntry.description ? (
                      <p>{bindPhrases(featuredEntry.description)}</p>
                    ) : null}
                  </div>
                  <span className={hubStyles.featuredAction}>
                    Khám phá chuyên mục
                    <Icon aria-hidden="true" name="arrow" size={20} />
                  </span>
                </Link>
              </article>

              {indexEntries.length ? (
                <nav
                  aria-label={`Các hướng khám phá trong ${definition.title}`}
                  className={hubStyles.pathIndex}
                >
                  <div className={hubStyles.indexHeading}>
                    <p>Các hướng khám phá</p>
                    <span>
                      {String(indexEntries.length).padStart(2, '0')} mục tiếp theo
                    </span>
                  </div>
                  <ol>
                    {indexEntries.map((entry, index) => (
                      <li
                        className={hubStyles.indexEntry}
                        data-scroll-motion="item"
                        key={entry.path}
                        style={{ '--motion-index': index + 1 } as React.CSSProperties}
                      >
                        <span className={hubStyles.indexNumber}>
                          {String(index + 2).padStart(2, '0')}
                        </span>
                        <div className={hubStyles.indexCopy}>
                          <h3>
                            <Link href={entry.path}>
                              {bindPhrases(entry.title)}
                            </Link>
                          </h3>
                          {entry.description ? (
                            <p>{bindPhrases(entry.description)}</p>
                          ) : null}
                        </div>
                        <span aria-hidden="true" className={hubStyles.indexArrow}>
                          <Icon name="arrow" size={18} />
                        </span>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
