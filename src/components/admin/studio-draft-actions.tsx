'use client';

import { Trash } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from '@/app/admin/admin.module.css';

export function StudioDraftActions({
  id,
  title,
  sourcePath,
  status,
}: {
  id: string;
  title: string;
  sourcePath?: string;
  status: 'draft' | 'published';
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    const message =
      sourcePath && status === 'published'
        ? `Xoá bản dựng “${title}”?\n\nTrang ${sourcePath} sẽ trở về giao diện gốc.`
        : `Xoá bản dựng “${title}”?\n\nThao tác này không hoàn tác được.`;
    if (!window.confirm(message)) return;

    setBusy(true);
    try {
      const response = await fetch(`/api/admin/studio/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('delete-failed');
      router.refresh();
    } catch {
      window.alert('Không xoá được bản dựng. Kiểm tra lại máy chủ.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      aria-label={`Xoá bản dựng ${title}`}
      className={styles.deleteDraft}
      disabled={busy}
      onClick={() => void remove()}
      title="Xoá bản dựng"
      type="button"
    >
      <Trash aria-hidden size={15} />
    </button>
  );
}
