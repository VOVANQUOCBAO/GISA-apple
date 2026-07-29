import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { describe, expect, test } from 'vitest';

import {
  contentRecordsSchema,
  normalizedContentRecordSchema,
} from '../../src/content/schema';
import {
  normalizeLegacyPages,
  runNormalization,
  type LegacySourcePage,
} from './normalize';

async function fixture(name: string): Promise<string> {
  return readFile(join(import.meta.dirname, 'test-data', name), 'utf8');
}

async function page(
  fixtureName: string,
  sourceUrl: string,
  overrides: Partial<LegacySourcePage> = {},
): Promise<LegacySourcePage> {
  return {
    fetchedAt: '2026-07-18T10:00:00.000Z',
    html: await fixture(fixtureName),
    snapshotId: '2026-07-18',
    sourceHash: `sha-${fixtureName}`,
    sourceUrl,
    ...overrides,
  };
}

describe('normalizeLegacyPages', () => {
  test('preserves authoritative CHRO-like textarea content instead of a global article', async () => {
    const result = normalizeLegacyPages([
      await page('w30s-detail.html', 'https://gisa.edu.vn/chro-giam-doc-nhan-su'),
    ]);
    expect(result.records[0]).toMatchObject({
      id: 'cms-3542490',
      kind: 'course',
      title: 'CHRO - GIÁM ĐỐC NHÂN SỰ',
      provenance: { extractionConfidence: 'high', extractionMethod: 'embedded_json' },
    });
    expect(JSON.stringify(result.records[0].body)).toContain('Authoritative course body');
    expect(JSON.stringify(result.records[0].body)).not.toContain('Wrong body');
  });

  test('groups authoritative duplicate CMS IDs and chooses the newest payload date', () => {
    const source = (name: string, slug: string, dateUpdate: number, fetchedAt: string): LegacySourcePage => ({
      fetchedAt,
      html: `<textarea class="w30s-content-data-page">${JSON.stringify({
        id: 700, name, content: `<p>${name} body</p>`, seo_name: slug,
        title_page: 'Tin tức', date_update: dateUpdate,
      })}</textarea>`,
      snapshotId: '2026-07-18', sourceHash: `hash-${slug}`,
      sourceUrl: `https://gisa.edu.vn/${slug}`,
    });
    const newer = source('Authoritative newer', 'newer-url', 200, '2026-07-17T00:00:00.000Z');
    const older = source('Older duplicate', 'older-url', 100, '2026-07-18T00:00:00.000Z');
    const result = normalizeLegacyPages([older, newer]);
    expect(result.records).toHaveLength(1);
    expect(result.records[0]).toMatchObject({ id: 'cms-700', title: 'Authoritative newer' });
    expect(result.redirectAliases).toEqual([
      { destination: '/tin-tuc/newer-url', sourceUrl: older.sourceUrl },
    ]);
  });

  test('identifies the exact source URL when normalization validation fails', () => {
    const sourceUrl = 'https://gisa.edu.vn/broken-encoding';
    expect(() => normalizeLegacyPages([{
      fetchedAt: '2026-07-18T10:00:00.000Z',
      html: '<html><head><title>NghiÃƒÂªn cứu</title></head><body><main><p>Text</p></main></body></html>',
      snapshotId: '2026-07-18',
      sourceHash: 'broken-hash',
      sourceUrl,
    }])).toThrow(sourceUrl);
  });

  test('prefers valid embedded CMS data and normalizes taxonomy, DOI, and volatile views', async () => {
    const result = normalizeLegacyPages([
      await page(
        'research.html',
        'https://gisa.edu.vn/legacy/research-record',
      ),
    ]);

    expect(result.records).toHaveLength(1);
    expect(result.records[0]).toMatchObject({
      id: 'cms-101',
      kind: 'publication',
      collection: 'publications',
      title: 'Embedded research title',
      slug: 'embedded-research-title',
      path: '/nghien-cuu/bai-bao-khoa-hoc/embedded-research-title',
      editorialStatus: 'pending_review',
      legacyUrls: ['https://gisa.edu.vn/legacy/research-record'],
      provenance: {
        extractionMethod: 'embedded_json',
        extractionConfidence: 'high',
      },
      publication: { doi: 'https://doi.org/10.1234/example.567' },
    });
    expect(result.records[0].metadata).toMatchObject({ sourceViewCount: '987' });
    expect(result.records[0].media).toContainEqual(
      expect.objectContaining({
        alt: 'Research cover',
        id: 'legacy-research-cover-jpg',
        kind: 'image',
        rightsStatus: 'pending_review',
        sourceUrl: 'https://gisa.edu.vn/media/research-cover.jpg',
      }),
    );
    expect(result.records[0].metadata).not.toHaveProperty('impact');
    expect(result.records[0].publication).not.toHaveProperty('journal');
    expect(result.records[0].publication).not.toHaveProperty('year');
  });

  test('prioritizes an explicitly marked page payload over generic and nested CMS-like objects', async () => {
    const result = normalizeLegacyPages([
      await page('embedded-priority.html', 'https://gisa.edu.vn/tin-tuc/marked'),
    ]);

    expect(result.records[0]).toMatchObject({
      id: 'cms-505',
      title: 'Marked page payload',
      path: '/tin-tuc/marked-page',
      provenance: {
        extractionMethod: 'embedded_json',
        extractionConfidence: 'high',
      },
    });
  });

  test('uses low-confidence DOM fallback, leaves it pending, and flags review', async () => {
    const result = normalizeLegacyPages([
      await page('news-dom.html', 'https://gisa.edu.vn/tin-tuc/dom-story'),
    ]);

    expect(result.records[0]).toMatchObject({
      kind: 'news',
      path: '/tin-tuc/dom-story',
      editorialStatus: 'pending_review',
      provenance: {
        extractionMethod: 'dom_fallback',
        extractionConfidence: 'low',
      },
    });
    expect(result.reviewIssues).toContainEqual(
      expect.objectContaining({
        code: 'low_confidence_extraction',
        sourceUrl: 'https://gisa.edu.vn/tin-tuc/dom-story',
      }),
    );
  });

  test('maps course and media pages and archives an unclassified page', async () => {
    const result = normalizeLegacyPages([
      await page('course.html', 'https://gisa.edu.vn/dao-tao/legacy-course'),
      await page('media.html', 'https://gisa.edu.vn/videos/gisa-story'),
      await page('malformed.html', 'https://gisa.edu.vn/misc/unknown-page'),
    ]);

    expect(result.records.map(({ kind, path }) => ({ kind, path }))).toEqual([
      { kind: 'course', path: '/khoa-hoc/quan-tri-tinh-gon' },
      { kind: 'archive', path: '/luu-tru/unknown-page' },
      { kind: 'video', path: '/video/gisa-story' },
    ]);
    expect(
      result.records.find((record) => record.kind === 'video')?.body,
    ).toContainEqual({
      type: 'video',
      provider: 'youtube',
      externalUrl: 'https://www.youtube.com/watch?v=abc123',
      title: 'Watch',
    });
    expect(
      result.records.find((record) => record.kind === 'archive')?.provenance,
    ).toMatchObject({
      extractionMethod: 'dom_fallback',
      extractionConfidence: 'low',
    });
    expect(result.reviewIssues).toContainEqual(
      expect.objectContaining({ code: 'unclassified_archive' }),
    );
  });

  test('removes timestamp suffixes and resolves duplicate CMS IDs to the newest record', async () => {
    const older = await page(
      'timestamp-slug.html',
      'https://gisa.edu.vn/tin-tuc/duplicate-1712345678901',
      { fetchedAt: '2026-07-17T10:00:00.000Z' },
    );
    const newer = await page(
      'timestamp-slug.html',
      'https://gisa.edu.vn/tin-tuc/duplicate-new-1712345678999',
      { fetchedAt: '2026-07-18T10:00:00.000Z' },
    );
    const result = normalizeLegacyPages([older, newer]);

    expect(result.records).toHaveLength(1);
    expect(result.records[0].slug).toBe('duplicate-new');
    expect(result.records[0].legacyUrls).toEqual([
      older.sourceUrl,
      newer.sourceUrl,
    ]);
    expect(result.redirectAliases).toContainEqual({
      destination: '/tin-tuc/duplicate-new',
      sourceUrl: older.sourceUrl,
    });

    const reversed = normalizeLegacyPages([newer, older]);
    expect(reversed.records[0].legacyUrls).toEqual(result.records[0].legacyUrls);
  });

  test('writes a deterministic review report alongside imported records', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-normalize-'));
    const snapshotId = '2026-07-18';
    const sourceUrl = 'https://gisa.edu.vn/tin-tuc/review-story';
    const cacheRoot = join(root, 'cache');
    const snapshotsRoot = join(root, 'snapshots');
    const importedRoot = join(root, 'imported');

    try {
      await mkdir(join(cacheRoot, snapshotId, 'raw'), { recursive: true });
      await writeFile(
        join(cacheRoot, snapshotId, 'raw', 'review-story.html'),
        await fixture('news-dom.html'),
      );
      await mkdir(join(snapshotsRoot, snapshotId), { recursive: true });
      await writeFile(
        join(snapshotsRoot, snapshotId, 'manifest.json'),
        JSON.stringify({
          entries: [
            {
              extractionStatus: 'fetched',
              fetchedAt: '2026-07-18T10:00:00.000Z',
              rawPath: 'raw/review-story.html',
              sha256: 'sha-review',
              url: sourceUrl,
            },
          ],
        }),
      );

      await runNormalization({
        cacheRoot,
        importedRoot,
        snapshotId,
        snapshotsRoot,
      });

      await expect(
        readFile(join(importedRoot, snapshotId, 'review.json'), 'utf8'),
      ).resolves.toBe(
        `${JSON.stringify([
          {
            confidence: 'low',
            issueCodes: ['low_confidence_extraction'],
            recordId: 'legacy-sha-review',
            url: sourceUrl,
          },
        ], null, 2)}\n`,
      );
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});

describe('normalized content schema', () => {
  const validRecord = {
    body: [{ type: 'paragraph' as const, text: 'Safe content' }],
    checkedAt: '2026-07-18',
    collection: 'news' as const,
    editorialStatus: 'pending_review' as const,
    evidenceStatus: 'needs_verification' as const,
    id: 'cms-1',
    kind: 'news' as const,
    legacyUrls: ['https://gisa.edu.vn/legacy'],
    locale: 'vi' as const,
    media: [],
    metadata: {},
    path: '/tin-tuc/safe',
    provenance: {
      extractionConfidence: 'high' as const,
      extractionMethod: 'embedded_json' as const,
      fetchedAt: '2026-07-18T10:00:00.000Z',
      snapshotId: '2026-07-18',
      sourceHash: 'sha',
      sourceUrl: 'https://gisa.edu.vn/legacy',
    },
    seo: {},
    slug: 'safe',
    sourceLabel: 'GISA public website',
    sourceUrl: 'https://gisa.edu.vn/legacy',
    summary: 'Summary',
    tags: [],
    title: 'Safe title',
    translationKey: 'cms-1',
  };

  test('accepts legitimate Vietnamese capital letters that resemble mojibake prefixes', () => {
    expect(() => normalizedContentRecordSchema.parse({
      ...validRecord,
      title: 'CHRO - GIÁM ĐỐC NHÂN SỰ',
    })).not.toThrow();
  });

  test.each([
    ['encoding corruption', { title: 'NghiÃªn cá»©u' }],
    ['empty slug', { slug: '' }],
    [
      'unsafe HTML',
      { body: [{ type: 'paragraph', text: '<script>alert(1)</script>' }] },
    ],
    ['source URL mismatch', { sourceUrl: 'https://gisa.edu.vn/other' }],
  ])('rejects %s', (_label, override) => {
    expect(() =>
      normalizedContentRecordSchema.parse({ ...validRecord, ...override }),
    ).toThrow();
  });

  test('rejects duplicate canonical paths across records', () => {
    expect(() =>
      contentRecordsSchema.parse([
        validRecord,
        { ...validRecord, id: 'cms-2', sourceUrl: validRecord.sourceUrl },
      ]),
    ).toThrow(/canonical path/i);
  });
});
