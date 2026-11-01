import { expect, test } from '@playwright/test';

import { allContentFixtures } from '../../src/content/fixtures';
import { PAGE_REGISTRY } from '../../src/content/pages';
import { isPublishableEvidence } from '../../src/content/evidence';

const englishRoutes = [...new Set([
  ...PAGE_REGISTRY.flatMap((definition) => 'path' in definition ? [definition.path] : []),
  ...allContentFixtures.filter((record) => isPublishableEvidence(record.evidenceStatus)).map((record) => record.path),
  '/landing-lp', '/landing-bdt', '/chuyen-gia?page=2', '/khoa-hoc?page=2',
  '/tin-tuc?page=2', '/tim-kiem?q=leadership', '/dang-ky/khoa-hoc?course=tam-ly-hoc-lanh-dao',
])];

test.use({ contextOptions: { reducedMotion: 'reduce' } });

for (const width of [390, 1920]) {
  for (const route of englishRoutes) {
    test(`English prose has two aligned edges: ${route} at ${width}px`, async ({ page, context, baseURL }) => {
      await page.setViewportSize({ width, height: 1000 });
      await context.addCookies([{ name: 'gisa-language', value: 'en', url: baseURL! }]);
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await page.evaluate(() => document.fonts.ready);

      const result = await page.evaluate(() => {
        const visible = (element: Element) => {
          if (!element.getClientRects().length) return false;
          for (let current: Element | null = element; current; current = current.parentElement) {
            const style = getComputedStyle(current);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || style.clipPath === 'inset(50%)' || style.clip !== 'auto') return false;
          }
          return true;
        };
        const prose = [...document.querySelectorAll<HTMLElement>(
          '#main-content p:not([data-copy="label"]):not([data-copy="statement"]), #main-content [data-copy="body"], footer [data-copy="body"]',
        )].filter((element) => visible(element) && element.textContent?.trim());
        return {
          count: prose.length,
          unaligned: prose.filter((element) => {
            const style = getComputedStyle(element);
            return style.textAlign !== 'justify' || style.textAlignLast !== 'start' || style.hyphens !== 'auto';
          }).map((element) => element.textContent),
          overflow: prose.filter((element) => element.scrollWidth > element.clientWidth + 3).map((element) => element.textContent),
          pageWidth: document.documentElement.scrollWidth,
        };
      });

      expect(result.count).toBeGreaterThan(0);
      expect(result.unaligned).toEqual([]);
      expect(result.overflow).toEqual([]);
      expect(result.pageWidth).toBeLessThanOrEqual(width + 2);
    });
  }
}

test('English selection survives navigation, filters and form validation', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'gisa-language', value: 'en', url: baseURL! }]);
  await page.goto('/tim-kiem?q=leadership');
  await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible();
  await expect(page.locator('main')).toContainText('Leadership Psychology');
  await page.goto('/dang-ky/khoa-hoc?course=tam-ly-hoc-lanh-dao');
  await expect(page.getByLabel('Course of Interest')).toHaveValue('tam-ly-hoc-lanh-dao');
  await page.getByRole('button', { name: 'Send Information' }).click();
  await expect(page.getByRole('heading', { name: 'Please Check the Following Fields' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Your name must contain at least 2 characters.');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
