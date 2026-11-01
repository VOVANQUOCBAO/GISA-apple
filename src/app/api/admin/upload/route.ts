import { promises as fs } from 'node:fs';
import path from 'node:path';

import { NextResponse } from 'next/server';

import { adminDisabled, disabled, failure } from '@/lib/admin/http';

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
 * Ảnh được ghi vào `public/media/uploads/...` để đường dẫn bắt đầu bằng `/media`,
 * đúng quy ước mà schema nội dung và `ContentBlocks` đang chấp nhận.
 */
export async function POST(request: Request) {
  if (adminDisabled()) return disabled();

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
    const relative = `/media/uploads/${month}/${name}`;
    const target = path.join(process.cwd(), 'public', 'media', 'uploads', month, name);

    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));

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
