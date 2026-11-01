import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Chữ của các trang tĩnh (trang chủ, giới thiệu…) không nằm trong `ContentRecord`,
 * vì chúng là bố cục chứ không phải bài viết. Những gì biên tập được ghi đè ở đây,
 * theo từng đường dẫn và từng khoá chữ.
 */
const ROOT = path.join(process.cwd(), 'content-data', 'admin', 'pages');

export type PageCopy = Record<string, string>;

function fileFor(pagePath: string): string {
  const safe = pagePath.replace(/^\//, '').replace(/[^a-z0-9-]+/gi, '-') || 'home';
  return path.join(ROOT, `${safe}.json`);
}

export async function getPageCopy(pagePath: string): Promise<PageCopy> {
  try {
    const raw = await fs.readFile(fileFor(pagePath), 'utf8');
    const parsed = JSON.parse(raw) as { copy?: PageCopy };
    return parsed.copy ?? {};
  } catch {
    return {};
  }
}

export async function listPagePaths(): Promise<string[]> {
  try {
    const entries = await fs.readdir(ROOT);
    return entries.filter((entry) => entry.endsWith('.json')).map((entry) => entry.slice(0, -5));
  } catch {
    return [];
  }
}

export async function setPageCopyEntry(
  pagePath: string,
  key: string,
  value: string,
): Promise<PageCopy> {
  const current = await getPageCopy(pagePath);
  const next = { ...current };

  if (value.trim().length === 0) {
    delete next[key];
  } else {
    next[key] = value;
  }

  await fs.mkdir(ROOT, { recursive: true });
  const file = fileFor(pagePath);
  const temporary = `${file}.${process.pid}.tmp`;

  await fs.writeFile(
    temporary,
    `${JSON.stringify({ path: pagePath, updatedAt: new Date().toISOString(), copy: next }, null, 2)}\n`,
    'utf8',
  );
  await fs.rename(temporary, file);

  return next;
}
