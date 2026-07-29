import { expect, test } from '@playwright/test';

const viewports = [
  { height: 844, name: 'mobile-390', width: 390 },
  { height: 1024, name: 'tablet-768', width: 768 },
  { height: 900, name: 'compact-1024', width: 1024 },
  { height: 900, name: 'desktop-1440', width: 1440 },
];

for (const viewport of viewports) {
  test(`home is safe and responsive at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Đăng ký tư vấn' }).first()).toHaveAttribute(
      'href',
      '/dang-ky/tu-van',
    );

    const collectionCounts = await page
      .locator('[data-collection]')
      .evaluateAll((sections) =>
        sections.map((section) => section.querySelectorAll('article').length),
      );
    expect(collectionCounts.every((count) => count <= 4)).toBe(true);

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasOverflow).toBe(false);

    const logoKeepsRatio = await page.locator('header img').evaluate((image) => {
      const element = image as HTMLImageElement;
      const renderedRatio = element.getBoundingClientRect().width / element.getBoundingClientRect().height;
      const naturalRatio = element.naturalWidth / element.naturalHeight;
      return Math.abs(renderedRatio - naturalRatio) < 0.01;
    });
    expect(logoKeepsRatio).toBe(true);

    await page.evaluate(() => {
      document.querySelectorAll('nextjs-portal').forEach((portal) => portal.remove());
    });

    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
      animations: 'disabled',
      fullPage: true,
    });
  });
}
