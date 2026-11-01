import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { adminAvailable, currentAdmin, hasAdminAccount, loginRequired, MIN_PASSWORD_LENGTH } from '@/lib/admin/auth';

import { login, setup } from './actions';
import styles from './login.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Đăng nhập quản trị',
};

const ERRORS: Record<string, string> = {
  sai: 'Sai tên đăng nhập hoặc mật khẩu.',
  'da-co': 'Đã có tài khoản quản trị. Hãy đăng nhập.',
  ten: 'Tên đăng nhập 3–32 ký tự: chữ thường không dấu, số, dấu chấm, gạch ngang hoặc gạch dưới.',
  ngan: `Mật khẩu cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`,
  khop: 'Hai lần nhập mật khẩu không khớp.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ loi?: string; tiep?: string }>;
}) {
  if (!adminAvailable()) notFound();
  if (!loginRequired()) redirect('/admin');

  const { loi, tiep } = await searchParams;
  const returnTo = tiep?.startsWith('/') && !tiep.startsWith('//') ? tiep : '/admin';
  if (await currentAdmin()) redirect(returnTo);

  const firstRun = !(await hasAdminAccount());
  const error = loi ? ERRORS[loi] : undefined;

  return (
    <main className={styles.page} id="main-content">
      <form action={firstRun ? setup : login} className={styles.card}>
        <h1>{firstRun ? 'Tạo tài khoản quản trị' : 'Đăng nhập quản trị'}</h1>
        <p className={styles.lead}>
          {firstRun
            ? 'Chưa có tài khoản nào. Tài khoản tạo ở đây là tài khoản quản trị duy nhất của website.'
            : 'Đăng nhập để soạn và đăng bài.'}
        </p>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <input name="tiep" type="hidden" value={returnTo} />

        <label className={styles.field}>
          <span>Tên đăng nhập</span>
          <input autoCapitalize="none" autoComplete="username" name="username" required type="text" />
        </label>

        <label className={styles.field}>
          <span>Mật khẩu</span>
          <input
            autoComplete={firstRun ? 'new-password' : 'current-password'}
            minLength={firstRun ? MIN_PASSWORD_LENGTH : undefined}
            name="password"
            required
            type="password"
          />
        </label>

        {firstRun ? (
          <label className={styles.field}>
            <span>Nhập lại mật khẩu</span>
            <input autoComplete="new-password" name="confirm" required type="password" />
          </label>
        ) : null}

        <button className={styles.submit} type="submit">
          {firstRun ? 'Tạo tài khoản' : 'Đăng nhập'}
        </button>
      </form>
    </main>
  );
}
