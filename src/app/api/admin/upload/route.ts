import { promises as fs } from 'node:fs';
import path from 'node:path';

import { NextResponse } from 'next/server';

import { failure, guardApi } from '@/lib/admin/http';
import { putMedia, usesDatabase } from '@/lib/admin/kv';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
]);

/**
 * Đường dẫn ảnh luôn bắt đầu bằng `/media`, đúng quy ước mà schema nội dung và
 * `ContentBlocks` đang chấp nhận. Trên máy, ảnh ghi vào `public/media/uploads/`;
 * khi deploy với database, ảnh nằm trong bảng `admin_media` và được phục vụ ở
 * `/media/admin/...` (xem `src/app/media/admin`).
 */
export async function POST(request: Request) {
  const blocked = await guardApi();
  if (blocked) return blocked;

  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Không nhận được tệp.' }, { status: 400 });
    }

    const extension = ALLOWED.get(file.type);
    if (!extension) {
      return NextResponse.json(
        { error: 'Chỉ nhận ảnh JPG, PNG, WebP, AVIF hoặc GIF.' },
        { status: 415 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Ảnh vượt quá 8MB.' }, { status: 413 });
    }

    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const base = path
      .basename(file.name, path.extname(file.name))
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'anh';

    const name = `${Date.now().toString(36)}-${base}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    let relative: string;

    if (usesDatabase()) {
      await putMedia(`${month}/${name}`, file.type, bytes);
      relative = `/media/admin/${month}/${name}`;
    } else {
      const target = path.join(process.cwd(), 'public', 'media', 'uploads', month, name);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, bytes);
      relative = `/media/uploads/${month}/${name}`;
    }

    return NextResponse.json({
      src: relative,
      width: Number(form.get('width')) || 0,
      height: Number(form.get('height')) || 0,
      name: file.name,
    });
  } catch (error) {
    return failure(error);
  }
}
