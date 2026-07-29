import type { ContentRecord } from '@/content/types';

import { ArticleTemplate } from './article-template';
import { ContentDetailLayout } from './content-blocks';
import { CourseTemplate } from './course-template';
import { ExpertTemplate } from './expert-template';
import { InitiativeTemplate } from './initiative-template';
import { ProjectTemplate } from './project-template';

export function DetailTemplate({ record }: { record: ContentRecord }) {
  switch (record.kind) {
    case 'project':
      return <ProjectTemplate record={record} />;
    case 'publication':
    case 'news':
    case 'notice':
      return <ArticleTemplate record={record} />;
    case 'course':
      return <CourseTemplate record={record} />;
    case 'expert':
      return <ExpertTemplate record={record} />;
    case 'initiative':
      return <InitiativeTemplate record={record} />;
    case 'tool':
      return <ContentDetailLayout label="Công cụ" record={record} />;
    case 'partner':
      return <ContentDetailLayout label="Đối tác" record={record} />;
  }
}
