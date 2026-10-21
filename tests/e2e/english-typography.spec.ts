import { expect, test } from '@playwright/test';

import { expertFixtures } from '../../src/content/fixtures/experts';
import { toolFixtures } from '../../src/content/fixtures/tools';

const englishRoutes = [
  '/',
  '/gioi-thieu/cau-chuyen-gisa',
  '/gioi-thieu/linh-vuc-hoat-dong',
  '/chuyen-gia',
  '/chuyen-gia?page=2',
  '/nghien-cuu/linh-vuc',
  '/tu-van/linh-vuc',
  '/tu-van/cong-cu',
  '/tu-van/thanh-qua',
  '/mang-luoi/quy-nha-tai-tro',
  ...toolFixtures.map((tool) => tool.path),
  ...expertFixtures.map((expert) => expert.path),
];

test.use({ reducedMotion: 'reduce' });

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
          '#main-content p:not([data-copy="label"]), #main-content [data-copy="body"], footer [data-copy="body"]',
        )].filter((element) => visible(element) && element.textContent?.trim());
        return {
          count: prose.length,
          unaligned: prose.filter((element) => {
            const style = getComputedStyle(element);
            return style.textAlign !== 'justify' || style.textAlignLast !== 'start';
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
