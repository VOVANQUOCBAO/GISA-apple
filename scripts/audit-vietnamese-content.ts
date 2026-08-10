import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type VietnameseAuditSeverity = 'P1' | 'P2';

export interface VietnameseAuditIssue {
  code: string;
  file: string;
  line: number;
  message: string;
  severity: VietnameseAuditSeverity;
}

export interface VietnameseSourceInput {
  file: string;
  source: string;
}

export interface TextCandidate {
  file: string;
  kind: 'jsx-text' | 'string';
  line: number;
  value: string;
}

const internalTerms = [
  { label: 'fixture', expression: /\bfixture\b/iu },
  { label: 'prototype', expression: /\bprototype\b/iu },
  { label: 'production', expression: /\bproduction\b/u },
  { label: 'collection', expression: /\bcollection\b/iu },
  { label: 'cổng bằng chứng', expression: /cổng bằng chứng/iu },
  { label: 'chờ xác minh', expression: /chờ xác minh/iu },
  {
    label: 'trang nguồn chưa công bố',
    expression: /trang nguồn chưa công bố/iu,
  },
  { label: 'được phép công bố', expression: /được phép công bố/iu },
] as const;

const ignoredJsxAttributes = new Set([
  'classname',
  'data-testid',
  'href',
  'id',
  'key',
  'name',
  'role',
  'src',
  'style',
  'type',
]);

function lineAt(source: string, index: number): number {
  return source.slice(0, Math.max(0, index)).split('\n').length;
}

function normalizeCopy(value: string): string {
  return value
    .normalize('NFC')
    .toLocaleLowerCase('vi')
    .replace(/[“”"'‘’()[\]{}:;,.!?/\\|–—-]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function words(value: string): string[] {
  return normalizeCopy(value).match(/[\p{L}\p{N}]+/gu) ?? [];
}

function hasInternalTerm(value: string): boolean {
  return internalTerms.some(({ expression }) => expression.test(value));
}

function isHumanCopy(value: string): boolean {
  const trimmed = value.replace(/\s+/gu, ' ').trim();
  if (trimmed.length < 3 || !/[\p{L}]/u.test(trimmed)) return false;
  if (hasInternalTerm(trimmed)) return true;
  if (/^(?:https?:\/\/|\/|\.\/|\.\.\/|@)/u.test(trimmed)) return false;
  if (/^[\w./:@-]+$/u.test(trimmed) && !/[À-ỹ]/u.test(trimmed)) return false;
  return /[À-ỹ\s,.!?;:]/u.test(trimmed);
}

function cleanLiteral(raw: string): string {
  return raw
    .replace(/\$\{[^}]*\}/gu, ' ')
    .replace(/\\(?:r?n|t)/gu, ' ')
    .replace(/\\([\\'"`])/gu, '$1')
    .replace(/\s+/gu, ' ')
    .trim();
}

function isImportLiteral(source: string, start: number): boolean {
  const lineStart = source.lastIndexOf('\n', start - 1) + 1;
  const prefix = source.slice(lineStart, start);
  return (
    /^\s*import\b/u.test(prefix) ||
    /\bfrom\s*$/u.test(prefix) ||
    /\brequire\(\s*$/u.test(prefix)
  );
}

function ignoredAttribute(source: string, start: number): boolean {
  const prefix = source.slice(Math.max(0, start - 80), start);
  const match = prefix.match(/([\w:-]+)\s*=\s*$/u);
  return match ? ignoredJsxAttributes.has(match[1].toLocaleLowerCase()) : false;
}

/** Extracts probable user-facing string literals and JSX text without evaluating code. */
export function extractTextCandidates(
  source: string,
  file = '(source)',
): TextCandidate[] {
  const candidates: TextCandidate[] = [];
  let index = 0;

  while (index < source.length) {
    const quote = source[index];
    if (source[index] === '/' && source[index + 1] === '/') {
      index += 2;
      while (index < source.length && source[index] !== '\n') index += 1;
      continue;
    }
    if (source[index] === '/' && source[index + 1] === '*') {
      index += 2;
      while (
        index < source.length &&
        !(source[index] === '*' && source[index + 1] === '/')
      ) {
        index += 1;
      }
      index += 2;
      continue;
    }
    if (quote !== "'" && quote !== '"' && quote !== '`') {
      index += 1;
      continue;
    }

    const start = index;
    index += 1;
    let raw = '';
    while (index < source.length) {
      const character = source[index];
      if (character === '\\') {
        raw += character + (source[index + 1] ?? '');
        index += 2;
        continue;
      }
      if (character === quote) {
        index += 1;
        break;
      }
      raw += character;
      index += 1;
    }

    const value = cleanLiteral(raw);
    if (
      !isImportLiteral(source, start) &&
      !ignoredAttribute(source, start) &&
      isHumanCopy(value)
    ) {
      candidates.push({ file, kind: 'string', line: lineAt(source, start), value });
    }
  }

  const jsxText = />\s*([^<>{}\n][^<>{}]*)\s*</gu;
  for (const match of source.matchAll(jsxText)) {
    const value = match[1].replace(/\s+/gu, ' ').trim();
    if (isHumanCopy(value)) {
      candidates.push({
        file,
        kind: 'jsx-text',
        line: lineAt(source, (match.index ?? 0) + match[0].indexOf(match[1])),
        value,
      });
    }
  }

  return candidates.sort((left, right) => left.line - right.line);
}

function sortIssues(
  left: VietnameseAuditIssue,
  right: VietnameseAuditIssue,
): number {
  return [left.file, String(left.line).padStart(8, '0'), left.code]
    .join('|')
    .localeCompare(
      [right.file, String(right.line).padStart(8, '0'), right.code].join('|'),
    );
}

function uniqueIssues(issues: VietnameseAuditIssue[]): VietnameseAuditIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.file}:${issue.line}:${issue.code}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function auditInternalLanguage(
  candidates: readonly TextCandidate[],
): VietnameseAuditIssue[] {
  return candidates.flatMap((candidate) =>
    internalTerms.flatMap(({ expression, label }) =>
      expression.test(candidate.value)
        ? [
            {
              code: 'INTERNAL_TERM_EXPOSED',
              file: candidate.file,
              line: candidate.line,
              message: `Thuật ngữ nội bộ “${label}” có nguy cơ hiển thị cho người đọc.`,
              severity: 'P1' as const,
            },
          ]
        : [],
    ),
  );
}

function hasIndependentContinuation(value: string): boolean {
  const clauses = value.split(',').slice(1);
  return clauses.some((clause) => {
    const continuation = clause.trim();
    if (words(continuation).length < 4) return false;
    return /^(?:GISA|chúng tôi|chương trình|dự án|nền tảng|khóa học|người học|doanh nghiệp|đội ngũ|mạng lưới|hoạt động|sáng kiến|tổ chức|đối tác|các|mỗi|người|nhóm)\b/iu.test(
      continuation,
    );
  });
}

/** Flags subordinating openings that were split into their own content block. */
export function auditDependentFragments(
  candidates: readonly TextCandidate[],
): VietnameseAuditIssue[] {
  return candidates.flatMap((candidate) => {
    const value = candidate.value.trim();
    const startsDependent = /^(?:Nhằm|Thông qua)(?:\s|$)/iu.test(value);
    const startsCorrelative = /^Không chỉ(?:\s|$)/iu.test(value);
    if (!startsDependent && !startsCorrelative) return [];

    const complete = startsCorrelative
      ? /\bmà còn\b/iu.test(value) || hasIndependentContinuation(value)
      : hasIndependentContinuation(value);
    if (complete) return [];

    return [
      {
        code: 'DEPENDENT_FRAGMENT',
        file: candidate.file,
        line: candidate.line,
        message:
          'Cụm phụ thuộc đang đứng thành một khối riêng; cần nối với mệnh đề chính để câu tiếng Việt trọn nghĩa.',
        severity: 'P1' as const,
      },
    ];
  });
}

interface ArrayRange {
  end: number;
  start: number;
}

function maskStringsAndComments(source: string): string {
  const characters = [...source];
  let index = 0;
  while (index < source.length) {
    const current = source[index];
    const next = source[index + 1];
    if (current === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') {
        characters[index] = ' ';
        index += 1;
      }
      continue;
    }
    if (current === '/' && next === '*') {
      characters[index] = characters[index + 1] = ' ';
      index += 2;
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        if (source[index] !== '\n') characters[index] = ' ';
        index += 1;
      }
      if (index < source.length) {
        characters[index] = characters[index + 1] = ' ';
        index += 2;
      }
      continue;
    }
    if (current === "'" || current === '"' || current === '`') {
      const quote = current;
      characters[index] = ' ';
      index += 1;
      while (index < source.length) {
        if (source[index] === '\\') {
          characters[index] = ' ';
          if (source[index + 1] !== '\n') characters[index + 1] = ' ';
          index += 2;
          continue;
        }
        const isEnd = source[index] === quote;
        if (source[index] !== '\n') characters[index] = ' ';
        index += 1;
        if (isEnd) break;
      }
      continue;
    }
    index += 1;
  }
  return characters.join('');
}

function findArrayRanges(source: string): ArrayRange[] {
  const masked = maskStringsAndComments(source);
  const stack: number[] = [];
  const ranges: ArrayRange[] = [];
  for (let index = 0; index < masked.length; index += 1) {
    if (masked[index] === '[') stack.push(index);
    if (masked[index] === ']' && stack.length > 0) {
      const start = stack.pop();
      if (start !== undefined) ranges.push({ start, end: index });
    }
  }
  return ranges;
}

function splitTopLevelEntries(source: string, range: ArrayRange): string[] {
  const body = source.slice(range.start + 1, range.end);
  const masked = maskStringsAndComments(body);
  const entries: string[] = [];
  let start = 0;
  let braces = 0;
  let brackets = 0;
  let parentheses = 0;
  for (let index = 0; index < masked.length; index += 1) {
    const character = masked[index];
    if (character === '{') braces += 1;
    if (character === '}') braces -= 1;
    if (character === '[') brackets += 1;
    if (character === ']') brackets -= 1;
    if (character === '(') parentheses += 1;
    if (character === ')') parentheses -= 1;
    if (
      character === ',' &&
      braces === 0 &&
      brackets === 0 &&
      parentheses === 0
    ) {
      entries.push(body.slice(start, index).trim());
      start = index + 1;
    }
  }
  const tail = body.slice(start).trim();
  if (tail) entries.push(tail);
  return entries.filter(Boolean);
}

function longSentence(value: string): boolean {
  return words(value).length >= 10 && /[.!?…]\s*$/u.test(value.trim());
}

function entryCopy(entry: string): TextCandidate[] {
  return extractTextCandidates(entry).filter((candidate) =>
    isHumanCopy(candidate.value),
  );
}

/** Audits statically visible array and JSX list structure. */
export function auditListPresentation(
  source: string,
  file = '(source)',
): VietnameseAuditIssue[] {
  const issues: VietnameseAuditIssue[] = [];
  const listProperties = new Set([
    'audience',
    'benefits',
    'expectations',
    'items',
    'objectives',
    'outcomes',
    'steps',
  ]);

  for (const range of findArrayRanges(source)) {
    const prefix = source.slice(Math.max(0, range.start - 120), range.start);
    const propertyMatch = prefix.match(/([\p{L}\p{N}_]+)\s*(?::|=)\s*$/u);
    if (!propertyMatch || !listProperties.has(propertyMatch[1])) continue;

    const entries = splitTopLevelEntries(source, range);
    if (entries.length < 3) continue;
    const copyByEntry = entries.map(entryCopy);
    const contentEntries = copyByEntry.filter((copy) => copy.length > 0);
    if (contentEntries.length < Math.ceil(entries.length * 0.7)) continue;

    const line = lineAt(source, range.start);
    const proseItems = contentEntries.filter((copy) =>
      copy.some((candidate) => longSentence(candidate.value)),
    );
    if (
      contentEntries.length >= 7 &&
      proseItems.length >= Math.ceil(contentEntries.length * 0.7)
    ) {
      issues.push({
        code: 'PROSE_SERIALIZED_AS_LIST',
        file,
        line,
        message:
          'Nhiều câu văn dài đang được trình bày như các mục liệt kê; nên biên tập thành lời dẫn và các đoạn có nhịp đọc tự nhiên.',
        severity: 'P1',
      });
    }

    const body = source.slice(range.start + 1, range.end);
    const hasGrouping =
      /\b(?:group|category|section|cluster|heading|nhóm)\s*:/iu.test(body) ||
      entries.some((entry) => /^\s*\[/u.test(entry));
    if (entries.length > 8 && !hasGrouping) {
      issues.push({
        code: 'UNGROUPED_LONG_LIST',
        file,
        line,
        message: `Danh sách có ${entries.length} mục nhưng chưa thể hiện cách phân nhóm hoặc lời dẫn.`,
        severity: 'P2',
      });
    }
  }

  const jsxListPattern = /<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/giu;
  for (const match of source.matchAll(jsxListPattern)) {
    const body = match[2];
    const items = [...body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/giu)].map(
      (item) => item[1].replace(/<[^>]+>|\{[^}]*\}/gu, ' ').replace(/\s+/gu, ' ').trim(),
    );
    if (items.length === 0) continue;
    const line = lineAt(source, match.index ?? 0);
    if (
      items.length >= 7 &&
      items.filter(longSentence).length >= Math.ceil(items.length * 0.7)
    ) {
      issues.push({
        code: 'PROSE_SERIALIZED_AS_LIST',
        file,
        line,
        message:
          'Nhiều câu văn dài đang được trình bày như các mục liệt kê; nên biên tập thành lời dẫn và các đoạn có nhịp đọc tự nhiên.',
        severity: 'P1',
      });
    }
    if (items.length > 8 && !/<(?:h[2-6]|ul|ol)\b/iu.test(body)) {
      issues.push({
        code: 'UNGROUPED_LONG_LIST',
        file,
        line,
        message: `Danh sách có ${items.length} mục nhưng chưa thể hiện cách phân nhóm hoặc lời dẫn.`,
        severity: 'P2',
      });
    }
  }

  return uniqueIssues(issues);
}

/** Finds markup that can visually split a Vietnamese sentence before it is complete. */
export function auditJsxStructure(
  source: string,
  file = '(source)',
): VietnameseAuditIssue[] {
  const issues: VietnameseAuditIssue[] = [];
  for (const match of source.matchAll(/<br\s*\/?\s*>/giu)) {
    issues.push({
      code: 'JSX_BREAK_IN_SENTENCE',
      file,
      line: lineAt(source, match.index ?? 0),
      message:
        'Không dùng <br> để điều khiển xuống dòng trong nội dung; độ rộng màn hình có thể làm câu bị ngắt sai nghĩa.',
      severity: 'P1',
    });
  }

  const inlineContainers = /<(p|a|span)\b[^>]*>([\s\S]*?)<\/\1>/giu;
  for (const match of source.matchAll(inlineContainers)) {
    if (!/<(?:div|p|section|article|ul|ol|h[1-6])\b/iu.test(match[2])) continue;
    issues.push({
      code: 'BLOCK_INSIDE_PHRASE',
      file,
      line: lineAt(source, match.index ?? 0),
      message:
        'Phần tử block nằm trong ngữ cảnh câu liên tục và có nguy cơ tách mệnh đề khi hiển thị.',
      severity: 'P1',
    });
  }

  const blockSpan = /<span\b(?:(?:[^>]*\bclassName\s*=\s*["'][^"']*\bblock\b[^"']*["'])|(?:[^>]*\bstyle\s*=\s*\{\{[^}]*\bdisplay\s*:\s*["']block["']))[^>]*>/giu;
  for (const match of source.matchAll(blockSpan)) {
    issues.push({
      code: 'BLOCK_INSIDE_PHRASE',
      file,
      line: lineAt(source, match.index ?? 0),
      message:
        'Span được ép hiển thị dạng block; cần kiểm tra để câu không bị xuống dòng trước khi kết thúc nghĩa.',
      severity: 'P1',
    });
  }

  return uniqueIssues(issues);
}

function candidateKey(candidate: TextCandidate): string {
  return `${candidate.file}:${candidate.line}`;
}

/** Finds exact repeated long copy and repeated 12-word passages across text blocks. */
export function auditDuplicateCopy(
  candidates: readonly TextCandidate[],
): VietnameseAuditIssue[] {
  const issues: VietnameseAuditIssue[] = [];
  const substantial = candidates.filter(
    (candidate) => candidate.value.length >= 60 && words(candidate.value).length >= 10,
  );
  const exact = new Map<string, TextCandidate[]>();
  for (const candidate of substantial) {
    const normalized = normalizeCopy(candidate.value);
    exact.set(normalized, [...(exact.get(normalized) ?? []), candidate]);
  }

  const exactDuplicateKeys = new Set<string>();
  for (const group of exact.values()) {
    if (group.length < 2) continue;
    for (const candidate of group.slice(1)) {
      exactDuplicateKeys.add(candidateKey(candidate));
      issues.push({
        code: 'DUPLICATE_LONG_COPY',
        file: candidate.file,
        line: candidate.line,
        message:
          'Đoạn nội dung dài lặp nguyên văn ở vị trí khác; cần kiểm tra liệu trang đã có lời giới thiệu riêng hay chưa.',
        severity: 'P2',
      });
    }
  }

  const ngrams = new Map<string, TextCandidate[]>();
  for (const candidate of substantial.filter(
    (item) => words(item.value).length >= 18 && !exactDuplicateKeys.has(candidateKey(item)),
  )) {
    const tokens = words(candidate.value);
    const seenHere = new Set<string>();
    for (let index = 0; index <= tokens.length - 12; index += 1) {
      const gram = tokens.slice(index, index + 12).join(' ');
      if (seenHere.has(gram)) continue;
      seenHere.add(gram);
      ngrams.set(gram, [...(ngrams.get(gram) ?? []), candidate]);
    }
  }

  const reported = new Set<string>();
  for (const group of ngrams.values()) {
    const locations = new Map(group.map((candidate) => [candidateKey(candidate), candidate]));
    if (locations.size < 2) continue;
    for (const candidate of [...locations.values()].slice(1)) {
      const key = candidateKey(candidate);
      if (reported.has(key) || exactDuplicateKeys.has(key)) continue;
      reported.add(key);
      issues.push({
        code: 'DUPLICATE_COPY_NGRAM',
        file: candidate.file,
        line: candidate.line,
        message:
          'Một cụm nội dung dài đang lặp lại ở khối khác; cần kiểm tra tính riêng biệt và ngữ cảnh của lời giới thiệu.',
        severity: 'P2',
      });
    }
  }

  return uniqueIssues(issues);
}

export function auditVietnameseSource(
  source: string,
  file = '(source)',
): VietnameseAuditIssue[] {
  const candidates = extractTextCandidates(source, file);
  return uniqueIssues([
    ...auditInternalLanguage(candidates),
    ...auditDependentFragments(candidates),
    ...auditListPresentation(source, file),
    ...auditJsxStructure(source, file),
  ]).sort(sortIssues);
}

export function auditVietnameseSources(
  sources: readonly VietnameseSourceInput[],
): VietnameseAuditIssue[] {
  const candidates = sources.flatMap(({ file, source }) =>
    extractTextCandidates(source, file),
  );
  return uniqueIssues([
    ...sources.flatMap(({ file, source }) => auditVietnameseSource(source, file)),
    ...auditDuplicateCopy(candidates),
  ]).sort(sortIssues);
}

function listSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .flatMap((name) => {
      const path = resolve(directory, name);
      if (statSync(path).isDirectory()) return listSourceFiles(path);
      if (!/\.(?:ts|tsx)$/u.test(name) || /\.(?:test|spec|stories)\./u.test(name)) {
        return [];
      }
      return [path];
    })
    .sort();
}

const excludedAuditPaths = [
  /^src\/app\/(?:landing-bdt|landing-lp)\//u,
  /^src\/app\/(?:layout|robots|sitemap)\.tsx?$/u,
  /^src\/components\/motion\//u,
  /^src\/components\/site\//u,
  /^src\/components\/templates\/(?:expert-showcase|home-template|journey-|knowledge-journey|rises-fold-panorama)/u,
  /^src\/content\/repositories\//u,
  /^src\/content\/(?:journey|types|verified-metrics)\.tsx?$/u,
] as const;

export function isAuditedSourcePath(file: string): boolean {
  const normalized = file.replaceAll('\\', '/');
  if (/\.(?:test|spec)\.[cm]?[jt]sx?$/u.test(normalized)) return false;
  return !excludedAuditPaths.some((expression) => expression.test(normalized));
}

export function runVietnameseContentAudit(
  root = process.cwd(),
): VietnameseAuditIssue[] {
  const directories = ['src/content', 'src/components', 'src/app'];
  const files = directories.flatMap((directory) =>
    listSourceFiles(resolve(root, directory)),
  ).filter((file) => isAuditedSourcePath(relative(root, file)));
  const sources = files.map((file) => ({
    file: relative(root, file).replaceAll('\\', '/'),
    source: readFileSync(file, 'utf8'),
  }));
  return auditVietnameseSources(sources);
}

const isMain =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  try {
    const issues = runVietnameseContentAudit();
    const counts = issues.reduce(
      (result, issue) => ({
        ...result,
        [issue.severity]: result[issue.severity] + 1,
      }),
      { P1: 0, P2: 0 },
    );

    console.log(
      `Vietnamese content audit: ${issues.length} issue(s) — ${counts.P1} P1, ${counts.P2} P2.`,
    );
    for (const issue of issues) {
      console.log(
        `${issue.file}:${issue.line} ${issue.severity} ${issue.code} ${issue.message}`,
      );
    }

    if (process.argv.includes('--strict') && counts.P1 > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(
      `Vietnamese content audit could not run: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 2;
  }
}
