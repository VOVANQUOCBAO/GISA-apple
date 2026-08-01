import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { assetManifestSchema, type AssetManifestItem } from '../src/content/asset-schema';
import { isPublishableEvidence } from '../src/content/evidence';
import { allContentFixtures } from '../src/content/fixtures';
import {
  LEGACY_MENU_PATHS,
  NAVIGATION,
  type NavigationGroup,
} from '../src/content/navigation';
import { PAGE_REGISTRY, type PageDefinition } from '../src/content/pages';
import {
  OLD_ROUTE_REDIRECTS,
  type LegacyRedirect,
} from '../src/content/redirects';
import { contentRecordSchema } from '../src/content/schema';
import type { ContentRecord } from '../src/content/types';

export interface AuditIssue {
  code: string;
  message: string;
  file?: string;
  record?: string;
}

interface SourceRow {
  allowedFields: string;
  checkedAt: string;
  id: string;
  path: string;
  sourceUrl: string;
  status: string;
}

const textPatterns = [
  {
    code: 'loading-artifact',
    expression: /Loading\.\.\./i,
    message: 'Loading artifact is exposed as copy.',
  },
  {
    code: 'mockup-term',
    expression:
      /\bskyline\b|số điện thoại giả|dữ liệu giả|(?:mockup|placeholder)[-_ ]?(?:asset|image|data|copy)?/i,
    message: 'Forbidden mockup or placeholder term is exposed.',
  },
  {
    code: 'json-config-artifact',
    expression: /\{\s*["'](?:items|title|metadata|collection)["']\s*:/i,
    message: 'JSON or configuration syntax is exposed as copy.',
  },
  {
    code: 'encoding-error',
    /**
     * Mojibake xuất hiện khi byte UTF-8 bị đọc như Latin-1, nên ký tự dẫn đầu
     * (Ã, Â, â, Ä, Æ) luôn kèm một ký tự thuộc dải Latin-1 bổ sung. Vế thứ hai
     * trước đây là `.`, nên nó bắt cả "Âu" trong "châu Âu" — tức báo lỗi mã hóa
     * cho chữ Việt viết đúng. Dải dưới đây khớp với `mojibakePattern` trong
     * src/content/schema.ts.
     */
    expression:
      /\uFFFD|\u00C3[\u0080-\u00BF\u0192]|\u00C2[\u0080-\u00BF]|\u00E2(?:\u20AC|\u2122|\u0153)|\u00C4[\u2018\u2019]|\u00C6[\u00B0\u00B1]/,
    message: 'Text contains a replacement or mojibake sequence.',
  },
] as const;

function issueSort(left: AuditIssue, right: AuditIssue): number {
  return [left.file ?? '', left.record ?? '', left.code, left.message]
    .join('|')
    .localeCompare(
      [right.file ?? '', right.record ?? '', right.code, right.message].join(
        '|',
      ),
    );
}

function normalize(value: string): string {
  return value.normalize('NFC').trim().toLocaleLowerCase('vi');
}

function validHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

export function auditText(
  text: string,
  context: Pick<AuditIssue, 'file' | 'record'> = {},
): AuditIssue[] {
  return textPatterns.flatMap(({ code, expression, message }) =>
    expression.test(text) ? [{ code, message, ...context }] : [],
  );
}

export function parseSourceRegister(markdown: string): Map<string, SourceRow> {
  const rows = new Map<string, SourceRow>();

  for (const line of markdown.split(/\r?\n/)) {
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
    const idMatch = cells[0]?.match(/^`([^`]+)`$/);
    if (!idMatch || cells.length < 7) continue;

    rows.set(idMatch[1], {
      id: idMatch[1],
      path: cells[2].replaceAll('`', ''),
      sourceUrl: cells[3].match(/\]\((https?:\/\/[^)]+)\)/)?.[1] ?? '',
      checkedAt: cells[4],
      status: cells[5].replaceAll('`', ''),
      allowedFields: cells[6],
    });
  }

  return rows;
}

function allowsClaim(row: SourceRow, terms: string[]): boolean {
  const allowed = normalize(row.allowedFields);
  return terms.some((term) => {
    const normalizedTerm = normalize(term);
    return (
      allowed.includes(normalizedTerm) &&
      !allowed.includes(`không gồm ${normalizedTerm}`)
    );
  });
}

function auditSensitiveClaims(record: ContentRecord, row: SourceRow): AuditIssue[] {
  const text = collectStrings({
    title: record.title,
    summary: record.summary,
    body: record.body,
    tags: record.tags,
    metadata: record.metadata,
  }).join(' ');
  const assertedText = text
    .split(/[.!?;]/)
    .filter(
      (sentence) =>
        !/không (?:công bố|gồm|xác nhận)|cần (?:được )?xác minh|chỉ hiển thị khi|chờ xác minh/i.test(
          sentence,
        ),
    )
    .join(' ');
  const categories = [
    {
      code: 'unsourced-fee',
      expression: /học phí|\b(?:vnd|usd)\b/i,
      allowed: ['học phí'],
      label: 'fee',
    },
    {
      code: 'unsourced-title',
      expression: /\b(?:giáo sư|phó giáo sư|tiến sĩ|thạc sĩ|giảng viên|chức danh)\b/i,
      allowed: ['chức danh', 'giảng viên'],
      label: 'professional title',
    },
    {
      code: 'unsourced-partner',
      expression: /\b(?:đối tác|nhà tài trợ|quỹ tài trợ)\b/i,
      allowed: ['đối tác', 'nhà tài trợ', 'quỹ'],
      label: 'partner or sponsor',
    },
    {
      code: 'unsourced-contact',
      expression:
        /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?84|0)[\s.-]?(?:\d[\s.-]?){8,10}/i,
      allowed: ['contact', 'liên hệ', 'email', 'điện thoại'],
      label: 'contact',
    },
    {
      code: 'unsourced-metric',
      expression:
        /\b\d+(?:[.,]\d+)?\s*(?:%|triệu|tỷ|người|doanh nghiệp|dự án|khóa học)\b/i,
      allowed: ['số liệu', 'kết quả', 'tác động'],
      label: 'quantified metric',
    },
  ];

  return categories.flatMap((category) =>
    category.expression.test(assertedText) && !allowsClaim(row, category.allowed)
      ? [
          {
            code: category.code,
            message: `Fixture contains a ${category.label} claim outside its approved source fields.`,
            record: record.id,
          },
        ]
      : [],
  );
}

export function auditFixtures(
  fixtures: readonly unknown[],
  sourceRegisterMarkdown: string,
): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const sourceRows = parseSourceRegister(sourceRegisterMarkdown);
  const ids = new Set<string>();
  const paths = new Set<string>();
  const slugs = new Set<string>();

  for (const rawRecord of fixtures) {
    const parsed = contentRecordSchema.safeParse(rawRecord);
    if (!parsed.success) {
      issues.push({
        code: 'invalid-fixture-schema',
        message: parsed.error.issues
          .map((item) => `${item.path.join('.')}: ${item.message}`)
          .join('; '),
        record:
          rawRecord && typeof rawRecord === 'object' && 'id' in rawRecord
            ? String(rawRecord.id)
            : '(unknown)',
      });
      continue;
    }

    const record = parsed.data;
    const slugKey = `${record.locale}:${record.collection}:${record.slug}`;
    for (const [set, key, code] of [
      [ids, record.id, 'duplicate-id'],
      [paths, record.path, 'duplicate-path'],
      [slugs, slugKey, 'duplicate-slug'],
    ] as const) {
      if (set.has(key)) {
        issues.push({
          code,
          message: `Duplicate fixture key: ${key}`,
          record: record.id,
        });
      }
      set.add(key);
    }

    const row = sourceRows.get(record.id);
    if (!row) {
      issues.push({
        code: 'missing-source',
        message: 'Fixture has no row in docs/content-source-register.md.',
        record: record.id,
      });
      continue;
    }

    if (row.path !== record.path) {
      issues.push({
        code: 'source-path-mismatch',
        message: `Source row path ${row.path} does not match ${record.path}.`,
        record: record.id,
      });
    }
    if (row.status !== record.evidenceStatus) {
      issues.push({
        code: 'source-status-mismatch',
        message: `Source row status ${row.status} does not match ${record.evidenceStatus}.`,
        record: record.id,
      });
    }
    if (row.checkedAt !== record.checkedAt) {
      issues.push({
        code: 'source-date-mismatch',
        message: `Source row date ${row.checkedAt} does not match ${record.checkedAt}.`,
        record: record.id,
      });
    }
    if (row.sourceUrl !== record.sourceUrl) {
      issues.push({
        code: 'source-url-mismatch',
        message: 'Fixture source URL differs from its source-register URL.',
        record: record.id,
      });
    }
    if (!validHttpUrl(record.sourceUrl)) {
      issues.push({
        code: 'invalid-source-url',
        message: `Source URL is not absolute HTTP(S): ${record.sourceUrl}`,
        record: record.id,
      });
    }
    if (!isPublishableEvidence(record.evidenceStatus)) {
      issues.push({
        code: 'non-publishable-fixture',
        message: `Public fixture uses ${record.evidenceStatus} evidence.`,
        record: record.id,
      });
    }
    if (record.image) {
      if (/^https?:\/\//i.test(record.image.src)) {
        issues.push({
          code: 'remote-image',
          message: `Fixture image is remote: ${record.image.src}`,
          record: record.id,
        });
      }
      if (!record.image.alt.trim()) {
        issues.push({
          code: 'missing-alt',
          message: 'Fixture image has empty alt text.',
          record: record.id,
        });
      }
    }

    for (const value of collectStrings(record)) {
      issues.push(...auditText(value, { record: record.id }));
    }
    issues.push(...auditSensitiveClaims(record, row));
  }

  for (const id of sourceRows.keys()) {
    if (!ids.has(id)) {
      issues.push({
        code: 'orphan-source',
        message: 'Source-register row has no fixture.',
        record: id,
      });
    }
  }

  return issues.sort(issueSort);
}

function patternMatches(pattern: string, path: string): boolean {
  return new RegExp(`^${pattern.replace('[slug]', '[^/]+')}$`).test(path);
}

export function auditRoutes(
  pages: readonly PageDefinition[],
  navigation: readonly NavigationGroup[],
  legacyPaths: readonly string[],
  redirects: readonly LegacyRedirect[],
  fixtures: readonly ContentRecord[] = allContentFixtures,
): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const fixedPaths = pages.flatMap((page) => ('path' in page ? [page.path] : []));
  const patterns = pages.flatMap((page) =>
    'pathPattern' in page ? [page.pathPattern] : [],
  );
  const fixturePaths = fixtures.map((record) => record.path);
  const canonicalPaths = new Set([...fixedPaths, ...fixturePaths]);
  const redirectBySource = new Map<string, string>();

  if (navigation.length !== 10) {
    issues.push({
      code: 'navigation-group-count',
      message: `Expected 10 top-level navigation groups, found ${navigation.length}.`,
      file: 'src/content/navigation.ts',
    });
  }
  if (legacyPaths.length !== 39) {
    issues.push({
      code: 'legacy-menu-count',
      message: `Expected 39 legacy menu paths, found ${legacyPaths.length}.`,
      file: 'src/content/navigation.ts',
    });
  }

  for (const path of [...fixedPaths, ...fixturePaths]) {
    if ([...fixedPaths, ...fixturePaths].filter((item) => item === path).length > 1) {
      issues.push({
        code: 'duplicate-canonical-route',
        message: `Canonical route is duplicated: ${path}`,
        file: 'src/content/pages.ts',
      });
    }
  }

  for (const group of navigation) {
    for (const item of [group, ...group.children]) {
      if (item.href === '#' || !item.href.startsWith('/')) {
        issues.push({
          code: 'invalid-navigation-link',
          message: `Navigation link is not a real local route: ${item.href}`,
          file: 'src/content/navigation.ts',
        });
      } else if (
        !canonicalPaths.has(item.href) &&
        !patterns.some((pattern) => patternMatches(pattern, item.href))
      ) {
        issues.push({
          code: 'missing-navigation-route',
          message: `Navigation target has no canonical page: ${item.href}`,
          file: 'src/content/navigation.ts',
        });
      }
    }
  }

  for (const redirect of redirects) {
    if (redirectBySource.has(redirect.source)) {
      issues.push({
        code: 'duplicate-redirect-source',
        message: `Redirect source is duplicated: ${redirect.source}`,
        file: 'src/content/redirects.ts',
      });
    }
    redirectBySource.set(redirect.source, redirect.destination);

    if (canonicalPaths.has(redirect.source)) {
      issues.push({
        code: 'redirect-canonical-collision',
        message: `Redirect source collides with a canonical route: ${redirect.source}`,
        file: 'src/content/redirects.ts',
      });
    }
    if (
      !canonicalPaths.has(redirect.destination) &&
      !patterns.some((pattern) => patternMatches(pattern, redirect.destination))
    ) {
      issues.push({
        code: 'missing-redirect-destination',
        message: `Redirect destination has no canonical page: ${redirect.destination}`,
        file: 'src/content/redirects.ts',
      });
    }
  }

  for (const source of redirectBySource.keys()) {
    const visited = new Set<string>();
    let cursor: string | undefined = source;
    while (cursor && redirectBySource.has(cursor)) {
      if (visited.has(cursor)) {
        issues.push({
          code: 'redirect-loop',
          message: `Redirect loop starts at ${source}.`,
          file: 'src/content/redirects.ts',
        });
        break;
      }
      visited.add(cursor);
      cursor = redirectBySource.get(cursor);
    }
  }

  const seenLegacy = new Set<string>();
  for (const path of legacyPaths) {
    if (seenLegacy.has(path)) {
      issues.push({
        code: 'duplicate-legacy-path',
        message: `Legacy menu path is duplicated: ${path}`,
        file: 'src/content/navigation.ts',
      });
    }
    seenLegacy.add(path);
    if (!canonicalPaths.has(path) && !redirectBySource.has(path)) {
      issues.push({
        code: 'unmapped-legacy-path',
        message: `Legacy menu path has no page or redirect: ${path}`,
        file: 'src/content/navigation.ts',
      });
    }
  }

  return issues.sort(issueSort);
}

export function auditAssets(
  manifestPayload: unknown,
  referencedPaths: readonly string[],
  publicRoot: string,
): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const parsed = assetManifestSchema.safeParse(manifestPayload);
  if (!parsed.success) {
    return [
      {
        code: 'invalid-asset-manifest',
        message: parsed.error.issues
          .map((item) => `${item.path.join('.')}: ${item.message}`)
          .join('; '),
        file: 'public/assets/asset-manifest.json',
      },
    ];
  }

  const byPath = new Map<string, AssetManifestItem>();
  for (const item of parsed.data) {
    if (byPath.has(item.publicPath)) {
      issues.push({
        code: 'duplicate-asset',
        message: `Asset manifest path is duplicated: ${item.publicPath}`,
        file: 'public/assets/asset-manifest.json',
      });
    }
    byPath.set(item.publicPath, item);

    const diskPath = resolve(publicRoot, item.publicPath.replace(/^\//, ''));
    if (!existsSync(diskPath)) {
      issues.push({
        code: 'missing-asset-file',
        message: `Manifest asset does not exist: ${item.publicPath}`,
        file: 'public/assets/asset-manifest.json',
      });
    }
    if (!item.alt.trim() && !/decorative|trang trí/i.test(item.notes)) {
      issues.push({
        code: 'missing-alt',
        message: `Asset needs alt text or a decorative note: ${item.publicPath}`,
        file: 'public/assets/asset-manifest.json',
      });
    }
    issues.push(
      ...auditText(`${item.publicPath} ${item.sourcePath}`, {
        file: 'public/assets/asset-manifest.json',
      }),
    );
  }

  for (const path of new Set(referencedPaths)) {
    if (/^https?:\/\//i.test(path)) {
      issues.push({
        code: 'remote-image',
        message: `Product references a remote image: ${path}`,
        file: 'src',
      });
    } else if (!byPath.has(path)) {
      issues.push({
        code: 'missing-asset-manifest-row',
        message: `Referenced asset has no manifest row: ${path}`,
        file: 'public/assets/asset-manifest.json',
      });
    }
  }

  return issues.sort(issueSort);
}

function listProductFiles(directory: string): string[] {
  return readdirSync(directory)
    .flatMap((name) => {
      const path = resolve(directory, name);
      if (statSync(path).isDirectory()) return listProductFiles(path);
      if (!/\.(?:ts|tsx|css)$/.test(name) || /\.test\./.test(name)) return [];
      return [path];
    })
    .sort();
}

function auditProductSource(root: string): {
  issues: AuditIssue[];
  referencedAssets: string[];
} {
  const issues: AuditIssue[] = [];
  const referencedAssets: string[] = [];
  const sourceRoot = resolve(root, 'src');

  for (const path of listProductFiles(sourceRoot)) {
    const relativePath = path.slice(root.length + 1).replaceAll('\\', '/');
    const text = readFileSync(path, 'utf8');
    for (const pattern of textPatterns.filter((item) =>
      ['loading-artifact', 'mockup-term', 'encoding-error'].includes(item.code),
    )) {
      if (pattern.expression.test(text)) {
        issues.push({
          code: pattern.code,
          message: pattern.message,
          file: relativePath,
        });
      }
    }
    referencedAssets.push(
      ...(text.match(/\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|gif|svg)/gi) ?? []),
      ...(text.match(/https?:\/\/[^\s"')]+\.(?:png|jpe?g|webp|gif|svg)/gi) ?? []),
    );
  }

  return { issues, referencedAssets };
}

export function runContentAudit(root = process.cwd()): AuditIssue[] {
  const fixtureRecords = contentRecordSchema.array().parse(allContentFixtures);
  const sourceRegister = readFileSync(
    resolve(root, 'docs/content-source-register.md'),
    'utf8',
  );
  const assetManifest = JSON.parse(
    readFileSync(resolve(root, 'public/assets/asset-manifest.json'), 'utf8'),
  ) as unknown;
  const productSource = auditProductSource(root);
  const dataTextIssues = collectStrings({ PAGE_REGISTRY, NAVIGATION }).flatMap(
    (value) => auditText(value),
  );

  return [
    ...auditFixtures(fixtureRecords, sourceRegister),
    ...auditRoutes(
      PAGE_REGISTRY,
      NAVIGATION,
      LEGACY_MENU_PATHS,
      OLD_ROUTE_REDIRECTS,
      fixtureRecords,
    ),
    ...auditAssets(
      assetManifest,
      [
        ...productSource.referencedAssets,
        ...fixtureRecords.flatMap((record) =>
          record.image ? [record.image.src] : [],
        ),
      ],
      resolve(root, 'public'),
    ),
    ...productSource.issues,
    ...dataTextIssues,
  ].sort(issueSort);
}

const isMain =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const issues = runContentAudit();
  if (issues.length === 0) {
    console.log('Content audit PASS: 0 violations.');
  } else {
    console.error(`Content audit FAIL: ${issues.length} violation(s).`);
    for (const issue of issues) {
      console.error(
        [issue.file, issue.record, issue.code, issue.message]
          .filter(Boolean)
          .join(' | '),
      );
    }
    process.exitCode = 1;
  }
}
