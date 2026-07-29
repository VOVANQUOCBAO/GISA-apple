import { expect, test } from '@playwright/test';

const representativeRoutes = [
  '/nghien-cuu/du-an',
  '/nghien-cuu/bai-bao-khoa-hoc',
  '/tu-van/cong-cu',
  '/khoa-hoc',
  '/chuyen-gia',
  '/cong-dong',
  '/tin-tuc',
  '/tin-tuc/thong-bao-lich',
];

test('representative hubs and listings expose a stable page shell', async ({ page }) => {
  for (const path of representativeRoutes) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});

test('keyboard filtering normalizes URL state and back-forward restores it', async ({
  page,
}) => {
  await page.goto('/nghien-cuu/du-an?q=TRADE4SD&page=3&unsafe=discard');

  const filter = page.getByRole('link', { name: 'Phát triển bền vững' });
  await filter.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(
    '/nghien-cuu/du-an?q=TRADE4SD&topic=Ph%C3%A1t+tri%E1%BB%83n+b%E1%BB%81n+v%E1%BB%AFng',
  );
  await expect(page.getByRole('link', { name: 'TRADE4SD' })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/page=3/);
  await page.goForward();
  await expect(page).toHaveURL(/topic=Ph%C3%A1t\+tri%E1%BB%83n/);
});

test('no-result state clears every active filter', async ({ page }) => {
  await page.goto('/nghien-cuu/du-an?q=khong-co-ket-qua&topic=khong-co');

  await expect(
    page.getByRole('heading', { name: 'Không có kết quả phù hợp' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Xóa bộ lọc' }).click();
  await expect(page).toHaveURL('/nghien-cuu/du-an');
  await expect(page.getByRole('link', { name: 'TRADE4SD' })).toBeVisible();
});
