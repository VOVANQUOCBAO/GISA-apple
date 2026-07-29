import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { load } from 'cheerio';

import {
  contentRecordsSchema,
  normalizedContentRecordSchema,
} from '../../src/content/schema';
import type {
  ContentRecord,
  MediaAsset,
  PublicationMetadata,
} from '../../src/content/types';
import type { SnapshotManifest } from './import-types';
import { extractDoi } from './doi';
import {
  extractEmbeddedCmsObject,
  type LegacyCmsObject,
} from './extract-embedded-data';
import { htmlToBlocks, type HtmlImageCandidate } from './html-to-blocks';
import { mapLegacyTaxonomy } from './taxonomy-map';

export interface LegacySourcePage {
  fetchedAt: string;
  html: string;
  snapshotId: string;
  sourceHash: string;
  sourceUrl: string;
}

export interface ReviewIssue {
  code: string;
  message: string;
  recordId: string;
  sourceUrl: string;
}

export interface RedirectAlias {
  destination: string;
  sourceUrl: string;
}

export interface NormalizationResult {
  records: ContentRecord[];
  redirectAliases: RedirectAlias[];
  reviewIssues: ReviewIssue[];
}

function parseNormalizedRecord(value: unknown, sourceUrl: string): ContentRecord {
  try {
    return normalizedContentRecordSchema.parse(value) as ContentRecord;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const serialized = JSON.stringify(value);
    const corruptionIndex = serialized.indexOf('Ã');
    const evidence = corruptionIndex >= 0
      ? serialized.slice(Math.max(0, corruptionIndex - 80), corruptionIndex + 160)
      : '(no candidate substring found)';
    throw new Error(`Failed to normalize ${sourceUrl}: ${detail}\nCandidate evidence: ${evidence}`);
  }
}

interface ReviewReportEntry {
  confidence: 'high' | 'medium' | 'low';
  issueCodes: string[];
  recordId: string;
  url: string;
}

interface ExtractedRecord {
  categoryId?: string | number;
  contentHtml: string;
  countView?: string | number;
  date?: string;
  description: string;
  doi?: string;
  id: string;
  imageUrl?: string;
  method: 'embedded_json' | 'dom_fallback';
  confidence: 'high' | 'low';
  seoDescription?: string;
  seoTitle?: string;
  slug?: string;
  tags: string[];
  title: string;
  titlePage?: string;
}

function cleanText(value: string | undefined): string {
  return (value ?? '').replace(/\s+/gu, ' ').trim();
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replaceAll('đ', 'd')
    .replaceAll('Đ', 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .replace(/-\d{13}$/u, '');
}

function dateOnly(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const match = value.match(/^\d{4}-\d{2}-\d{2}/u)?.[0];
  if (!match || Number.isNaN(new Date(`${match}T00:00:00.000Z`).valueOf())) {
    return undefined;
  }
  return match;
}

function tags(value: LegacyCmsObject['tags']): string[] {
  const values = Array.isArray(value) ? value : String(value ?? '').split(',');
  return [...new Set(values.map((entry) => cleanText(String(entry))).filter(Boolean))];
}

function fromEmbedded(object: LegacyCmsObject): ExtractedRecord {
  return {
    categoryId: object.category_id,
    confidence: 'high',
    contentHtml: typeof object.content === 'string' ? object.content : '',
    countView: object.count_view,
    date: cleanText(String(object.updated_at ?? object.date ?? object.created_at ?? object.date_update ?? object.date_created_format ?? '')),
    description: cleanText(object.desc),
    doi: typeof object.doi === 'string' ? object.doi : undefined,
    id: `cms-${String(object.id)}`,
    imageUrl: typeof object.image_url === 'string' ? object.image_url : undefined,
    method: 'embedded_json',
    seoDescription: typeof object.seo_description === 'string' ? object.seo_description : undefined,
    seoTitle: typeof object.seo_title === 'string' ? object.seo_title : undefined,
    slug: typeof object.seo_name === 'string' ? object.seo_name : undefined,
    tags: tags(object.tags),
    title: cleanText(object.name),
    titlePage: typeof object.title_page === 'string' ? object.title_page : undefined,
  };
}

function fromDom(page: LegacySourcePage): ExtractedRecord {
  const $ = load(page.html);
  const title = cleanText($('main h1, article h1, h1').first().text() || $('title').text());
  const content = $('main article, main, article').first();
  content.find('h1').first().remove();
  return {
    confidence: 'low',
    contentHtml: content.html() ?? '',
    description: cleanText($('meta[name="description"]').attr('content')) || cleanText(content.find('p').first().text()),
    id: `legacy-${page.sourceHash.slice(0, 24)}`,
    method: 'dom_fallback',
    slug: new URL(page.sourceUrl).pathname.split('/').filter(Boolean).pop(),
    tags: [],
    title,
    titlePage: cleanText($('[data-title-page], .title-page, .breadcrumb').first().text()),
  };
}

function mediaFor(
  record: ExtractedRecord,
  page: LegacySourcePage,
  bodyImages: readonly HtmlImageCandidate[],
): MediaAsset[] {
  const media: MediaAsset[] = bodyImages.map((image) => ({
    alt: image.alt || record.title,
    id: image.assetId,
    kind: 'image',
    mimeType: 'application/octet-stream',
    rightsStatus: 'pending_review',
    sourceHash: page.sourceHash,
    sourceUrl: image.sourceUrl,
  }));
  if (!record.imageUrl) return media;
  try {
    const sourceUrl = new URL(record.imageUrl, page.sourceUrl).href;
    if (!['http:', 'https:'].includes(new URL(sourceUrl).protocol)) return media;
    media.push({
      alt: record.title,
      id: `media-${record.id}`,
      kind: 'image',
      mimeType: 'application/octet-stream',
      rightsStatus: 'pending_review',
      sourceHash: page.sourceHash,
      sourceUrl,
    });
  } catch {
    // A malformed top-level image URL is not a media candidate.
  }
  return media;
}

function prepare(page: LegacySourcePage): { extracted: ExtractedRecord; path: string; slug: string } {
  const embedded = extractEmbeddedCmsObject(page.html);
  const extracted = embedded ? fromEmbedded(embedded) : fromDom(page);
  const routeSlug = slugify(extracted.slug || extracted.title || new URL(page.sourceUrl).pathname);
  const taxonomy = mapLegacyTaxonomy({
    categoryId: extracted.categoryId,
    sourceUrl: page.sourceUrl,
    titlePage: extracted.titlePage,
  });
  return { extracted, path: `${taxonomy.routePrefix}/${routeSlug}`, slug: routeSlug };
}

export function normalizeLegacyPages(pages: readonly LegacySourcePage[]): NormalizationResult {
  const prepared = pages.map((page) => ({ page, ...prepare(page) }));
  const canonicalPaths = new Map(prepared.map((item) => [item.page.sourceUrl, item.path]));
  const candidates = prepared.map(({ page, extracted, path, slug }) => {
    const taxonomy = mapLegacyTaxonomy({
      categoryId: extracted.categoryId,
      sourceUrl: page.sourceUrl,
      titlePage: extracted.titlePage,
    });
    const conversion = htmlToBlocks(extracted.contentHtml, {
      canonicalPaths,
      documentTitle: extracted.title,
      sourceUrl: page.sourceUrl,
    });
    const doi = extractDoi(
      extracted.doi,
      extracted.contentHtml,
      extracted.description,
    );
    const publication: PublicationMetadata | undefined = doi ? { doi } : undefined;
    const metadata: ContentRecord['metadata'] = {
      ...(extracted.countView === undefined
        ? {}
        : { sourceViewCount: String(extracted.countView) }),
      ...(extracted.titlePage ? { legacyTitlePage: extracted.titlePage } : {}),
      ...(extracted.categoryId === undefined
        ? {}
        : { legacyCategoryId: String(extracted.categoryId) }),
      ...(conversion.issues.length ? { normalizationIssues: conversion.issues } : {}),
    };
    const record = parseNormalizedRecord({
      body: conversion.blocks,
      checkedAt: page.snapshotId,
      collection: taxonomy.collection,
      editorialStatus: 'pending_review',
      evidenceStatus: 'needs_verification',
      id: extracted.id,
      kind: taxonomy.kind,
      legacyUrls: [page.sourceUrl],
      locale: 'vi',
      media: mediaFor(extracted, page, conversion.images),
      metadata,
      path,
      provenance: {
        extractionConfidence: extracted.confidence,
        extractionMethod: extracted.method,
        fetchedAt: page.fetchedAt,
        snapshotId: page.snapshotId,
        sourceHash: page.sourceHash,
        sourceUrl: page.sourceUrl,
      },
      publication,
      seo: {
        ...(cleanText(extracted.seoTitle) ? { title: cleanText(extracted.seoTitle) } : {}),
        ...(cleanText(extracted.seoDescription) ? { description: cleanText(extracted.seoDescription) } : {}),
      },
      slug,
      sourceLabel: 'GISA public website',
      sourceUrl: page.sourceUrl,
      summary: extracted.description || extracted.title,
      tags: extracted.tags,
      title: extracted.title,
      translationKey: extracted.id,
      ...(dateOnly(extracted.date) ? { publishedAt: dateOnly(extracted.date) } : {}),
    }, page.sourceUrl);
    return { freshness: extracted.date ?? '', page, record };
  });

  const groups = new Map<string, typeof candidates>();
  for (const candidate of candidates) {
    const group = groups.get(candidate.record.id) ?? [];
    group.push(candidate);
    groups.set(candidate.record.id, group);
  }
  const records: ContentRecord[] = [];
  const redirectAliases: RedirectAlias[] = [];
  const reviewIssues: ReviewIssue[] = [];
  for (const group of groups.values()) {
    const ordered = [...group].sort(
      (left, right) =>
        right.freshness.localeCompare(left.freshness) ||
        right.page.fetchedAt.localeCompare(left.page.fetchedAt) ||
        right.page.sourceUrl.localeCompare(left.page.sourceUrl),
    );
    const winner = ordered[0];
    const legacyUrls = [...new Set(group.map(({ page }) => page.sourceUrl))].sort(
      (left, right) => left.localeCompare(right),
    );
    const record = parseNormalizedRecord({
      ...winner.record,
      legacyUrls,
    }, winner.page.sourceUrl);
    records.push(record);
    for (const sourceUrl of legacyUrls) {
      if (sourceUrl !== winner.page.sourceUrl) {
        redirectAliases.push({ destination: record.path, sourceUrl });
      }
    }
    if (record.provenance?.extractionConfidence === 'low') {
      reviewIssues.push({
        code: 'low_confidence_extraction',
        message: 'DOM fallback extraction requires human review.',
        recordId: record.id,
        sourceUrl: record.sourceUrl,
      });
    }
    if (record.kind === 'archive') {
      reviewIssues.push({
        code: 'unclassified_archive',
        message: 'The page could not be classified and requires archive approval.',
        recordId: record.id,
        sourceUrl: record.sourceUrl,
      });
    }
  }
  records.sort((left, right) => left.path.localeCompare(right.path));
  contentRecordsSchema.parse(records);
  redirectAliases.sort((left, right) => left.sourceUrl.localeCompare(right.sourceUrl));
  reviewIssues.sort((left, right) => left.sourceUrl.localeCompare(right.sourceUrl));
  return { records, redirectAliases, reviewIssues };
}

export interface RunNormalizationOptions {
  cacheRoot?: string;
  importedRoot?: string;
  snapshotId: string;
  snapshotsRoot?: string;
}

export async function runNormalization(
  options: RunNormalizationOptions,
): Promise<NormalizationResult> {
  const snapshotsRoot = resolve(options.snapshotsRoot ?? 'content-data/snapshots');
  const cacheDirectory = resolve(options.cacheRoot ?? '.cache/gisa-import', options.snapshotId);
  const manifest = JSON.parse(
    await readFile(resolve(snapshotsRoot, options.snapshotId, 'manifest.json'), 'utf8'),
  ) as SnapshotManifest;
  const pages: LegacySourcePage[] = [];
  for (const entry of manifest.entries) {
    if (entry.extractionStatus !== 'fetched' || !entry.rawPath || !entry.sha256 || !entry.fetchedAt) continue;
    const rawPath = resolve(cacheDirectory, entry.rawPath);
    const relativePath = relative(cacheDirectory, rawPath);
    if (relativePath.startsWith('..') || resolve(relativePath) === relativePath) {
      throw new Error(`Unsafe raw cache path for ${entry.url}.`);
    }
    pages.push({
      fetchedAt: entry.fetchedAt,
      html: await readFile(rawPath, 'utf8'),
      snapshotId: options.snapshotId,
      sourceHash: entry.sha256,
      sourceUrl: entry.url,
    });
  }
  const result = normalizeLegacyPages(pages);
  const outputDirectory = resolve(
    options.importedRoot ?? 'content-data/imported',
    options.snapshotId,
  );
  const outputPath = resolve(outputDirectory, 'records.ndjson');
  const reviewPath = resolve(outputDirectory, 'review.json');
  const aliasesPath = resolve(outputDirectory, 'aliases.json');
  const reviewReport: ReviewReportEntry[] = result.records
    .map((record) => {
      const confidence = record.provenance?.extractionConfidence;
      if (!confidence) {
        throw new Error(`Normalized record ${record.id} is missing extraction confidence.`);
      }
      return {
        confidence,
        issueCodes: result.reviewIssues
          .filter((issue) => issue.recordId === record.id)
          .map((issue) => issue.code)
          .sort((left, right) => left.localeCompare(right)),
        recordId: record.id,
        url: record.sourceUrl,
      };
    })
    .sort(
      (left, right) =>
        left.url.localeCompare(right.url) || left.recordId.localeCompare(right.recordId),
    );
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${result.records.map((record) => JSON.stringify(record)).join('\n')}\n`,
    'utf8',
  );
  await writeFile(reviewPath, `${JSON.stringify(reviewReport, null, 2)}\n`, 'utf8');
  await writeFile(aliasesPath, `${JSON.stringify(result.redirectAliases, null, 2)}\n`, 'utf8');
  return result;
}

function parseArguments(values: readonly string[]): RunNormalizationOptions {
  const snapshotArgument = values.find((value) => value.startsWith('--snapshot-id='));
  const snapshotId = snapshotArgument?.slice('--snapshot-id='.length);
  if (!snapshotId) throw new Error('Usage: content:normalize -- --snapshot-id=<YYYY-MM-DD>');
  return { snapshotId };
}

async function main(): Promise<void> {
  const result = await runNormalization(parseArguments(process.argv.slice(2)));
  console.log(`Normalized ${result.records.length} content record(s); ${result.reviewIssues.length} review issue(s).`);
}

const isMain = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;
if (isMain) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
