import { bindPhrases } from '@/lib/vietnamese-text';
import { LocalizedDate } from '@/lib/i18n/localized-date';
import type { ContentRecord } from '@/content/types';

import { ContentDetailLayout } from './content-blocks';
import styles from './templates.module.css';

function labelFor(record: ContentRecord): string {
  if (record.kind === 'publication') return 'Ấn phẩm';
  if (record.kind === 'notice') return 'Thông báo lưu trữ';
  return 'Tin tức';
}

export function ArticleTemplate({ record }: { record: ContentRecord }) {
  return (
    <ContentDetailLayout
      details={
        <>
          {record.publishedAt ? (
            <time className={styles.detailDate} dateTime={record.publishedAt}>
              <LocalizedDate value={record.publishedAt} />
            </time>
          ) : null}
          {record.kind === 'notice' ? (
            <p className={styles.archiveNotice}>{bindPhrases(" Đây là thông báo lưu trữ. Giao diện không xác nhận nội dung này còn hiệu lực. ")}</p>
          ) : null}
        </>
      }
      label={labelFor(record)}
      record={record}
    />
  );
}
