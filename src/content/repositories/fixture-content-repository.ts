import { isPublishableEvidence } from '../evidence';
import { allContentFixtures } from '../fixtures';
import { contentRecordSchema } from '../schema';
import type {
  Collection,
  ContentQuery,
  ContentRecord,
  ContentSummary,
  PaginatedResult,
} from '../types';
import type { ContentRepository } from './content-repository';

const parsedFixtureRecords = contentRecordSchema.array().parse(allContentFixtures);

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

/**
 * Ấn phẩm khoa học chỉ có năm công bố, không có ngày, nên `publishedAt` để trống
 * và chúng sẽ rơi hết về nhánh so sánh theo tên. Với một mục lục nghiên cứu thì
 * thứ tự đó vô nghĩa, vì vậy `metadata.year` được dùng làm khóa thay thế: bài
 * mới nhất lên đầu, trùng năm mới xét đến tên.
 */
function sortKey(record: ContentRecord): string {
  if (record.publishedAt) return record.publishedAt;
  const year = record.metadata.year;
  return (Array.isArray(year) ? year[0] : year) ?? '';
}

function compareRecords(left: ContentRecord, right: ContentRecord): number {
  const dateOrder = sortKey(right).localeCompare(sortKey(left));
  return dateOrder || left.title.localeCompare(right.title, 'vi');
}

function matchesFilters(
  record: ContentRecord,
  filters: Record<string, string>,
): boolean {
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
      const target = values.get(key) ?? new Set<string>();

      for (const entry of entries) {
        if (entry) target.add(entry);
      }

      values.set(key, target);
    }
  }

  return Object.fromEntries(
    [...values.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entries]) => [key, [...entries].sort((left, right) => left.localeCompare(right, 'vi'))]),
  );
}

export class FixtureContentRepository implements ContentRepository {
  private readonly records: ContentRecord[] = parsedFixtureRecords;

  private publicRecords(): ContentRecord[] {
    return this.records.filter((record) =>
      isPublishableEvidence(record.evidenceStatus),
    );
  }

  async getByPath(path: string): Promise<ContentRecord | null> {
    return this.publicRecords().find((record) => record.path === path) ?? null;
  }

  async getBySlug(
    collection: Collection,
    slug: string,
  ): Promise<ContentRecord | null> {
    return (
      this.publicRecords().find(
        (record) => record.collection === collection && record.slug === slug,
      ) ?? null
    );
  }

  async list(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    return this.query(query, false);
  }

  async search(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    return this.query(query, true);
  }

  async listIndexablePaths(): Promise<string[]> {
    return this.publicRecords()
      .map((record) => record.path)
      .sort((left, right) => left.localeCompare(right));
  }

  private query(
    query: ContentQuery,
    includeSearch: boolean,
  ): PaginatedResult<ContentSummary> {
    const publicRecords = this.publicRecords();
    const collectionRecords = query.collection
      ? publicRecords.filter((record) => record.collection === query.collection)
      : publicRecords;
    const normalizedQuery = normalize(query.query ?? '');
    const searchedRecords =
      includeSearch && normalizedQuery
        ? collectionRecords.filter((record) =>
            normalize(
              [record.title, record.summary, ...record.tags].join(' '),
            ).includes(normalizedQuery),
          )
        : collectionRecords;
    const filteredRecords = searchedRecords
      .filter((record) => matchesFilters(record, query.filters))
      .sort(compareRecords);
    const pageSize = Math.max(1, Math.floor(query.pageSize));
    const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
    const page = Math.min(Math.max(1, Math.floor(query.page)), pageCount);
    const start = (page - 1) * pageSize;

    return {
      items: filteredRecords.slice(start, start + pageSize).map(toSummary),
      total: filteredRecords.length,
      page,
      pageSize,
      pageCount,
      availableFilters: availableFilters(collectionRecords),
    };
  }
}
