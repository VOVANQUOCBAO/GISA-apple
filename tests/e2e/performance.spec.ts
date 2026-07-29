import { expect, test } from '@playwright/test';

interface PerformanceMetrics {
  cls: number;
  inp: number;
  lcp: number;
}

test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'Event Timing measurement requires Chromium.',
);

test('home meets the recorded Core Web Vitals budget', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium',
    'Measured once in the fixed desktop Chromium profile.',
  );

  await page.addInitScript(() => {
    const metrics: PerformanceMetrics = { cls: 0, inp: 0, lcp: 0 };
    Object.defineProperty(window, '__gisaPerformanceMetrics', { value: metrics });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.lcp = Math.max(metrics.lcp, entry.startTime);
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          hadRecentInput: boolean;
          value: number;
        };
        if (!shift.hadRecentInput) metrics.cls += shift.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.inp = Math.max(metrics.inp, entry.duration);
      }
    }).observe({
      type: 'event',
      buffered: true,
      durationThreshold: 16,
    } as PerformanceObserverInit & { durationThreshold: number });
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  const menuTrigger = page.locator('header button[data-menu-index]').first();
  await menuTrigger.click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);

  const metrics = await page.evaluate(
    () =>
      (window as typeof window & {
        __gisaPerformanceMetrics: PerformanceMetrics;
      }).__gisaPerformanceMetrics,
  );

  console.log(`GISA_PERFORMANCE ${JSON.stringify(metrics)}`);
  expect(metrics.lcp).toBeGreaterThan(0);
  expect(metrics.lcp).toBeLessThanOrEqual(2_500);
  expect(metrics.cls).toBeLessThanOrEqual(0.1);
  expect(metrics.inp).toBeLessThanOrEqual(200);
});
