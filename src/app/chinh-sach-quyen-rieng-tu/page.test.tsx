import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import PrivacyPolicyPage, { metadata } from './page';

describe('PrivacyPolicyPage', () => {
  test('names the route and explains online submission handling', () => {
    render(<PrivacyPolicyPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Chính sách quyền riêng tư' }),
    ).toBeVisible();
    expect(screen.getByText(/chuyển thông tin tới kênh tiếp nhận/i)).toBeVisible();
    expect(screen.getByText(/Dữ liệu được truyền qua kết nối HTTPS/i)).toBeVisible();
    expect(screen.getByText(/đề nghị kiểm tra, cập nhật hoặc xóa/i)).toBeVisible();
    expect(metadata.title).toBe('Chính sách quyền riêng tư');
  });
});
