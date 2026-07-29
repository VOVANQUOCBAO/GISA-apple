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
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
}
