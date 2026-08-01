import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { resolvePage } from '@/content/pages';
import type { ContentRepository } from '@/content/repositories';
import type { ContentSummary, PaginatedResult } from '@/content/types';
import NotFoundPage from '@/app/not-found';

import { TemplateRouter } from './template-router';

describe('TemplateRouter', () => {
  test.each([
    ['/nghien-cuu', 'hub'],
    ['/nghien-cuu/du-an', 'listing'],
    ['/nghien-cuu/du-an/trade4sd', 'detail'],
  ] as const)('resolves %s to %s template', (path, template) => {
    expect(resolvePage(path)?.template).toBe(template);
  });

  test('renders hub child navigation', async () => {
    const definition = resolvePage('/nghien-cuu');
    expect(definition?.template).toBe('hub');
    if (!definition) throw new Error('Missing hub definition');

    render(
      await TemplateRouter({
        definition,
        path: '/nghien-cuu',
        searchParams: {},
      }),
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Nghiên cứu' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Dự án nghiên cứu' })).toHaveAttribute(
      'href',
      '/nghien-cuu/du-an',
    );
  });

  test('renders a repository-backed listing and detail', async () => {
    const listing = resolvePage('/nghien-cuu/du-an');
    const detail = resolvePage('/nghien-cuu/du-an/trade4sd');
    if (!listing || !detail) throw new Error('Missing content definitions');

    const { unmount } = render(
      await TemplateRouter({
        definition: listing,
        path: '/nghien-cuu/du-an',
        searchParams: {},
      }),
    );
    expect(screen.getByRole('link', { name: 'TRADE4SD' })).toHaveAttribute(
      'href',
      '/nghien-cuu/du-an/trade4sd',
    );
    unmount();

    render(
      await TemplateRouter({
        definition: detail,
        path: '/nghien-cuu/du-an/trade4sd',
        searchParams: {},
      }),
    );
    expect(screen.getByRole('heading', { level: 1, name: 'TRADE4SD' })).toBeVisible();
    expect(screen.getByText('Website công khai GISA — mục dự án TRADE4SD')).toBeVisible();
    expect(document.body).not.toHaveTextContent('undefined');
  });

  test('distinguishes an empty collection from a filter with no results', async () => {
    const emptyListing = resolvePage('/mang-luoi/doi-tac');
    const filteredListing = resolvePage('/nghien-cuu/du-an');
    if (!emptyListing || !filteredListing) throw new Error('Missing listing definitions');

    const { unmount } = render(
      await TemplateRouter({
        definition: emptyListing,
        path: '/mang-luoi/doi-tac',
        searchParams: {},
      }),
    );
    expect(
      screen.getByRole('heading', {
        name: 'Chưa có nội dung được phép công bố',
      }),
    ).toBeVisible();
    unmount();

    render(
      await TemplateRouter({
        definition: filteredListing,
        path: '/nghien-cuu/du-an',
        searchParams: { topic: 'Không tồn tại' },
      }),
    );
    expect(
      screen.getByRole('heading', { name: 'Không có kết quả phù hợp' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Xóa bộ lọc' })).toHaveAttribute(
      'href',
      '/nghien-cuu/du-an',
    );
  });

  test('renders the last valid page returned for an out-of-range request', async () => {
    const definition = resolvePage('/nghien-cuu/du-an');
    if (!definition) throw new Error('Missing listing definition');

    const item: ContentSummary = {
      collection: 'projects',
      evidenceStatus: 'verified',
      id: 'project-last-page',
      kind: 'project',
      metadata: {},
      path: '/nghien-cuu/du-an/trade4sd',
      slug: 'trade4sd',
      summary: 'Bản ghi ở trang hợp lệ cuối cùng.',
      tags: [],
      title: 'Trang cuối',
    };
    const result: PaginatedResult<ContentSummary> = {
      availableFilters: {},
      items: [item],
      page: 2,
      pageCount: 2,
      pageSize: 12,
      total: 13,
    };
    const repository: ContentRepository = {
      getByPath: async () => null,
      getBySlug: async () => null,
      list: async () => result,
      listIndexablePaths: async () => [],
      search: async () => result,
    };

    render(
      await TemplateRouter({
        definition,
        path: '/nghien-cuu/du-an',
        repository,
        searchParams: { page: '999' },
      }),
    );
    expect(screen.getByRole('link', { name: 'Trang 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('404 recovery offers home, search, and the four main hubs', () => {
    render(<NotFoundPage />);

    for (const name of [
      'Trang chủ',
      'Tìm kiếm',
      'Nghiên cứu',
      'Tư vấn',
      'Đào tạo',
      'Ứng dụng',
    ]) {
      expect(screen.getByRole('link', { name })).toBeVisible();
    }
  });
});
