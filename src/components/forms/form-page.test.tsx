import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { FormPage, breadcrumbItemsForForm } from './form-page';

describe('FormPage navigation context', () => {
  test.each([
    ['tu-van', '/tu-van', 'Tư vấn'],
    ['khoa-hoc', '/dao-tao', 'Đào tạo'],
    ['hop-tac', '/mang-luoi', 'Mạng lưới'],
  ] as const)('maps %s back to its navigation section', (kind, href, label) => {
    expect(breadcrumbItemsForForm(kind)).toContainEqual({ href, label });
  });

  test('renders the partnership section in the visible breadcrumb', () => {
    render(<FormPage kind="hop-tac" />);
    const breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn' });

    expect(within(breadcrumb).getByRole('link', { name: 'Mạng lưới' })).toHaveAttribute(
      'href',
      '/mang-luoi',
    );
    expect(
      within(breadcrumb).getByText('Thông tin đề nghị hợp tác').closest('li'),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('does not add a duplicate parent for the top-level contact route', () => {
    expect(breadcrumbItemsForForm('lien-he')).toEqual([
      { href: '/', label: 'Trang chủ' },
      { label: 'Nội dung liên hệ' },
    ]);
  });
});
