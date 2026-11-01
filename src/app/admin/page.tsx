import type { Metadata } from 'next';
import Link from 'next/link';

import { StudioDraftActions } from '@/components/admin/studio-draft-actions';
import { loginRequired, requireAdminPage } from '@/lib/admin/auth';
import { listStudioDrafts } from '@/lib/admin/studio-store';
import { listDocuments } from '@/lib/admin/store';

import styles from './admin.module.css';
import { logout } from './dang-nhap/actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Quản trị nội dung',
};

const KIND_LABEL: Record<string, string> = {
  news: 'Tin tức',
  notice: 'Thông báo',
  initiative: 'Sáng kiến',
  project: 'Dự án',
  publication: 'Ấn phẩm',
  tool: 'Công cụ',
  course: 'Khóa học',
  expert: 'Chuyên gia',
  partner: 'Đối tác',
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('vi-VN');
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
  });
}

/**
 * Cửa vào của phần quản trị: tạo bài mới trong studio tự do, hoặc mở lại bài
 * đang có. Việc viết và sửa diễn ra trên chính trang thật ở `/xem-truoc/...`.
 */
export default async function AdminPage() {
  await requireAdminPage('/admin');

  const [documents, studioDrafts] = await Promise.all([listDocuments(), listStudioDrafts()]);

  const groups = new Map<string, typeof documents>();
  for (const document of documents) {
    const list = groups.get(document.kind) ?? [];
    list.push(document);
    groups.set(document.kind, list);
  }

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <h1>Quản trị nội dung</h1>
        <p>
          Tạo bài mới trên một trang trắng rộng 1200px, kéo khối từ thanh công cụ vào bất kỳ đâu.
          Hoặc mở một bài có sẵn để sửa trực tiếp trên trang thật.
        </p>
      </header>

      <div className={styles.actions}>
        <Link className={styles.primaryAction} href="/admin/studio">
          + Tạo bài mới
        </Link>
        <span className={styles.actionsNote}>Trang trắng · kéo thả tự do · tự động lưu</span>
        {loginRequired() ? (
          <form action={logout} className={styles.logout}>
            <button type="submit">Đăng xuất</button>
          </form>
        ) : null}
      </div>

      {studioDrafts.length ? (
        <section className={styles.group}>
          <h2>
            Bài dựng tự do <span>{studioDrafts.length}</span>
          </h2>
          <ul className={styles.list}>
            {studioDrafts.map((draft) => (
              <li className={styles.draftRow} key={draft.id}>
                <Link className={styles.draftLink} href={`/admin/studio/${draft.id}`}>
                  <span className={styles.title}>{draft.title || 'Bài viết mới'}</span>
                  <span className={styles.meta}>
                    <span className={styles.state} data-state={draft.live ? 'live' : draft.status}>
                      {draft.live
                        ? 'Đang hiển thị'
                        : draft.status === 'draft'
                          ? 'Nháp'
                          : draft.sourcePath
                            ? 'Bị thay thế'
                            : 'Đã đăng'}
                    </span>
                    {draft.sourcePath ? (
                      <span className={styles.sourcePath} title={draft.sourcePath}>
                        {draft.sourcePath}
                      </span>
                    ) : null}
                    <span>{draft.elementCount} khối</span>
                    <span>{formatDateTime(draft.updatedAt)}</span>
                  </span>
                </Link>
                <StudioDraftActions
                  id={draft.id}
                  sourcePath={draft.sourcePath}
                  status={draft.status}
                  title={draft.title || 'Bài viết mới'}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {[...groups.entries()].map(([kind, items]) => (
        <section className={styles.group} key={kind}>
          <h2>
            {KIND_LABEL[kind] ?? kind} <span>{items.length}</span>
          </h2>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <Link href={`/xem-truoc/${encodeURIComponent(item.id)}`}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.meta}>
                    <span className={styles.state} data-state={item.state}>
                      {item.state === 'draft' ? 'Nháp' : 'Đã đăng'}
                    </span>
                    {formatDate(item.updatedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className={styles.note}>
        Bản chạy thử trên máy. Dữ liệu nằm trong <code>content-data/admin</code>, xoá thư mục
        đó là trở về ban đầu.
      </p>
    </main>
  );
}
