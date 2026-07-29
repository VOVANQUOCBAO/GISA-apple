import { expect, test } from '@playwright/test';

test('empty, matched, and unmatched searches expose safe states', async ({
  page,
}) => {
  await page.goto('/tim-kiem');
  await expect(
    page.getByRole('heading', { name: 'Tìm nội dung đã được xác minh' }),
  ).toBeVisible();

  const search = page.getByLabel('Tìm kiếm trên website GISA');
  await search.fill('TRADE4SD');
  await search.press('Enter');
  await expect(page).toHaveURL(/\/tim-kiem\?q=TRADE4SD/);
  await expect(page.getByRole('link', { name: 'TRADE4SD' })).toBeVisible();

  await search.fill('không-có-kết-quả-xyz');
  await search.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Không tìm thấy kết quả' }),
  ).toBeVisible();
});

test('type filters preserve the query and browser history', async ({ page }) => {
  await page.goto('/tim-kiem?q=GISA');
  await page.getByRole('link', { name: 'Dự án' }).click();
  await expect(page).toHaveURL(/q=GISA.*type=projects|type=projects.*q=GISA/);
  await expect(page.getByRole('link', { name: 'Dự án' })).toHaveAttribute(
    'aria-current',
    'true',
  );

  await page.goBack();
  await expect(page).toHaveURL('/tim-kiem?q=GISA');
  await page.goForward();
  await expect(page).toHaveURL(/type=projects/);
});

test('an injection-shaped query is rendered as text, not HTML', async ({
  page,
}) => {
  const query = '<img src=x onerror=alert(1)>';
  await page.goto(`/tim-kiem?q=${encodeURIComponent(query)}`);

  await expect(page.getByText(query, { exact: false })).toBeVisible();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
});
