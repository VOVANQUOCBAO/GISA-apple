import { describe, expect, test } from 'vitest';

import { newsFixtures } from './fixtures/news';
import { publicationFixtures } from './fixtures/publications';
import type { ContentBlock, ContentRecord } from './types';

const CONTENT_ISSUES: Array<[label: string, pattern: RegExp]> = [
  ['khoảng trắng kép', /[ \t]{2,}/],
  ['khoảng trắng trước dấu câu', /[ \t]+[,.!?;:…»”)]/],
  ['khoảng trắng quanh dấu gạch ngang', /[ \t][-–—]|[-–—][ \t]/],
  ['dòng hoặc đoạn thụt vào', /(?:^|\n)[ \t]+/],
  ['heading hoặc list marker bị lẫn vào nội dung', /(?:^|\n)\s*(?:#{1,6}\s+|[-*+•]\s+|\d+[.)]\s+)/],
  ['non-breaking space', /\u00a0/],
];

type LocatedString = { path: string; value: string };

function stringAt(path: string, value: string | undefined): LocatedString[] {
  return value === undefined ? [] : [{ path, value }];
}

function collectBlockStrings(block: ContentBlock, path: string): LocatedString[] {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
      return stringAt(`${path}.text`, block.text);
    case 'list':
      return block.items.flatMap((item, index) => stringAt(`${path}.items[${index}]`, item));
    case 'quote':
      return [
        ...stringAt(`${path}.text`, block.text),
        ...stringAt(`${path}.attribution`, block.attribution),
      ];
    case 'image':
      return stringAt(`${path}.caption`, block.caption);
    case 'table':
      return [
        ...block.headers.flatMap((header, index) => stringAt(`${path}.headers[${index}]`, header)),
        ...block.rows.flatMap((row, rowIndex) =>
          row.flatMap((cell, cellIndex) => stringAt(`${path}.rows[${rowIndex}][${cellIndex}]`, cell)),
        ),
      ];
    case 'linkGroup':
      return block.links.flatMap((link, index) => stringAt(`${path}.links[${index}].label`, link.label));
    case 'video':
      return stringAt(`${path}.title`, block.title);
  }
}

/** Only field values rendered as editorial copy are checked; identifiers and URLs are deliberately excluded. */
function collectStrings(records: readonly ContentRecord[]): LocatedString[] {
  return records.flatMap((record, index) => {
    const path = `fixture[${index}]`;

    return [
      ...stringAt(`${path}.title`, record.title),
      ...stringAt(`${path}.summary`, record.summary),
      ...stringAt(`${path}.sourceLabel`, record.sourceLabel),
      ...stringAt(`${path}.image.alt`, record.image?.alt),
      ...record.tags.flatMap((tag, tagIndex) => stringAt(`${path}.tags[${tagIndex}]`, tag)),
      ...record.body.flatMap((block, blockIndex) => collectBlockStrings(block, `${path}.body[${blockIndex}]`)),
      ...Object.entries(record.metadata).flatMap(([key, value]) =>
        Array.isArray(value)
          ? value.flatMap((item, valueIndex) => stringAt(`${path}.metadata.${key}[${valueIndex}]`, item))
          : stringAt(`${path}.metadata.${key}`, value),
      ),
      ...stringAt(`${path}.publication.journal`, record.publication?.journal),
      ...stringAt(`${path}.seo.title`, record.seo?.title),
      ...stringAt(`${path}.seo.description`, record.seo?.description),
      ...(record.media?.flatMap((asset, assetIndex) => stringAt(`${path}.media[${assetIndex}].alt`, asset.alt)) ?? []),
    ];
  });
}

describe('chất lượng nội dung news và publications', () => {
  test.each([
    'từ -tiếp',
    'từ- tiếp',
    'từ –tiếp',
    'từ— tiếp',
  ])('phát hiện khoảng trắng một phía của dấu gạch ngang: %s', (value) => {
    expect(CONTENT_ISSUES.some(([, pattern]) => pattern.test(value))).toBe(true);
  });

  test.each([
    'COM-B',
    'K.-D.',
    'Bottles-to-Bottles',
    'on-line',
  ])('không nhầm dấu nối hợp lệ là lỗi spacing: %s', (value) => {
    expect(CONTENT_ISSUES.some(([, pattern]) => pattern.test(value))).toBe(false);
  });

  test('phát hiện khoảng trắng trước dấu ba chấm Unicode', () => {
    expect(CONTENT_ISSUES.some(([, pattern]) => pattern.test('Nội dung tiếp theo …'))).toBe(true);
  });

  test('chỉ quét các trường nội dung hiển thị, không quét id, URL hay asset path', () => {
    const fixture = {
      ...newsFixtures[0],
      id: 'news -technical-id',
      slug: 'slug -technical',
      path: '/path -technical',
      sourceUrl: 'https://example.com/source -technical',
      image: {
        ...newsFixtures[0].image,
        src: '/assets/image -technical.png',
      },
      body: [{ type: 'image' as const, assetId: '/assets/body -technical.png', caption: 'Chú thích' }],
    };

    const paths = collectStrings([fixture] as unknown as ContentRecord[]).map(({ path }) => path);

    expect(paths).not.toContain('fixture[0].id');
    expect(paths).not.toContain('fixture[0].slug');
    expect(paths).not.toContain('fixture[0].path');
    expect(paths).not.toContain('fixture[0].sourceUrl');
    expect(paths).not.toContain('fixture[0].image.src');
    expect(paths).not.toContain('fixture[0].body[0].assetId');
    expect(paths).toContain('fixture[0].image.alt');
    expect(paths).toContain('fixture[0].body[0].caption');
  });

  test('mọi chuỗi nội dung hiển thị đều không có lỗi khoảng trắng hoặc marker rời', () => {
    const strings = collectStrings([
      ...newsFixtures,
      ...publicationFixtures,
    ]);

    const issues = strings.flatMap(({ path, value }) =>
      CONTENT_ISSUES.flatMap(([label, pattern]) =>
        pattern.test(value) ? [`${path}: ${label} (${JSON.stringify(value)})`] : [],
      ),
    );

    expect(issues).toEqual([]);
  });
});
