import { NextResponse } from 'next/server';

import { adminDisabled, disabled, failure } from '@/lib/admin/http';
import { listDocuments } from '@/lib/admin/store';
import { listStudioDrafts } from '@/lib/admin/studio-store';

export const dynamic = 'force-dynamic';

/**
 * Tìm bài đang quản lý theo đường dẫn công khai, cho nút “Sửa bài này” trên site.
 * Trang không phải bài viết trả `id: null` (không phải lỗi) để trình duyệt không
 * ghi một dòng 404 vào console mỗi lần mở trang chủ.
 */
export async function GET(request: Request) {
  if (adminDisabled()) return disabled();

  try {
    const path = new URL(request.url).searchParams.get('path') ?? '';
    if (!path.startsWith('/')) {
      return NextResponse.json({ error: 'Thiếu đường dẫn.' }, { status: 400 });
    }

    const [documents, studioDrafts] = await Promise.all([listDocuments(), listStudioDrafts()]);
    const match = documents.find((document) => document.path === path);
    const studioCandidates = studioDrafts.filter((draft) => draft.sourcePath === path);
    const studio = studioCandidates.find((draft) => draft.live) ?? studioCandidates[0];

    if (!match && !studio) return NextResponse.json({ id: null });

    return NextResponse.json({
      id: match?.id ?? null,
      ...(match ? { state: match.state } : {}),
      ...(studio ? { studioId: studio.id, studioStatus: studio.status } : {}),
    });
  } catch (error) {
    return failure(error);
  }
}
