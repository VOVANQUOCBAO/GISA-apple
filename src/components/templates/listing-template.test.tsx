import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { FilterBar } from '@/components/ui/filter-bar';
import { Pagination } from '@/components/ui/pagination';

describe('listing URL state', () => {
  test('filter links reset page, preserve the query, and discard unknown keys', () => {
    render(
      <FilterBar
        filters={{ topic: ['Kinh tế', 'Xã hội'] }}
        path="/nghien-cuu/du-an"
        query={{
          page: '3',
          q: 'bền vững',
          topic: 'Kinh tế',
          unsafe: 'không-được-giữ',
        }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Xã hội' })).toHaveAttribute(
      'href',
      '/nghien-cuu/du-an?q=b%E1%BB%81n+v%E1%BB%AFng&topic=X%C3%A3+h%E1%BB%99i',
    );
  });

  test('pagination omits default page one and keeps active public state', () => {
    render(
      <Pagination
        page={2}
        pageCount={3}
        path="/tin-tuc"
        query={{ page: '2', q: 'khí hậu', topic: 'Môi trường' }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Trang 1' })).toHaveAttribute(
      'href',
      '/tin-tuc?q=kh%C3%AD+h%E1%BA%ADu&topic=M%C3%B4i+tr%C6%B0%E1%BB%9Dng',
    );
    expect(screen.getByRole('link', { name: 'Trang 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
