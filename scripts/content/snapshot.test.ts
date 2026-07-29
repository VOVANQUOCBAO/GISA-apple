import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, test, vi } from 'vitest';

import { createFetchPolicy } from './fetch-policy';
import { parseSitemap, parseSitemapDocument } from './sitemap-schema';
import { approvedListingSeeds, discoverPageLinks, parseSnapshotCliArguments, runSnapshot } from './snapshot';

const temporaryDirectories: string[] = [];

test('uses the locked source-register listing seeds when the CLI supplies none', () => {
  expect(approvedListingSeeds([])).toEqual([
    'https://gisa.edu.vn/du-an-nghien-cuu',
    'https://gisa.edu.vn/tin-tuc',
  ]);
  expect(approvedListingSeeds(['https://gisa.edu.vn/custom'])).toEqual([
    'https://gisa.edu.vn/custom',
  ]);
});

test('accepts the literal pnpm argument separator used by the verification command', () => {
  expect(parseSnapshotCliArguments(['--', '--snapshot-id=2026-07-18'])).toMatchObject({
    snapshotId: '2026-07-18',
  });
});

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) =>
      rm(path, { force: true, recursive: true }),
    ),
  );
});

async function fixture(name: string): Promise<string> {
  return readFile(join(import.meta.dirname, 'test-data', name), 'utf8');
}

describe('parseSitemap', () => {
  test('returns sorted, deduplicated, same-origin absolute URLs without fragments', async () => {
    const urls = parseSitemap(await fixture('sitemap.xml'), {
      baseUrl: 'https://gisa.edu.vn',
      sitemapUrl: 'https://gisa.edu.vn/sitemap.xml',
    });

    expect(urls).toEqual([
      'https://gisa.edu.vn/',
      'https://gisa.edu.vn/nghien-cuu/bai-viet-a',
      'https://gisa.edu.vn/tin-tuc/bai-viet-b',
    ]);
  });

  test('separates child sitemap URLs from public page URLs', () => {
    const parsed = parseSitemapDocument(
      '<?xml version="1.0"?><sitemapindex><sitemap><loc>/pages.xml</loc></sitemap></sitemapindex>',
      {
        baseUrl: 'https://gisa.edu.vn',
        sitemapUrl: 'https://gisa.edu.vn/sitemap.xml',
      },
    );

    expect(parsed).toEqual({
      pageUrls: [],
      sitemapUrls: ['https://gisa.edu.vn/pages.xml'],
    });
  });
});

describe('discoverPageLinks', () => {
  test('retains listing provenance for W30S collection textarea items', async () => {
    const result = discoverPageLinks(await fixture('w30s-listing.html'), {
      baseUrl: 'https://gisa.edu.vn',
      pageUrl: 'https://gisa.edu.vn/tin-tuc',
      seedKind: 'listing',
    });
    expect(result.links).toEqual([
      { provenance: ['listing'], url: 'https://gisa.edu.vn/first-story' },
      { provenance: ['listing'], url: 'https://gisa.edu.vn/second-story' },
    ]);
  });
  test('classifies navigation, listing, pagination, and embedded same-origin links', async () => {
    const result = discoverPageLinks(await fixture('article.html'), {
      baseUrl: 'https://gisa.edu.vn',
      pageUrl: 'https://gisa.edu.vn/nghien-cuu?page=1',
      seedKind: 'listing',
    });

    expect(result.links).toEqual([
      {
        provenance: ['navigation'],
        url: 'https://gisa.edu.vn/gioi-thieu',
      },
      {
        provenance: ['embedded_link'],
        url: 'https://gisa.edu.vn/nghien-cuu/bai-bao-khoa-hoc/embedded-record',
      },
      {
        provenance: ['listing'],
        url: 'https://gisa.edu.vn/nghien-cuu/du-an/listing-record',
      },
      {
        provenance: ['listing'],
        url: 'https://gisa.edu.vn/nghien-cuu?page=2',
      },
    ]);
    expect(result.paginationUrls).toEqual([
      'https://gisa.edu.vn/nghien-cuu?page=2',
    ]);
  });
});

describe('createFetchPolicy', () => {
  test('limits concurrency to two and spaces request starts by at least 500ms', async () => {
    let clock = 0;
    let active = 0;
    let maxActive = 0;
    const starts: number[] = [];
    const releases: Array<() => void> = [];
    const policy = createFetchPolicy({
      concurrency: 2,
      fetchImpl: async () => {
        starts.push(clock);
        active += 1;
        maxActive = Math.max(maxActive, active);
        await new Promise<void>((resolve) => releases.push(resolve));
        active -= 1;
        return new Response('ok', {
          headers: { 'content-type': 'text/html; charset=utf-8' },
          status: 200,
        });
      },
      minStartIntervalMs: 500,
      now: () => clock,
      sleep: async (milliseconds) => {
        await Promise.resolve();
        clock += milliseconds;
      },
    });

    const pending = [
      policy.fetch('https://gisa.edu.vn/a'),
      policy.fetch('https://gisa.edu.vn/b'),
      policy.fetch('https://gisa.edu.vn/c'),
    ];
    await vi.waitFor(() => expect(releases).toHaveLength(2));
    expect(maxActive).toBe(2);
    releases.splice(0).forEach((release) => release());
    await vi.waitFor(() => expect(releases).toHaveLength(1));
    releases.splice(0).forEach((release) => release());
    await Promise.all(pending);

    expect(maxActive).toBe(2);
    expect(starts).toEqual([0, 500, 1000]);
  });

  test('retries transient failures and does not automatically follow redirects', async () => {
    const requestOptions: RequestInit[] = [];
    let attempts = 0;
    const policy = createFetchPolicy({
      fetchImpl: async (_url, init) => {
        requestOptions.push(init ?? {});
        attempts += 1;
        if (attempts < 3) return new Response('busy', { status: 503 });
        return new Response('', {
          headers: { location: 'https://outside.example/target' },
          status: 302,
        });
      },
      minStartIntervalMs: 0,
      retryDelayMs: 0,
    });

    const result = await policy.fetch('https://gisa.edu.vn/legacy');

    expect(attempts).toBe(3);
    expect(requestOptions.every((options) => options.redirect === 'manual')).toBe(
      true,
    );
    expect(result.status).toBe(302);
    expect(result.location).toBe('https://outside.example/target');
    expect(
      new Headers(requestOptions[0].headers).get('user-agent'),
    ).toContain('GISA-Content-Snapshot');
    expect(requestOptions.every((options) => options.signal instanceof AbortSignal)).toBe(
      true,
    );
  });

  test('aborts a request that exceeds the configured timeout', async () => {
    const policy = createFetchPolicy({
      fetchImpl: async (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
      maxRetries: 0,
      minStartIntervalMs: 0,
      timeoutMs: 5,
    });

    await expect(policy.fetch('https://gisa.edu.vn/slow')).rejects.toThrow(
      'Unable to fetch https://gisa.edu.vn/slow',
    );
  });
});

describe('runSnapshot', () => {
  test('writes a deterministic tracked manifest and resumes from matching raw hashes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-snapshot-'));
    temporaryDirectories.push(root);
    const sitemap = await fixture('sitemap.xml');
    const article = await fixture('article.html');
    let fetchCount = 0;
    const fetchImpl: typeof fetch = async (input) => {
      fetchCount += 1;
      const url = String(input);
      if (url.endsWith('/sitemap.xml')) {
        return new Response(sitemap, {
          headers: { 'content-type': 'application/xml' },
          status: 200,
        });
      }
      return new Response(article, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
        status: 200,
      });
    };
    const options = {
      baseUrl: 'https://gisa.edu.vn',
      cacheRoot: join(root, '.cache', 'gisa-import'),
      fetchPolicy: createFetchPolicy({
        fetchImpl,
        minStartIntervalMs: 0,
        retryDelayMs: 0,
      }),
      outputRoot: join(root, 'content-data', 'snapshots'),
      seedUrls: ['https://gisa.edu.vn/nghien-cuu?page=1'],
      sitemapUrl: 'https://gisa.edu.vn/sitemap.xml',
      snapshotId: '2026-07-18',
    } as const;

    const first = await runSnapshot(options);
    const firstFetchCount = fetchCount;
    const second = await runSnapshot(options);

    expect(first.entries.map((entry) => entry.url)).toEqual(
      [...first.entries.map((entry) => entry.url)].sort(),
    );
    expect(first.entries).toEqual(second.entries);
    expect(firstFetchCount).toBeGreaterThan(0);
    expect(fetchCount).toBe(firstFetchCount);
    expect(
      first.entries.every(
        (entry) =>
          entry.responseStatus !== undefined &&
          entry.contentType !== undefined &&
          entry.fetchedAt !== undefined &&
          entry.sha256 !== undefined &&
          entry.exclusionReason === null &&
          entry.extractionStatus === 'fetched',
      ),
    ).toBe(true);

    const manifest = JSON.parse(
      await readFile(
        join(root, 'content-data', 'snapshots', '2026-07-18', 'manifest.json'),
        'utf8',
      ),
    ) as typeof first;
    expect(manifest).toEqual(first);

    const beforeRefresh = fetchCount;
    await runSnapshot({ ...options, refresh: true });
    expect(fetchCount).toBeGreaterThan(beforeRefresh);
  });

  test('recursively parses same-origin sitemap indexes without treating them as pages', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-sitemap-index-'));
    temporaryDirectories.push(root);
    const fetched: string[] = [];
    const policy = createFetchPolicy({
      fetchImpl: async (input) => {
        const url = String(input);
        fetched.push(url);
        if (url.endsWith('/sitemap.xml')) {
          return new Response(
            '<?xml version="1.0"?><sitemapindex><sitemap><loc>/pages.xml</loc></sitemap></sitemapindex>',
            { headers: { 'content-type': 'application/xml' }, status: 200 },
          );
        }
        if (url.endsWith('/pages.xml')) {
          return new Response(
            '<?xml version="1.0"?><urlset><url><loc>/article</loc></url></urlset>',
            { headers: { 'content-type': 'application/xml' }, status: 200 },
          );
        }
        return new Response('<main></main>', {
          headers: { 'content-type': 'text/html' },
          status: 200,
        });
      },
      minStartIntervalMs: 0,
      retryDelayMs: 0,
    });

    const manifest = await runSnapshot({
      baseUrl: 'https://gisa.edu.vn',
      cacheRoot: join(root, '.cache', 'gisa-import'),
      fetchPolicy: policy,
      outputRoot: join(root, 'content-data', 'snapshots'),
      sitemapUrl: 'https://gisa.edu.vn/sitemap.xml',
      snapshotId: '2026-07-18',
    });

    expect(fetched).toContain('https://gisa.edu.vn/pages.xml');
    expect(manifest.sitemapFetches.map((record) => record.url)).toEqual([
      'https://gisa.edu.vn/pages.xml',
      'https://gisa.edu.vn/sitemap.xml',
    ]);
    expect(manifest.entries.map((entry) => entry.url)).toContain(
      'https://gisa.edu.vn/article',
    );
    expect(manifest.entries.map((entry) => entry.url)).not.toContain(
      'https://gisa.edu.vn/pages.xml',
    );
  });

  test('rejects a successful response that is not a valid sitemap document', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-invalid-sitemap-'));
    temporaryDirectories.push(root);

    await expect(
      runSnapshot({
        baseUrl: 'https://gisa.edu.vn',
        cacheRoot: join(root, '.cache', 'gisa-import'),
        fetchPolicy: createFetchPolicy({
          fetchImpl: async () =>
            new Response('<html><title>Access denied</title></html>', {
              headers: { 'content-type': 'text/html' },
              status: 200,
            }),
          minStartIntervalMs: 0,
        }),
        outputRoot: join(root, 'content-data', 'snapshots'),
        sitemapUrl: 'https://gisa.edu.vn/sitemap.xml',
        snapshotId: '2026-07-18',
      }),
    ).rejects.toThrow(
      'Invalid sitemap https://gisa.edu.vn/sitemap.xml',
    );
  });

  test('resumes intact raw sidecars even when the tracked manifest is missing', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-interrupted-snapshot-'));
    temporaryDirectories.push(root);
    const sitemap =
      '<?xml version="1.0"?><urlset><url><loc>/</loc></url><url><loc>/article</loc></url></urlset>';
    const firstFetches: string[] = [];
    const firstPolicy = createFetchPolicy({
      fetchImpl: async (input) => {
        const url = String(input);
        firstFetches.push(url);
        if (url.endsWith('/sitemap.xml')) {
          return new Response(sitemap, {
            headers: { 'content-type': 'application/xml' },
            status: 200,
          });
        }
        if (url.endsWith('/article')) throw new Error('connection lost');
        return new Response('<main></main>', {
          headers: { 'content-type': 'text/html' },
          status: 200,
        });
      },
      maxRetries: 0,
      minStartIntervalMs: 0,
    });
    const shared = {
      baseUrl: 'https://gisa.edu.vn',
      cacheRoot: join(root, '.cache', 'gisa-import'),
      outputRoot: join(root, 'content-data', 'snapshots'),
      seedUrls: [],
      sitemapUrl: 'https://gisa.edu.vn/sitemap.xml',
      snapshotId: '2026-07-18',
    } as const;
    await expect(
      runSnapshot({ ...shared, fetchPolicy: firstPolicy }),
    ).rejects.toThrow('https://gisa.edu.vn/article');
    await rm(
      join(root, 'content-data', 'snapshots', '2026-07-18', 'manifest.json'),
      { force: true },
    );

    const resumedFetches: string[] = [];
    const resumed = await runSnapshot({
      ...shared,
      fetchPolicy: createFetchPolicy({
        fetchImpl: async (input) => {
          resumedFetches.push(String(input));
          return new Response('<main></main>', {
            headers: { 'content-type': 'text/html' },
            status: 200,
          });
        },
        minStartIntervalMs: 0,
      }),
    });

    expect(firstFetches).toContain('https://gisa.edu.vn/');
    expect(resumedFetches).toEqual(['https://gisa.edu.vn/article']);
    expect(resumed.entries).toHaveLength(2);
  });

  test('prefers a valid raw sidecar when a raced tracked manifest row is stale', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-stale-manifest-'));
    temporaryDirectories.push(root);
    const shared = {
      baseUrl: 'https://gisa.edu.vn',
      cacheRoot: join(root, '.cache', 'gisa-import'),
      outputRoot: join(root, 'content-data', 'snapshots'),
      seedUrls: [],
      sitemapUrl: 'https://gisa.edu.vn/sitemap.xml',
      snapshotId: '2026-07-18',
    } as const;
    const first = await runSnapshot({
      ...shared,
      fetchPolicy: createFetchPolicy({
        fetchImpl: async (input) => String(input).endsWith('/sitemap.xml')
          ? new Response('<?xml version="1.0"?><urlset><url><loc>/article</loc></url></urlset>', { headers: { 'content-type': 'application/xml' } })
          : new Response('<main><h1>Article</h1></main>', { headers: { 'content-type': 'text/html' } }),
        minStartIntervalMs: 0,
      }),
    });
    const manifestPath = join(shared.outputRoot, shared.snapshotId, 'manifest.json');
    const stale = { ...first, entries: first.entries.map((entry) => ({ ...entry, sha256: 'stale-manifest-hash' })) };
    await writeFile(manifestPath, `${JSON.stringify(stale, null, 2)}\n`);
    const fetched: string[] = [];
    const resumed = await runSnapshot({
      ...shared,
      fetchPolicy: createFetchPolicy({
        fetchImpl: async (input) => { fetched.push(String(input)); throw new Error('must use valid sidecar'); },
        maxRetries: 0,
        minStartIntervalMs: 0,
      }),
    });
    expect(fetched).toEqual([]);
    expect(resumed.entries[0].sha256).toBe(first.entries[0].sha256);
  });

  test('rejects a cached manifest with a stale complete discovery-scope fingerprint', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-stale-scope-'));
    temporaryDirectories.push(root);
    const shared = {
      baseUrl: 'https://gisa.edu.vn', cacheRoot: join(root, '.cache', 'gisa-import'),
      outputRoot: join(root, 'content-data', 'snapshots'), seedUrls: [],
      sitemapUrl: 'https://gisa.edu.vn/sitemap.xml', snapshotId: '2026-07-18',
    } as const;
    const policy = createFetchPolicy({
      fetchImpl: async (input) => String(input).endsWith('/sitemap.xml')
        ? new Response('<?xml version="1.0"?><urlset><url><loc>/article</loc></url></urlset>', { headers: { 'content-type': 'application/xml' } })
        : new Response('<main></main>', { headers: { 'content-type': 'text/html' } }),
      minStartIntervalMs: 0,
    });
    const first = await runSnapshot({ ...shared, fetchPolicy: policy });
    const manifestPath = join(shared.outputRoot, shared.snapshotId, 'manifest.json');
    await writeFile(manifestPath, `${JSON.stringify({
      ...first,
      discoveryScope: { ...first.discoveryScope, fingerprint: 'stale-scope' },
    }, null, 2)}\n`);
    await expect(runSnapshot({ ...shared, fetchPolicy: policy })).rejects.toThrow(/discovery scope/i);
  });

  test('merges provenance discovered after a URL was already fetched', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-snapshot-provenance-'));
    temporaryDirectories.push(root);
    const sitemap = `<?xml version="1.0"?><urlset><url><loc>https://gisa.edu.vn/</loc></url><url><loc>https://gisa.edu.vn/article</loc></url></urlset>`;
    const policy = createFetchPolicy({
      fetchImpl: async (input) => {
        const url = String(input);
        if (url.endsWith('/sitemap.xml')) {
          return new Response(sitemap, {
            headers: { 'content-type': 'application/xml' },
            status: 200,
          });
        }
        return new Response(
          url.endsWith('/zz-listing')
            ? '<main><article><a href="/article">Article</a></article></main>'
            : '<main></main>',
          {
            headers: { 'content-type': 'text/html; charset=utf-8' },
            status: 200,
          },
        );
      },
      minStartIntervalMs: 0,
      retryDelayMs: 0,
    });

    const manifest = await runSnapshot({
      baseUrl: 'https://gisa.edu.vn',
      cacheRoot: join(root, '.cache', 'gisa-import'),
      fetchPolicy: policy,
      outputRoot: join(root, 'content-data', 'snapshots'),
      seedUrls: ['https://gisa.edu.vn/zz-listing'],
      sitemapUrl: 'https://gisa.edu.vn/sitemap.xml',
      snapshotId: '2026-07-18',
    });

    expect(
      manifest.entries.find(
        (entry) => entry.url === 'https://gisa.edu.vn/article',
      )?.provenance,
    ).toEqual(['sitemap', 'listing']);
  });

  test('fails with the exhausted URL instead of silently reducing coverage', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-snapshot-failure-'));
    temporaryDirectories.push(root);
    const sitemap = await fixture('sitemap.xml');
    const policy = createFetchPolicy({
      fetchImpl: async (input) =>
        String(input).endsWith('/sitemap.xml')
          ? new Response(sitemap, {
              headers: { 'content-type': 'application/xml' },
              status: 200,
            })
          : new Response('unavailable', { status: 503 }),
      minStartIntervalMs: 0,
      retryDelayMs: 0,
    });

    await expect(
      runSnapshot({
        baseUrl: 'https://gisa.edu.vn',
        cacheRoot: join(root, '.cache', 'gisa-import'),
        fetchPolicy: policy,
        outputRoot: join(root, 'content-data', 'snapshots'),
        seedUrls: [],
        sitemapUrl: 'https://gisa.edu.vn/sitemap.xml',
        snapshotId: '2026-07-18',
      }),
    ).rejects.toThrow('https://gisa.edu.vn/nghien-cuu/bai-viet-a');

    const manifest = JSON.parse(
      await readFile(
        join(root, 'content-data', 'snapshots', '2026-07-18', 'manifest.json'),
        'utf8',
      ),
    ) as { entries: Array<Record<string, unknown>> };
    const failed = manifest.entries.find(
      (entry) => entry.url === 'https://gisa.edu.vn/nghien-cuu/bai-viet-a',
    );
    expect(failed).toMatchObject({
      contentType: 'text/plain;charset=UTF-8',
      exclusionReason: null,
      extractionStatus: 'failed',
      responseStatus: 503,
    });
    expect(failed?.sha256).toEqual(expect.any(String));
  });
});
