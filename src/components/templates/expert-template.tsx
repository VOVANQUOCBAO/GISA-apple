import type { ContentRecord } from '@/content/types';

import { ContentDetailLayout, MetadataFacts } from './content-blocks';
import styles from './templates.module.css';

export function ExpertTemplate({ record }: { record: ContentRecord }) {
  return (
    <ContentDetailLayout
      details={
        <>
          {!record.image ? (
            <p className={styles.neutralDisclosure}>
              Hồ sơ không dùng ảnh đại diện khi chưa có asset được phép công bố.
            </p>
          ) : null}
          <MetadataFacts
            fields={[
              { key: 'title', label: 'Chức danh' },
              { key: 'degree', label: 'Học vị' },
              { key: 'specialty', label: 'Chuyên môn' },
              { key: 'biography', label: 'Tiểu sử' },
            ]}
            metadata={record.metadata}
          />
        </>
      }
      label="Chuyên gia"
      record={record}
    />
  );
}
