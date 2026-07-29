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
