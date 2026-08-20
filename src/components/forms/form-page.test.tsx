import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { FormPage, breadcrumbItemsForForm } from './form-page';

describe('FormPage navigation context', () => {
  test.each([
    ['tu-van', '/tu-van/linh-vuc', 'Tư vấn'],
    ['khoa-hoc', '/dao-tao/linh-vuc', 'Đào tạo'],
    ['hop-tac', '/mang-luoi/thuc-day-hop-tac', 'Mạng lưới'],
  ] as const)('maps %s back to its navigation section', (kind, href, label) => {
    expect(breadcrumbItemsForForm(kind)).toContainEqual({ href, label });
  });

  test('renders a compact visible breadcrumb for the partnership form', () => {
    render(<FormPage kind="hop-tac" />);
    const breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn' });

    expect(within(breadcrumb).getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/');
    expect(within(breadcrumb).queryByText('Mạng lưới')).not.toBeInTheDocument();
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
