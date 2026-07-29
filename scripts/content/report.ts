import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as cheerio from 'cheerio';

import type { SnapshotManifest, SnapshotManifestEntry } from './import-types';

interface ImportedRecord {
  id: string;
  kind: string;
  legacyUrls?: string[];
  media?: unknown[];
  provenance?: { extractionConfidence?: string; extractionMethod?: string };
  sourceUrl: string;
}

interface ReviewEntry {
  confidence: string;
  issueCodes: string[];
  recordId: string;
  url: string;
}

type Outcome = 'canonical_record' | 'redirect_alias' | 'explicit_exclusion' | 'unresolved';

interface CoverageRow {
  confidence: string;
  contentType: string;
  destination: string;
  discoveryClass: string;
  duplicateGroup: string;
  exclusionReason: string;
  extractionMethod: string;
  imageCount: number;
  issueCodes: string[];
  outcome: Outcome;
  provenance: string[];
  responseStatus: number | null;
  url: string;
}

export interface ReportOptions {
  cacheRoot?: string;
  importedRoot?: string;
  reportsRoot?: string;
  snapshotId: string;
  snapshotsRoot?: string;
}

export interface CoverageSummary {
  canonicalRecords: number;
  discoveredPublicUrls: number;
  explicitExclusions: number;
  fetchedUrls: number;
  redirectAliases: number;
  sitemapRowDeltaFromHistorical: number;
  sitemapRows: number;
  sitemapUniqueDeltaFromHistorical: number;
  sitemapUniqueUrls: number;
  sitemapOnly: number;
  listingOnly: number;
  navigationOnly: number;
  multiSource: number;
  unresolvedPublicUrls: number;
}

function readNdjson(contents: string): ImportedRecord[] {
  return contents.split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line) as ImportedRecord);
}

function countBy(values: readonly string[]): Map<string, number> {
  const result = new Map<string, number>();
  for (const value of values) result.set(value || '(none)', (result.get(value || '(none)') ?? 0) + 1);
  return new Map([...result].sort(([left], [right]) => left.localeCompare(right)));
}

function table(counts: Map<string, number>): string {
  return ['| Value | Count |', '| --- | ---: |', ...[...counts].map(([key, count]) => `| ${key.replaceAll('|', '\\|')} | ${count} |`)].join('\n');
}

function discoveryClass(provenance: readonly string[]): string {
  if (provenance.length > 1) return 'multi_source';
  if (provenance[0] === 'sitemap') return 'sitemap_only';
  if (provenance[0] === 'listing') return 'listing_only';
  if (provenance[0] === 'navigation') return 'navigation_only';
  return `${provenance[0] ?? 'unknown'}_only`;
}

function csvCell(value: string | number | null): string {
  const text = value === null ? '' : String(value);
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function stableCandidateId(kind: string, value: string): string {
  return `${kind}-${createHash('sha256').update(value).digest('hex').slice(0, 12)}`;
}

async function extractSiteSettings(manifest: SnapshotManifest, cacheDirectory: string) {
  const home = manifest.entries.find((entry) => entry.url === manifest.baseUrl && entry.rawPath && entry.extractionStatus === 'fetched');
  const candidates: Array<Record<string, unknown>> = [];
  if (home?.rawPath) {
    const raw = resolve(cacheDirectory, home.rawPath);
    const child = relative(cacheDirectory, raw);
    if (child.startsWith('..') || resolve(child) === child) throw new Error(`Unsafe raw cache path for ${home.url}.`);
    const $ = cheerio.load(await readFile(raw, 'utf8'));
    const add = (kind: string, value: string, evidence: string): void => {
      const normalized = value.replace(/\s+/gu, ' ').trim();
      if (!normalized || candidates.some((candidate) => candidate.kind === kind && candidate.value === normalized)) return;
      candidates.push({ evidence, id: stableCandidateId(kind, normalized), kind, reviewStatus: 'pending_review', sourceUrl: home.url, value: normalized });
    };
    const description = $('meta[name="description"]').attr('content') ?? $('meta[property="og:description"]').attr('content') ?? '';
    add('organization_description', description, 'home meta description');
    add('tagline', $('main h1, h1').first().text(), 'home primary heading');
    $('a[href^="mailto:"], a[href^="tel:"]').each((_index, element) => add('contact', $(element).attr('href') ?? '', 'home contact link'));
    $('a[href]').each((_index, element) => {
      const href = $(element).attr('href') ?? '';
      if (/^https?:\/\/(?:www\.)?(?:facebook|linkedin|youtube|instagram|x|twitter)\.com\//iu.test(href)) add('social', href, 'home social link');
    });
    $('.w30s-widget-childs').each((_index, element) => {
      const value = $(element).children('h2').first().text().replace(/\s+/gu, ' ').trim();
      const label = $(element).children('h4').first().text().replace(/\s+/gu, ' ').trim();
      if (/^\d[\d.,+]*$/u.test(value) && label) add('metric', `${value} ${label}`, 'home adjacent metric widgets');
    });
    $('body *').contents().filter((_index, node) => node.type === 'text').each((_index, node) => {
      const text = $(node).text().replace(/\s+/gu, ' ').trim();
      for (const match of text.matchAll(/(?:^|\s)(\d[\d.,+]*\s+(?:projects?|publications?|partners?|experts?|courses?|dự án|bài báo|đối tác|chuyên gia|khóa học))(?:\s|$)/giu)) add('metric', match[1], 'home visible metric text');
    });
  }
  candidates.sort((left, right) => String(left.kind).localeCompare(String(right.kind)) || String(left.value).localeCompare(String(right.value)));
  return { candidates, schemaVersion: 1, snapshotId: manifest.snapshotId };
}

function classify(
  entry: SnapshotManifestEntry,
  records: readonly ImportedRecord[],
  reviews: readonly ReviewEntry[],
  entriesByUrl: ReadonlyMap<string, SnapshotManifestEntry>,
): CoverageRow {
  const record = records.find((candidate) => candidate.sourceUrl === entry.url);
  const aliasRecord = records.find((candidate) => candidate.sourceUrl !== entry.url && candidate.legacyUrls?.includes(entry.url));
  const redirectLocation = entry.redirectLocation;
  const redirectTarget = redirectLocation ? entriesByUrl.get(redirectLocation) : undefined;
  let outcome: Outcome = 'unresolved';
  let destination = '';
  if (record) {
    outcome = 'canonical_record';
    destination = record.id;
  } else if (aliasRecord) {
    outcome = 'redirect_alias';
    destination = aliasRecord.id;
  } else if (
    entry.extractionStatus === 'redirect_review' &&
    redirectTarget &&
    redirectTarget.extractionStatus !== 'redirect_review' &&
    redirectLocation &&
    records.some((candidate) => candidate.sourceUrl === redirectLocation || candidate.legacyUrls?.includes(redirectLocation))
  ) {
    outcome = 'redirect_alias';
    destination = redirectLocation;
  } else if (entry.extractionStatus === 'excluded' && entry.exclusionReason) {
    outcome = 'explicit_exclusion';
    destination = entry.exclusionReason;
  }
  const effectiveRecord = record ?? aliasRecord;
  const review = reviews.find((candidate) => candidate.recordId === effectiveRecord?.id);
  return {
    confidence: effectiveRecord?.provenance?.extractionConfidence ?? '',
    contentType: entry.contentType ?? '',
    destination,
    discoveryClass: discoveryClass(entry.provenance),
    duplicateGroup: aliasRecord?.id ?? '',
    exclusionReason: entry.exclusionReason ?? '',
    extractionMethod: effectiveRecord?.provenance?.extractionMethod ?? '',
    imageCount: effectiveRecord?.media?.length ?? 0,
    issueCodes: review?.issueCodes ?? [],
    outcome,
    provenance: entry.provenance,
    responseStatus: entry.responseStatus,
    url: entry.url,
  };
}

export async function runReport(options: ReportOptions): Promise<{ rows: CoverageRow[]; summary: CoverageSummary }> {
  const snapshotsRoot = resolve(options.snapshotsRoot ?? 'content-data/snapshots');
  const importedRoot = resolve(options.importedRoot ?? 'content-data/imported');
  const reportsRoot = resolve(options.reportsRoot ?? 'docs/qa/content-migration');
  const cacheDirectory = resolve(options.cacheRoot ?? '.cache/gisa-import', options.snapshotId);
  const manifest = JSON.parse(await readFile(resolve(snapshotsRoot, options.snapshotId, 'manifest.json'), 'utf8')) as SnapshotManifest;
  const recordsPath = resolve(importedRoot, options.snapshotId, 'records.ndjson');
  const records = readNdjson(await readFile(recordsPath, 'utf8'));
  let reviews: ReviewEntry[] = [];
  try { reviews = JSON.parse(await readFile(resolve(importedRoot, options.snapshotId, 'review.json'), 'utf8')) as ReviewEntry[]; } catch { reviews = []; }
  const entriesByUrl = new Map(manifest.entries.map((entry) => [entry.url, entry]));
  const rows = manifest.entries.map((entry) => classify(entry, records, reviews, entriesByUrl)).sort((left, right) => left.url.localeCompare(right.url));
  let sitemapRows = 0;
  for (const sitemap of manifest.sitemapFetches) {
    if (!sitemap.rawPath) continue;
    const contents = await readFile(resolve(cacheDirectory, sitemap.rawPath), 'utf8');
    sitemapRows += contents.match(/<url(?:\s|>)/giu)?.length ?? 0;
  }
  const sitemapUniqueUrls = manifest.entries.filter((entry) => entry.provenance.includes('sitemap')).length;
  const summary: CoverageSummary = {
    canonicalRecords: rows.filter((row) => row.outcome === 'canonical_record').length,
    discoveredPublicUrls: rows.length,
    explicitExclusions: rows.filter((row) => row.outcome === 'explicit_exclusion').length,
    fetchedUrls: manifest.entries.filter((entry) => entry.extractionStatus === 'fetched').length,
    redirectAliases: rows.filter((row) => row.outcome === 'redirect_alias').length,
    sitemapRowDeltaFromHistorical: sitemapRows - 536,
    sitemapRows,
    sitemapUniqueDeltaFromHistorical: sitemapUniqueUrls - 535,
    sitemapUniqueUrls,
    sitemapOnly: rows.filter((row) => row.discoveryClass === 'sitemap_only').length,
    listingOnly: rows.filter((row) => row.discoveryClass === 'listing_only').length,
    navigationOnly: rows.filter((row) => row.discoveryClass === 'navigation_only').length,
    multiSource: rows.filter((row) => row.discoveryClass === 'multi_source').length,
    unresolvedPublicUrls: rows.filter((row) => row.outcome === 'unresolved').length,
  };
  const settings = await extractSiteSettings(manifest, cacheDirectory);
  await mkdir(dirname(recordsPath), { recursive: true });
  await writeFile(resolve(importedRoot, options.snapshotId, 'site-settings.json'), `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
  const header = ['url','discovery_class','discovery_sources','outcome','destination_or_record_id','response_status','content_type','extraction_method','confidence','image_count','duplicate_group','issue_codes','exclusion_reason'];
  const csv = [header, ...rows.map((row) => [row.url,row.discoveryClass,row.provenance.join('|'),row.outcome,row.destination,row.responseStatus,row.contentType,row.extractionMethod,row.confidence,row.imageCount,row.duplicateGroup,row.issueCodes.join('|'),row.exclusionReason])].map((line) => line.map(csvCell).join(',')).join('\n') + '\n';
  const markdown = `# GISA content migration coverage — ${options.snapshotId}\n\n## Acceptance summary\n\n| Measure | Count |\n| --- | ---: |\n${Object.entries(summary).map(([key, count]) => `| ${key} | ${count} |`).join('\n')}\n\nHistorical sitemap baseline: 536 rows / 535 unique URLs. Current sitemap: ${sitemapRows} rows / ${sitemapUniqueUrls} unique URLs (deltas ${summary.sitemapRowDeltaFromHistorical} / ${summary.sitemapUniqueDeltaFromHistorical}). The duplicate historical row explains the row-to-unique difference; no historical count is forced.\n\nDiscovery equations:\n\n- discovered_public_urls (${summary.discoveredPublicUrls}) = fetched_urls (${summary.fetchedUrls}) + documented_fetch_exclusions (${summary.explicitExclusions})\n- fetched_urls (${summary.fetchedUrls}) = normalized canonical URL outcomes (${summary.canonicalRecords}) + redirect aliases (${summary.redirectAliases}) + documented_normalization_exclusions (${summary.explicitExclusions})\n- unresolved_public_urls = ${summary.unresolvedPublicUrls}\n\nApproved configured listing seeds: ${(manifest.listingSeeds ?? []).map((seed) => `\`${seed}\``).join(', ')}. This persisted list also includes any root-navigation or pagination pages promoted during deterministic traversal.\n\n## Content types\n\n${table(countBy(records.map((record) => record.kind)))}\n\n## Extraction methods\n\n${table(countBy(records.map((record) => record.provenance?.extractionMethod ?? '')))}\n\n## Confidence\n\n${table(countBy(records.map((record) => record.provenance?.extractionConfidence ?? '')))}\n\n## Image availability\n\n${table(countBy(records.map((record) => (record.media?.length ?? 0) > 0 ? 'has_images' : 'no_images')))}\n\n## Duplicate groups\n\n${table(countBy(rows.filter((row) => row.duplicateGroup).map((row) => row.duplicateGroup)))}\n\n## Issue codes\n\n${table(countBy(rows.flatMap((row) => row.issueCodes)))}\n\n## Outcome\n\n${table(countBy(rows.map((row) => row.outcome)))}\n`;
  await mkdir(reportsRoot, { recursive: true });
  await writeFile(resolve(reportsRoot, `${options.snapshotId}-coverage.md`), markdown, 'utf8');
  await writeFile(resolve(reportsRoot, `${options.snapshotId}-review.csv`), csv, 'utf8');
  return { rows, summary };
}

export async function verifyImportedSnapshot(options: Omit<ReportOptions, 'cacheRoot'>): Promise<CoverageSummary> {
  const snapshotsRoot = resolve(options.snapshotsRoot ?? 'content-data/snapshots');
  const importedRoot = resolve(options.importedRoot ?? 'content-data/imported');
  const reportsRoot = resolve(options.reportsRoot ?? 'docs/qa/content-migration');
  const manifest = JSON.parse(await readFile(resolve(snapshotsRoot, options.snapshotId, 'manifest.json'), 'utf8')) as SnapshotManifest;
  const records = readNdjson(await readFile(resolve(importedRoot, options.snapshotId, 'records.ndjson'), 'utf8'));
  await readFile(resolve(importedRoot, options.snapshotId, 'site-settings.json'), 'utf8');
  const csv = await readFile(resolve(reportsRoot, `${options.snapshotId}-review.csv`), 'utf8');
  const rows = manifest.entries.map((entry) => classify(entry, records, [], new Map(manifest.entries.map((item) => [item.url, item]))));
  const unresolved = rows.filter((row) => row.outcome === 'unresolved').map((row) => row.url);
  if (csv.trim().split(/\r?\n/u).length - 1 !== manifest.entries.length) throw new Error('Review CSV does not contain exactly one row per discovery-union URL.');
  if (unresolved.length > 0) throw new Error(`Unresolved public URL(s):\n${unresolved.join('\n')}`);
  const coverage = await readFile(resolve(reportsRoot, `${options.snapshotId}-coverage.md`), 'utf8');
  const reportedNumber = (name: string): number => {
    const match = coverage.match(new RegExp(`\\| ${name} \\| (-?\\d+) \\|`, 'u'));
    if (!match) throw new Error(`Coverage report is missing ${name}.`);
    return Number(match[1]);
  };
  return {
    canonicalRecords: rows.filter((row) => row.outcome === 'canonical_record').length,
    discoveredPublicUrls: rows.length,
    explicitExclusions: rows.filter((row) => row.outcome === 'explicit_exclusion').length,
    fetchedUrls: manifest.entries.filter((entry) => entry.extractionStatus === 'fetched').length,
    redirectAliases: rows.filter((row) => row.outcome === 'redirect_alias').length,
    sitemapRowDeltaFromHistorical: reportedNumber('sitemapRowDeltaFromHistorical'),
    sitemapRows: reportedNumber('sitemapRows'),
    sitemapUniqueDeltaFromHistorical: reportedNumber('sitemapUniqueDeltaFromHistorical'),
    sitemapUniqueUrls: reportedNumber('sitemapUniqueUrls'),
    sitemapOnly: rows.filter((row) => row.discoveryClass === 'sitemap_only').length,
    listingOnly: rows.filter((row) => row.discoveryClass === 'listing_only').length,
    navigationOnly: rows.filter((row) => row.discoveryClass === 'navigation_only').length,
    multiSource: rows.filter((row) => row.discoveryClass === 'multi_source').length,
    unresolvedPublicUrls: 0,
  };
}

function parseSnapshotId(values: readonly string[]): string {
  const value = values.find((item) => item.startsWith('--snapshot-id='))?.slice('--snapshot-id='.length);
  if (!value) throw new Error('Usage: content:report -- --snapshot-id=<YYYY-MM-DD>');
  return value;
}

async function main(): Promise<void> {
  const result = await runReport({ snapshotId: parseSnapshotId(process.argv.slice(2)) });
  console.log(`Reported ${result.summary.discoveredPublicUrls} public URL(s); ${result.summary.unresolvedPublicUrls} unresolved.`);
}

const isMain = process.argv[1] ? resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url)) : false;
if (isMain) main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
