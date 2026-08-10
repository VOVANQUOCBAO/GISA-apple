import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { ExpertShowcase } from './expert-showcase';

describe('ExpertShowcase', () => {
  test('shows a portrait-only carousel and changes the active profile', () => {
    const { container } = render(<ExpertShowcase />);

    expect(screen.getByRole('heading', { name: 'Mạng lưới tri thức GISA' })).toBeInTheDocument();
    expect(screen.queryByText(/20 chuyên gia/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Quy tụ các chuyên gia/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Xem hồ sơ ThS. NCS.TS Trần Anh Khang' })).toHaveAttribute(
      'href',
      '/chuyen-gia/tran-anh-khang',
    );
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(
      container.querySelector('#chuyen-gia-noi-bat [data-scroll-motion="reveal"]'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Chọn GS. TS. Attila Jambor' }));

    expect(screen.getByRole('link', { name: 'Xem hồ sơ GS. TS. Attila Jambor' })).toHaveAttribute(
      'href',
      '/chuyen-gia/attila-jambor',
    );
  });
});
