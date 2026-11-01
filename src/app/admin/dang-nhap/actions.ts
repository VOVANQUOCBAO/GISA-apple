'use server';

import { redirect } from 'next/navigation';

import {
  checkCredentials,
  createAdminAccount,
  endSession,
  hasAdminAccount,
  loginRequired,
  MIN_PASSWORD_LENGTH,
  startSession,
  USERNAME_PATTERN,
} from '@/lib/admin/auth';

/** Chỉ cho quay về trang trong site, tránh chuyển hướng sang nơi khác. */
function safeReturn(value: FormDataEntryValue | null): string {
  const target = typeof value === 'string' ? value : '';
  return target.startsWith('/') && !target.startsWith('//') ? target : '/admin';
}

function back(error: string, returnTo: string): never {
  redirect(`/admin/dang-nhap?loi=${error}&tiep=${encodeURIComponent(returnTo)}`);
}

export async function login(form: FormData): Promise<void> {
  const returnTo = safeReturn(form.get('tiep'));
  const username = String(form.get('username') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');

  if (!(await checkCredentials(username, password))) {
    // Chậm lại một nhịp để dò mật khẩu tốn thời gian hơn.
    await new Promise((resolve) => setTimeout(resolve, 800));
    back('sai', returnTo);
  }

  await startSession(username);
  redirect(returnTo);
}

/** Tạo tài khoản đầu tiên. Chỉ chạy được khi database chưa có tài khoản nào. */
export async function setup(form: FormData): Promise<void> {
  const returnTo = safeReturn(form.get('tiep'));
  if (!loginRequired() || (await hasAdminAccount())) back('da-co', returnTo);

  const username = String(form.get('username') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const confirm = String(form.get('confirm') ?? '');

  if (!USERNAME_PATTERN.test(username)) back('ten', returnTo);
  if (password.length < MIN_PASSWORD_LENGTH) back('ngan', returnTo);
  if (password !== confirm) back('khop', returnTo);

  await createAdminAccount(username, password);
  await startSession(username);
  redirect(returnTo);
}

export async function logout(): Promise<void> {
  await endSession();
  redirect('/admin/dang-nhap');
}
