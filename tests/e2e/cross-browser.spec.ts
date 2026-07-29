import { expect, test } from '@playwright/test';

const representativeRoutes = [
  '/',
  '/nghien-cuu/du-an/trade4sd',
  '/dang-ky/tu-van',
  '/tim-kiem?q=GISA',
] as const;

test('representative routes have no browser errors or failed requests', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? '';
    if (/aborted|cancelled|canceled/i.test(failure)) return;
    failedRequests.push(`${request.method()} ${request.url()}`);
  });

  for (const path of representativeRoutes) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('h1:visible')).toHaveCount(1);
  }

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test('images are local, intrinsically sized, and independent of mockup domains', async ({
  page,
}) => {
  const forbiddenImageRequests: string[] = [];

  page.on('request', (request) => {
    if (
      request.resourceType() === 'image' &&
      /gisa\.edu\.vn|mockup/i.test(request.url())
    ) {
      forbiddenImageRequests.push(request.url());
    }
  });

  for (const path of representativeRoutes) {
    await page.goto(path, { waitUntil: 'networkidle' });
    const missingDimensions = await page.locator('img').evaluateAll((images) =>
      images.flatMap((image) =>
        image.hasAttribute('width') && image.hasAttribute('height')
          ? []
          : [image.getAttribute('src') ?? '(missing src)'],
      ),
    );
    expect(missingDimensions, `${path} image dimensions`).toEqual([]);
  }

  expect(forbiddenImageRequests).toEqual([]);
});

test('home renders a bounded selection without client collection requests', async ({
  page,
}) => {
  const clientDataRequests: string[] = [];

  page.on('request', (request) => {
    const url = new URL(request.url());
    const isCollectionEndpoint =
      /^\/(?:api\/)?content(?:\/|$)/.test(url.pathname) ||
      url.searchParams.has('collection');
    if (
      ['fetch', 'xhr'].includes(request.resourceType()) &&
      isCollectionEndpoint
    ) {
      clientDataRequests.push(request.url());
    }
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  const selectedCards = page.locator('main section[data-collection] article');
  expect(await selectedCards.count()).toBeGreaterThan(0);
  expect(await selectedCards.count()).toBeLessThanOrEqual(6);
  expect(clientDataRequests).toEqual([]);
});
