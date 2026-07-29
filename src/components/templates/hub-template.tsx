import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import type { PageDefinition } from '@/content/pages';
import { PAGE_REGISTRY } from '@/content/pages';

import styles from './templates.module.css';
import { bindPhrases } from '@/lib/vietnamese-text';

type HubDefinition = Extract<PageDefinition, { template: 'hub' }>;

function getPageTitle(path: string): string {
  const page = PAGE_REGISTRY.find(
    (entry) => 'path' in entry && entry.path === path,
  );
  return page && 'title' in page ? page.title : path;
}

export function HubTemplate({ definition }: { definition: HubDefinition }) {
  return (
    <main id="main-content" tabIndex={-1}>
      <div className={styles.pageContainer}>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { label: definition.title },
          ]}
        />
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>{bindPhrases("Trang đầu mục")}</p>
          <h1>{definition.title}</h1>
          <p>{definition.description}</p>
        </header>
        <section aria-labelledby="hub-navigation-title">
          <h2 id="hub-navigation-title">Khám phá {definition.title}</h2>
          <div className={styles.linkGrid}>
            {definition.childPaths.map((path) => (
              <article className={styles.linkCard} key={path}>
                <h3>
                  <Link href={path}>{getPageTitle(path)}</Link>
                </h3>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
