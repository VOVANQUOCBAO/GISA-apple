import { render, screen } from '@testing-library/react';

import { SiteFooter } from './site-footer';

test('publishes the approved Vietnamese institute contact details', () => {
  render(<SiteFooter />);

  expect(screen.getByRole('contentinfo')).toHaveTextContent(
    'Viện Phát triển Bền vững và Quản lý Nâng cao Toàn cầu',
  );
  expect(screen.getByRole('link', { name: /0818 711 799/ })).toHaveAttribute(
    'href',
    'tel:+84818711799',
  );
  expect(screen.getByRole('link', { name: 'info@gisa.edu.vn' })).toHaveAttribute(
    'href',
    'mailto:info@gisa.edu.vn',
  );
  expect(screen.getByRole('link', { name: 'Facebook GISA' })).toHaveAttribute(
    'href',
    'https://www.facebook.com/gisa.edu.vn/',
  );
});
