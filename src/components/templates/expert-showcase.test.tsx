import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { ExpertShowcase } from './expert-showcase';

describe('ExpertShowcase', () => {
  test('shows a portrait-only carousel and changes the active profile', () => {
    const { container } = render(<ExpertShowcase />);

    expect(screen.getByRole('heading', { name: 'Đội ngũ chuyên gia' })).toBeInTheDocument();
    expect(screen.queryByText(/20 chuyên gia/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Quy tụ các chuyên gia/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Xem hồ sơ TS. Hoàng Văn Việt' })).toHaveAttribute(
      'href',
      '/chuyen-gia/hoang-van-viet',
    );
    expect(screen.getAllByRole('img')).toHaveLength(5);
    expect(
      container.querySelector('#chuyen-gia-noi-bat [data-scroll-motion="reveal"]'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Chọn TS. Phan Thị Kim Anh' }));

    expect(screen.getByRole('link', { name: 'Xem hồ sơ TS. Phan Thị Kim Anh' })).toHaveAttribute(
      'href',
      '/chuyen-gia/phan-thi-kim-anh',
    );
  });

  test('kéo trái phải bằng chuột đổi chuyên gia đang xem', () => {
    const { container } = render(<ExpertShowcase />);
    const shell = container.querySelector('#chuyen-gia-noi-bat > div') as HTMLElement;
    const activeName = () =>
      container.querySelector('article[data-active="true"] strong')?.textContent;

    const start = activeName();

    // Kéo sang trái: sang chuyên gia kế tiếp.
    fireEvent.pointerDown(shell, { button: 0, clientX: 600, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerMove(shell, { clientX: 400, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerUp(shell, { clientX: 400, pointerId: 1, pointerType: 'mouse' });

    const afterLeft = activeName();
    expect(afterLeft).not.toBe(start);

    // Kéo ngược lại: quay về chuyên gia ban đầu.
    fireEvent.pointerDown(shell, { button: 0, clientX: 400, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerMove(shell, { clientX: 600, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerUp(shell, { clientX: 600, pointerId: 1, pointerType: 'mouse' });

    expect(activeName()).toBe(start);

    // Di chuyển ngắn hơn ngưỡng thì không đổi, tránh cướp thao tác bấm.
    fireEvent.pointerDown(shell, { button: 0, clientX: 600, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerMove(shell, { clientX: 570, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerUp(shell, { clientX: 570, pointerId: 1, pointerType: 'mouse' });

    expect(activeName()).toBe(start);
  });
});
