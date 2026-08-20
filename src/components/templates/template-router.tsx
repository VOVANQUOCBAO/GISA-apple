import { notFound } from 'next/navigation';

import type { UrlQuery } from '@/components/ui/filter-bar';
import type { PageDefinition } from '@/content/pages';
import { selectRelatedContent } from '@/content/related';
import {
  getContentRepository,
  type ContentRepository,
} from '@/content/repositories';

import { AboutStaticTemplate, isAboutStaticPath } from './about-static-template';
import { CapabilityStaticTemplate } from './capability-static-template';
import { CourseListingTemplate } from './course-listing-template';
import { DetailTemplate } from './detail-template';
import {
  EcosystemListingTemplate,
  supportsEcosystemListingTemplate,
} from './ecosystem-listing-template';
import {
  EcosystemStaticTemplate,
  supportsEcosystemStaticTemplate,
} from './ecosystem-static-template';
import { ExpertListingTemplate } from './expert-listing-template';
import { HubTemplate } from './hub-template';
import {
  KnowledgePracticeListingTemplate,
  supportsKnowledgePracticeListing,
} from './knowledge-practice-listing-template';
import { ListingTemplate } from './listing-template';
import { StaticPageTemplate } from './static-page-template';

interface TemplateRouterProps {
  definition: PageDefinition;
  path: string;
  repository?: ContentRepository;
  searchParams: UrlQuery;
}

function positiveInteger(value: string | string[] | undefined): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export async function TemplateRouter({
  definition,
  path,
  repository = getContentRepository(),
  searchParams,
}: TemplateRouterProps) {
  if (definition.template === 'hub') {
    return <HubTemplate definition={definition} />;
  }

  if (definition.template === 'listing') {
    const query =
      typeof searchParams.q === 'string'
        ? searchParams.q.trim().slice(0, 100)
        : '';
    const filters = Object.fromEntries(
      definition.filters.flatMap((key) => {
        const rawValue = searchParams[key];
        const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
        return value ? [[key, value] as const] : [];
      }),
    );
    // Phạm vi cố định đi riêng qua `scope`, không trộn vào `filters`: repository
    // áp `scope` trước rồi mới liệt kê `availableFilters`, nên FilterBar chỉ chào
    // giá trị có thật trong phạm vi. Tham số URL cũng không ghi đè được nó —
    // `/tu-van/du-an?projectType=Nghiên cứu` vẫn chỉ ra dự án tư vấn.
    const contentQuery = {
      collection: definition.collection,
      filters,
      page: positiveInteger(searchParams.page),
      pageSize: definition.collection === 'partners' ? 60 : 12,
      query,
      scope: definition.fixedFilters,
    };
    const result = query
      ? await repository.search(contentQuery)
      : await repository.list(contentQuery);
    const normalizedSearchParams: UrlQuery = {
      ...(query ? { q: query } : {}),
      ...(result.page > 1 ? { page: String(result.page) } : {}),
      ...filters,
    };

    if (definition.collection === 'courses') {
      return (
        <CourseListingTemplate
          definition={definition}
          path={path}
          result={result}
          searchParams={normalizedSearchParams}
        />
      );
    }

    if (path === '/chuyen-gia') {
      return (
        <ExpertListingTemplate
          definition={definition}
          path={path}
          result={result}
          searchParams={normalizedSearchParams}
        />
      );
    }

    if (supportsEcosystemListingTemplate(path)) {
      return (
        <EcosystemListingTemplate
          definition={definition}
          path={path}
          result={result}
          searchParams={normalizedSearchParams}
        />
      );
    }

    if (supportsKnowledgePracticeListing(path)) {
      return (
        <KnowledgePracticeListingTemplate
          definition={definition}
          path={path}
          result={result}
          searchParams={normalizedSearchParams}
        />
      );
    }

    return (
      <ListingTemplate
        definition={definition}
        path={path}
        result={result}
        searchParams={normalizedSearchParams}
      />
    );
  }

  if (definition.template === 'detail') {
    const record = await repository.getByPath(path);
    if (!record) notFound();

    // Ấn phẩm là loại duy nhất có khối "bài gợi ý" dưới trang chi tiết, nên chỉ
    // truy vấn danh sách cùng collection cho loại này.
    const related =
      record.kind === 'publication'
        ? selectRelatedContent(
            record,
            (
              await repository.list({
                collection: definition.collection,
                filters: {},
                page: 1,
                pageSize: 24,
                query: '',
              })
            ).items,
          )
        : undefined;

    return <DetailTemplate record={record} related={related} />;
  }

  if (isAboutStaticPath(path)) {
    return <AboutStaticTemplate definition={definition} path={path} />;
  }

  if (path.startsWith('/dao-tao/') || path.startsWith('/ung-dung/')) {
    return <CapabilityStaticTemplate definition={definition} path={path} />;
  }

  if (supportsEcosystemStaticTemplate(path)) {
    return <EcosystemStaticTemplate definition={definition} path={path} />;
  }

  return <StaticPageTemplate definition={definition} path={path} />;
}
