import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { allContentFixtures } from '@/content/fixtures';
import { contentRecordSchema } from '@/content/schema';
import type { ContentRecord } from '@/content/types';
import { toAnchorId } from '@/lib/anchor-id';

import type {
  AdminDocumentPayload,
  AdminDocumentSummary,
  AdminVersion,
  StoredRecordFile,
} from './types';

/**
 * Kho nội dung local của admin.
 *
 * Cố tình dùng file JSON thay vì database: người dựng thử có thể mở
 * `content-data/admin/` bằng bất kỳ trình soạn thảo nào, chép đi, hoặc xoá sạch
 * để bắt đầu lại. Toàn bộ nội dung vẫn đi qua đúng `ContentRecord` mà website
 * đang dùng, nên bản xem trước và trang thật không thể lệch schema.
 */
const ADMIN_ROOT = path.join(process.cwd(), 'content-data', 'admin');
const DRAFT_DIR = path.join(ADMIN_ROOT, 'drafts');
const PUBLISHED_DIR = path.join(ADMIN_ROOT, 'published');
const HISTORY_DIR = path.join(ADMIN_ROOT, 'history');
const MAX_HISTORY = 20;

export class AdminValidationError extends Error {
  constructor(readonly issues: string[]) {
    super('Nội dung chưa đúng hợp đồng dữ liệu của website.');
    this.name = 'AdminValidationError';
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Các loại nội dung admin nhận quản lý. Chúng dùng chung
 * `EcosystemDetailTemplate` ở trang chi tiết, nên chỉ cần một bản xem trước.
 * Thêm loại mới = thêm vào danh sách này và bật nhánh template tương ứng.
 */
export const EDITORIAL_KINDS = ['news', 'notice', 'initiative'] as const;

export type EditorialKind = (typeof EDITORIAL_KINDS)[number];

export function documentIdFor(kind: string, slug: string): string {
  return `${kind}--${slug}`;
}

function fileFor(directory: string, id: string): string {
  return path.join(directory, `${id}.json`);
}

async function ensureDirectory(directory: string): Promise<void> {
  await fs.mkdir(directory, { recursive: true });
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await ensureDirectory(path.dirname(file));
  const temporary = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rename(temporary, file);
}

async function listIds(directory: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directory);
    return entries.filter((entry) => entry.endsWith('.json')).map((entry) => entry.slice(0, -5));
  } catch {
    return [];
  }
}

function toStored(record: ContentRecord, status: StoredRecordFile['status']): StoredRecordFile {
  return {
    id: record.id,
    slug: record.slug,
    path: record.path,
    status,
    updatedAt: new Date().toISOString(),
    record,
  };
}

function summaryOf(
  id: string,
  draft: StoredRecordFile | null,
  published: StoredRecordFile | null,
): AdminDocumentSummary {
  const source = draft ?? published;
  const record = source?.record;

  return {
    id,
    kind: record?.kind ?? 'news',
    title: record?.title ?? 'Không có tiêu đề',
    slug: record?.slug ?? id.split('--').slice(1).join('--'),
    path: record?.path ?? '/tin-tuc',
    state: draft ? 'draft' : 'published',
    hasDraft: Boolean(draft),
    updatedAt: source?.updatedAt ?? new Date().toISOString(),
    ...(record?.publishedAt ? { publishedAt: record.publishedAt } : {}),
    ...(record?.image?.src ? { image: record.image.src } : {}),
  };
}

let seeding: Promise<void> | null = null;

/** Lần đầu mở admin, kho được nạp từ chính nội dung đang có trên site. */
async function ensureSeeded(): Promise<void> {
  if (!seeding) {
    seeding = (async () => {
      await Promise.all([
        ensureDirectory(DRAFT_DIR),
        ensureDirectory(PUBLISHED_DIR),
        ensureDirectory(HISTORY_DIR),
      ]);

      if ((await listIds(PUBLISHED_DIR)).length > 0) return;

      const records = contentRecordSchema.array().parse(allContentFixtures);
      for (const record of records) {
        if (!(EDITORIAL_KINDS as readonly string[]).includes(record.kind)) continue;
        await writeJson(
          fileFor(PUBLISHED_DIR, documentIdFor(record.kind, record.slug)),
          toStored(record, 'published'),
        );
      }
    })().catch((error: unknown) => {
      seeding = null;
      throw error;
    });
  }

  return seeding;
}

async function pushHistory(id: string, record: ContentRecord): Promise<void> {
  const directory = path.join(HISTORY_DIR, id);
  await ensureDirectory(directory);
  await writeJson(path.join(directory, `${Date.now()}.json`), record);

  const versions = (await listIds(directory)).sort().reverse();
  for (const stale of versions.slice(MAX_HISTORY)) {
    await fs.rm(path.join(directory, `${stale}.json`), { force: true });
  }
}

export async function listDocuments(): Promise<AdminDocumentSummary[]> {
  await ensureSeeded();

  const ids = new Set([...(await listIds(PUBLISHED_DIR)), ...(await listIds(DRAFT_DIR))]);
  const documents = await Promise.all(
    [...ids].map(async (id) => {
      const [draft, published] = await Promise.all([
        readJson<StoredRecordFile>(fileFor(DRAFT_DIR, id)),
        readJson<StoredRecordFile>(fileFor(PUBLISHED_DIR, id)),
      ]);
      return summaryOf(id, draft, published);
    }),
  );

  return documents.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getDocument(id: string): Promise<AdminDocumentPayload | null> {
  await ensureSeeded();

  const [draft, published] = await Promise.all([
    readJson<StoredRecordFile>(fileFor(DRAFT_DIR, id)),
    readJson<StoredRecordFile>(fileFor(PUBLISHED_DIR, id)),
  ]);

  const record = draft?.record ?? published?.record;
  if (!record) return null;

  return { summary: summaryOf(id, draft, published), draft, published, record };
}

function normalizeIdentity(record: ContentRecord, previous: ContentRecord): ContentRecord {
  const slug = record.slug || previous.slug;
  // Mỗi loại nội dung có tiền tố đường dẫn riêng (/tin-tuc, /cong-dong…), nên chỉ
  // thay đoạn slug cuối thay vì dựng lại cả đường dẫn.
  const parent = previous.path.split('/').slice(0, -1).join('/');

  return {
    ...record,
    id: previous.id,
    kind: previous.kind,
    collection: previous.collection,
    slug,
    path: slug === previous.slug ? previous.path : `${parent}/${slug}`,
    translationKey: previous.translationKey,
  };
}

export async function saveDraft(id: string, record: ContentRecord): Promise<AdminDocumentPayload> {
  await ensureSeeded();

  const previous = await getDocument(id);
  const next = normalizeIdentity(record, previous?.record ?? record);

  await writeJson(fileFor(DRAFT_DIR, id), {
    ...toStored(next, 'draft'),
    updatedAt: new Date().toISOString(),
  });
  await pushHistory(id, next);

  const saved = await getDocument(id);
  if (!saved) throw new Error(`Không lưu được bản nháp ${id}.`);
  return saved;
}

export async function publishDocument(id: string): Promise<AdminDocumentPayload> {
  await ensureSeeded();

  const document = await getDocument(id);
  if (!document) throw new Error(`Không tìm thấy ${id}.`);

  const candidate: ContentRecord = {
    ...document.record,
    publishedAt: document.record.publishedAt ?? today(),
  };
  const parsed = contentRecordSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new AdminValidationError(
      parsed.error.issues.map((issue) => {
        const where = issue.path.join('.') || 'nội dung';
        return `${where}: ${issue.message}`;
      }),
    );
  }

  await writeJson(fileFor(PUBLISHED_DIR, id), toStored(parsed.data, 'published'));
  await pushHistory(id, parsed.data);
  await fs.rm(fileFor(DRAFT_DIR, id), { force: true });

  const published = await getDocument(id);
  if (!published) throw new Error(`Không đăng được ${id}.`);
  return published;
}

/** Gỡ bài khỏi website nhưng giữ nguyên nội dung để đăng lại. */
export async function unpublishDocument(id: string): Promise<AdminDocumentPayload> {
  await ensureSeeded();

  const document = await getDocument(id);
  if (!document) throw new Error(`Không tìm thấy ${id}.`);

  await writeJson(fileFor(DRAFT_DIR, id), toStored(document.record, 'draft'));
  await fs.rm(fileFor(PUBLISHED_DIR, id), { force: true });

  const unpublished = await getDocument(id);
  if (!unpublished) throw new Error(`Không gỡ được ${id}.`);
  return unpublished;
}

async function uniqueSlug(base: string): Promise<string> {
  const taken = new Set([...(await listIds(PUBLISHED_DIR)), ...(await listIds(DRAFT_DIR))]);
  const root = base || 'bai-viet';

  if (!taken.has(documentIdFor('news', root))) return root;

  for (let index = 2; index < 200; index += 1) {
    const candidate = `${root}-${index}`;
    if (!taken.has(documentIdFor('news', candidate))) return candidate;
  }

  return `${root}-${Date.now()}`;
}

export async function createDocument(input: {
  title: string;
  summary?: string;
}): Promise<AdminDocumentPayload> {
  await ensureSeeded();

  const title = input.title.trim() || 'Bài viết mới';
  const slug = await uniqueSlug(toAnchorId(title));
  const id = documentIdFor('news', slug);

  const record: ContentRecord = {
    id: `news-${slug}`,
    kind: 'news',
    collection: 'news',
    slug,
    path: `/tin-tuc/${slug}`,
    locale: 'vi',
    translationKey: `news-${slug}`,
    title,
    summary: input.summary?.trim() ?? '',
    body: [{ type: 'paragraph', text: '' }],
    tags: [],
    evidenceStatus: 'provided_by_gisa',
    sourceUrl: `https://gisa.edu.vn/tin-tuc/${slug}`,
    sourceLabel: 'GISA',
    checkedAt: today(),
    metadata: { topic: 'Tin tức GISA' },
  };

  const saved = await saveDraft(id, record);
  return saved;
}

export async function listVersions(id: string): Promise<AdminVersion[]> {
  const directory = path.join(HISTORY_DIR, id);

  try {
    const entries = await fs.readdir(directory);
    const versions = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) => {
          const record = await readJson<ContentRecord>(path.join(directory, entry));
          return {
            version: entry.slice(0, -5),
            at: new Date(Number(entry.slice(0, -5))).toISOString(),
            title: record?.title ?? '',
          };
        }),
    );

    return versions.sort((left, right) => right.version.localeCompare(left.version));
  } catch {
    return [];
  }
}

export async function restoreVersion(id: string, version: string): Promise<AdminDocumentPayload> {
  const snapshot = await readJson<ContentRecord>(path.join(HISTORY_DIR, id, `${version}.json`));
  if (!snapshot) throw new Error(`Không tìm thấy bản lưu ${version}.`);

  return saveDraft(id, snapshot);
}

/** Nội dung đã đăng, dùng cho repository của website công khai. */
export async function listPublishedRecords(): Promise<ContentRecord[]> {
  await ensureSeeded();
  const ids = await listIds(PUBLISHED_DIR);

  const records = await Promise.all(
    ids.map(async (id) => (await readJson<StoredRecordFile>(fileFor(PUBLISHED_DIR, id)))?.record ?? null),
  );

  return records.filter((record): record is ContentRecord => record !== null);
}

/** Đường dẫn đang có bản nháp nhưng chưa đăng, để website ẩn chúng đi. */
export async function listDraftOnlyPaths(): Promise<string[]> {
  await ensureSeeded();

  const [drafts, published] = await Promise.all([listIds(DRAFT_DIR), listIds(PUBLISHED_DIR)]);
  const publishedIds = new Set(published);

  const paths = await Promise.all(
    drafts
      .filter((id) => !publishedIds.has(id))
      .map(async (id) => (await readJson<StoredRecordFile>(fileFor(DRAFT_DIR, id)))?.path ?? null),
  );

  return paths.filter((value): value is string => value !== null);
}
