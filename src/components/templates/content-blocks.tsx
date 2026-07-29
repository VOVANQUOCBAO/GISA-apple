import type { ReactNode } from 'react';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SourceNote } from '@/components/ui/source-note';
import type { ContentBlock, ContentRecord } from '@/content/types';

import styles from './templates.module.css';
import { bindPhrases } from '@/lib/vietnamese-text';

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return <p key={`${block.type}-${index}`}>{bindPhrases(block.text)}</p>;
        }
        if (block.type === 'list') {
          const List = block.ordered ? 'ol' : 'ul';
          return (
            <List key={`${block.type}-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </List>
          );
        }
        if (block.type === 'heading') {
          const Heading = block.level === 2 ? 'h2' : 'h3';
          return <Heading key={`${block.type}-${index}`}>{bindPhrases(block.text)}</Heading>;
        }
        if (block.type === 'quote') {
          return (
            <blockquote key={`${block.type}-${index}`}>
              <p>{bindPhrases(block.text)}</p>
              {block.attribution ? <cite>{block.attribution}</cite> : null}
            </blockquote>
          );
        }
        if (block.type === 'table') {
          return (
            <table key={`${block.type}-${index}`}>
              {block.headers.length ? (
                <thead><tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
              ) : null}
              <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
            </table>
          );
        }
        if (block.type === 'linkGroup') {
          return (
            <ul key={`${block.type}-${index}`}>
              {block.links.map((link) => <li key={link.href}><a href={link.href}>{bindPhrases(link.label)}</a></li>)}
            </ul>
          );
        }
        if (block.type === 'video') {
          return <p key={`${block.type}-${index}`}><a href={block.externalUrl}>{block.title}</a></p>;
        }
        return block.caption ? <p key={`${block.type}-${index}`}>{block.caption}</p> : null;
      })}
    </div>
  );
}

interface ContentDetailLayoutProps {
  actions?: ReactNode;
  details?: ReactNode;
  label: string;
  record: ContentRecord;
}

export function ContentDetailLayout({
  actions,
  details,
  label,
  record,
}: ContentDetailLayoutProps) {
  return (
    <main id="main-content" tabIndex={-1}>
      <article className={`${styles.pageContainer} ${styles.detailLayout}`}>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            { label: record.title },
          ]}
        />
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>{bindPhrases(label)}</p>
          <h1>{record.title}</h1>
          <p>{record.summary}</p>
          {details}
        </header>
        <ContentBlocks blocks={record.body} />
        {actions ? <div className={styles.detailActions}>{actions}</div> : null}
        <SourceNote
          checkedAt={record.checkedAt}
          sourceLabel={record.sourceLabel}
          sourceUrl={record.sourceUrl}
        />
      </article>
    </main>
  );
}

interface MetadataFactsProps {
  fields: Array<{ key: string; label: string }>;
  metadata: ContentRecord['metadata'];
}

export function MetadataFacts({ fields, metadata }: MetadataFactsProps) {
  const available = fields.flatMap(({ key, label }) => {
    const value = metadata[key];
    return value ? [{ key, label, value }] : [];
  });
  if (available.length === 0) return null;

  return (
    <dl className={styles.factList}>
      {available.map(({ key, label, value }) => (
        <div key={key}>
          <dt>{bindPhrases(label)}</dt>
          <dd>{Array.isArray(value) ? value.join(', ') : value}</dd>
        </div>
      ))}
    </dl>
  );
}
