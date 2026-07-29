import { describe, expect, test } from 'vitest';

import { isPublishableEvidence } from './evidence';

describe('evidence publishing gate', () => {
  test.each([
    ['verified', true],
    ['provided_by_gisa', true],
    ['strategic_proposal', false],
    ['needs_verification', false],
  ] as const)('%s => %s', (status, expected) => {
    expect(isPublishableEvidence(status)).toBe(expected);
  });
});
