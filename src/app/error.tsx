'use client';

import { bindPhrases } from '@/lib/vietnamese-text';


export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container" id="main-content" tabIndex={-1}>
      <div role="alert">
        <h1>{bindPhrases("Không thể tải nội dung")}</h1>
        <p>{bindPhrases("Nguồn nội dung gặp lỗi tạm thời. Bạn có thể thử lại.")}</p>
      </div>
      <button onClick={reset} type="button">{bindPhrases(" Thử lại ")}</button>
    </main>
  );
}
