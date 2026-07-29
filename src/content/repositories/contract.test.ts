import { describe, expect, test } from 'vitest';

import type { ContentRepository } from './content-repository';
import { FixtureContentRepository } from './fixture-content-repository';

export function contentRepositoryContract(
  name: string,
  createRepository: () => ContentRepository,
) {
  describe(name, () => {
    test('returns stable pagination metadata', async () => {
      const result = await createRepository().list({
        collection: 'projects',
        page: 1,
        pageSize: 2,
        filters: {},
      });

      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(2);
      expect(result.total).toBeGreaterThanOrEqual(result.items.length);
      expect(result.availableFilters).toBeDefined();
    });

    test('never returns non-publishable records to public queries', async () => {
      const result = await createRepository().search({
        query: '',
        page: 1,
        pageSize: 100,
        filters: {},
      });

      expect(
        result.items.every((item) =>
          ['verified', 'provided_by_gisa'].includes(item.evidenceStatus),
        ),
      ).toBe(true);
    });

    test('normalizes Vietnamese search and clamps pages', async () => {
      const repository = createRepository();
      const searchResult = await repository.search({
        query: '  NGHIÊN CỨU  ',
        page: 1,
        pageSize: 1,
        filters: {},
      });
      const clampedResult = await repository.list({
        page: 999,
        pageSize: 1,
        filters: {},
      });

      expect(searchResult.total).toBeGreaterThan(0);
      expect(clampedResult.page).toBe(clampedResult.pageCount);
    });

    test('only exposes publishable paths and records', async () => {
      const repository = createRepository();
      const paths = await repository.listIndexablePaths();
      const records = await Promise.all(paths.map((path) => repository.getByPath(path)));

      expect(paths.length).toBeGreaterThan(0);
      expect(records.every((record) => record !== null && ['verified', 'provided_by_gisa'].includes(record.evidenceStatus))).toBe(true);
    });
  });
}

contentRepositoryContract('FixtureContentRepository', () => new FixtureContentRepository());
