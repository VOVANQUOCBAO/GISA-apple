import type { ContentRecord } from '@/content/types';

import { ContentDetailLayout, MetadataFacts } from './content-blocks';

export function InitiativeTemplate({ record }: { record: ContentRecord }) {
  return (
    <ContentDetailLayout
      details={
        <MetadataFacts
          fields={[
            { key: 'context', label: 'Bối cảnh' },
            { key: 'problem', label: 'Vấn đề' },
            { key: 'evidence', label: 'Bằng chứng' },
            { key: 'role', label: 'Vai trò GISA' },
            { key: 'application', label: 'Ứng dụng' },
            { key: 'impact', label: 'Tác động đã xác minh' },
          ]}
          metadata={record.metadata}
        />
      }
      label="Sáng kiến"
      record={record}
    />
  );
}
