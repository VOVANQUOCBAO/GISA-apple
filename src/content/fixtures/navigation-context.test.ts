import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'vitest';

import { expertFixtures } from './experts';
import { publicationFixtures } from './publications';

describe('fixture navigation context', () => {
  test('every applied publication uses the applied-publication namespace', () => {
    const appliedPublications = publicationFixtures.filter(
      (record) => record.metadata.type === 'Chuyên khảo',
    );

    expect(appliedPublications.length).toBeGreaterThan(0);
    expect(
      appliedPublications.every((record) =>
        record.path.startsWith('/nghien-cuu/bai-bao-ung-dung/'),
      ),
    ).toBe(true);
  });

  test('linked expert portraits point to existing public assets', () => {
    const expertsWithPortraits = expertFixtures.filter((record) => record.image);

    expect(expertsWithPortraits.map((record) => record.slug)).toEqual(
      expect.arrayContaining(['hoang-van-viet', 'tran-anh-khang']),
    );
    for (const expert of expertsWithPortraits) {
      const publicPath = expert.image?.src.replace(/^\//, '');
      expect(publicPath).toBeDefined();
      expect(existsSync(join(process.cwd(), 'public', publicPath!))).toBe(true);
    }
  });
});
