import { expect, test } from '@playwright/test';

test('desktop navigation opens a submenu and restores focus with Escape', async ({
  page,
}) => {
  await page.goto('/');

  const trigger = page.getByRole('button', { name: /menu Giới thiệu$/ });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Câu chuyện GISA', exact: true })).toHaveAttribute(
    'href',
    '/gioi-thieu/cau-chuyen-gisa',
  );

  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});

test('mobile navigation traps focus and closes back to its trigger', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const trigger = page.locator('button[aria-controls="mobile-navigation"]');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const dialog = page.getByRole('dialog', { name: 'Menu chính' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Mở rộng Giới thiệu' }).click();
  await expect(dialog.getByRole('link', { name: 'Câu chuyện GISA' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});

test('skip link is first in the keyboard order and every navigation link is real', async ({
  page,
}) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', {
    name: 'Bỏ qua đến nội dung chính',
  });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveAttribute('href', '#main-content');

  const hashOnlyLinks = await page.locator('header a[href="#"], footer a[href="#"]').count();
  expect(hashOnlyLinks).toBe(0);
});
