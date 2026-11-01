import { z } from 'zod';

import { translate } from '@/lib/i18n/language';

import { isPublishableEvidence } from '../evidence';
import { contentRecordSchema } from '../schema';
import type {
  Collection,
  ContentQuery,
  ContentRecord,
  ContentSummary,
  PaginatedResult,
} from '../types';
import type { ContentRepository } from './content-repository';

/**
 * Tin tức lấy từ admin PHP trên InfinityFree.
 *
 * Toàn bộ nội dung khác (dự án, khóa học, chuyên gia…) vẫn lấy từ repository
 * nền (fixture hoặc HTTP CMS). Nhờ vậy có thể thay nguồn tin tức mà không phải
 * migrate cả website.
 */

const newsPageSchema = z.object({
  items: z.array(z.unknown()),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  pageCount: z.number().int().positive(),
  availableFilters: z.record(z.string(), z.array(z.string())).default({}),
});

interface NewsPage {
  records: ContentRecord[];
  pageCount: number;
  availableFilters: Record<string, string[]>;
}

function summaryOf(record: ContentRecord): ContentSummary {
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

function matches(
  record: ContentSummary,
  filters: Record<string, string>,
): boolean {
  return Object.entries(filters).every(([key, value]) => {
    const field = record.metadata[key];

    return Array.isArray(field) ? field.includes(value) : field === value;
  });
}

function searchableText(item: ContentSummary): string {
  return [
    item.title,
    item.summary,
    translate(item.title, 'en'),
    translate(item.summary, 'en'),
    ...item.tags,
  ]
    .join(' ')
    .toLocaleLowerCase('vi');
}

export class HttpNewsRepository implements ContentRepository {
  private readonly baseUrl: URL;

  constructor(
    private readonly base: ContentRepository,
    baseUrl: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {
    const normalized = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    try {
      this.baseUrl = new URL(normalized);
    } catch (error) {
      throw new Error(`NEWS_API_BASE_URL is not a valid URL: ${baseUrl}`, {
        cause: error,
      });
    }

    if (!['http:', 'https:'].includes(this.baseUrl.protocol)) {
      throw new Error('NEWS_API_BASE_URL must use http or https.');
    }
  }

  private async request(
    path: string,
    parameters: Record<string, string | number> = {},
  ): Promise<unknown> {
    const url = new URL(path.replace(/^\//, ''), this.baseUrl);
    for (const [key, value] of Object.entries(parameters)) {
      url.searchParams.set(key, String(value));
    }

    const init = {
      headers: {
        accept: 'application/json',
        // InfinityFree có hệ thống chống bot; dùng UA trình duyệt để API công khai
        // không bị chặn nhầm khi Vercel gọi server-to-server.
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    } as RequestInit & { next: { revalidate: number } };

    const response = await this.fetcher(url, init);
    if (!response.ok) {
      throw new Error(
        `News API request failed with ${response.status}: ${url.pathname}`,
      );
    }

    return response.json();
  }

  private async fetchPage(page: number): Promise<NewsPage> {
    const payload = await this.request('content', {
      collection: 'news',
      page,
      pageSize: 100,
    });
    const parsed = newsPageSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(
        `News API schema mismatch: ${parsed.error.issues
          .map((issue) => `${issue.path.join('.') || '(root)'} ${issue.message}`)
          .join('; ')}`,
      );
    }

    const records: ContentRecord[] = [];
    for (const item of parsed.data.items) {
      const record = contentRecordSchema.safeParse(item);
      if (!record.success) {
        console.error('Skipping invalid news record from PHP admin', {
          issues: record.error.issues,
        });
        continue;
      }
      if (isPublishableEvidence(record.data.evidenceStatus)) {
        records.push(record.data);
      }
    }

    return {
      records,
      pageCount: parsed.data.pageCount,
      availableFilters: parsed.data.availableFilters,
    };
  }

  private async allNews(): Promise<{
    records: ContentRecord[];
    availableFilters: Record<string, string[]>;
  }> {
    const first = await this.fetchPage(1);
    const records = [...first.records];
    const lastPage = Math.min(first.pageCount, 20);

    for (let page = 2; page <= lastPage; page += 1) {
      const next = await this.fetchPage(page);
      records.push(...next.records);
    }

    return { records, availableFilters: first.availableFilters };
  }

  async getByPath(path: string): Promise<ContentRecord | null> {
    const existing = await this.base.getByPath(path);
    if (existing) return existing;

    if (!/^\/tin-tuc\/[^/]+$/.test(path)) return null;

    try {
      const payload = await this.request('content', { path });
      const parsed = contentRecordSchema.nullable().safeParse(payload);
      const record = parsed.success ? parsed.data : null;

      return record && isPublishableEvidence(record.evidenceStatus)
        ? record
        : null;
    } catch (error) {
      console.error('Could not load news post from PHP admin', error);
      return null;
    }
  }

  async getBySlug(
    collection: Collection,
    slug: string,
  ): Promise<ContentRecord | null> {
    if (collection !== 'news') return this.base.getBySlug(collection, slug);

    return this.getByPath(`/tin-tuc/${slug}`);
  }

  async list(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    if (query.collection && query.collection !== 'news') {
      return this.base.list(query);
    }

    return this.combine(query, false);
  }

  async search(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    if (query.collection && query.collection !== 'news') {
      return this.base.search(query);
    }

    return this.combine(query, true);
  }

  private async combine(
    query: ContentQuery,
    search: boolean,
  ): Promise<PaginatedResult<ContentSummary>> {
    const existing = await (search ? this.base.search : this.base.list).call(
      this.base,
      { ...query, page: 1, pageSize: 10000 },
    );

    let remote: ContentSummary[] = [];
    try {
      const news = await this.allNews();
      remote = news.records.map(summaryOf);
    } catch (error) {
      console.error('Could not load news list from PHP admin', error);
    }

    const needle = query.query?.trim().toLocaleLowerCase('vi') ?? '';
    const all = [...remote, ...existing.items]
      .filter(
        (item) =>
          (!query.collection || item.collection === query.collection) &&
          matches(item, query.scope ?? {}) &&
          matches(item, query.filters) &&
          (!search || needle === '' || searchableText(item).includes(needle)),
      )
      .sort(
        (left, right) =>
          (right.publishedAt ?? '').localeCompare(left.publishedAt ?? '') ||
          left.title.localeCompare(right.title, 'vi'),
      );

    const pageSize = Math.max(1, Math.floor(query.pageSize));
    const pageCount = Math.max(1, Math.ceil(all.length / pageSize));
    const page = Math.min(Math.max(1, Math.floor(query.page)), pageCount);
    const availableFilters = { ...existing.availableFilters };
    const facetKeys = new Set(['topic', 'category']);

    for (const post of remote) {
      for (const [key, value] of Object.entries(post.metadata)) {
        if (!facetKeys.has(key)) continue;
        const values = Array.isArray(value) ? value : value ? [value] : [];
        availableFilters[key] = [
          ...new Set([...(availableFilters[key] ?? []), ...values]),
        ];
      }
    }

    return {
      items: all.slice((page - 1) * pageSize, page * pageSize),
      total: all.length,
      page,
      pageSize,
      pageCount,
      availableFilters,
    };
  }

  async listIndexablePaths(): Promise<string[]> {
    const basePaths = await this.base.listIndexablePaths();

    try {
      const news = await this.allNews();

      return [
        ...new Set([...basePaths, ...news.records.map((record) => record.path)]),
      ].sort((left, right) => left.localeCompare(right));
    } catch (error) {
      console.error('Could not load indexable news paths from PHP admin', error);

      return basePaths;
    }
  }
}
