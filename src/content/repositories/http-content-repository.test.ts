import { expect, test } from 'vitest';

import { allContentFixtures } from '../fixtures';
import { contentRecordSchema } from '../schema';
import type {
  Collection,
  ContentQuery,
  ContentSummary,
  PaginatedResult,
} from '../types';
import { contentRepositoryContract } from './contract.test';
import { FixtureContentRepository } from './fixture-content-repository';
import { getContentRepository } from './index';
import {
  ContentSourceError,
  HttpContentRepository,
} from './http-content-repository';

const fixtureRepository = new FixtureContentRepository();
const records = contentRecordSchema.array().parse(allContentFixtures);
const recordsById = new Map(records.map((record) => [record.id, record]));

function expandPage(result: PaginatedResult<ContentSummary>) {
  return {
    ...result,
    items: result.items.map((item) => recordsById.get(item.id)),
  };
}

function queryFromUrl(url: URL): ContentQuery {
  const collection = url.searchParams.get('collection') ?? undefined;
  const filters = Object.fromEntries(
    [...url.searchParams.entries()]
      .filter(([key]) => key.startsWith('filter.'))
      .map(([key, value]) => [key.slice('filter.'.length), value]),
  );

  return {
    collection: collection as Collection | undefined,
    query: url.searchParams.get('q') ?? undefined,
    page: Number(url.searchParams.get('page') ?? 1),
    pageSize: Number(url.searchParams.get('pageSize') ?? 12),
    filters,
  };
}

const mockCmsFetcher: typeof fetch = async (input) => {
  const url = new URL(
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input
        : input.url,
  );

  if (url.pathname === '/content' && url.searchParams.has('path')) {
    const record = await fixtureRepository.getByPath(
      url.searchParams.get('path') ?? '',
    );
    return record
      ? Response.json(record)
      : new Response(null, { status: 404 });
  }

  if (url.pathname === '/content' && url.searchParams.has('indexable')) {
    const paths = await fixtureRepository.listIndexablePaths();
    const items = await Promise.all(
      paths.map((path) => fixtureRepository.getByPath(path)),
    );
    return Response.json({
      items,
      total: items.length,
      page: 1,
      pageSize: 100,
      pageCount: 1,
      availableFilters: {},
    });
  }

  if (url.pathname === '/content') {
    return Response.json(
      expandPage(await fixtureRepository.list(queryFromUrl(url))),
    );
  }

  if (url.pathname === '/search') {
    return Response.json(
      expandPage(await fixtureRepository.search(queryFromUrl(url))),
    );
  }

  const detailMatch = url.pathname.match(/^\/content\/([^/]+)\/([^/]+)$/);
  if (detailMatch) {
    const record = await fixtureRepository.getBySlug(
      decodeURIComponent(detailMatch[1]) as Collection,
      decodeURIComponent(detailMatch[2]),
    );
    return record
      ? Response.json(record)
      : new Response(null, { status: 404 });
  }

  return new Response(null, { status: 404 });
};

contentRepositoryContract(
  'HttpContentRepository',
  () =>
    new HttpContentRepository(
      'https://cms.example.invalid',
      mockCmsFetcher,
    ),
);

test('rejects an invalid CMS payload at the boundary', async () => {
  const repository = new HttpContentRepository(
    'https://cms.example.invalid',
    async () => Response.json({ items: [{ title: 42 }] }),
  );

  await expect(
    repository.list({
      collection: 'news',
      page: 1,
      pageSize: 12,
      filters: {},
    }),
  ).rejects.toThrow(/content schema/i);
});

test('maps transport failures to typed source errors', async () => {
  const networkRepository = new HttpContentRepository(
    'https://cms.example.invalid',
    async () => {
      throw new TypeError('connection refused');
    },
  );
  const missingRepository = new HttpContentRepository(
    'https://cms.example.invalid',
    async () => new Response(null, { status: 404 }),
  );

  const networkError = await networkRepository
    .list({ page: 1, pageSize: 12, filters: {} })
    .catch((error: unknown) => error);
  const missingError = await missingRepository
    .list({ page: 1, pageSize: 12, filters: {} })
    .catch((error: unknown) => error);

  expect(networkError).toBeInstanceOf(ContentSourceError);
  expect(networkError).toMatchObject({ kind: 'network' });
  expect(missingError).toBeInstanceOf(ContentSourceError);
  expect(missingError).toMatchObject({ kind: 'not_found' });
});

test('composition defaults to fixtures and validates HTTP configuration', () => {
  const previousSource = process.env.CONTENT_SOURCE;
  const previousBaseUrl = process.env.CONTENT_API_BASE_URL;

  try {
    delete process.env.CONTENT_SOURCE;
    delete process.env.CONTENT_API_BASE_URL;
    expect(getContentRepository()).toBeInstanceOf(FixtureContentRepository);

    process.env.CONTENT_SOURCE = 'http';
    expect(() => getContentRepository()).toThrow(
      'CONTENT_API_BASE_URL is required when CONTENT_SOURCE=http.',
    );

    process.env.CONTENT_API_BASE_URL = '/relative';
    expect(() => getContentRepository()).toThrow(/valid absolute http\(s\) URL/);

    process.env.CONTENT_API_BASE_URL = 'https://cms.example.invalid';
    expect(getContentRepository()).toBeInstanceOf(HttpContentRepository);

    process.env.CONTENT_SOURCE = 'unknown';
    expect(() => getContentRepository()).toThrow(/Unsupported CONTENT_SOURCE/);
  } finally {
    if (previousSource === undefined) delete process.env.CONTENT_SOURCE;
    else process.env.CONTENT_SOURCE = previousSource;

    if (previousBaseUrl === undefined) delete process.env.CONTENT_API_BASE_URL;
    else process.env.CONTENT_API_BASE_URL = previousBaseUrl;
  }
});
