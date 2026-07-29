import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, test } from 'vitest';

import { runReport, verifyImportedSnapshot } from './report';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { force: true, recursive: true })));
});

describe('imported snapshot report', () => {
  test('writes deterministic pending-review settings, coverage, and one outcome per URL', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-report-'));
    temporaryDirectories.push(root);
    const snapshotId = '2026-07-18';
    const snapshotsRoot = join(root, 'snapshots');
    const importedRoot = join(root, 'imported');
    const cacheRoot = join(root, 'cache');
    const reportsRoot = join(root, 'reports');
    await mkdir(join(snapshotsRoot, snapshotId), { recursive: true });
    await mkdir(join(importedRoot, snapshotId), { recursive: true });
    await mkdir(join(cacheRoot, snapshotId, 'raw'), { recursive: true });
    await writeFile(join(cacheRoot, snapshotId, 'raw', 'home.html'), `
      <html><head><meta name="description" content="GISA advances sustainable innovation."></head>
      <body><h1>Knowledge in motion</h1><a href="mailto:hello@gisa.edu.vn">Email</a>
      <a href="https://facebook.com/gisa">Facebook</a>
      <div class="w30s-widget-childs"><h2>25+</h2><h4>Projects completed</h4></div></body></html>`);
    await writeFile(join(snapshotsRoot, snapshotId, 'manifest.json'), JSON.stringify({
      baseUrl: 'https://gisa.edu.vn/', generatedAt: '2026-07-18T00:00:00.000Z', schemaVersion: 1,
      sitemapFetches: [{ url: 'https://gisa.edu.vn/sitemap.xml' }], sitemapUrl: 'https://gisa.edu.vn/sitemap.xml', snapshotId,
      entries: [{ contentType: 'text/html', exclusionReason: null, extractionStatus: 'fetched', failureReason: null,
        fetchedAt: '2026-07-18T00:00:00.000Z', provenance: ['sitemap', 'navigation'], rawPath: 'raw/home.html',
        redirectLocation: null, responseStatus: 200, sha256: 'hash', url: 'https://gisa.edu.vn/' }],
    }));
    await writeFile(join(importedRoot, snapshotId, 'records.ndjson'), `${JSON.stringify({
      id: 'home', kind: 'archive', sourceUrl: 'https://gisa.edu.vn/', legacyUrls: ['https://gisa.edu.vn/'],
      media: [], provenance: { extractionConfidence: 'low', extractionMethod: 'dom_fallback' },
    })}\n`);
    await writeFile(join(importedRoot, snapshotId, 'review.json'), JSON.stringify([{ confidence: 'low', issueCodes: ['low_confidence_extraction'], recordId: 'home', url: 'https://gisa.edu.vn/' }]));

    const first = await runReport({ cacheRoot, importedRoot, reportsRoot, snapshotId, snapshotsRoot });
    const second = await runReport({ cacheRoot, importedRoot, reportsRoot, snapshotId, snapshotsRoot });
    expect(second).toEqual(first);
    expect(first.summary).toMatchObject({ discoveredPublicUrls: 1, unresolvedPublicUrls: 0 });
    const settings = JSON.parse(await readFile(join(importedRoot, snapshotId, 'site-settings.json'), 'utf8'));
    expect(settings.candidates.every((candidate: { reviewStatus: string }) => candidate.reviewStatus === 'pending_review')).toBe(true);
    expect(settings.candidates.map((candidate: { kind: string }) => candidate.kind)).toEqual(expect.arrayContaining(['contact', 'metric', 'organization_description', 'social', 'tagline']));
    expect(await readFile(join(reportsRoot, `${snapshotId}-review.csv`), 'utf8')).toContain('canonical_record');
    await expect(verifyImportedSnapshot({ importedRoot, reportsRoot, snapshotId, snapshotsRoot })).resolves.toMatchObject({ unresolvedPublicUrls: 0 });
  });

  test('rejects an imported snapshot with an unresolved public URL', async () => {
    const root = await mkdtemp(join(tmpdir(), 'gisa-verify-'));
    temporaryDirectories.push(root);
    const snapshotId = '2026-07-18';
    const snapshotsRoot = join(root, 'snapshots');
    const importedRoot = join(root, 'imported');
    const reportsRoot = join(root, 'reports');
    await mkdir(join(snapshotsRoot, snapshotId), { recursive: true });
    await mkdir(join(importedRoot, snapshotId), { recursive: true });
    await mkdir(reportsRoot, { recursive: true });
    await writeFile(join(snapshotsRoot, snapshotId, 'manifest.json'), JSON.stringify({ entries: [{ extractionStatus: 'failed', exclusionReason: null, provenance: ['sitemap'], url: 'https://gisa.edu.vn/broken' }] }));
    await writeFile(join(importedRoot, snapshotId, 'records.ndjson'), '');
    await writeFile(join(importedRoot, snapshotId, 'site-settings.json'), JSON.stringify({ candidates: [] }));
    await writeFile(join(reportsRoot, `${snapshotId}-review.csv`), 'url,outcome\nhttps://gisa.edu.vn/broken,unresolved\n');
    await expect(verifyImportedSnapshot({ importedRoot, reportsRoot, snapshotId, snapshotsRoot })).rejects.toThrow('https://gisa.edu.vn/broken');
  });
});
