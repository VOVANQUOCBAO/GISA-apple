import { isPublishableEvidence } from '../evidence';
import type {
  Collection,
  ContentQuery,
  ContentRecord,
  ContentSummary,
  PaginatedResult,
} from '../types';
import type { ContentRepository } from './content-repository';

/**
 * Nạp kho admin theo nhu cầu. `@/lib/admin/store` có `server-only` và `node:fs`,
 * nên import tĩnh sẽ làm hỏng mọi test chạm tới `getContentRepository()`.
 */
async function adminStore() {
  return import('@/lib/admin/store');
}

/**
 * Nội dung do admin local quản lý (`content-data/admin`).
 *
 * Admin được ưu tiên cho những collection mà nó đang giữ bản đã đăng; mọi thứ
 * khác vẫn do repository nền phục vụ. Nhờ vậy có thể thêm dần loại nội dung mà
 * không phải migrate cả website, và không có chuyện một bài vừa nằm ở fixture
 * vừa nằm ở admin rồi hiện hai lần.
 */
function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('vi');
}

function toSummary(record: ContentRecord): ContentSummary {
  const {
    id,
    kind,
    collection,
    slug,
    path,
    title,
    summary,
    publishedAt,
    image,
    tags,
    evidenceStatus,
    metadata,
  } = record;

  return {
    id,
    kind,
    collection,
    slug,
    path,
    title,
    summary,
    publishedAt,
    image,
    tags,
    evidenceStatus,
    metadata,
  };
}

function sortKey(record: Pick<ContentRecord, 'publishedAt' | 'metadata'>): string {
  if (record.publishedAt) return record.publishedAt;
  const year = record.metadata.year;
  return (Array.isArray(year) ? year[0] : year) ?? '';
}

function compareRecords(left: ContentRecord, right: ContentRecord): number {
  return (
    sortKey(right).localeCompare(sortKey(left)) ||
    left.title.localeCompare(right.title, 'vi')
  );
}

function matchesFilters(record: ContentRecord, filters: Record<string, string>): boolean {
  return Object.entries(filters).every(([key, requestedValue]) => {
    const value = record.metadata[key];
    const requested = normalize(requestedValue);

    return Array.isArray(value)
      ? value.some((item) => normalize(item) === requested)
      : typeof value === 'string' && normalize(value) === requested;
  });
}

function availableFilters(records: ContentRecord[]): Record<string, string[]> {
  const values = new Map<string, Set<string>>();

  for (const record of records) {
    for (const [key, rawValue] of Object.entries(record.metadata)) {
      const entries = Array.isArray(rawValue) ? rawValue : [rawValue];
      const bucket = values.get(key) ?? new Set<string>();

      for (const entry of entries) {
        if (entry) bucket.add(entry);
      }

      values.set(key, bucket);
    }
  }

  return Object.fromEntries(
    [...values.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entries]) => [
        key,
        [...entries].sort((left, right) => left.localeCompare(right, 'vi')),
      ]),
  );
}

export class LocalAdminContentRepository implements ContentRepository {
  constructor(private readonly base: ContentRepository) {}

  private async published(): Promise<ContentRecord[]> {
    const { listPublishedRecords } = await adminStore();
    return (await listPublishedRecords()).filter((record) =>
      isPublishableEvidence(record.evidenceStatus),
    );
  }

  private async hiddenPaths(): Promise<Set<string>> {
    const { listDraftOnlyPaths } = await adminStore();
    const [drafts, published] = await Promise.all([listDraftOnlyPaths(), this.published()]);
    const visible = new Set(published.map((record) => record.path));
    return new Set(drafts.filter((path) => !visible.has(path)));
  }

  async getByPath(path: string): Promise<ContentRecord | null> {
    const admin = await this.published();
    const match = admin.find((record) => record.path === path);
    if (match) return match;

    if ((await this.hiddenPaths()).has(path)) return null;
    return this.base.getByPath(path);
  }

  async getBySlug(collection: Collection, slug: string): Promise<ContentRecord | null> {
    const admin = await this.published();
    if (admin.some((record) => record.collection === collection)) {
      return admin.find((record) => record.collection === collection && record.slug === slug) ?? null;
    }

    return this.base.getBySlug(collection, slug);
  }

  async list(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    const admin = await this.published();

    if (query.collection && admin.some((record) => record.collection === query.collection)) {
      return this.paginate(
        admin.filter((record) => record.collection === query.collection),
        query,
        false,
      );
    }

    if (!query.collection) return this.overlay(await this.base.list(query));

    return this.base.list(query);
  }

  async search(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    const admin = await this.published();

    if (query.collection && admin.some((record) => record.collection === query.collection)) {
      return this.paginate(
        admin.filter((record) => record.collection === query.collection),
        query,
        true,
      );
    }

    if (!query.collection) return this.overlay(await this.base.search(query));

    return this.base.search(query);
  }

  async listIndexablePaths(): Promise<string[]> {
    const [basePaths, admin, hidden] = await Promise.all([
      this.base.listIndexablePaths(),
      this.published(),
      this.hiddenPaths(),
    ]);

    const adminPaths = new Set(admin.map((record) => record.path));
    const kept = basePaths.filter((path) => !hidden.has(path));

    return [...new Set([...kept, ...adminPaths])].sort((left, right) =>
      left.localeCompare(right),
    );
  }

  /**
   * Khi tìm trên toàn bộ nội dung, repository nền vẫn trả về bản fixture của
   * những bài admin đang quản lý. Thay bằng bản trong admin và ẩn bài đang nháp.
   */
  private async overlay(result: PaginatedResult<ContentSummary>): Promise<PaginatedResult<ContentSummary>> {
    const [admin, hidden] = await Promise.all([this.published(), this.hiddenPaths()]);
    const byPath = new Map(admin.map((record) => [record.path, record]));

    const items = result.items
      .filter((item) => !hidden.has(item.path))
      .map((item) => {
        const record = byPath.get(item.path);
        return record ? toSummary(record) : item;
      });

    return { ...result, items };
  }

  private paginate(
    records: ContentRecord[],
    query: ContentQuery,
    includeSearch: boolean,
  ): PaginatedResult<ContentSummary> {
    const fixedScope = query.scope;
    const scope = fixedScope
      ? records.filter((record) => matchesFilters(record, fixedScope))
      : records;
    const normalizedQuery = normalize(query.query ?? '');
    const searched =
      includeSearch && normalizedQuery
        ? scope.filter((record) =>
            normalize([record.title, record.summary, ...record.tags].join(' ')).includes(
              normalizedQuery,
            ),
          )
        : scope;

    const filtered = searched
      .filter((record) => matchesFilters(record, query.filters ?? {}))
      .sort(compareRecords);

    const pageSize = Math.max(1, Math.floor(query.pageSize));
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const page = Math.min(Math.max(1, Math.floor(query.page)), pageCount);
    const start = (page - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize).map(toSummary),
      total: filtered.length,
      page,
      pageSize,
      pageCount,
      availableFilters: availableFilters(scope),
    };
  }
}
