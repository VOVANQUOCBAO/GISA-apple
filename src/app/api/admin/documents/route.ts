import { NextResponse } from 'next/server';

import { adminDisabled, disabled, failure } from '@/lib/admin/http';
import { createDocument, listDocuments } from '@/lib/admin/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (adminDisabled()) return disabled();

  try {
    return NextResponse.json({ documents: await listDocuments() });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  if (adminDisabled()) return disabled();

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
