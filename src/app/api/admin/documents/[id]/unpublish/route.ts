import { NextResponse } from 'next/server';

import { adminDisabled, disabled, failure } from '@/lib/admin/http';
import { unpublishDocument } from '@/lib/admin/store';

export const dynamic = 'force-dynamic';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (adminDisabled()) return disabled();

  try {
    const { id } = await context.params;
    return NextResponse.json(await unpublishDocument(decodeURIComponent(id)));
  } catch (error) {
    return failure(error);
  }
}
