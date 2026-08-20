import { describe, expect, test } from 'vitest';

import { LEGACY_MENU_PATHS, NAVIGATION } from './navigation';
import { PAGE_REGISTRY } from './pages';
import { OLD_ROUTE_REDIRECTS } from './redirects';

describe('navigation completeness', () => {
  test('navigation keeps eight focused top-level destinations and no hash links', () => {
    expect(NAVIGATION).toHaveLength(8);
    const links = NAVIGATION.flatMap((group) => [
      group.href,
      ...group.children.map((item) => item.href),
    ]);

    expect(links).not.toContain('#');
    expect(links).not.toContain('/');
    expect(links).not.toContain('/lien-he');
  });

  test('all 39 legacy menu destinations are routed or redirected', () => {
    expect(new Set(LEGACY_MENU_PATHS)).toHaveLength(39);

    for (const path of LEGACY_MENU_PATHS) {
      expect(
        OLD_ROUTE_REDIRECTS.some((entry) => entry.source === path) ||
          PAGE_REGISTRY.some(
            (page) => 'path' in page && page.path === path,
          ),
      ).toBe(true);
    }
  });
});
