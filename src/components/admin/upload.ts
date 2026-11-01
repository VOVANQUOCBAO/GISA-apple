'use client';

/** Gửi ảnh lên kho local, trả về đường dẫn `/media/...` mà schema chấp nhận. */
export async function uploadImage(
  file: File,
): Promise<{ src: string; width: number; height: number }> {
  const form = new FormData();
  form.set('file', file);

  try {
    const bitmap = await createImageBitmap(file);
    form.set('width', String(bitmap.width));
    form.set('height', String(bitmap.height));
    bitmap.close();
  } catch {
    /* Không đọc được kích thước thì để máy chủ dùng mặc định. */
  }

  const response = await fetch('/api/admin/upload', { method: 'POST', body: form });
  if (!response.ok) throw new Error('Không tải được ảnh.');

  return (await response.json()) as { src: string; width: number; height: number };
}
