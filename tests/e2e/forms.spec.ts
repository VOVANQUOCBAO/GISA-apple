import { expect, test } from '@playwright/test';

async function fillProfessionalForm(page: import('@playwright/test').Page) {
  await page.getByLabel(/^Họ và tên/).fill('Nguyễn An');
  await page.getByLabel(/^Email/).fill('an@example.com');
  await page.getByLabel(/^Số điện thoại/).fill('0818711799');
  await page.getByLabel(/^Tổ chức/).fill('Công ty An Việt');
  await page.getByLabel(/^Chức vụ/).fill('Giám đốc');
  await page.getByLabel(/^Ngành nghề/).fill('Giáo dục');
  await page
    .getByLabel(/^Nội dung/)
    .fill('Tôi muốn tìm hiểu thêm thông tin từ GISA.');
  await page.getByLabel(/đồng ý để GISA/i).check();
}

test('empty and malformed submissions focus a linked error summary', async ({
  page,
}) => {
  await page.goto('/dang-ky/hop-tac');
  await page.getByRole('button', { name: 'Gửi thông tin' }).click();

  const summary = page
    .getByRole('alert')
    .filter({ hasText: 'Vui lòng kiểm tra các trường sau' });
  await expect(summary).toBeFocused();
  await expect(
    summary.getByRole('link', { name: 'Vui lòng nhập tên tổ chức.' }),
  ).toHaveAttribute('href', '#organization');

  await page.getByLabel(/^Email/).fill('email-sai');
  await page.getByLabel(/Số điện thoại/).fill('123');
  await page.getByLabel(/^Họ và tên/).fill('Nguyễn An');
  await page.getByLabel(/^Nội dung/).fill('Nội dung hợp lệ để thử.');
  await page.getByRole('button', { name: 'Gửi thông tin' }).click();

  await expect(page.getByLabel(/^Email/)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel(/Số điện thoại/)).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(page.getByLabel(/đồng ý để GISA/i)).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

test('shows success only after the receiver accepts the submission', async ({
  page,
}) => {
  const submissions: unknown[] = [];
  await page.route('**/api/form-submissions', async (route) => {
    submissions.push(route.request().postDataJSON());
    await route.fulfill({
      body: JSON.stringify({ message: 'GISA đã tiếp nhận thông tin của bạn.' }),
      contentType: 'application/json',
      status: 202,
    });
  });

  await page.goto('/lien-he');
  await fillProfessionalForm(page);
  await page.getByRole('button', { name: 'Gửi thông tin' }).click();

  await expect(
    page.getByText('GISA đã tiếp nhận thông tin của bạn.'),
  ).toBeVisible();
  expect(submissions).toHaveLength(1);
  expect(submissions[0]).toMatchObject({
    email: 'an@example.com',
    kind: 'lien-he',
  });
});

test('delivery failure keeps user data available for retry', async ({ page }) => {
  await page.route('**/api/form-submissions', async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        message: 'Kênh tiếp nhận trực tuyến chưa được cấu hình.',
      }),
      contentType: 'application/json',
      status: 503,
    });
  });

  await page.goto('/lien-he');
  await fillProfessionalForm(page);
  await page.getByRole('button', { name: 'Gửi thông tin' }).click();

  await expect(
    page.getByText('Kênh tiếp nhận trực tuyến chưa được cấu hình.'),
  ).toBeVisible();
  await expect(page.getByLabel(/^Email/)).toHaveValue('an@example.com');
  await expect(page.getByLabel(/^Nội dung/)).toHaveValue(
    'Tôi muốn tìm hiểu thêm thông tin từ GISA.',
  );
});

test('course context is prefilled without requiring professional fields', async ({
  page,
}) => {
  await page.goto('/dang-ky/khoa-hoc?course=khoa-hoc-dai-dien');

  await expect(page.getByLabel('Khóa học quan tâm')).toHaveValue(
    'khoa-hoc-dai-dien',
  );
  await expect(page.getByLabel('Khóa học quan tâm')).toHaveAttribute(
    'readonly',
    '',
  );
  await expect(page.getByLabel(/^Tổ chức/)).not.toHaveAttribute('required', '');
  await expect(page.getByLabel(/^Chức vụ/)).not.toHaveAttribute('required', '');
  await expect(page.getByLabel(/^Ngành nghề/)).not.toHaveAttribute('required', '');
  await expect(page.getByLabel(/^Nội dung/)).not.toHaveAttribute('required', '');
});

test('course enquiry can be submitted with the keyboard', async ({ page }) => {
  await page.route('**/api/form-submissions', async (route) => {
    await route.fulfill({
      body: JSON.stringify({ message: 'GISA đã tiếp nhận thông tin của bạn.' }),
      contentType: 'application/json',
      status: 202,
    });
  });
  await page.goto('/dang-ky/khoa-hoc');
  await page.getByLabel(/^Họ và tên/).fill('Học Viên');
  await page.getByLabel(/^Email/).fill('hocvien@example.com');
  await page.getByLabel(/^Số điện thoại/).fill('0818711799');
  await page.getByLabel(/đồng ý để GISA/i).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Gửi thông tin' })).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(
    page.getByText('GISA đã tiếp nhận thông tin của bạn.'),
  ).toBeVisible();
});
