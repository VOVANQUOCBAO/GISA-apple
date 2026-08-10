import Link from 'next/link';

import styles from './not-found.module.css';

const recoveryLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/tim-kiem', label: 'Tìm kiếm' },
  { href: '/nghien-cuu', label: 'Nghiên cứu' },
  { href: '/tu-van', label: 'Tư vấn' },
  { href: '/dao-tao', label: 'Đào tạo' },
  { href: '/ung-dung', label: 'Ứng dụng' },
];

export default function NotFoundPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <section className={styles.stage} aria-labelledby="not-found-title">
        <p aria-hidden="true" className={styles.code}>404</p>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Đường dẫn không khả dụng</p>
          <h1 id="not-found-title">Không tìm thấy trang</h1>
          <p className={styles.lede}>
            Đường dẫn có thể đã thay đổi hoặc nội dung hiện không còn khả dụng.
            Bạn có thể tiếp tục từ một trong các khu vực chính dưới đây.
          </p>
          <nav aria-label="Các đường dẫn thay thế">
            <ul className={styles.links}>
              {recoveryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
