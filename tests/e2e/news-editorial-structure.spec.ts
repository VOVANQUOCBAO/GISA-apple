import { expect, test } from '@playwright/test';

const routes = [
  '/tin-tuc/hoi-thao-thuong-mai-nong-san-ben-vung-mekong',
  '/tin-tuc/san-pham-khoa-hoc-cong-nghe-tai-trien-lam-tang-truong-xanh',
  '/tin-tuc/cong-trinh-thang-giai-sang-tao-khoa-hoc-cong-nghe-viet-nam-2024',
  '/tin-tuc/tai-chinh-khi-hau-va-phat-trien',
  '/tin-tuc/nhua-tan-trong-nuoc-bien',
];

for (const width of [1440, 1024, 768, 390]) {
  test(`news metadata spans above a centered reading column at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const route of routes) {
      await page.goto(route, { waitUntil: 'networkidle' });
      const article = page.locator('article[data-kind="news"]');
      const facts = page.getByRole('region', { name: 'Thông tin chính' });
      const body = page.getByRole('region', { name: 'Nội dung bài viết' });
      await expect(facts).toBeVisible();
      const factsBox = await facts.boundingBox();
      const articleBox = await article.boundingBox();
      const bodyBox = await body.boundingBox();
      expect(factsBox!.y + factsBox!.height, route).toBeLessThan(bodyBox!.y);
      expect(factsBox!.width, route).toBeCloseTo(articleBox!.width, 0);
      expect(await facts.evaluate((node) => getComputedStyle(node).position)).toBe('static');
      expect(bodyBox!.x + bodyBox!.width / 2, route).toBeCloseTo(width / 2, 0);
      expect(bodyBox!.width).toBeLessThanOrEqual(760);
      if (width >= 1024) expect(bodyBox!.width).toBeGreaterThanOrEqual(720);
      if (width === 390) {
        expect(bodyBox!.x).toBe(20);
        expect(await page.locator('h1').evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeLessThanOrEqual(44);
      }
      const paragraphs = await body.locator(':scope > div > p').evaluateAll((nodes) => nodes.map((node) => ({
        fontSize: parseFloat(getComputedStyle(node).fontSize),
        alignment: getComputedStyle(node).textAlign,
      })));
      expect(paragraphs.length).toBeGreaterThan(0);
      expect(paragraphs.every(({ fontSize, alignment }) => fontSize <= 20 && ['left', 'start'].includes(alignment))).toBe(true);
      expect(await article.locator('figure').evaluateAll((nodes) => nodes.every((node) => {
        const bounds = node.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth;
      }))).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const footer = article.locator('footer');
      await expect(footer.getByRole('link', { name: 'Xem tin tức' })).toHaveAttribute('href', '/tin-tuc');
      const closingAction = footer.getByRole('region', { name: 'Bước tiếp theo' });
      expect(await closingAction.evaluate((node) => ({
        background: getComputedStyle(node).backgroundColor,
        radius: getComputedStyle(node).borderRadius,
        padding: getComputedStyle(node).padding,
      }))).toEqual({ background: 'rgba(0, 0, 0, 0)', radius: '0px', padding: '0px' });
    }
  });
}
