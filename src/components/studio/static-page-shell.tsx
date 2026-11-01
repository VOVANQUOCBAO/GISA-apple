import { StaticPage } from './static-page';
import styles from './static-page-shell.module.css';
import type { StudioDoc } from './types';

/**
 * Khung hiển thị một trang dựng tự do trong website thật: giữ nguyên header,
 * footer và chiều rộng tối đa, chỉ thay phần nội dung bằng trang 1200px.
 */
export function StaticPageShell({ doc }: { doc: StudioDoc }) {
  return (
    <main className={styles.page} id="main-content">
      <h1 className={styles.srOnly}>{doc.title}</h1>
      <div className={styles.frame}>
        <StaticPage doc={doc} />
      </div>
    </main>
  );
}
