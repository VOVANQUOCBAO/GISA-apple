import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import PrivacyPolicyPage, { metadata } from './page';

describe('PrivacyPolicyPage', () => {
  test('names the route as a privacy policy and states the current browser-only boundary', () => {
    render(<PrivacyPolicyPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Chính sách quyền riêng tư' }),
    ).toBeVisible();
    expect(screen.getByText(/dữ liệu không được gửi tới GISA/i)).toBeVisible();
    expect(screen.getByText(/không được lưu trên máy chủ của GISA/i)).toBeVisible();
    expect(screen.getByText(/không gửi yêu cầu qua mạng/i)).toBeVisible();
    expect(metadata.title).toBe('Chính sách quyền riêng tư');
  });
});
