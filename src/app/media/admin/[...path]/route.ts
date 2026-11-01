import { getMedia, usesDatabase } from '@/lib/admin/kv';

export const runtime = 'nodejs';

/** Ảnh admin tải lên khi chạy với database (xem `api/admin/upload`). */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (!usesDatabase()) return new Response('Không tìm thấy ảnh.', { status: 404 });

  const { path } = await params;
  const media = await getMedia(path.join('/'));
  if (!media) return new Response('Không tìm thấy ảnh.', { status: 404 });

  return new Response(new Uint8Array(media.data), {
    headers: {
      'Content-Type': media.contentType,
      // Tên tệp có dấu thời gian nên không bao giờ bị ghi đè.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
