import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { failure, guardApi } from '@/lib/admin/http';
import {
  createStudioDraft,
  listStudioDrafts,
  sanitizeStudioDoc,
  sanitizeSourcePath,
  StudioValidationError,
} from '@/lib/admin/studio-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const blocked = await guardApi();
  if (blocked) return blocked;

  try {
    return NextResponse.json({ drafts: await listStudioDrafts() });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  const blocked = await guardApi();
  if (blocked) return blocked;

  try {
    const body = (await request.json().catch(() => null)) as {
      doc?: unknown;
      status?: unknown;
      sourcePath?: unknown;
    } | null;
    const doc = sanitizeStudioDoc(body?.doc);
    const sourcePath = sanitizeSourcePath(body?.sourcePath);
    const draft = await createStudioDraft({
      doc,
      status: body?.status === 'published' ? 'published' : 'draft',
      ...(sourcePath ? { sourcePath } : {}),
    });

    if (draft.status === 'published' && draft.sourcePath) {
      revalidatePath(draft.sourcePath);
    }

    return NextResponse.json({ draft }, { status: 201 });
  } catch (error) {
    if (error instanceof StudioValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    return failure(error);
  }
}
