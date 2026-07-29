import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { assetManifestSchema } from './asset-schema';

describe('asset provenance gate', () => {
  test('every public asset has source and review state', () => {
    const json = JSON.parse(
      readFileSync('public/assets/asset-manifest.json', 'utf8')
    );

    expect(assetManifestSchema.parse(json)).toHaveLength(1);
  });
});
