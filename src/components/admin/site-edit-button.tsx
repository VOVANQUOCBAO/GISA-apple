'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Match {
  path: string;
  id: string | null;
  state: 'draft' | 'published';
  studioId?: string;
  studioStatus?: 'draft' | 'published';
}

/**
 * Nút “Sửa bài này” hiện trên chính website khi chạy local, để biên tập viên đi
 * tới đâu sửa tới đó thay vì phải mở một danh sách quản trị riêng.
 */
export function SiteEditButton() {
  const pathname = usePathname() ?? '';
  const params = useSearchParams();
  const [match, setMatch] = useState<Match | null>(null);

  const suppressed =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/xem-truoc') ||
    pathname.startsWith('/xem-bai');

  useEffect(() => {
    if (suppressed) return;

    let cancelled = false;

    fetch(`/api/admin/lookup?path=${encodeURIComponent(pathname)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then(
        (
          data:
            | {
                id?: string | null;
                state?: 'draft' | 'published';
                studioId?: string;
                studioStatus?: 'draft' | 'published';
              }
            | null,
        ) => {
          if (cancelled || (!data?.id && !data?.studioId)) return;
          setMatch({
            path: pathname,
            id: data.id ?? null,
            state: data.state ?? 'published',
            ...(data.studioId ? { studioId: data.studioId } : {}),
            ...(data.studioStatus ? { studioStatus: data.studioStatus } : {}),
          });
        },
      )
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [pathname, suppressed]);

  // Đường dẫn đã đổi thì nút cũ không còn đúng nữa, ẩn ngay trước khi có kết quả mới.
  if (suppressed) return null;

  const editing = params.get('edit') === '1';

  /* Trang chủ chưa có bài nào để sửa: cho sửa thẳng chữ trên trang. */
  if (pathname === '/') {
    return (
      <Link
        href={editing ? '/' : '/?edit=1'}
        style={{
          background: editing ? '#12785c' : '#fff',
          border: editing ? '0' : '1px solid #dfe6df',
          borderRadius: '999px',
          bottom: '22px',
          boxShadow: '0 10px 26px rgba(10, 40, 30, 0.18)',
          color: editing ? '#fff' : '#3f4f47',
          fontFamily: '"Source Sans 3", system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          padding: '10px 16px',
          position: 'fixed',
          right: '22px',
          textDecoration: 'none',
          zIndex: 800,
        }}
      >
        {editing ? '✓ Xong, thoát chế độ sửa' : '✎ Sửa trang chủ'}
      </Link>
    );
  }

  if (!match || match.path !== pathname) {
    return (
      <Link
        href="/admin"
        style={{
          background: '#fff',
          border: '1px solid #dfe6df',
          borderRadius: '999px',
          bottom: '22px',
          boxShadow: '0 10px 26px rgba(10, 40, 30, 0.14)',
          color: '#3f4f47',
          fontFamily: '"Source Sans 3", system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          padding: '10px 16px',
          position: 'fixed',
          right: '22px',
          textDecoration: 'none',
          zIndex: 800,
        }}
      >
        + Viết bài mới
      </Link>
    );
  }

  return (
    <div
      style={{
        bottom: '22px',
        display: 'flex',
        gap: '8px',
        position: 'fixed',
        right: '22px',
        zIndex: 800,
      }}
    >
      <Link
        href="/admin"
        style={{
          alignItems: 'center',
          background: '#fff',
          border: '1px solid #dfe6df',
          borderRadius: '999px',
          boxShadow: '0 10px 26px rgba(10, 40, 30, 0.14)',
          color: '#3f4f47',
          display: 'inline-flex',
          fontFamily: '"Source Sans 3", system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          padding: '11px 16px',
          textDecoration: 'none',
        }}
      >
        + Bài mới
      </Link>
      <Link
        href={
          match.studioId
            ? `/admin/studio/${encodeURIComponent(match.studioId)}`
            : `/xem-truoc/${encodeURIComponent(match.id ?? '')}`
        }
        style={{
          alignItems: 'center',
          background: '#12785c',
          borderRadius: '999px',
          boxShadow: '0 14px 32px rgba(10, 40, 30, 0.28)',
          color: '#fff',
          display: 'inline-flex',
          fontFamily: '"Source Sans 3", system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          gap: '8px',
          padding: '11px 18px',
          textDecoration: 'none',
        }}
      >
        <span aria-hidden="true">✎</span>
        {match.studioId ? 'Sửa bản dựng' : 'Sửa bài này'}
        {match.studioId ? (
          <span
            style={{
              background: 'rgba(255,255,255,0.22)',
              borderRadius: '999px',
              fontSize: '11px',
              padding: '2px 7px',
            }}
          >
            {match.studioStatus === 'published' ? 'đang hiển thị' : 'bản nháp'}
          </span>
        ) : match.state === 'draft' ? (
          <span
            style={{
              background: 'rgba(255,255,255,0.22)',
              borderRadius: '999px',
              fontSize: '11px',
              padding: '2px 7px',
            }}
          >
            có bản nháp
          </span>
        ) : null}
      </Link>
    </div>
  );
}
