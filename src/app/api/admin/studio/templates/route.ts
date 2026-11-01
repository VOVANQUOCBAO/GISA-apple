import { NextResponse } from 'next/server';

import { adminDisabled, disabled, failure } from '@/lib/admin/http';
import { getPageTemplate, listPageTemplates } from '@/lib/admin/page-templates';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (adminDisabled()) return disabled();

  try {
    const id = new URL(request.url).searchParams.get('id');

    if (id) {
      const template = await getPageTemplate(id);
      if (!template) return NextResponse.json({ error: 'Không tìm thấy trang.' }, { status: 404 });
      return NextResponse.json({ template });
    }

    return NextResponse.json({ templates: await listPageTemplates() });
  } catch (error) {
    return failure(error);
  }
}
