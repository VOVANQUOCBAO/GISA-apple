import { expect, test } from '@playwright/test';

test('home has one visible h1 and no horizontal overflow', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
  );

  expect(overflow).toBe(false);
});
