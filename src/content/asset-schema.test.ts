import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { assetManifestSchema } from './asset-schema';

describe('asset provenance gate', () => {
  test('every public asset has source and review state', () => {
    const json = JSON.parse(
      readFileSync('public/assets/asset-manifest.json', 'utf8')
    );

    // Cổng chặn ở đây là schema: mọi dòng phải khai đủ nguồn và trạng thái duyệt
    // quyền. Không chốt cứng số dòng vì manifest lớn dần theo từng đợt bổ sung ảnh.
    const manifest = assetManifestSchema.parse(json);

    expect(manifest.length).toBe(json.length);
    expect(manifest.length).toBeGreaterThan(0);
  });
});
