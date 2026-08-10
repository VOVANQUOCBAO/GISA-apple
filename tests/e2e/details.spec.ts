import { expect, test } from '@playwright/test';

const detailRoutes = [
  '/nghien-cuu/du-an/trade4sd',
  '/nghien-cuu/bai-bao-khoa-hoc/mo-hinh-chuan-doi-sanh-do-luong-hieu-suat',
  '/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue',
  '/chuyen-gia/hoang-van-viet',
  '/cong-dong/mo-hinh-phat-trien-kinh-te-tuan-hoan-tai-dia-phuong',
  '/tin-tuc/tai-chinh-khi-hau-va-phat-trien',
  '/tin-tuc/thong-bao-lich/tuyen-dung-vi-tri-tro-ly-nghien-cuu',
];

test('every sourced detail kind renders without placeholder facts', async ({ page }) => {
  for (const path of detailRoutes) {
    const response = await page.goto(path);
    expect(response?.ok(), `${path} should resolve`).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('complementary', { name: 'Nguồn nội dung' })).toBeVisible();
    await expect(page.locator('body')).not.toContainText('undefined');
    await expect(page.locator('body')).not.toContainText('đang cập nhật');
  }
});

test('course carries context to the simulated registration route', async ({ page }) => {
  await page.goto('/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue');

  await expect(
    page.getByRole('link', { name: 'Đăng ký quan tâm khóa học' }),
  ).toHaveAttribute(
    'href',
    '/dang-ky/khoa-hoc?course=ke-toan-thuc-hanh-va-toi-uu-hoa-thue',
  );
  await expect(page.locator('body')).not.toContainText('Học phí');
  await expect(page.locator('body')).not.toContainText('Giảng viên');
});

test('archived notice does not claim that recruitment is active', async ({ page }) => {
  await page.goto('/tin-tuc/thong-bao-lich/tuyen-dung-vi-tri-tro-ly-nghien-cuu');

  await expect(page.getByText(/thông báo này thuộc kho lưu trữ/i)).toBeVisible();
  await expect(
    page.getByRole('complementary', { name: 'Thông tin chính' }),
  ).toContainText('Không xác nhận còn hiệu lực');
  await expect(page.locator('body')).not.toContainText('Đang tuyển');
});
