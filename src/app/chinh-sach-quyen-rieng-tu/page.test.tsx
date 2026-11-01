import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import PrivacyPolicyPage, { generateMetadata } from './page';

vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined }) }));

describe('PrivacyPolicyPage', () => {
  test('names the route and explains online submission handling', async () => {
    render(<PrivacyPolicyPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Chính sách quyền riêng tư' }),
    ).toBeVisible();
    expect(screen.getByText(/chuyển thông tin tới kênh tiếp nhận/i)).toBeVisible();
    expect(screen.getByText(/Dữ liệu được truyền qua kết nối HTTPS/i)).toBeVisible();
    expect(screen.getByText(/đề nghị kiểm tra, cập nhật hoặc xóa/i)).toBeVisible();
    expect((await generateMetadata()).title).toBe('Chính sách quyền riêng tư');
  });
});
