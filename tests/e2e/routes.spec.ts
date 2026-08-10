import { expect, test } from '@playwright/test';

import { PAGE_REGISTRY } from '../../src/content/pages';

const fixedPaths = PAGE_REGISTRY.flatMap((definition) =>
  'path' in definition ? [definition.path] : [],
);

test('every fixed sitemap route responds below 400', async ({ request }) => {
  for (const path of fixedPaths) {
    const response = await request.get(path);
    expect(response.status(), `${path} should be routable`).toBeLessThan(400);
  }
});

const redirectCases = [
  ['/kinh-te-ben-vung', '/ung-dung/kinh-te-ben-vung'],
  ['/kinh-te-ben-vung-1751264493', '/cong-dong/kinh-te-ben-vung'],
  ['/tin-tuc-1712655344', '/tin-tuc'],
  ['/dao-tao/edge', '/dao-tao/gisa-edge'],
  ['/dao-tao/rise', '/dao-tao/gisa-rise'],
  ['/dao-tao/ascend', '/dao-tao/gisa-ascend'],
  ['/dao-tao/legacy', '/dao-tao/gisa-legacy'],
] as const;

for (const [source, destination] of redirectCases) {
  test(`redirects ${source} to ${destination}`, async ({ page }) => {
    await page.goto(source);
    expect(new URL(page.url()).pathname).toBe(destination);
  });
}
