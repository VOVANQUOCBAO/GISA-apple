import { NextResponse } from 'next/server';

import { failure, guardApi } from '@/lib/admin/http';
import { listVersions } from '@/lib/admin/store';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const blocked = await guardApi();
  if (blocked) return blocked;

  try {
    const { id } = await context.params;
    return NextResponse.json({ versions: await listVersions(decodeURIComponent(id)) });
  } catch (error) {
    return failure(error);
  }
}
