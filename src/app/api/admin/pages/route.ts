import { NextResponse } from 'next/server';

import { adminDisabled, disabled, failure } from '@/lib/admin/http';
import { getPageCopy, setPageCopyEntry } from '@/lib/admin/pages';

export const dynamic = 'force-dynamic';

function normalizePath(value: string | null): string | null {
  if (!value || !value.startsWith('/')) return null;
  return value;
}

export async function GET(request: Request) {
  if (adminDisabled()) return disabled();

  try {
    const pagePath = normalizePath(new URL(request.url).searchParams.get('path'));
    if (!pagePath) return NextResponse.json({ error: 'Thiếu đường dẫn.' }, { status: 400 });

    return NextResponse.json({ path: pagePath, copy: await getPageCopy(pagePath) });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request) {
  if (adminDisabled()) return disabled();

  try {
    const body = (await request.json()) as { path?: string; key?: string; value?: string };
    if (!body.path || !body.key || typeof body.value !== 'string') {
      return NextResponse.json({ error: 'Thiếu nội dung cần lưu.' }, { status: 400 });
    }

    const copy = await setPageCopyEntry(body.path, body.key, body.value);
    return NextResponse.json({ path: body.path, copy });
  } catch (error) {
    return failure(error);
  }
}
