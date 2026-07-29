import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { describe, expect, test } from 'vitest';

import { extractEmbeddedCmsObject } from './extract-embedded-data';

describe('extractEmbeddedCmsObject W30S payloads', () => {
  test('prefers the authoritative top-level escaped textarea payload', async () => {
    const html = await readFile(join(import.meta.dirname, 'test-data', 'w30s-detail.html'), 'utf8');
    expect(extractEmbeddedCmsObject(html)).toMatchObject({
      id: 3542490,
      name: 'CHRO - GIÁM ĐỐC NHÂN SỰ',
      seo_name: 'chro-giam-doc-nhan-su',
      title_page: 'Sản phẩm',
    });
  });

  test('does not mistake a nested listing item for the current page', async () => {
    const html = await readFile(join(import.meta.dirname, 'test-data', 'w30s-listing.html'), 'utf8');
    expect(extractEmbeddedCmsObject(html)).toBeUndefined();
  });
});
