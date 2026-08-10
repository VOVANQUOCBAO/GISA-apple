import { describe, expect, test } from 'vitest';

import { NAVIGATION } from '@/content/navigation';

import { isNavigationGroupActive } from './desktop-navigation';

function group(label: string) {
  const result = NAVIGATION.find((item) => item.label === label);
  if (!result) throw new Error(`Không tìm thấy nhóm điều hướng ${label}`);
  return result;
}

describe('isNavigationGroupActive', () => {
  test('activates a group for a registered child outside the group URL prefix', () => {
    expect(isNavigationGroupActive('/dang-ky/hop-tac', group('Mạng lưới'))).toBe(true);
    expect(isNavigationGroupActive('/dang-ky/tu-van', group('Tư vấn'))).toBe(true);
    expect(isNavigationGroupActive('/dang-ky/khoa-hoc', group('Đào tạo'))).toBe(true);
  });

  test('does not activate unrelated groups', () => {
    expect(isNavigationGroupActive('/dang-ky/hop-tac', group('Tư vấn'))).toBe(false);
    expect(isNavigationGroupActive('/tin-tuc', group('Trang chủ'))).toBe(false);
  });
});
