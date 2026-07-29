import { expect, test } from '@playwright/test';

const detailRoutes = [
  '/nghien-cuu/du-an/trade4sd',
  '/nghien-cuu/bai-bao-khoa-hoc/mo-hinh-chuan-doi-sanh-do-luong-hieu-suat',
  '/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue',
  '/chuyen-gia/nguyen-minh-khoi',
  '/cong-dong/sang-kien-kinh-te-ben-vung',
  '/tin-tuc/tai-chinh-khi-hau-va-phat-trien',
  '/tin-tuc/thong-bao-lich/tuyen-dung-vi-tri-tro-ly-nghien-cuu',
];

test('every sourced detail kind renders without placeholder facts', async ({ page }) => {
  for (const path of detailRoutes) {
    await page.goto(path);
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

  await expect(page.getByText(/không xác nhận nội dung này còn hiệu lực/i)).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Đang tuyển');
});
