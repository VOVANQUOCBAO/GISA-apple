import type { ContentRecord } from '@/content/types';

import {
  buildStructuredData,
  serializeStructuredData,
} from './structured-data.ts';

export function StructuredData({ record }: { record: ContentRecord }) {
  return (
    <script
      data-structured-data="content"
      dangerouslySetInnerHTML={{
        __html: serializeStructuredData(buildStructuredData(record)),
      }}
      type="application/ld+json"
    />
  );
}
