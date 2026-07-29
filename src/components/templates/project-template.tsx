import type { ContentRecord } from '@/content/types';

import { ContentDetailLayout, MetadataFacts } from './content-blocks';

export function ProjectTemplate({ record }: { record: ContentRecord }) {
  return (
    <ContentDetailLayout
      details={
        <MetadataFacts
          fields={[
            { key: 'context', label: 'Bối cảnh' },
            { key: 'method', label: 'Phương pháp' },
            { key: 'role', label: 'Vai trò GISA' },
            { key: 'result', label: 'Kết quả đã xác minh' },
          ]}
          metadata={record.metadata}
        />
      }
      label="Dự án"
      record={record}
    />
  );
}
