import Link from 'next/link';

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
    <main className="container" id="main-content" tabIndex={-1}>
      <h1>Không tìm thấy trang</h1>
      <p>Đường dẫn này không có trong sitemap GISA hoặc nội dung chưa được phép công bố.</p>
      <ul>
        {recoveryLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
