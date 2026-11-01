import 'server-only';

import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { listDocNames, readDoc, usesDatabase, writeDoc } from './kv';

/**
 * Đăng nhập admin.
 *
 * Chạy trên máy (file JSON) thì không cần đăng nhập, như trước. Khi deploy với
 * database thì mọi trang và API admin đều đòi phiên đăng nhập. Tài khoản, mật
 * khẩu (đã băm scrypt) và khoá ký cookie đều nằm trong database, nên không phải
 * đặt thêm biến môi trường nào.
 */
const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  length: number,
) => Promise<Buffer>;

export const SESSION_COOKIE = 'gisa_admin_session';
const SESSION_DAYS = 7;
const USERS_DIR = 'system/users';
const SECRET_KEY = 'system/session-secret';

export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,31}$/u;
export const MIN_PASSWORD_LENGTH = 10;

interface StoredUser {
  username: string;
  passwordHash: string;
  createdAt: string;
}

/** Admin có được phục vụ ở môi trường này không. */
export function adminAvailable(): boolean {
  if (usesDatabase()) return true;
  return process.env.NODE_ENV !== 'production' || process.env.ADMIN_LOCAL === '1';
}

export function loginRequired(): boolean {
  return usesDatabase();
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;

  const expected = Buffer.from(hash, 'base64');
  const actual = await scrypt(password, Buffer.from(salt, 'base64'), expected.length);
  return timingSafeEqual(actual, expected);
}

async function sessionSecret(): Promise<string> {
  const existing = await readDoc<{ value: string }>(SECRET_KEY);
  if (existing?.value) return existing.value;

  const value = randomBytes(32).toString('base64');
  await writeDoc(SECRET_KEY, { value });
  // Hai request cùng tạo khoá thì bản ghi sau thắng; đọc lại để mọi nơi dùng chung.
  return (await readDoc<{ value: string }>(SECRET_KEY))?.value ?? value;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export async function hasAdminAccount(): Promise<boolean> {
  return (await listDocNames(USERS_DIR)).length > 0;
}

export async function createAdminAccount(username: string, password: string): Promise<void> {
  await writeDoc(`${USERS_DIR}/${username}`, {
    username,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  } satisfies StoredUser);
}

export async function checkCredentials(username: string, password: string): Promise<boolean> {
  if (!USERNAME_PATTERN.test(username)) return false;
  const user = await readDoc<StoredUser>(`${USERS_DIR}/${username}`);
  if (!user) return false;
  return verifyPassword(password, user.passwordHash);
}

export async function startSession(username: string): Promise<void> {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ u: username, exp: expires })).toString('base64url');
  const token = `${payload}.${sign(payload, await sessionSecret())}`;

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expires),
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Tên admin đang đăng nhập, hoặc null. */
export async function currentAdmin(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload, await sessionSecret()));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      u?: string;
      exp?: number;
    };
    if (!session.u || !session.exp || session.exp < Date.now()) return null;
    const user = await readDoc<StoredUser>(`${USERS_DIR}/${session.u}`);
    return user ? user.username : null;
  } catch {
    return null;
  }
}

/** Đặt ở đầu mỗi trang admin: ẩn trang khi admin tắt, đòi đăng nhập khi cần. */
export async function requireAdminPage(returnTo: string): Promise<void> {
  if (!adminAvailable()) notFound();
  if (loginRequired() && !(await currentAdmin())) {
    redirect(`/admin/dang-nhap?tiep=${encodeURIComponent(returnTo)}`);
  }
}
