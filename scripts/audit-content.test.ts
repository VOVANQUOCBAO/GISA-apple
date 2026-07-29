import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { expect, test } from 'vitest';

import { allContentFixtures } from '../src/content/fixtures';
import { LEGACY_MENU_PATHS, NAVIGATION } from '../src/content/navigation';
import { PAGE_REGISTRY } from '../src/content/pages';
import { OLD_ROUTE_REDIRECTS } from '../src/content/redirects';
import {
  auditAssets,
  auditFixtures,
  auditRoutes,
  auditText,
} from './audit-content';

test('flags forbidden mockup and artifact strings', () => {
  const result = auditText('Loading... skyline số điện thoại giả');

  expect(result.map((issue) => issue.code)).toEqual(
    expect.arrayContaining(['loading-artifact', 'mockup-term']),
  );
});

test('requires source rows for every fixture', () => {
  const sourceRegister = readFileSync('docs/content-source-register.md', 'utf8');

  expect(
    auditFixtures(allContentFixtures, sourceRegister).filter(
      (issue) => issue.code === 'missing-source',
    ),
  ).toEqual([]);
});

test('the checked fixtures, routes, redirects, and assets have zero violations', () => {
  const sourceRegister = readFileSync('docs/content-source-register.md', 'utf8');
  const assetManifest = JSON.parse(
    readFileSync('public/assets/asset-manifest.json', 'utf8'),
  ) as unknown;

  expect(auditFixtures(allContentFixtures, sourceRegister)).toEqual([]);
  expect(
    auditRoutes(
      PAGE_REGISTRY,
      NAVIGATION,
      LEGACY_MENU_PATHS,
      OLD_ROUTE_REDIRECTS,
    ),
  ).toEqual([]);
  expect(
    auditAssets(
      assetManifest,
      ['/brand/gisa-logo-temp.png'],
      resolve('public'),
    ),
  ).toEqual([]);
});

test('flags unsourced positive claims while allowing verification disclosures', () => {
  const sourceRegister = readFileSync('docs/content-source-register.md', 'utf8');
  const course = allContentFixtures.find(
    (record) => record.id === 'course-practical-accounting-tax',
  );
  expect(course).toBeDefined();

  const issues = auditFixtures(
    [
      {
        ...course,
        summary: `${course?.summary} Học phí 10 triệu VND.`,
      },
    ],
    sourceRegister,
  );

  expect(issues.map((issue) => issue.code)).toContain('unsourced-fee');
});

test('detects redirect loops and unregistered assets', () => {
  const routeIssues = auditRoutes(
    PAGE_REGISTRY,
    NAVIGATION,
    LEGACY_MENU_PATHS,
    [
      ...OLD_ROUTE_REDIRECTS,
      { source: '/loop-a', destination: '/loop-b' },
      { source: '/loop-b', destination: '/loop-a' },
    ],
  );
  const assetManifest = JSON.parse(
    readFileSync('public/assets/asset-manifest.json', 'utf8'),
  ) as unknown;

  expect(routeIssues.map((issue) => issue.code)).toContain('redirect-loop');
  expect(
    auditAssets(assetManifest, ['/brand/not-registered.png'], resolve('public')).map(
      (issue) => issue.code,
    ),
  ).toContain('missing-asset-manifest-row');
});
