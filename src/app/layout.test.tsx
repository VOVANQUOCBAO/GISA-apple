import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

test('renders the Vietnamese document shell and skip link', () => {
  render(
    <RootLayout>
      <main id="main-content">Nội dung</main>
    </RootLayout>
  );

  expect(
    screen.getByRole('link', { name: 'Bỏ qua đến nội dung chính' })
  ).toHaveAttribute('href', '#main-content');
  expect(document.documentElement.lang).toBe('vi');
});

test('renders the ENGONOW-only footer affiliation signature', () => {
  render(
    <RootLayout>
      <main id="main-content">Nội dung</main>
    </RootLayout>
  );

  expect(screen.getByText('Designed by')).toBeInTheDocument();
  expect(screen.getByAltText('ENGONOW')).toBeInTheDocument();
  expect(screen.queryByText('Jay Smith')).not.toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: 'Truy cập nền tảng học tập ENGONOW' })
  ).toHaveAttribute('href', 'https://study.engonow.com/vi');
  expect(
    screen.getByRole('navigation', { name: 'Thiết kế bởi ENGONOW' })
      .closest('[data-scroll-motion]')
  ).toHaveAttribute('data-scroll-motion', 'reveal');
  expect(screen.queryByText('Quyền riêng tư')).not.toBeInTheDocument();
  expect(screen.queryByText('Võ Văn Quốc Bảo')).not.toBeInTheDocument();
});
