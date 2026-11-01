import { NextResponse } from 'next/server';

import { AdminValidationError } from './store';

/** Admin chỉ phục vụ trên máy local; bản deploy không bao giờ mở route này. */
export function adminDisabled(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.ADMIN_LOCAL !== '1';
}

export function disabled(): NextResponse {
  return NextResponse.json(
    { error: 'Admin chỉ chạy trên máy local (ADMIN_LOCAL=1 để bật ngoài dev).' },
    { status: 404 },
  );
}

export function failure(error: unknown): NextResponse {
  if (error instanceof AdminValidationError) {
    return NextResponse.json({ error: error.message, issues: error.issues }, { status: 422 });
  }

  const message = error instanceof Error ? error.message : 'Lỗi không xác định.';
  return NextResponse.json({ error: message }, { status: 500 });
}
