import { NextResponse } from 'next/server';

import { failure, guardApi } from '@/lib/admin/http';
import { publishDocument, saveDraft } from '@/lib/admin/store';
import type { ContentRecord } from '@/content/types';

export const dynamic = 'force-dynamic';

/**
 * Đăng bài. Nếu trình duyệt gửi kèm bản đang sửa thì lưu nháp trước rồi mới
 * đăng — tránh trường hợp bấm Đăng trong lúc autosave chưa kịp chạy.
 */
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const blocked = await guardApi();
  if (blocked) return blocked;

  try {
    const { id } = await context.params;
    const documentId = decodeURIComponent(id);
    const body = (await request.json().catch(() => ({}))) as { record?: ContentRecord };

    if (body.record) await saveDraft(documentId, body.record);

    return NextResponse.json(await publishDocument(documentId));
  } catch (error) {
    return failure(error);
  }
}
