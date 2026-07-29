import { expect, test } from '@playwright/test';

test('canonical and Open Graph metadata use approved absolute URLs', async ({
  page,
}) => {
  await page.goto('/nghien-cuu/du-an?page=1&topic=test');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://gisa.edu.vn/nghien-cuu/du-an',
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://gisa.edu.vn/nghien-cuu/du-an',
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
});

test('search is noindex, follow with a presentation-free canonical', async ({
  page,
}) => {
  await page.goto('/tim-kiem?q=TRADE4SD&type=projects&page=1');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://gisa.edu.vn/tim-kiem',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex, follow/,
  );
});

test('detail JSON-LD always has breadcrumbs and gates unverified Course fields', async ({
  page,
}) => {
  await page.goto('/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue');

  const entries = await page
    .locator('script[data-structured-data="content"]')
    .evaluate((element) => JSON.parse(element.textContent ?? '[]'));

  expect(entries.some((entry: { '@type'?: string }) => entry['@type'] === 'BreadcrumbList')).toBe(true);
  expect(entries.some((entry: { '@type'?: string }) => entry['@type'] === 'Course')).toBe(false);
});

test('sitemap and production robots enforce the indexing policy', async ({
  request,
}) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('https://gisa.edu.vn/nghien-cuu/du-an/trade4sd');
  expect(sitemap).not.toContain('https://gisa.edu.vn/tim-kiem');
  expect(sitemap).not.toContain('/dang-ky/');

  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Allow: /');
  expect(robots).not.toContain('Disallow: /');
  expect(robots).toContain('Sitemap: https://gisa.edu.vn/sitemap.xml');
});
