import styles from './ui.module.css';

interface SourceNoteProps {
  checkedAt: string;
  sourceLabel: string;
  sourceUrl: string;
}

export function SourceNote({
  checkedAt,
  sourceLabel,
  sourceUrl,
}: SourceNoteProps) {
  return (
    <aside aria-label="Nguồn nội dung" className={styles.sourceNote}>
      <strong>Nguồn:</strong>{' '}
      <a href={sourceUrl}>{sourceLabel}</a>
      <span>Kiểm tra ngày {checkedAt}.</span>
    </aside>
  );
}
