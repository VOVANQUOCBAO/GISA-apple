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

test('images are local and reserve layout space', async ({
  baseURL,
  page,
}) => {
  const externalImageRequests: string[] = [];
  const appOrigin = new URL(baseURL ?? 'http://127.0.0.1:3000').origin;

  page.on('request', (request) => {
    if (request.resourceType() !== 'image') return;

    const requestUrl = request.url();
    if (
      new URL(requestUrl).origin !== appOrigin ||
      /gisa\.edu\.vn|mockup/i.test(decodeURIComponent(requestUrl))
    ) {
      externalImageRequests.push(requestUrl);
    }
  });

  for (const path of representativeRoutes) {
    await page.goto(path, { waitUntil: 'networkidle' });
    const imageIssues = await page.locator('img').evaluateAll((images) =>
      images.flatMap((image) => {
        const source = image.getAttribute('src') ?? '(missing src)';
        const bounds = image.getBoundingClientRect();

        if (bounds.width <= 0 || bounds.height <= 0) {
          return [`${source} has no rendered layout box`];
        }
        return [];
      }),
    );
    expect(imageIssues, `${path} image layout`).toEqual([]);
  }

  expect(externalImageRequests).toEqual([]);
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

  const selectedCards = page.getByRole('tabpanel').locator('article');
  await expect(selectedCards.first()).toBeVisible();
  expect(await selectedCards.count()).toBeGreaterThan(0);
  expect(await selectedCards.count()).toBeLessThanOrEqual(6);
  expect(clientDataRequests).toEqual([]);
});
