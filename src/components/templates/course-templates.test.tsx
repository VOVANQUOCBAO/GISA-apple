import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { PageDefinition } from '@/content/pages';
import { courseFixtures } from '@/content/fixtures/courses';
import type { ContentSummary, PaginatedResult } from '@/content/types';

import { CourseListingTemplate } from './course-listing-template';
import { CourseTemplate } from './course-template';

const listingDefinition: Extract<PageDefinition, { template: 'listing' }> = {
  collection: 'courses',
  description: 'Tìm khóa học phù hợp với nhu cầu chuyên môn.',
  filters: ['format'],
  path: '/khoa-hoc',
  template: 'listing',
  title: 'Khóa học',
};

const listingItems = courseFixtures.slice(0, 2) satisfies ContentSummary[];

function listingResult(overrides: Partial<PaginatedResult<ContentSummary>> = {}) {
  return {
    availableFilters: { format: ['Trực tuyến', 'Trực tiếp'] },
    items: listingItems,
    page: 2,
    pageCount: 3,
    pageSize: 2,
    total: 6,
    ...overrides,
  } satisfies PaginatedResult<ContentSummary>;
}

describe('course templates', () => {
  test('course listing preserves filter and pagination URL state', () => {
    const { container } = render(
      <CourseListingTemplate
        definition={listingDefinition}
        path="/khoa-hoc"
        result={listingResult()}
        searchParams={{ format: 'Trực tuyến', page: '2', q: 'lãnh đạo' }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Trực tiếp' })).toHaveAttribute(
      'href',
      '/khoa-hoc?format=Tr%E1%BB%B1c+ti%E1%BA%BFp&q=l%C3%A3nh+%C4%91%E1%BA%A1o',
    );
    expect(screen.getByRole('link', { name: 'Trang 3' })).toHaveAttribute(
      'href',
      '/khoa-hoc?format=Tr%E1%BB%B1c+tuy%E1%BA%BFn&q=l%C3%A3nh+%C4%91%E1%BA%A1o&page=3',
    );
    expect(container.querySelector('br')).not.toBeInTheDocument();
  });

  test('course detail only shows metadata that actually exists', () => {
    const record = courseFixtures[0];
    const { container } = render(<CourseTemplate record={record} />);

    expect(screen.getAllByText(record.metadata.program as string)).not.toHaveLength(0);
    expect(container).toHaveTextContent(record.metadata.objectives as string);
    expect(screen.queryByText('Học phí')).not.toBeInTheDocument();
    expect(screen.queryByText('Lịch học')).not.toBeInTheDocument();
    expect(screen.queryByText('Giảng viên')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Đăng ký quan tâm khóa học' })).toHaveAttribute(
      'href',
      `/dang-ky/khoa-hoc?course=${encodeURIComponent(record.slug)}`,
    );
    expect(container.querySelector('br')).not.toBeInTheDocument();
  });
});
