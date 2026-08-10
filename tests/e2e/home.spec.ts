import { expect, test } from '@playwright/test';

const viewports = [
  { height: 844, name: 'mobile-390', width: 390 },
  { height: 1024, name: 'tablet-768', width: 768 },
  { height: 900, name: 'compact-1024', width: 1024 },
  { height: 900, name: 'desktop-1440', width: 1440 },
];

for (const viewport of viewports) {
  test(`home is safe and responsive at ${viewport.width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('gisa-site-intro-seen', 'true');
    });
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

    await page.evaluate(async () => {
      const step = Math.max(420, window.innerHeight * 0.72);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
      const imagesReady = Promise.all(
        Array.from(document.images, (image) => {
          if (image.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            image.addEventListener('error', () => resolve(), { once: true });
            image.addEventListener('load', () => resolve(), { once: true });
          });
        }),
      );
      await Promise.race([
        imagesReady,
        new Promise<void>((resolve) => setTimeout(resolve, 3_000)),
      ]);
      window.scrollTo(0, 0);
    });

    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
      animations: 'disabled',
      fullPage: true,
      timeout: 30_000,
    });
  });
}
