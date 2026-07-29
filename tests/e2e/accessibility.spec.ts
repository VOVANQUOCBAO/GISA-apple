import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const representativeRoutes = [
  '/',
  '/nghien-cuu',
  '/nghien-cuu/du-an',
  '/nghien-cuu/du-an/trade4sd',
  '/khoa-hoc',
  '/khoa-hoc/khoa-hoc-dai-dien',
  '/chuyen-gia/chuyen-gia-dai-dien',
  '/dang-ky/tu-van',
  '/tim-kiem?q=GISA'
];

for (const path of representativeRoutes) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);

    const result = await new AxeBuilder({ page }).analyze();
    const blockingViolations = result.violations.filter((item) =>
      ['serious', 'critical'].includes(item.impact ?? '')
    );

    expect(blockingViolations).toEqual([]);
  });
}

test('keyboard focus remains visible and clear of the sticky header', async ({
  page,
}) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.locator('.skip-link');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  const skipBox = await skipLink.boundingBox();
  expect(skipBox).not.toBeNull();
  expect(skipBox?.y).toBeGreaterThanOrEqual(0);

  const outline = await skipLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
  });
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThanOrEqual(3);

  const menuTrigger = page.locator('header button[data-menu-index]').first();
  await menuTrigger.focus();
  await menuTrigger.press('Enter');
  await expect(menuTrigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menuTrigger).toBeFocused();
});

test('200% zoom equivalent preserves the core content without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 720, height: 450 });

  for (const path of representativeRoutes) {
    await page.goto(path);
    await expect(page.locator('h1:visible')).toHaveCount(1);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      `${path} must reflow at the CSS viewport produced by 200% zoom`,
    ).toBe(true);
  }
});

test('WCAG text spacing overrides reflow and reduced motion is respected', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/dang-ky/tu-van');
  await page.addStyleTag({
    content: `
      * { letter-spacing: 0.12em !important; line-height: 1.5 !important; word-spacing: 0.16em !important; }
      p { margin-bottom: 2em !important; }
    `,
  });

  await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
  expect(await page.locator('img:not([alt])').count()).toBe(0);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  expect(
    await page.locator('html').evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe('auto');
});
