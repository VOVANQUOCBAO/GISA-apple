import { expect, test } from '@playwright/test';

const newsRoutes = [
  '/tin-tuc/hoi-thao-thuong-mai-nong-san-ben-vung-mekong',
  '/tin-tuc/san-pham-khoa-hoc-cong-nghe-tai-trien-lam-tang-truong-xanh',
  '/tin-tuc/cong-trinh-thang-giai-sang-tao-khoa-hoc-cong-nghe-viet-nam-2024',
  '/tin-tuc/tai-chinh-khi-hau-va-phat-trien',
  '/tin-tuc/nhua-tan-trong-nuoc-bien',
];

const publicationRoutes = [
  '/nghien-cuu/bai-bao-khoa-hoc/mo-hinh-chuan-doi-sanh-do-luong-hieu-suat',
  '/nghien-cuu/bai-bao-khoa-hoc/chuong-trinh-chat-luong-thuc-pham-va-phi-bao-hiem-gia',
  '/nghien-cuu/bai-bao-khoa-hoc/chuoi-gia-tri-va-nang-luc-canh-tranh-buoi-da-xanh',
  '/nghien-cuu/bai-bao-khoa-hoc/trai-nghiem-khach-hang-voi-chatbot-ai',
  '/nghien-cuu/bai-bao-khoa-hoc/dong-luc-va-rao-can-tieu-dung-sua-ben-vung',
  '/nghien-cuu/bai-bao-khoa-hoc/san-sang-tra-tien-cho-nhan-phuc-loi-dong-vat',
  '/nghien-cuu/bai-bao-khoa-hoc/loi-the-so-sanh-cua-cac-loai-cay-trong-thay-the',
  '/nghien-cuu/bai-bao-khoa-hoc/nang-luc-canh-tranh-nong-nghiep-theo-rca-va-nrca',
  '/nghien-cuu/bai-bao-ung-dung/tinh-ben-vung-cua-chuong-trinh-chat-luong-thuc-pham-chau-au',
  '/nghien-cuu/bai-bao-khoa-hoc/do-luong-tinh-ben-vung-chuoi-cung-ung-thuc-pham-ngan',
  '/nghien-cuu/bai-bao-khoa-hoc/dong-luc-cua-thuong-mai-noi-nganh-nong-nghiep',
  '/nghien-cuu/bai-bao-khoa-hoc/chuyen-mon-hoa-thuong-mai-nong-nghiep-o-nen-kinh-te-chuyen-doi',
  '/nghien-cuu/bai-bao-khoa-hoc/nghien-cuu-chuoi-gia-tri-buoi-da-xanh-ben-tre',
  '/nghien-cuu/bai-bao-khoa-hoc/chuoi-cung-ung-thuc-pham-ngan-ben-vung-va-binh-dang',
];

const routes = [...newsRoutes, ...publicationRoutes];

const viewports = [
  { height: 900, label: 'desktop', width: 1440 },
  { height: 844, label: 'mobile', width: 390 },
] as const;

test.describe('article detail layout matrix', () => {
  for (const viewport of viewports) {
    test(`${viewport.label}: every news and research article has a calm readable layout`, async ({ page }) => {
      await page.setViewportSize({ height: viewport.height, width: viewport.width });

      for (const path of routes) {
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
        expect(response?.ok(), `${path} resolves`).toBe(true);

        const metrics = await page.locator('main').evaluate((main) => {
          const article = main.querySelector<HTMLElement>('article');
          const heading = main.querySelector<HTMLElement>('h1');
          const prose = Array.from(
            main.querySelectorAll<HTMLElement>('[class*="body"] p, [class*="articleBody"] p'),
          ).filter((paragraph) => (paragraph.textContent?.trim().length ?? 0) >= 80);
          const media = Array.from(main.querySelectorAll<HTMLElement>('article img, article figure'));
          const viewportWidth = document.documentElement.clientWidth;
          const publicationOverline = main.querySelector<HTMLElement>(
            '[data-editorial-layout="publication"] header p',
          );
          const overlineStyle = publicationOverline ? getComputedStyle(publicationOverline) : null;

          return {
            articleLeft: article?.getBoundingClientRect().left ?? 0,
            articleRight: article?.getBoundingClientRect().right ?? 0,
            headingFontSize: heading ? Number.parseFloat(getComputedStyle(heading).fontSize) : 0,
            headingFits: Boolean(heading) && heading!.scrollWidth <= heading!.clientWidth + 1,
            mediaFits: media.every((element) => {
              const box = element.getBoundingClientRect();
              return box.left >= -1 && box.right <= viewportWidth + 1;
            }),
            pageFits: document.documentElement.scrollWidth <= viewportWidth + 1,
            proseAlignments: prose.map((paragraph) => getComputedStyle(paragraph).textAlign),
            proseWidths: prose.map((paragraph) => paragraph.getBoundingClientRect().width),
            publicationOverline: overlineStyle ? {
              align: overlineStyle.textAlign,
              alignLast: overlineStyle.textAlignLast,
              justify: overlineStyle.getPropertyValue('text-justify'),
            } : null,
          };
        });

        expect(metrics.pageFits, `${path} has no horizontal page overflow`).toBe(true);
        expect(metrics.articleLeft, `${path} article stays inside viewport`).toBeGreaterThanOrEqual(-1);
        expect(metrics.articleRight, `${path} article stays inside viewport`).toBeLessThanOrEqual(viewport.width + 1);
        expect(metrics.headingFits, `${path} title stays inside its column`).toBe(true);
        expect(metrics.mediaFits, `${path} figures stay inside viewport`).toBe(true);
        if (publicationRoutes.includes(path)) {
          expect(metrics.publicationOverline, `${path} masthead label uses natural spacing`).toEqual({
            align: 'start',
            alignLast: 'auto',
            justify: 'auto',
          });
        }
        expect(metrics.proseAlignments.length, `${path} contains readable prose`).toBeGreaterThan(0);
        expect(
          metrics.proseAlignments.every((alignment) => alignment === 'left' || alignment === 'start'),
          `${path} prose is left aligned`,
        ).toBe(true);

        if (viewport.label === 'desktop') {
          expect(metrics.headingFontSize, `${path} desktop title scale`).toBeLessThanOrEqual(72);
          expect(Math.max(...metrics.proseWidths), `${path} desktop reading measure`).toBeGreaterThanOrEqual(700);
          expect(Math.max(...metrics.proseWidths), `${path} desktop reading measure`).toBeLessThanOrEqual(780);
        } else {
          expect(metrics.headingFontSize, `${path} mobile title scale`).toBeLessThanOrEqual(44);
          expect(Math.max(...metrics.proseWidths), `${path} mobile prose fits`).toBeLessThanOrEqual(350);
        }
      }
    });
  }
});
