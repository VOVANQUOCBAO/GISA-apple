import { createHash } from 'node:crypto';
import {
  mkdir,
  readFile,
  rename,
  writeFile,
} from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as cheerio from 'cheerio';

import { createFetchPolicy, type FetchPolicy, type FetchResult } from './fetch-policy';
import {
  type DiscoveredLink,
  type DiscoverySource,
  type SnapshotFetchRecord,
  type SnapshotManifest,
  type SnapshotManifestEntry,
  sortDiscoverySources,
} from './import-types';
import {
  normalizeSameOriginUrl,
  parseSitemapDocument,
} from './sitemap-schema';

interface DiscoverPageOptions {
  baseUrl: string;
  pageUrl: string;
  seedKind?: 'listing';
}

export interface DiscoveredPageLinks {
  links: DiscoveredLink[];
  paginationUrls: string[];
}

export interface RunSnapshotOptions {
  baseUrl: string;
  cacheRoot?: string;
  fetchPolicy?: FetchPolicy;
  outputRoot?: string;
  refresh?: boolean;
  seedUrls?: readonly string[];
  sitemapUrl: string;
  snapshotId: string;
}

const LOCKED_LISTING_SEEDS = [
  'https://gisa.edu.vn/du-an-nghien-cuu',
  'https://gisa.edu.vn/tin-tuc',
] as const;

export function approvedListingSeeds(seedUrls: readonly string[]): string[] {
  return [...(seedUrls.length > 0 ? seedUrls : LOCKED_LISTING_SEEDS)].sort();
}

const HTML_TYPES = ['text/html', 'application/xhtml+xml'];

function addDiscovery(
  map: Map<string, Set<DiscoverySource>>,
  url: string | undefined,
  source: DiscoverySource,
): void {
  if (!url) return;
  const sources = map.get(url) ?? new Set<DiscoverySource>();
  sources.add(source);
  map.set(url, sources);
}

export function discoverPageLinks(
  html: string,
  options: DiscoverPageOptions,
): DiscoveredPageLinks {
  const $ = cheerio.load(html);
  const discovered = new Map<string, Set<DiscoverySource>>();
  const pagination = new Set<string>();
  const normalize = (value: string): string | undefined =>
    normalizeSameOriginUrl(value, options.baseUrl, options.pageUrl);

  $('header a[href], nav a[href]').each((_index, element) => {
    const node = $(element);
    if (node.closest('[class*="pagination"], [aria-label*="pagination" i]').length) {
      return;
    }
    addDiscovery(discovered, normalize(node.attr('href') ?? ''), 'navigation');
  });

  const listingSelectors = [
    'main article a[href]',
    'main [class*="card"] a[href]',
    'main [class*="item"] a[href]',
    'main [class*="list"] a[href]',
  ].join(', ');
  $(listingSelectors).each((_index, element) => {
    addDiscovery(
      discovered,
      normalize($(element).attr('href') ?? ''),
      'listing',
    );
  });

  $('a[rel="next"], [class*="pagination"] a[href], [aria-label*="pagination" i] a[href]').each(
    (_index, element) => {
      const url = normalize($(element).attr('href') ?? '');
      addDiscovery(discovered, url, 'listing');
      if (url) pagination.add(url);
    },
  );

  $('main a[href]').each((_index, element) => {
    const url = normalize($(element).attr('href') ?? '');
    if (url && !discovered.has(url)) {
      addDiscovery(
        discovered,
        url,
        options.seedKind === 'listing' ? 'listing' : 'embedded_link',
      );
    }
  });

  $('script').each((_index, element) => {
    const text = $(element).text();
    const expression = /["'](?:url|href|link|path)["']\s*:\s*["']([^"']+)["']/gi;
    for (const match of text.matchAll(expression)) {
      addDiscovery(discovered, normalize(match[1]), 'embedded_link');
    }
  });

  $('textarea.w30s-content-data-page').each((_index, element) => {
    let payload: unknown;
    try {
      payload = JSON.parse($(element).text().trim());
    } catch {
      return;
    }
    const visit = (value: unknown): void => {
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (!value || typeof value !== 'object') return;
      const object = value as Record<string, unknown>;
      if ((typeof object.id === 'string' || typeof object.id === 'number') && typeof object.name === 'string') {
        const candidate = typeof object.qr_code === 'string'
          ? object.qr_code
          : typeof object.seo_name === 'string' && object.seo_name
            ? `/${object.seo_name}`
            : undefined;
        addDiscovery(discovered, candidate ? normalize(candidate) : undefined, options.seedKind === 'listing' ? 'listing' : 'embedded_link');
      }
      Object.values(object).forEach(visit);
    };
    visit(payload);
  });

  discovered.delete(normalize(options.pageUrl) ?? options.pageUrl);
  return {
    links: [...discovered.entries()]
      .map(([url, sources]) => ({
        provenance: sortDiscoverySources(sources),
        url,
      }))
      .sort((left, right) => (left.url < right.url ? -1 : left.url > right.url ? 1 : 0)),
    paginationUrls: [...pagination].sort(),
  };
}

function hashBytes(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function rawExtension(contentType: string, url: string): string {
  if (contentType.includes('html')) return '.html';
  if (contentType.includes('xml')) return '.xml';
  const candidate = extname(new URL(url).pathname).toLowerCase();
  return /^[.][a-z0-9]{1,8}$/.test(candidate) ? candidate : '.bin';
}

function rawFilename(url: string, contentType: string): string {
  return `${createHash('sha256').update(url).digest('hex')}${rawExtension(
    contentType,
    url,
  )}`;
}

function rawMetadataPath(url: string): string {
  return join(
    'raw',
    `${createHash('sha256').update(url).digest('hex')}.json`,
  );
}

async function atomicWrite(path: string, contents: string | Uint8Array): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp-${process.pid}`;
  await writeFile(temporaryPath, contents);
  await rename(temporaryPath, path);
}

async function readManifest(path: string): Promise<SnapshotManifest | undefined> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as SnapshotManifest;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}

interface CachedFetch {
  bytes: Uint8Array;
  record: SnapshotFetchRecord;
}

function resolveCachePath(
  cacheDirectory: string,
  path: string,
): string | undefined {
  const root = resolve(cacheDirectory);
  const target = resolve(root, path);
  const childPath = relative(root, target);
  if (
    childPath === '' ||
    childPath === '..' ||
    childPath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) ||
    isAbsolute(childPath)
  ) {
    return undefined;
  }
  return target;
}

async function readCached(
  initialRecord: SnapshotFetchRecord | undefined,
  url: string,
  cacheDirectory: string,
): Promise<CachedFetch | undefined> {
  const readCandidate = async (
    record: SnapshotFetchRecord | undefined,
  ): Promise<CachedFetch | undefined> => {
    if (
      !record ||
      !['fetched', 'redirect_review'].includes(record.extractionStatus) ||
      record.url !== url ||
      !record.rawPath ||
      !record.sha256
    ) {
      return undefined;
    }
    try {
      const path = resolveCachePath(cacheDirectory, record.rawPath);
      if (!path) return undefined;
      const bytes = new Uint8Array(await readFile(path));
      return hashBytes(bytes) === record.sha256 ? { bytes, record } : undefined;
    } catch {
      return undefined;
    }
  };
  const initial = await readCandidate(initialRecord);
  if (initial) return initial;
  try {
    const metadataPath = resolveCachePath(cacheDirectory, rawMetadataPath(url));
    if (!metadataPath) return undefined;
    return readCandidate(
      JSON.parse(await readFile(metadataPath, 'utf8')) as SnapshotFetchRecord,
    );
  } catch {
    return undefined;
  }
}

async function persistFetch(
  result: FetchResult,
  cacheDirectory: string,
): Promise<SnapshotFetchRecord> {
  const rawPath = join('raw', rawFilename(result.url, result.contentType));
  const rawFile = resolveCachePath(cacheDirectory, rawPath);
  const metadataFile = resolveCachePath(
    cacheDirectory,
    rawMetadataPath(result.url),
  );
  if (!rawFile || !metadataFile) {
    throw new Error(`Unsafe raw cache path for ${result.url}`);
  }
  await atomicWrite(rawFile, result.body);
  const location = result.location
    ? new URL(result.location, result.url).href
    : undefined;
  const record: SnapshotFetchRecord = {
    contentType: result.contentType,
    exclusionReason: null,
    extractionStatus:
      result.status >= 300 && result.status < 400
        ? 'redirect_review'
        : result.status >= 400
          ? 'failed'
          : 'fetched',
    failureReason: result.status >= 400 ? `HTTP ${result.status}` : null,
    fetchedAt: result.fetchedAt,
    rawPath: rawPath.replaceAll('\\', '/'),
    redirectLocation: location ?? null,
    responseStatus: result.status,
    sha256: result.sha256,
    url: result.url,
  };
  await atomicWrite(metadataFile, `${JSON.stringify(record, null, 2)}\n`);
  return record;
}

function decode(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

function isHtml(contentType: string | null | undefined): boolean {
  return HTML_TYPES.some((type) => contentType?.includes(type));
}

function entryFromRecord(
  record: SnapshotFetchRecord,
  provenance: Iterable<DiscoverySource>,
): SnapshotManifestEntry {
  return { ...record, provenance: sortDiscoverySources(provenance) };
}

export async function runSnapshot(
  options: RunSnapshotOptions,
): Promise<SnapshotManifest> {
  const parsedSnapshotDate = new Date(`${options.snapshotId}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(options.snapshotId) ||
    Number.isNaN(parsedSnapshotDate.valueOf()) ||
    parsedSnapshotDate.toISOString().slice(0, 10) !== options.snapshotId
  ) {
    throw new Error('snapshot-id must be an ISO date in YYYY-MM-DD format.');
  }
  const base = new URL(options.baseUrl);
  const baseUrl = `${base.origin}/`;
  const sitemapUrl = new URL(options.sitemapUrl, baseUrl).href;
  if (new URL(sitemapUrl).origin !== base.origin) {
    throw new Error('The sitemap must be on the configured base origin.');
  }
  const cacheRoot = resolve(options.cacheRoot ?? '.cache/gisa-import');
  const outputRoot = resolve(options.outputRoot ?? 'content-data/snapshots');
  const cacheDirectory = resolve(cacheRoot, options.snapshotId);
  const manifestPath = resolve(outputRoot, options.snapshotId, 'manifest.json');
  const configPath = resolve(cacheDirectory, 'snapshot-config.json');
  const configuredListingSeeds = [...new Set((options.seedUrls ?? []).map((seed) => {
    const url = normalizeSameOriginUrl(seed, baseUrl);
    if (!url) throw new Error(`Listing seed is not same-origin: ${seed}`);
    return url;
  }))].sort();
  const expectedConfig = {
    baseUrl,
    listingSeeds: configuredListingSeeds,
    schemaVersion: 1,
    sitemapUrl,
    snapshotId: options.snapshotId,
  } as const;
  let cachedConfig: typeof expectedConfig | undefined;
  try {
    cachedConfig = JSON.parse(
      await readFile(configPath, 'utf8'),
    ) as typeof expectedConfig;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  if (
    !options.refresh &&
    cachedConfig &&
    JSON.stringify(cachedConfig) !== JSON.stringify(expectedConfig)
  ) {
    throw new Error(
      `Snapshot cache configuration changed for ${options.snapshotId}; rerun with --refresh.`,
    );
  }
  await atomicWrite(configPath, `${JSON.stringify(expectedConfig, null, 2)}\n`);

  const previous = options.refresh ? undefined : await readManifest(manifestPath);
  if (
    previous &&
    (previous.schemaVersion !== 1 ||
      previous.snapshotId !== options.snapshotId ||
      previous.baseUrl !== baseUrl ||
      previous.sitemapUrl !== sitemapUrl)
  ) {
    throw new Error(
      `Snapshot manifest configuration changed for ${options.snapshotId}; rerun with --refresh.`,
    );
  }
  const fetchPolicy = options.fetchPolicy ?? createFetchPolicy();
  const runStartedAt = new Date().toISOString();
  let didFetch = false;
  const provenance = new Map<string, Set<DiscoverySource>>();

  const previousSitemaps = new Map(
    (previous?.sitemapFetches ?? []).map((record) => [record.url, record] as const),
  );
  const sitemapFetches = new Map<string, SnapshotFetchRecord>();
  const sitemapQueue = [sitemapUrl];
  const processedSitemaps = new Set<string>();
  while (sitemapQueue.length > 0) {
    const currentSitemapUrl = sitemapQueue.shift();
    if (!currentSitemapUrl || processedSitemaps.has(currentSitemapUrl)) continue;
    processedSitemaps.add(currentSitemapUrl);
    const cached = options.refresh
      ? undefined
      : await readCached(
          previousSitemaps.get(currentSitemapUrl),
          currentSitemapUrl,
          cacheDirectory,
        );
    let bytes = cached?.bytes;
    let record = cached?.record;
    if (!bytes || !record) {
      const result = await fetchPolicy.fetch(currentSitemapUrl);
      didFetch = true;
      record = await persistFetch(result, cacheDirectory);
      bytes = result.body;
    }
    sitemapFetches.set(currentSitemapUrl, record);
    if (record.extractionStatus !== 'fetched') {
      throw new Error(
        `Unable to fetch sitemap: ${currentSitemapUrl} (${record.responseStatus ?? 'transport failure'})`,
      );
    }
    let parsed;
    try {
      parsed = parseSitemapDocument(decode(bytes), {
        baseUrl,
        sitemapUrl: currentSitemapUrl,
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid sitemap ${currentSitemapUrl}: ${detail}`);
    }
    for (const url of parsed.pageUrls) addDiscovery(provenance, url, 'sitemap');
    for (const childSitemapUrl of parsed.sitemapUrls) {
      if (!processedSitemaps.has(childSitemapUrl)) sitemapQueue.push(childSitemapUrl);
    }
  }
  addDiscovery(provenance, baseUrl, 'navigation');
  const listingPages = new Set<string>();
  const paginationPages = new Set<string>();
  for (const seed of configuredListingSeeds) {
    listingPages.add(seed);
    addDiscovery(provenance, seed, 'listing');
  }

  const previousByUrl = new Map(
    (previous?.entries ?? []).map((entry) => [entry.url, entry] as const),
  );
  const entries = new Map<string, SnapshotManifestEntry>();
  const processed = new Set<string>();
  const failures = new Set<string>();

  const buildManifest = (): SnapshotManifest => ({
    baseUrl,
    discoveryScope: (() => {
      const scope = {
        listingUrls: [...provenance.entries()].filter(([, sources]) => sources.has('listing')).map(([url]) => url).sort(),
        navigationUrls: [...provenance.entries()].filter(([, sources]) => sources.has('navigation')).map(([url]) => url).sort(),
        paginationUrls: [...paginationPages].sort(),
      };
      return {
        ...scope,
        fingerprint: createHash('sha256').update(JSON.stringify(scope)).digest('hex'),
      };
    })(),
    entries: [...entries.values()]
      .map((entry) => ({
        ...entry,
        provenance: sortDiscoverySources(
          provenance.get(entry.url) ?? entry.provenance,
        ),
      }))
      .sort((left, right) =>
        left.url < right.url ? -1 : left.url > right.url ? 1 : 0,
      ),
    generatedAt:
      didFetch || !previous ? runStartedAt : previous.generatedAt,
    listingSeeds: [...listingPages].sort(),
    schemaVersion: 1,
    sitemapFetches: [...sitemapFetches.values()].sort((left, right) =>
      left.url < right.url ? -1 : left.url > right.url ? 1 : 0,
    ),
    sitemapUrl,
    snapshotId: options.snapshotId,
  });

  while (true) {
    const pending = [...provenance.keys()]
      .filter((url) => !processed.has(url))
      .sort()
      .slice(0, 2);
    if (pending.length === 0) break;

    await Promise.all(
      pending.map(async (url) => {
        const prior = previousByUrl.get(url);
        const cached = options.refresh
          ? undefined
          : await readCached(prior, url, cacheDirectory);
        let bytes = cached?.bytes;
        let record: SnapshotFetchRecord | undefined = cached?.record ?? prior;
        if (!bytes) {
          try {
            const result = await fetchPolicy.fetch(url);
            didFetch = true;
            record = await persistFetch(result, cacheDirectory);
            bytes = result.body;
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            record = {
              contentType: null,
              exclusionReason: null,
              extractionStatus: 'failed',
              failureReason: message,
              fetchedAt: null,
              rawPath: null,
              redirectLocation: null,
              responseStatus: null,
              sha256: null,
              url,
            };
          }
        }
        if (!record) {
          record = {
            contentType: null,
            exclusionReason: null,
            extractionStatus: 'failed',
            failureReason: 'No fetch record was produced.',
            fetchedAt: null,
            rawPath: null,
            redirectLocation: null,
            responseStatus: null,
            sha256: null,
            url,
          };
        }
        const entry = entryFromRecord(record, provenance.get(url) ?? []);
        entries.set(url, entry);
        processed.add(url);

        if (entry.extractionStatus === 'failed') {
          failures.add(url);
          return;
        }
        if (entry.extractionStatus === 'redirect_review') {
          const destination = entry.redirectLocation
            ? normalizeSameOriginUrl(entry.redirectLocation, baseUrl, url)
            : undefined;
          if (destination) addDiscovery(provenance, destination, 'embedded_link');
          return;
        }
        if (!bytes || !isHtml(entry.contentType)) return;

        const discovered = discoverPageLinks(decode(bytes), {
          baseUrl,
          pageUrl: url,
          seedKind: listingPages.has(url) ? 'listing' : undefined,
        });
        for (const link of discovered.links) {
          if (url === baseUrl && link.provenance.includes('navigation')) {
            listingPages.add(link.url);
          }
          for (const source of link.provenance) {
            addDiscovery(provenance, link.url, source);
          }
        }
        for (const paginationUrl of discovered.paginationUrls) {
          listingPages.add(paginationUrl);
          paginationPages.add(paginationUrl);
        }
      }),
    );
    await atomicWrite(
      manifestPath,
      `${JSON.stringify(buildManifest(), null, 2)}\n`,
    );
  }

  const manifest = buildManifest();
  if (
    previous?.discoveryScope?.fingerprint &&
    previous.discoveryScope.fingerprint !== manifest.discoveryScope.fingerprint
  ) {
    throw new Error(
      `Cached snapshot discovery scope changed: ${previous.discoveryScope.fingerprint} != ${manifest.discoveryScope.fingerprint}`,
    );
  }
  await atomicWrite(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  if (failures.size > 0) {
    throw new Error(
      `Snapshot failed for ${failures.size} URL(s):\n${[...failures]
        .sort()
        .join('\n')}`,
    );
  }
  return manifest;
}

export interface CliArguments {
  baseUrl?: string;
  refresh: boolean;
  seedUrls: string[];
  sitemapUrl?: string;
  snapshotId?: string;
}

export function parseSnapshotCliArguments(argv: readonly string[]): CliArguments {
  const result: CliArguments = { refresh: false, seedUrls: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (argument === '--refresh') {
      result.refresh = true;
      continue;
    }
    const [name, inlineValue] = argument.split('=', 2);
    const value = inlineValue ?? argv[index + 1];
    if (!value || (!inlineValue && value.startsWith('--'))) {
      throw new Error(`Missing value for ${name}.`);
    }
    if (!inlineValue) index += 1;
    if (name === '--base-url') result.baseUrl = value;
    else if (name === '--sitemap') result.sitemapUrl = value;
    else if (name === '--snapshot-id') result.snapshotId = value;
    else if (name === '--seed') result.seedUrls.push(value);
    else throw new Error(`Unknown argument: ${name}`);
  }
  return result;
}

async function main(): Promise<void> {
  const args = parseSnapshotCliArguments(process.argv.slice(2));
  if (!args.baseUrl || !args.sitemapUrl || !args.snapshotId) {
    throw new Error(
      'Usage: content:snapshot -- --base-url=<url> --sitemap=<url> --snapshot-id=YYYY-MM-DD [--seed=<url>] [--refresh]',
    );
  }
  const manifest = await runSnapshot({
    baseUrl: args.baseUrl,
    refresh: args.refresh,
    seedUrls: approvedListingSeeds(args.seedUrls),
    sitemapUrl: args.sitemapUrl,
    snapshotId: args.snapshotId,
  });
  console.log(
    `Snapshot ${manifest.snapshotId}: ${manifest.entries.length} public URL(s).`,
  );
}

const isMain =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
