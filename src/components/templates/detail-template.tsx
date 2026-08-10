import type { ContentRecord, ContentSummary } from '@/content/types';

import { ArticleTemplate } from './article-template';
import { ContentDetailLayout } from './content-blocks';
import { CourseTemplate } from './course-template';
import {
  EcosystemDetailTemplate,
  supportsEcosystemDetailTemplate,
} from './ecosystem-detail-template';
import { ExpertTemplate } from './expert-template';
import { InitiativeTemplate } from './initiative-template';
import { ProjectTemplate } from './project-template';
import {
  ProjectToolDetailTemplate,
  supportsProjectToolDetail,
} from './project-tool-detail-template';
import { PublicationTemplate } from './publication-template';

interface DetailTemplateProps {
  record: ContentRecord;
  related?: ContentSummary[];
}

export function DetailTemplate({ record, related }: DetailTemplateProps) {
  if (supportsEcosystemDetailTemplate(record)) {
    return <EcosystemDetailTemplate record={record} />;
  }

  if (supportsProjectToolDetail(record)) {
    return <ProjectToolDetailTemplate record={record} />;
  }

  switch (record.kind) {
    case 'project':
      return <ProjectTemplate record={record} />;
    case 'publication':
      return <PublicationTemplate record={record} related={related} />;
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
