import { describe, expect, test } from 'vitest';

import { selectRelatedContent } from './related';
import type { ContentSummary } from './types';

function summary(id: string, tags: string[]): ContentSummary {
  return {
    collection: 'publications',
    evidenceStatus: 'verified',
    id,
    kind: 'publication',
    metadata: {},
    path: `/nghien-cuu/bai-bao-khoa-hoc/${id}`,
    slug: id,
    summary: `Tóm tắt ${id}`,
    tags,
    title: `Bài ${id}`,
  };
}

const pool = [
  summary('a', ['Chuỗi giá trị', 'bưởi da xanh']),
  summary('b', ['Chuỗi giá trị', 'Bến Tre']),
  summary('c', ['Trí tuệ nhân tạo']),
  summary('d', ['Kinh tế thực phẩm', 'Bến Tre']),
  summary('e', ['Chuỗi cung ứng']),
];

describe('selectRelatedContent', () => {
  test('puts same-topic records first and never suggests the current one', () => {
    const related = selectRelatedContent(pool[0], pool);

    expect(related.map((item) => item.id)).toContain('b');
    expect(related.map((item) => item.id)).not.toContain('a');
    expect(related[0].id).toBe('b');
  });

  test('ranks a shared secondary tag above an unrelated record', () => {
    const related = selectRelatedContent(pool[1], pool, 2);

    // 'a' cùng chủ đề chính; 'd' chỉ trùng tag phụ "Bến Tre" nhưng vẫn hơn 'c'/'e'.
    expect(related.map((item) => item.id)).toEqual(['a', 'd']);
  });

  test('fills from different neighbours when nothing shares a tag', () => {
    const forC = selectRelatedContent(pool[2], pool, 2).map((item) => item.id);
    const forE = selectRelatedContent(pool[4], pool, 2).map((item) => item.id);

    expect(forC).toHaveLength(2);
    expect(forE).toHaveLength(2);
    expect(forC).not.toEqual(forE);
  });

  test('returns nothing when the collection holds only this record', () => {
    expect(selectRelatedContent(pool[0], [pool[0]])).toEqual([]);
  });
});
