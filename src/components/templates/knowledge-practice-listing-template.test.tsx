import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { resolvePage } from '@/content/pages';
import { projectFixtures } from '@/content/fixtures/projects';
import { toolFixtures } from '@/content/fixtures/tools';

import { KnowledgePracticeListingTemplate } from './knowledge-practice-listing-template';

describe('KnowledgePracticeListingTemplate', () => {
  test('offers the consulting CTA when the scoped project collection is empty', () => {
    const definition = resolvePage('/tu-van/du-an');
    if (!definition || definition.template !== 'listing') {
      throw new Error('Missing consulting project listing');
    }

    render(
      <KnowledgePracticeListingTemplate
        definition={definition}
        path="/tu-van/du-an"
        result={{
          availableFilters: {},
          items: [],
          page: 1,
          pageCount: 1,
          pageSize: 12,
          total: 0,
        }}
        searchParams={{}}
      />,
    );

    const emptyHeading = screen.getByRole('heading', {
      name: 'Chưa có nội dung trong phạm vi này',
    });
    const emptyState = emptyHeading.closest('section');

    expect(emptyHeading).toBeVisible();
    expect(emptyState).not.toBeNull();
    expect(
      within(emptyState!).getByRole('link', { name: 'Trao đổi nhu cầu tư vấn' }),
    ).toHaveAttribute('href', '/dang-ky/tu-van');
  });

  test('keeps project cards uniform and pairs each image with its program logo', () => {
    const definition = resolvePage('/nghien-cuu/du-an');
    if (!definition || definition.template !== 'listing') {
      throw new Error('Missing research project listing');
    }

    const { container } = render(
      <KnowledgePracticeListingTemplate
        definition={definition}
        path={definition.path}
        result={{
          availableFilters: { topic: ['Phát triển bền vững'] },
          items: projectFixtures,
          page: 1,
          pageCount: 1,
          pageSize: 12,
          total: projectFixtures.length,
        }}
        searchParams={{}}
      />,
    );

    const list = screen.getByRole('list', { name: definition.title });
    expect(within(list).getAllByRole('article')).toHaveLength(projectFixtures.length);
    expect(within(list).getAllByRole('img')).toHaveLength(projectFixtures.length);
    expect(list.querySelectorAll('[class*="projectLogo"] img')).toHaveLength(projectFixtures.length);
    expect(container.querySelector('[data-featured]')).toBeNull();
    expect(screen.getByRole('region', { name: 'Lọc nội dung' })).toBeVisible();
    expect(screen.queryByText('Thu hẹp danh sách theo nhu cầu')).not.toBeInTheDocument();
    expect(screen.queryByText('Mỗi lựa chọn sẽ cập nhật danh sách bên dưới.')).not.toBeInTheDocument();
  });

  test('gives every consulting tool a distinct visual icon', () => {
    const definition = resolvePage('/tu-van/cong-cu');
    if (!definition || definition.template !== 'listing') {
      throw new Error('Missing consulting tool listing');
    }

    const { container } = render(
      <KnowledgePracticeListingTemplate
        definition={definition}
        path={definition.path}
        result={{
          availableFilters: {},
          items: toolFixtures,
          page: 1,
          pageCount: 1,
          pageSize: 12,
          total: toolFixtures.length,
        }}
        searchParams={{}}
      />,
    );

    expect(container.querySelectorAll('[class*="toolVisual"] svg')).toHaveLength(toolFixtures.length);
  });
});
