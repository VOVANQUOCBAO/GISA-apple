import 'server-only';

import { allContentFixtures } from '@/content/fixtures';
import { contentRecordSchema } from '@/content/schema';
import type { ContentRecord } from '@/content/types';
import { toAnchorId } from '@/lib/anchor-id';

import { listDocNames, readDoc, readDocsIn, removeDoc, writeDoc } from './kv';
import type {
  AdminDocumentPayload,
  AdminDocumentSummary,
  AdminVersion,
  StoredRecordFile,
} from './types';

/**
 * Kho nội dung của admin (file JSON trên máy, Postgres khi deploy — xem `kv.ts`).
 * Toàn bộ nội dung vẫn đi qua đúng `ContentRecord` mà website đang dùng, nên
 * bản xem trước và trang thật không thể lệch schema.
 */
const DRAFT_DIR = 'drafts';
const PUBLISHED_DIR = 'published';
const HISTORY_DIR = 'history';
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

function keyFor(directory: string, id: string): string {
  return `${directory}/${id}`;
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
      if ((await listDocNames(PUBLISHED_DIR)).length > 0) return;

      const records = contentRecordSchema.array().parse(allContentFixtures);
      for (const record of records) {
        if (!(EDITORIAL_KINDS as readonly string[]).includes(record.kind)) continue;
        await writeDoc(
          keyFor(PUBLISHED_DIR, documentIdFor(record.kind, record.slug)),
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
  const directory = keyFor(HISTORY_DIR, id);
  await writeDoc(`${directory}/${Date.now()}`, record);

  const versions = (await listDocNames(directory)).sort().reverse();
  for (const stale of versions.slice(MAX_HISTORY)) {
    await removeDoc(`${directory}/${stale}`);
  }
}

export async function listDocuments(): Promise<AdminDocumentSummary[]> {
  await ensureSeeded();

  const [drafts, published] = await Promise.all([
    readDocsIn<StoredRecordFile>(DRAFT_DIR),
    readDocsIn<StoredRecordFile>(PUBLISHED_DIR),
  ]);
  const ids = new Set([...published.keys(), ...drafts.keys()]);
  const documents = [...ids].map((id) =>
    summaryOf(id, drafts.get(id) ?? null, published.get(id) ?? null),
  );

  return documents.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getDocument(id: string): Promise<AdminDocumentPayload | null> {
  await ensureSeeded();

  const [draft, published] = await Promise.all([
    readDoc<StoredRecordFile>(keyFor(DRAFT_DIR, id)),
    readDoc<StoredRecordFile>(keyFor(PUBLISHED_DIR, id)),
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

  await writeDoc(keyFor(DRAFT_DIR, id), {
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

  await writeDoc(keyFor(PUBLISHED_DIR, id), toStored(parsed.data, 'published'));
  await pushHistory(id, parsed.data);
  await removeDoc(keyFor(DRAFT_DIR, id));

  const published = await getDocument(id);
  if (!published) throw new Error(`Không đăng được ${id}.`);
  return published;
}

/** Gỡ bài khỏi website nhưng giữ nguyên nội dung để đăng lại. */
export async function unpublishDocument(id: string): Promise<AdminDocumentPayload> {
  await ensureSeeded();

  const document = await getDocument(id);
  if (!document) throw new Error(`Không tìm thấy ${id}.`);

  await writeDoc(keyFor(DRAFT_DIR, id), toStored(document.record, 'draft'));
  await removeDoc(keyFor(PUBLISHED_DIR, id));

  const unpublished = await getDocument(id);
  if (!unpublished) throw new Error(`Không gỡ được ${id}.`);
  return unpublished;
}

async function uniqueSlug(base: string): Promise<string> {
  const taken = new Set([
    ...(await listDocNames(PUBLISHED_DIR)),
    ...(await listDocNames(DRAFT_DIR)),
  ]);
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
  const snapshots = await readDocsIn<ContentRecord>(keyFor(HISTORY_DIR, id));
  const versions = [...snapshots].map(([version, record]) => ({
    version,
    at: new Date(Number(version)).toISOString(),
    title: record?.title ?? '',
  }));

  return versions.sort((left, right) => right.version.localeCompare(left.version));
}

export async function restoreVersion(id: string, version: string): Promise<AdminDocumentPayload> {
  const snapshot = await readDoc<ContentRecord>(`${keyFor(HISTORY_DIR, id)}/${version}`);
  if (!snapshot) throw new Error(`Không tìm thấy bản lưu ${version}.`);

  return saveDraft(id, snapshot);
}

/** Nội dung đã đăng, dùng cho repository của website công khai. */
export async function listPublishedRecords(): Promise<ContentRecord[]> {
  await ensureSeeded();
  const published = await readDocsIn<StoredRecordFile>(PUBLISHED_DIR);
  return [...published.values()].map((file) => file.record).filter(Boolean);
}

/** Đường dẫn đang có bản nháp nhưng chưa đăng, để website ẩn chúng đi. */
export async function listDraftOnlyPaths(): Promise<string[]> {
  await ensureSeeded();

  const [drafts, published] = await Promise.all([
    readDocsIn<StoredRecordFile>(DRAFT_DIR),
    listDocNames(PUBLISHED_DIR),
  ]);
  const publishedIds = new Set(published);

  return [...drafts]
    .filter(([id, file]) => !publishedIds.has(id) && Boolean(file.path))
    .map(([, file]) => file.path);
}
