'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, useContext, type ReactNode } from 'react';

import { bindPhrases } from '@/lib/vietnamese-text';

import type { PageCopy } from '@/lib/admin/pages';

const CopyContext = createContext<{ copy: PageCopy; pagePath: string } | null>(null);

export function PageCopyProvider({
  pagePath,
  copy,
  children,
}: {
  pagePath: string;
  copy: PageCopy;
  children: ReactNode;
}) {
  return <CopyContext.Provider value={{ copy, pagePath }}>{children}</CopyContext.Provider>;
}

interface PageTextProps {
  /** Khoá ổn định, ví dụ `home.hero.title`. */
  k: string;
  /** Chữ gốc khi chưa có ai sửa. */
  text: string;
}

/**
 * Một mẩu chữ của trang tĩnh. Ở chế độ soạn (`?edit=1`) nó thành ô sửa được và lưu
 * lại theo khoá; ngoài ra chỉ là chữ thường.
 */
export function PageText({ k, text }: PageTextProps) {
  const context = useContext(CopyContext);
  const pathname = usePathname() ?? '';
  const params = useSearchParams();
  const editing = params.get('edit') === '1';

  const value = context?.copy[k] ?? text;
  const pagePath = context?.pagePath ?? pathname;

  return (
    <span
      data-page-key={k}
      data-page-path={pagePath}
      contentEditable={editing || undefined}
      data-placeholder={editing ? 'Gõ chữ…' : undefined}
      onBlur={(event) => {
        if (!editing) return;
        const next = (event.currentTarget.innerText ?? '').replace(/\s+/g, ' ').trim();
        if (!next || next === value) return;

        void fetch('/api/admin/pages', {
          body: JSON.stringify({ key: k, path: pagePath, value: next }),
          headers: { 'content-type': 'application/json' },
          keepalive: true,
          method: 'PATCH',
        }).catch(() => undefined);
      }}
      role={editing ? 'textbox' : undefined}
      suppressContentEditableWarning
      tabIndex={editing ? 0 : undefined}
    >
      {bindPhrases(value)}
    </span>
  );
}
