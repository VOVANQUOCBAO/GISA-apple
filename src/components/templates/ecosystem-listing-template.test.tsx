import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { PageDefinition } from '@/content/pages';
import type { ContentSummary, PaginatedResult } from '@/content/types';

import {
  EcosystemListingTemplate,
  supportsEcosystemListingTemplate,
} from './ecosystem-listing-template';

const definition: Extract<PageDefinition, { template: 'listing' }> = {
  collection: 'initiatives',
  description: 'Sáng kiến thuộc nhánh cộng đồng.',
  filters: ['pillar'],
  path: '/cong-dong/kinh-te-ben-vung',
  template: 'listing',
  title: 'Kinh tế bền vững',
};

const item: ContentSummary = {
  collection: 'initiatives',
  evidenceStatus: 'verified',
  id: 'initiative-test',
  kind: 'initiative',
  metadata: { pillar: 'Kinh tế bền vững' },
  path: '/cong-dong/sang-kien-test',
  slug: 'sang-kien-test',
  summary: 'Kết nối tri thức – hành động tại địa phương.',
  tags: ['cộng đồng', 'kinh tế tuần hoàn'],
  title: 'Sáng kiến phát triển địa phương',
};

const result: PaginatedResult<ContentSummary> = {
  availableFilters: { pillar: ['Kinh tế bền vững'] },
  items: [item],
  page: 1,
  pageCount: 1,
  pageSize: 12,
  total: 1,
};

describe('EcosystemListingTemplate', () => {
  test('preserves collection, filter and route contracts without forced breaks', () => {
    const { container } = render(
      <EcosystemListingTemplate
        definition={definition}
        path={definition.path}
        result={result}
        searchParams={{}}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: definition.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: item.title })).toHaveAttribute('href', item.path);
    expect(
      screen
        .getAllByRole('link', { name: 'Kinh tế bền vững' })
        .find((link) => link.getAttribute('href')?.includes('?pillar=')),
    ).toHaveAttribute(
      'href',
      '/cong-dong/kinh-te-ben-vung?pillar=Kinh+t%E1%BA%BF+b%E1%BB%81n+v%E1%BB%AFng',
    );
    expect(container.querySelector('br')).toBeNull();
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  test('does not claim unrelated routes', () => {
    expect(supportsEcosystemListingTemplate('/tin-tuc')).toBe(true);
    expect(supportsEcosystemListingTemplate('/nghien-cuu/du-an')).toBe(false);
    expect(supportsEcosystemListingTemplate('/')).toBe(false);
  });

  test('does not repeat the section root in the Tin tức breadcrumb', () => {
    const newsDefinition: Extract<PageDefinition, { template: 'listing' }> = {
      collection: 'news',
      description: 'Tin tức và cập nhật từ GISA.',
      filters: [],
      path: '/tin-tuc',
      template: 'listing',
      title: 'Tin tức',
    };

    render(
      <EcosystemListingTemplate
        definition={newsDefinition}
        path={newsDefinition.path}
        result={{ ...result, availableFilters: {}, items: [], total: 0 }}
        searchParams={{}}
      />,
    );

    const breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn' });
    expect(within(breadcrumb).getAllByRole('listitem')).toHaveLength(2);
    expect(within(breadcrumb).getAllByText('Tin tức')).toHaveLength(1);
  });
});
