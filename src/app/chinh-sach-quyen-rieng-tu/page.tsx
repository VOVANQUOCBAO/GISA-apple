import type { Metadata } from 'next';

import { buildMetadata } from '@/components/seo/build-metadata';
import { Breadcrumbs } from '@/components/site/breadcrumbs';

import styles from '../../components/forms/form.module.css';

export const metadata: Metadata = buildMetadata({
  description: 'Thông tin quyền riêng tư dành cho các biểu mẫu GISA.',
  path: '/chinh-sach-quyen-rieng-tu',
  title: 'Chính sách quyền riêng tư',
});

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <Breadcrumbs
        items={[
          { href: '/', label: 'Trang chủ' },
          { label: 'Chính sách quyền riêng tư' },
        ]}
      />
      <header className={styles.pageHeader}>
        <p>Thông báo prototype</p>
        <h1>Chính sách quyền riêng tư</h1>
      </header>
      <div>
        <p>
          Các biểu mẫu trong prototype này chỉ mô phỏng giao diện. Thông tin
          nhập vào không được gửi tới GISA và không được lưu trên hệ thống
          production.
        </p>
        <p>
          Chính sách quyền riêng tư chính thức, danh tính pháp nhân chịu trách
          nhiệm và thông tin liên hệ cần được GISA phê duyệt trước khi website
          tiếp nhận dữ liệu thực tế.
        </p>
      </div>
    </main>
  );
}
