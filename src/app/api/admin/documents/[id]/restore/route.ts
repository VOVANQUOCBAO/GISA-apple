import { NextResponse } from 'next/server';

import { adminDisabled, disabled, failure } from '@/lib/admin/http';
import { restoreVersion } from '@/lib/admin/store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (adminDisabled()) return disabled();

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { version?: string };
    if (!body.version) {
      return NextResponse.json({ error: 'Thiếu bản cần khôi phục.' }, { status: 400 });
    }

    return NextResponse.json(await restoreVersion(decodeURIComponent(id), body.version));
  } catch (error) {
    return failure(error);
  }
}
