import { describe, expect, test } from 'vitest';

import type { ContentRecord } from '@/content/types';

import { buildStructuredData } from './structured-data';

function makeRecord(
  overrides: Partial<ContentRecord> = {},
): ContentRecord {
  return {
    id: 'project-test',
    kind: 'project',
    collection: 'projects',
    slug: 'du-an-thu-nghiem',
    path: '/nghien-cuu/du-an/du-an-thu-nghiem',
    locale: 'vi',
    translationKey: 'project-test',
    title: 'Dự án thử nghiệm',
    summary: 'Tóm tắt dự án thử nghiệm.',
    body: [],
    tags: ['nghiên cứu'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/',
    sourceLabel: 'Website GISA',
    checkedAt: '2026-07-18',
    metadata: {},
    ...overrides,
  };
}

describe('buildStructuredData', () => {
  test('does not emit Course JSON-LD without verified required fields', () => {
    const record = makeRecord({
      collection: 'courses',
      evidenceStatus: 'verified',
      kind: 'course',
      metadata: {},
      path: '/khoa-hoc/khoa-hoc-thu-nghiem',
      slug: 'khoa-hoc-thu-nghiem',
    });

    expect(
      buildStructuredData(record).some(
        (entry) => entry['@type'] === 'Course',
      ),
    ).toBe(false);
  });

  test('always emits breadcrumb data for a canonical content page', () => {
    expect(
      buildStructuredData(makeRecord()).some(
        (entry) => entry['@type'] === 'BreadcrumbList',
      ),
    ).toBe(true);
  });
});
