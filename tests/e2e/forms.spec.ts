import { expect, test } from '@playwright/test';

async function fillValidForm(page: import('@playwright/test').Page) {
  await page.getByLabel(/^Họ và tên/).fill('Nguyễn An');
  await page.getByLabel(/^Email/).fill('an@example.com');
  await page
    .getByLabel(/^Nội dung/)
    .fill('Tôi muốn tìm hiểu thêm thông tin từ GISA.');
  await page
    .getByLabel(/Tôi hiểu thông tin chưa được gửi đến GISA/i)
    .check();
}

test('empty and malformed submissions focus a linked error summary', async ({
  page,
}) => {
  await page.goto('/dang-ky/hop-tac');
  await page.getByRole('button', { name: 'Kiểm tra thông tin' }).click();

  const summary = page
    .getByRole('alert')
    .filter({ hasText: 'Vui lòng kiểm tra các trường sau' });
  await expect(summary).toBeFocused();
  await expect(summary).toContainText('Vui lòng kiểm tra các trường');
  await expect(
    summary.getByRole('link', { name: 'Vui lòng nhập tên tổ chức.' }),
  ).toHaveAttribute('href', '#organization');

  await page.getByLabel(/^Email/).fill('email-sai');
  await page.getByLabel(/Số điện thoại/).fill('123');
  await page.getByLabel(/^Họ và tên/).fill('Nguyễn An');
  await page.getByLabel(/^Nội dung/).fill('Nội dung hợp lệ để thử.');
  await page.getByRole('button', { name: 'Kiểm tra thông tin' }).click();

  await expect(page.getByLabel(/^Email/)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel(/Số điện thoại/)).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(
    page.getByLabel(/Tôi hiểu thông tin chưa được gửi đến GISA/i),
  ).toHaveAttribute('aria-invalid', 'true');
});

test('pending and success remain local to the browser', async ({ page }) => {
  const nonGetRequests: string[] = [];
  page.on('request', (request) => {
    if (!['GET', 'HEAD'].includes(request.method())) {
      nonGetRequests.push(`${request.method()} ${request.url()}`);
    }
  });

  await page.goto('/lien-he');
  await fillValidForm(page);
  await page.getByRole('button', { name: 'Kiểm tra thông tin' }).click();

  await expect(
    page.getByRole('button', { name: 'Đang kiểm tra…' }),
  ).toBeDisabled();
  await expect(
    page.getByText(
      'Thông tin vẫn ở trong trình duyệt và chưa được gửi tới GISA. Kênh tiếp nhận đang được hoàn thiện.',
    ),
  ).toBeVisible();
  expect(nonGetRequests).toEqual([]);
});

test('simulated error can be retried successfully', async ({ page }) => {
  await page.goto('/dang-ky/tu-van');
  await fillValidForm(page);
  await page.getByLabel(/^Email/).fill('an@simulate-error.invalid');
  await page.getByRole('button', { name: 'Kiểm tra thông tin' }).click();
  await expect(page.getByText(/Không thể hoàn tất thao tác/)).toBeVisible();

  await page.getByLabel(/^Email/).fill('an@example.com');
  await page.getByRole('button', { name: 'Kiểm tra thông tin' }).click();
  await expect(page.getByText(/thông tin vẫn ở trong trình duyệt/i)).toBeVisible();
});

test('course context is prefilled from the URL', async ({ page }) => {
  await page.goto('/dang-ky/khoa-hoc?course=khoa-hoc-dai-dien');
  await expect(page.getByLabel('Khóa học quan tâm')).toHaveValue(
    'khoa-hoc-dai-dien',
  );
  await expect(page.getByLabel('Khóa học quan tâm')).toHaveAttribute(
    'readonly',
    '',
  );
});

test('the form can be submitted with the keyboard', async ({ page }) => {
  await page.goto('/dang-ky/tu-van');
  await page.getByLabel(/^Họ và tên/).fill('Nguyễn An');
  await page.getByLabel(/^Email/).fill('an@example.com');
  await page
    .getByLabel(/^Nội dung/)
    .fill('Tôi muốn kiểm tra thao tác bàn phím trên biểu mẫu.');

  await page.getByLabel(/^Nội dung/).press('Tab');
  await expect(
    page.getByLabel(/Tôi hiểu thông tin chưa được gửi đến GISA/i),
  ).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Kiểm tra thông tin' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.getByText(/thông tin vẫn ở trong trình duyệt/i)).toBeVisible();
});

test('privacy route discloses the prototype boundary', async ({ page }) => {
  await page.goto('/chinh-sach-quyen-rieng-tu');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Chính sách quyền riêng tư' }),
  ).toBeVisible();
  await expect(page.getByText(/không được gửi tới GISA/i)).toBeVisible();
  await expect(page.getByText(/không gửi yêu cầu qua mạng/i)).toBeVisible();
});
