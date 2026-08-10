import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { resolvePage } from '@/content/pages';
import { FixtureContentRepository } from '@/content/repositories/fixture-content-repository';

import { ExpertListingTemplate, expertInitials } from './expert-listing-template';
import { ExpertTemplate } from './expert-template';

const repository = new FixtureContentRepository();

describe('expert directory templates', () => {
  test('creates restrained initials after removing academic honorifics', () => {
    expect(expertInitials('TS. Hoàng Văn Việt')).toBe('HV');
    expect(expertInitials('ThS. NCS.TS Trần Anh Khang')).toBe('TK');
    expect(expertInitials('Prof. Marina Tomić Maksan')).toBe('MM');
  });

  test('renders the listing as verified people profiles with pagination', async () => {
    const definition = resolvePage('/chuyen-gia');
    expect(definition?.template).toBe('listing');
    if (!definition || definition.template !== 'listing') throw new Error('Missing expert listing');

    const result = await repository.list({
      collection: 'experts',
      filters: {},
      page: 1,
      pageSize: 12,
      query: '',
    });
    const firstItem = result.items[0];
    if (!firstItem) throw new Error('Missing expert summaries');
    render(
      <ExpertListingTemplate
        definition={definition}
        path="/chuyen-gia"
        result={result}
        searchParams={{}}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Chuyên gia' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Tri thức được dẫn dắt bởi con người' })).toBeVisible();
    expect(screen.getByRole('link', { name: firstItem.title })).toHaveAttribute('href', firstItem.path);
    expect(
      screen.getByRole('img', {
        name: `Hồ sơ ${firstItem.title} chưa có ảnh được công bố`,
      }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Trang 2' })).toBeVisible();
  });

  test('keeps the detail page within facts published by the source', async () => {
    const record = await repository.getByPath('/chuyen-gia/hoang-van-viet');
    if (!record) throw new Error('Missing verified expert fixture');

    render(<ExpertTemplate record={record} />);

    expect(screen.getByRole('heading', { level: 1, name: record.title })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Lĩnh vực chuyên môn' })).toBeVisible();
    expect(document.body).toHaveTextContent('Phát triển Bền vững');
    expect(screen.getByRole('heading', { name: 'Phạm vi thông tin đã xác minh' })).toBeVisible();
    expect(screen.queryByText(/Học vị/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tiểu sử đầy đủ:/)).not.toBeInTheDocument();
  });
});
