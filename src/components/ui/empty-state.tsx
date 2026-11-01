import { bindPhrases } from '@/lib/vietnamese-text';
import type { ReactNode } from 'react';

import styles from './ui.module.css';

interface EmptyStateProps {
  action?: ReactNode;
  description: string;
  title: string;
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <section className={styles.emptyState}>
      <h2>{bindPhrases(title)}</h2>
      <p>{bindPhrases(description)}</p>
      {action}
    </section>
  );
}
