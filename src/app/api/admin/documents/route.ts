import { NextResponse } from 'next/server';

import { failure, guardApi } from '@/lib/admin/http';
import { createDocument, listDocuments } from '@/lib/admin/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const blocked = await guardApi();
  if (blocked) return blocked;

  try {
    return NextResponse.json({ documents: await listDocuments() });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  const blocked = await guardApi();
  if (blocked) return blocked;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      summary?: string;
    };

    const document = await createDocument({
      title: body.title ?? 'Bài viết mới',
      ...(body.summary ? { summary: body.summary } : {}),
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}
