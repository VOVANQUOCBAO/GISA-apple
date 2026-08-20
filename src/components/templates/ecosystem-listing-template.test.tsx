import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { PageDefinition } from '@/content/pages';
import type { ContentSummary, PaginatedResult } from '@/content/types';
import { newsFixtures } from '@/content/fixtures/news';
import { partnerFixtures } from '@/content/fixtures/partners';

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
    expect(container).toHaveTextContent(item.summary);
    expect(screen.queryByRole('heading', { name: 'Tìm theo nội dung bạn quan tâm' })).not.toBeInTheDocument();
    expect(screen.queryByText('Chọn một tiêu chí để thu hẹp danh sách.')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Lọc sáng kiến cộng đồng' })).toBeInTheDocument();
    expect(container.querySelector('legend')?.className).toContain('visuallyHidden');
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

  test('keeps the Tin tức index free of topic filters and filter guidance', () => {
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
        result={{
          ...result,
          availableFilters: { topic: ['Môi trường'] },
          items: [newsFixtures[0]],
          total: 1,
        }}
        searchParams={{}}
      />,
    );

    expect(screen.queryByText('Tìm theo nội dung bạn quan tâm')).not.toBeInTheDocument();
    expect(screen.queryByText('Chọn một tiêu chí để thu hẹp danh sách.')).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Chủ đề' })).not.toBeInTheDocument();
  });

  test('separates domestic and international partners', () => {
    const partnerDefinition: Extract<PageDefinition, { template: 'listing' }> = {
      collection: 'partners',
      description: 'Mạng lưới đối tác GISA.',
      filters: [],
      path: '/mang-luoi/doi-tac',
      template: 'listing',
      title: 'Đối tác',
    };
    const partnerItems: ContentSummary[] = [
      { ...item, collection: 'partners', id: 'partner-ueh', kind: 'partner', metadata: { partnerScope: 'domestic' }, path: '/mang-luoi/doi-tac/ueh', title: 'UEH University' },
      { ...item, collection: 'partners', id: 'partner-kent', kind: 'partner', metadata: { partnerScope: 'international' }, path: '/mang-luoi/doi-tac/kent', title: 'University of Kent' },
    ];

    render(
      <EcosystemListingTemplate
        definition={partnerDefinition}
        path={partnerDefinition.path}
        result={{ ...result, availableFilters: {}, items: partnerItems, total: 2 }}
        searchParams={{}}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Đối tác trong nước' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Đối tác quốc tế' })).toBeVisible();
    expect(partnerFixtures.every((partner) => ['domestic', 'international'].includes(String(partner.metadata.partnerScope)))).toBe(true);
    expect(
      partnerFixtures
        .filter((partner) => partner.metadata.partnerScope === 'domestic')
        .map((partner) => partner.id),
    ).toEqual([
      'partner-ueh-university',
      'partner-golden-land',
      'partner-halo-land',
      'partner-moc-gia',
    ]);
  });

  test('renders a meaningful image for news cards', () => {
    const newsDefinition: Extract<PageDefinition, { template: 'listing' }> = {
      collection: 'news',
      description: 'Tin tức và cập nhật từ GISA.',
      filters: [],
      path: '/tin-tuc',
      template: 'listing',
      title: 'Tin tức',
    };
    const newsItem = newsFixtures[0];

    render(
      <EcosystemListingTemplate
        definition={newsDefinition}
        path={newsDefinition.path}
        result={{ ...result, availableFilters: {}, items: [newsItem], total: 1 }}
        searchParams={{}}
      />,
    );

    expect(screen.getByRole('img', { name: newsItem.image?.alt })).toBeVisible();
    expect(newsFixtures.every((news) => Boolean(news.image))).toBe(true);
  });
});
