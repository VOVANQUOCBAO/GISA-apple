import { ButtonLink } from '@/components/ui/button-link';
import type { ContentRecord } from '@/content/types';

import { ContentDetailLayout, MetadataFacts } from './content-blocks';

export function CourseTemplate({ record }: { record: ContentRecord }) {
  return (
    <ContentDetailLayout
      actions={
        <ButtonLink href={`/dang-ky/khoa-hoc?course=${encodeURIComponent(record.slug)}`}>
          Đăng ký quan tâm khóa học
        </ButtonLink>
      }
      details={
        <MetadataFacts
          fields={[
            { key: 'audience', label: 'Đối tượng' },
            { key: 'objectives', label: 'Mục tiêu học tập' },
            { key: 'schedule', label: 'Lịch học' },
            { key: 'fee', label: 'Học phí' },
            { key: 'instructor', label: 'Giảng viên' },
          ]}
          metadata={record.metadata}
        />
      }
      label="Khóa học"
      record={record}
    />
  );
}
