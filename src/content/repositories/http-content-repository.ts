import { z } from 'zod';

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

const contentPageSchema = z.object({
  items: z.array(contentRecordSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  pageCount: z.number().int().positive(),
  availableFilters: z.record(z.string(), z.array(z.string())),
});

export type ContentSourceErrorKind = 'network' | 'schema' | 'not_found';

export class ContentSourceError extends Error {
  readonly kind: ContentSourceErrorKind;

  constructor(
    kind: ContentSourceErrorKind,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ContentSourceError';
    this.kind = kind;
  }
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

function isNotFound(error: unknown): error is ContentSourceError {
  return error instanceof ContentSourceError && error.kind === 'not_found';
}

export class HttpContentRepository implements ContentRepository {
  private readonly baseUrl: URL;

  constructor(
    baseUrl: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {
    try {
      const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      this.baseUrl = new URL(normalizedBaseUrl);
    } catch (error) {
      throw new ContentSourceError(
        'network',
        `Invalid content API base URL: ${baseUrl}`,
        { cause: error },
      );
    }

    if (!['http:', 'https:'].includes(this.baseUrl.protocol)) {
      throw new ContentSourceError(
        'network',
        'Content API base URL must use http or https.',
      );
    }
  }

  async getByPath(path: string): Promise<ContentRecord | null> {
    try {
      const record = await this.request(
        '/content',
        { path },
        contentRecordSchema.nullable(),
      );
      return record && isPublishableEvidence(record.evidenceStatus)
        ? record
        : null;
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async getBySlug(
    collection: Collection,
    slug: string,
  ): Promise<ContentRecord | null> {
    try {
      const record = await this.request(
        `/content/${encodeURIComponent(collection)}/${encodeURIComponent(slug)}`,
        {},
        contentRecordSchema.nullable(),
      );
      return record && isPublishableEvidence(record.evidenceStatus)
        ? record
        : null;
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async list(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    return this.query('/content', query);
  }

  async search(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    return this.query('/search', query);
  }

  async listIndexablePaths(): Promise<string[]> {
    const paths = new Set<string>();
    let page = 1;
    let pageCount = 1;

    do {
      const result = await this.request(
        '/content',
        { indexable: 'true', page, pageSize: 100 },
        contentPageSchema,
      );

      for (const record of result.items) {
        if (isPublishableEvidence(record.evidenceStatus)) paths.add(record.path);
      }

      pageCount = result.pageCount;
      page += 1;
    } while (page <= pageCount);

    return [...paths].sort((left, right) => left.localeCompare(right));
  }

  private async query(
    endpoint: '/content' | '/search',
    query: ContentQuery,
  ): Promise<PaginatedResult<ContentSummary>> {
    const filters = Object.fromEntries(
      Object.entries(query.filters)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => [`filter.${key}`, value]),
    );
    const result = await this.request(
      endpoint,
      {
        ...(query.collection ? { collection: query.collection } : {}),
        ...(endpoint === '/search' && query.query ? { q: query.query } : {}),
        page: query.page,
        pageSize: query.pageSize,
        ...filters,
      },
      contentPageSchema,
    );

    return {
      ...result,
      items: result.items
        .filter((record) => isPublishableEvidence(record.evidenceStatus))
        .map(toSummary),
    };
  }

  private async request<T>(
    endpoint: string,
    parameters: Record<string, string | number>,
    schema: z.ZodType<T>,
  ): Promise<T> {
    const url = new URL(endpoint.replace(/^\//, ''), this.baseUrl);
    for (const [key, value] of Object.entries(parameters)) {
      url.searchParams.set(key, String(value));
    }

    let response: Response;
    try {
      response = await this.fetcher(url, {
        headers: { accept: 'application/json' },
      });
    } catch (error) {
      throw new ContentSourceError(
        'network',
        `Content request failed: ${url.toString()}`,
        { cause: error },
      );
    }

    if (!response.ok) {
      const kind = response.status === 404 ? 'not_found' : 'network';
      throw new ContentSourceError(
        kind,
        `Content request returned ${response.status}: ${url.toString()}`,
      );
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      throw new ContentSourceError(
        'schema',
        `Content schema validation failed for ${url.pathname}: invalid JSON`,
        { cause: error },
      );
    }

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new ContentSourceError(
        'schema',
        `Content schema validation failed for ${url.pathname}: ${parsed.error.issues
          .map((issue) => `${issue.path.join('.') || '(root)'} ${issue.message}`)
          .join('; ')}`,
        { cause: parsed.error },
      );
    }

    return parsed.data;
  }
}
