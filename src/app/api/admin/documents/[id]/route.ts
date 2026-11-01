import { NextResponse } from 'next/server';

import { adminDisabled, disabled, failure } from '@/lib/admin/http';
import { getDocument, saveDraft } from '@/lib/admin/store';
import type { ContentRecord } from '@/content/types';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (adminDisabled()) return disabled();

  try {
    const { id } = await context.params;
    const document = await getDocument(decodeURIComponent(id));
    if (!document) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết.' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (adminDisabled()) return disabled();

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { record?: ContentRecord };
    if (!body.record) {
      return NextResponse.json({ error: 'Thiếu nội dung cần lưu.' }, { status: 400 });
    }

    const document = await saveDraft(decodeURIComponent(id), body.record);
    return NextResponse.json(document);
  } catch (error) {
    return failure(error);
  }
}
