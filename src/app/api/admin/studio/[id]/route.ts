import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { adminDisabled, disabled, failure } from '@/lib/admin/http';
import {
  deleteStudioDraft,
  getStudioDraft,
  sanitizeStudioDoc,
  sanitizeSourcePath,
  StudioValidationError,
  updateStudioDraft,
} from '@/lib/admin/studio-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  if (adminDisabled()) return disabled();

  const { id } = await context.params;
  const draft = await getStudioDraft(id);
  if (!draft) return NextResponse.json({ error: 'Không tìm thấy bài.' }, { status: 404 });

  return NextResponse.json({ draft });
}

export async function PUT(request: Request, context: Context) {
  if (adminDisabled()) return disabled();

  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => null)) as {
      doc?: unknown;
      status?: unknown;
      sourcePath?: unknown;
      publish?: unknown;
    } | null;
    const doc = body?.doc === undefined ? undefined : sanitizeStudioDoc(body.doc);
    const status = body?.status === undefined ? undefined : body.status === 'published' ? 'published' : 'draft';
    const sourcePath = body?.sourcePath === undefined ? undefined : sanitizeSourcePath(body.sourcePath);
    const publish = body?.publish === true;

    const draft = await updateStudioDraft(id, { doc, status, publish, ...(sourcePath ? { sourcePath } : {}) });
    if (!draft) return NextResponse.json({ error: 'Không tìm thấy bài.' }, { status: 404 });

    if (draft.sourcePath) {
      revalidatePath(draft.sourcePath);
    }

    return NextResponse.json({ draft });
  } catch (error) {
    if (error instanceof StudioValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    return failure(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  if (adminDisabled()) return disabled();

  const { id } = await context.params;
  const draft = await getStudioDraft(id);
  const removed = await deleteStudioDraft(id);
  if (!removed) return NextResponse.json({ error: 'Không tìm thấy bài.' }, { status: 404 });

  if (draft?.sourcePath) {
    revalidatePath(draft.sourcePath);
  }

  return NextResponse.json({ ok: true });
}
