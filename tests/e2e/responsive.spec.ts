import { expect, test } from '@playwright/test';

const representativePaths = [
  '/',
  '/nghien-cuu',
  '/nghien-cuu/du-an',
  '/nghien-cuu/du-an/trade4sd',
  '/dang-ky/tu-van',
  '/tim-kiem?q=GISA',
] as const;

const visualCases = [
  { name: 'home', path: '/' },
  { name: 'hub', path: '/nghien-cuu' },
  { name: 'listing', path: '/nghien-cuu/du-an' },
  { name: 'project', path: '/nghien-cuu/du-an/trade4sd' },
  {
    name: 'article',
    path: '/tin-tuc/tai-chinh-khi-hau-va-phat-trien',
  },
  {
    name: 'course',
    path: '/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue',
  },
  { name: 'expert', path: '/chuyen-gia/nguyen-minh-khoi' },
  {
    name: 'initiative',
    path: '/cong-dong/sang-kien-kinh-te-ben-vung',
  },
  { name: 'form', path: '/dang-ky/tu-van' },
] as const;

for (const width of [390, 768, 1024, 1440]) {
  test(`representative pages fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 900, width });

    for (const path of representativePaths) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
        `${path} must not overflow at ${width}px`,
      ).toBe(true);
    }
  });
}

test('mobile filter and pagination controls meet 44px touch targets', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 390 });
  await page.goto('/tim-kiem?q=GISA');

  const filterControls = page.locator('main fieldset a');
  const paginationControls = page
    .getByRole('navigation', { name: 'Phân trang' })
    .locator('a');
  const controls = filterControls.or(paginationControls);
  await expect(controls.first()).toBeVisible();

  const undersized = await controls.evaluateAll((elements) =>
    elements.flatMap((element) => {
      const rectangle = element.getBoundingClientRect();
      return rectangle.width < 44 || rectangle.height < 44
        ? [
            {
              height: rectangle.height,
              label: element.textContent?.trim(),
              width: rectangle.width,
            },
          ]
        : [];
    }),
  );

  expect(undersized).toEqual([]);
});

for (const width of [390, 768, 1024, 1440]) {
  for (const visualCase of visualCases) {
    test(`${visualCase.name} visual evidence at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(90_000);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(() => {
        window.sessionStorage.setItem('gisa-site-intro-seen', 'true');
      });
      await page.setViewportSize({ height: 900, width });
      await page.goto(visualCase.path);
      await page.addStyleTag({
        content: 'nextjs-portal { display: none !important; }',
      });

      await expect(page.locator('h1:visible')).toHaveCount(1);
      await page.keyboard.press('Tab');
      await expect(page.locator('.skip-link')).toBeFocused();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

      if (visualCase.name === 'home') {
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
      }

      await expect(page).toHaveScreenshot(
        `${visualCase.name}-${width}.png`,
        {
          animations: 'disabled',
          fullPage: true,
          timeout: 30_000,
        },
      );
    });
  }
}
