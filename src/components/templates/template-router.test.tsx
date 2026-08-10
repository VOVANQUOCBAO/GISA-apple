import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { PageDefinition } from '@/content/pages';
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

  test('renders static content as editorial chapters with complete introductory prose', async () => {
    const definition = resolvePage('/dao-tao/gisa-core');
    expect(definition?.template).toBe('static');
    if (!definition) throw new Error('Missing static definition');

    const { container } = render(
      await TemplateRouter({
        definition,
        path: '/dao-tao/gisa-core',
        searchParams: {},
      }),
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Nội dung chính' }),
    ).toBeVisible();
    expect(container.querySelector('section#noi-dung-chinh')).toBeInTheDocument();
    expect(
      [...container.querySelectorAll('p')].some((paragraph) =>
        paragraph.textContent?.startsWith('GISA Core là chuỗi chương trình đào tạo'),
      ),
    ).toBe(true);
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
    // Không còn trang danh sách nào trong `PAGE_REGISTRY` có collection rỗng, nên
    // trạng thái "chưa có nội dung" được dựng từ một định nghĩa tổng hợp trỏ vào
    // collection `resources` — collection chưa có fixture nào.
    const emptyListing: PageDefinition = {
      template: 'listing',
      path: '/mang-luoi/doi-tac',
      title: 'Đối tác',
      description: 'Chỉ hiển thị đối tác đã được phép công bố.',
      collection: 'resources',
      filters: [],
    };
    const filteredListing = resolvePage('/nghien-cuu/du-an');
    if (!filteredListing) throw new Error('Missing listing definitions');

    const { unmount } = render(
      await TemplateRouter({
        definition: emptyListing,
        path: '/mang-luoi/doi-tac',
        searchParams: {},
      }),
    );
    expect(
      screen.getByRole('heading', {
        name: 'Hồ sơ sẽ được bổ sung',
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

  /*
    `fixedFilters` là phạm vi của trang, không phải bộ lọc người xem chọn. Ba phép
    kiểm dưới đây khóa ba hệ quả của việc phân biệt đó — thiếu bất kỳ cái nào thì
    hai trang cùng đọc `projects` lại hiện y hệt nhau, hoặc FilterBar chào những
    lựa chọn luôn ra rỗng.
  */
  test('applies a page scope that URL parameters cannot override', async () => {
    const consultingProjects = resolvePage('/tu-van/du-an');
    if (!consultingProjects) throw new Error('Missing listing definition');
    expect(consultingProjects.template).toBe('listing');

    render(
      await TemplateRouter({
        definition: consultingProjects,
        path: '/tu-van/du-an',
        // Phạm vi trang là `projectType: 'Tư vấn'`; tham số URL cố ép sang 'Nghiên
        // cứu' vẫn không được kéo bốn dự án nghiên cứu vào trang tư vấn.
        searchParams: { projectType: 'Nghiên cứu' },
      }),
    );

    expect(screen.queryByRole('link', { name: 'TRADE4SD' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Chưa có nội dung trong phạm vi này' }),
    ).toBeVisible();
    // Không chào "Xóa bộ lọc": phạm vi không nằm trên URL nên xóa cũng không đổi gì.
    expect(screen.queryByRole('link', { name: 'Xóa bộ lọc' })).not.toBeInTheDocument();
  });

  test('offers only filter values that exist inside the page scope', async () => {
    const appliedArticles = resolvePage('/nghien-cuu/bai-bao-ung-dung');
    if (!appliedArticles) throw new Error('Missing listing definition');
    // Cùng collection, cùng khóa lọc, chỉ khác ở chỗ không có phạm vi — đây là danh
    // sách chủ đề mà trang chuyên khảo từng chào trước khi sửa.
    const allArticles: PageDefinition = {
      template: 'listing',
      path: '/nghien-cuu/bai-bao-ung-dung',
      title: 'Ấn phẩm',
      description: 'Toàn bộ ấn phẩm, không giới hạn phạm vi.',
      collection: 'publications',
      filters: ['topic'],
    };

    // FilterBar dựng mỗi khóa lọc thành một <fieldset> có <legend> tiếng Việt và
    // một danh sách link giá trị.
    const optionsFor = async (definition: PageDefinition, path: string) => {
      const { container, unmount } = render(
        await TemplateRouter({ definition, path, searchParams: {} }),
      );
      const topicFieldset = [...container.querySelectorAll('fieldset')].find(
        (fieldset) => fieldset.querySelector('legend')?.textContent === 'Chủ đề',
      );
      const values = [...(topicFieldset?.querySelectorAll('a') ?? [])].map(
        (link) => link.textContent ?? '',
      );
      unmount();
      return values;
    };

    const scoped = await optionsFor(appliedArticles, '/nghien-cuu/bai-bao-ung-dung');
    const unscoped = await optionsFor(allArticles, '/nghien-cuu/bai-bao-ung-dung');

    // `Chuyên khảo` là một bản ghi trong số mười bốn ấn phẩm, nên danh sách topic
    // của nó phải hẹp hơn hẳn — trước đây cả hai trang chào đúng một danh sách và
    // gần như mọi lựa chọn trên trang chuyên khảo đều trả về rỗng.
    expect(scoped.length).toBeGreaterThan(0);
    expect(scoped.length).toBeLessThan(unscoped.length);
    expect(unscoped).toEqual(expect.arrayContaining(scoped));
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
