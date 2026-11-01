import { bindPhrases } from '@/lib/vietnamese-text';
import { LocalizedDate } from '@/lib/i18n/localized-date';
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
      <strong>{bindPhrases("Nguồn:")}</strong>{' '}
      <a href={sourceUrl}>{bindPhrases(sourceLabel)}</a>
      <span>{bindPhrases("Kiểm tra ngày ")}<LocalizedDate value={checkedAt} />.</span>
    </aside>
  );
}
