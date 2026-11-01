import { describe, expect, test } from 'vitest';

import { PAGE_REGISTRY } from '@/content/pages';
import { STATIC_PAGE_BLOCKS } from '@/content/static-blocks';
import { allContentFixtures } from '@/content/fixtures';
import { isPublishableEvidence } from '@/content/evidence';
import { FixtureContentRepository } from '@/content/repositories/fixture-content-repository';
import { translate } from './language';

const vietnamese = /[ĂăÂâĐđÊêÔôƠơƯưÀÁẢÃẠàáảãạÈÉẺẼẸèéẻẽẹÌÍỈĨỊìíỉĩịÒÓỎÕỌòóỏõọÙÚỦŨỤùúủũụỲÝỶỸỴỳýỷỹỵ\u1ea0-\u1ef9]/;
const nativeNames = new Set([
  'Prof. Nína María Saviolidis',
  'Università di Parma',
  'Università degli Studi di Milano',
  'Mộc Gia',
]);

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

describe('complete public English content', () => {
  test('covers every published page, content record and static body without changing Vietnamese', () => {
    const values = [...new Set([
      ...strings(PAGE_REGISTRY),
      ...strings(STATIC_PAGE_BLOCKS),
      ...strings(allContentFixtures.filter((record) => isPublishableEvidence(record.evidenceStatus))),
    ])].filter((text) => vietnamese.test(text) && !nativeNames.has(text));
    expect(values.length).toBeGreaterThan(1500);
    const missing = values.filter((text) => translate(text, 'en') === text);
    expect(missing).toEqual([]);
    expect(values.filter((text) => translate(text, 'vi') !== text)).toEqual([]);
  });

  test('finds the same published course using its English title', async () => {
    const result = await new FixtureContentRepository().search({
      query: 'Leadership Psychology', filters: {}, page: 1, pageSize: 100,
    });
    expect(result.items.some((record) => record.path === '/khoa-hoc/tam-ly-hoc-lanh-dao')).toBe(true);
  });
});
