import { render, screen } from '@testing-library/react';

import { FixtureContentRepository } from '@/content/repositories';

import { SearchResults } from './search-results';

test('search excludes unverified records and renders an injection query as text', async () => {
  const repository = new FixtureContentRepository();
  const query = '<img src=x onerror=alert(1)>';
  const result = await repository.search({
    query,
    page: 1,
    pageSize: 12,
    filters: {},
  });

  expect(
    result.items.every((item) => item.evidenceStatus !== 'needs_verification'),
  ).toBe(true);

  render(<SearchResults query={query} result={result} />);

  expect(document.querySelector('img[src="x"]')).toBeNull();
  expect(screen.getByText(query, { exact: false })).toBeVisible();
});

test('an empty query offers public content destinations without loading results', () => {
  render(<SearchResults query="" result={null} />);

  expect(
    screen.getByRole('heading', { name: 'Bạn muốn tìm hiểu nội dung nào?' }),
  ).toBeVisible();
  expect(screen.getByRole('link', { name: 'Nghiên cứu' })).toHaveAttribute(
    'href',
    '/nghien-cuu',
  );
});
