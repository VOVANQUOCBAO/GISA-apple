import { describe, expect, test } from 'vitest';

import { OLD_ROUTE_REDIRECTS } from './redirects';

describe('legacy redirects', () => {
  test('contains all 36 registered mappings', () => {
    expect(OLD_ROUTE_REDIRECTS).toHaveLength(36);
  });

  test('has unique sources with no loops or home-page catch-all', () => {
    const sources = OLD_ROUTE_REDIRECTS.map((entry) => entry.source);

    expect(new Set(sources)).toHaveLength(sources.length);
    expect(
      OLD_ROUTE_REDIRECTS.every(
        (entry) =>
          entry.source !== entry.destination && entry.destination !== '/',
      ),
    ).toBe(true);
  });

  test.each([
    ['/kinh-te-ben-vung', '/ung-dung/kinh-te-ben-vung'],
    ['/kinh-te-ben-vung-1751264493', '/cong-dong/kinh-te-ben-vung'],
    ['/tin-tuc-1712655344', '/tin-tuc'],
    ['/dao-tao/edge', '/dao-tao/gisa-edge'],
    ['/dao-tao/rise', '/dao-tao/gisa-rise'],
    ['/dao-tao/ascend', '/dao-tao/gisa-ascend'],
    ['/dao-tao/legacy', '/dao-tao/gisa-legacy'],
  ])('maps %s to %s', (source, destination) => {
    expect(
      OLD_ROUTE_REDIRECTS.find((entry) => entry.source === source)
        ?.destination,
    ).toBe(destination);
  });
});
