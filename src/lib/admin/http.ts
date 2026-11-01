import { NextResponse } from 'next/server';

import { adminAvailable, currentAdmin, loginRequired } from './auth';
import { AdminValidationError } from './store';

/**
 * Đặt ở đầu mỗi API admin. Trả về response chặn (404 khi admin tắt, 401 khi
 * chưa đăng nhập), hoặc null nếu được đi tiếp.
 */
export async function guardApi(): Promise<NextResponse | null> {
  if (!adminAvailable()) {
    return NextResponse.json(
      { error: 'Admin chỉ chạy trên máy local (ADMIN_LOCAL=1 để bật ngoài dev).' },
      { status: 404 },
    );
  }

  if (loginRequired() && !(await currentAdmin())) {
    return NextResponse.json({ error: 'Phiên đăng nhập đã hết, hãy đăng nhập lại.' }, { status: 401 });
  }

  return null;
}

export function failure(error: unknown): NextResponse {
  if (error instanceof AdminValidationError) {
    return NextResponse.json({ error: error.message, issues: error.issues }, { status: 422 });
  }

  const message = error instanceof Error ? error.message : 'Lỗi không xác định.';
  return NextResponse.json({ error: message }, { status: 500 });
}
