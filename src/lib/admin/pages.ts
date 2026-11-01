import 'server-only';

import { listDocNames, readDoc, writeDoc } from './kv';

/**
 * Chữ của các trang tĩnh (trang chủ, giới thiệu…) không nằm trong `ContentRecord`,
 * vì chúng là bố cục chứ không phải bài viết. Những gì biên tập được ghi đè ở đây,
 * theo từng đường dẫn và từng khoá chữ.
 */
const ROOT = 'pages';

export type PageCopy = Record<string, string>;

function keyFor(pagePath: string): string {
  const safe = pagePath.replace(/^\//, '').replace(/[^a-z0-9-]+/gi, '-') || 'home';
  return `${ROOT}/${safe}`;
}

export async function getPageCopy(pagePath: string): Promise<PageCopy> {
  try {
    const stored = await readDoc<{ copy?: PageCopy }>(keyFor(pagePath));
    return stored?.copy ?? {};
  } catch {
    return {};
  }
}

export async function listPagePaths(): Promise<string[]> {
  return listDocNames(ROOT);
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

  await writeDoc(keyFor(pagePath), {
    path: pagePath,
    updatedAt: new Date().toISOString(),
    copy: next,
  });

  return next;
}
