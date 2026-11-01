'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from '@/app/admin/admin.module.css';

/**
 * Tạo một tin tức nháp rồi mở thẳng trình soạn thảo trên trang thật
 * (`/xem-truoc/...`), nơi có bảng Kiểm tra SEO trước khi đăng.
 */
export function NewArticleButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const create = async () => {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Bài viết mới' }),
      });
      if (!response.ok) throw new Error('create-failed');

      const created = (await response.json()) as { summary?: { id?: string } };
      if (!created.summary?.id) throw new Error('create-failed');
      router.push(`/xem-truoc/${encodeURIComponent(created.summary.id)}`);
    } catch {
      window.alert('Không tạo được tin tức mới. Kiểm tra lại máy chủ.');
      setBusy(false);
    }
  };

  return (
    <button
      className={styles.primaryAction}
      disabled={busy}
      onClick={() => void create()}
      type="button"
    >
      {busy ? 'Đang tạo…' : '+ Tạo tin tức mới'}
    </button>
  );
}
