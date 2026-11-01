import 'server-only';

import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

/**
 * Kho dữ liệu của admin, theo khoá dạng thư mục ("drafts/news--abc").
 *
 * Có `DATABASE_URL` (Neon trên Vercel) thì mọi thứ nằm trong Postgres, vì
 * filesystem của Vercel chỉ đọc. Không có thì giữ cách cũ: file JSON trong
 * `content-data/admin/`, mở được bằng bất kỳ trình soạn thảo nào.
 */
const FS_ROOT = path.join(process.cwd(), 'content-data', 'admin');

export function usesDatabase(): boolean {
  return Boolean(databaseUrl());
}

function databaseUrl(): string | undefined {
  return (process.env.DATABASE_URL ?? process.env.POSTGRES_URL)?.trim() || undefined;
}

function childName(prefix: string, key: string): string | null {
  const rest = key.slice(prefix.length);
  return rest.length > 0 && !rest.includes('/') ? rest : null;
}

// ---------------------------------------------------------------- Postgres

let client: NeonQueryFunction<false, false> | null = null;
let schemaReady: Promise<void> | null = null;

function sql(): NeonQueryFunction<false, false> {
  const url = databaseUrl();
  if (!url) throw new Error('Chưa cấu hình DATABASE_URL.');
  client ??= neon(url);
  return client;
}

async function ready(): Promise<NeonQueryFunction<false, false>> {
  const query = sql();
  schemaReady ??= (async () => {
    await query`
      create table if not exists admin_docs (
        key text primary key,
        value jsonb not null,
        updated_at timestamptz not null default now()
      )`;
    await query`
      create table if not exists admin_media (
        key text primary key,
        content_type text not null,
        data text not null,
        created_at timestamptz not null default now()
      )`;
  })().catch((error: unknown) => {
    schemaReady = null;
    throw error;
  });
  await schemaReady;
  return query;
}

// ---------------------------------------------------------------- File JSON

function fileFor(key: string): string {
  return path.join(FS_ROOT, `${key}.json`);
}

const writeQueues = new Map<string, Promise<void>>();

async function writeFileAtomic(file: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  // Tên tạm phải duy nhất: autosave và thao tác publish/unpublish có thể ghi
  // gần như cùng lúc.
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;

  try {
    await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await fs.rename(temporary, file);
  } catch (error) {
    await fs.unlink(temporary).catch(() => undefined);
    throw error;
  }
}

/**
 * Ghi tuần tự theo từng file. Trên Windows, rename đè lên file đích đang được
 * ghi bởi request khác có thể lỗi EPERM; xếp hàng tránh cả 500 lẫn file .tmp sót.
 */
async function writeFileQueued(file: string, value: unknown): Promise<void> {
  const previous = writeQueues.get(file) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(() => writeFileAtomic(file, value));
  writeQueues.set(file, next);

  try {
    await next;
  } finally {
    if (writeQueues.get(file) === next) writeQueues.delete(file);
  }
}

async function fileNames(directory: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(path.join(FS_ROOT, directory));
    return entries.filter((entry) => entry.endsWith('.json')).map((entry) => entry.slice(0, -5));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------- API chung

export async function readDoc<T>(key: string): Promise<T | null> {
  if (usesDatabase()) {
    const query = await ready();
    const rows = await query`select value from admin_docs where key = ${key}`;
    return (rows[0]?.value as T | undefined) ?? null;
  }

  try {
    return JSON.parse(await fs.readFile(fileFor(key), 'utf8')) as T;
  } catch {
    return null;
  }
}

export async function writeDoc(key: string, value: unknown): Promise<void> {
  if (usesDatabase()) {
    const query = await ready();
    await query`
      insert into admin_docs (key, value, updated_at)
      values (${key}, ${JSON.stringify(value)}::jsonb, now())
      on conflict (key) do update set value = excluded.value, updated_at = now()`;
    return;
  }

  await writeFileQueued(fileFor(key), value);
}

/** Xoá một khoá; trả về false nếu khoá không tồn tại. */
export async function removeDoc(key: string): Promise<boolean> {
  if (usesDatabase()) {
    const query = await ready();
    const rows = await query`delete from admin_docs where key = ${key} returning key`;
    return rows.length > 0;
  }

  try {
    await fs.unlink(fileFor(key));
    return true;
  } catch {
    return false;
  }
}

/** Tên các khoá nằm ngay dưới một "thư mục", không đi sâu hơn. */
export async function listDocNames(directory: string): Promise<string[]> {
  if (usesDatabase()) {
    const query = await ready();
    const prefix = `${directory}/`;
    const rows = await query`select key from admin_docs where starts_with(key, ${prefix})`;
    return rows
      .map((row) => childName(prefix, String(row.key)))
      .filter((name): name is string => name !== null);
  }

  return fileNames(directory);
}

/** Như `listDocNames` nhưng kèm nội dung, gộp thành một truy vấn. */
export async function readDocsIn<T>(directory: string): Promise<Map<string, T>> {
  const result = new Map<string, T>();

  if (usesDatabase()) {
    const query = await ready();
    const prefix = `${directory}/`;
    const rows = await query`select key, value from admin_docs where starts_with(key, ${prefix})`;
    for (const row of rows) {
      const name = childName(prefix, String(row.key));
      if (name !== null) result.set(name, row.value as T);
    }
    return result;
  }

  const names = await fileNames(directory);
  const values = await Promise.all(names.map((name) => readDoc<T>(`${directory}/${name}`)));
  names.forEach((name, index) => {
    const value = values[index];
    if (value !== null && value !== undefined) result.set(name, value);
  });
  return result;
}

// ---------------------------------------------------------------- Ảnh

export async function putMedia(key: string, contentType: string, data: Buffer): Promise<void> {
  const query = await ready();
  await query`
    insert into admin_media (key, content_type, data)
    values (${key}, ${contentType}, ${data.toString('base64')})
    on conflict (key) do update set content_type = excluded.content_type, data = excluded.data`;
}

export async function getMedia(key: string): Promise<{ contentType: string; data: Buffer } | null> {
  const query = await ready();
  const rows = await query`select content_type, data from admin_media where key = ${key}`;
  const row = rows[0];
  if (!row) return null;
  return { contentType: String(row.content_type), data: Buffer.from(String(row.data), 'base64') };
}
