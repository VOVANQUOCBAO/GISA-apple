import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { resolvePage } from '@/content/pages';

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
});
