import type { Metadata } from 'next';

import { buildMetadata } from '@/components/seo/build-metadata';
import { Breadcrumbs } from '@/components/site/breadcrumbs';

import styles from '../../components/forms/form.module.css';

export const metadata: Metadata = buildMetadata({
  description: 'Chính sách mô tả cách các biểu mẫu GISA xử lý dữ liệu ngay trong trình duyệt ở giai đoạn hiện tại.',
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
        <p>Phạm vi hiện tại</p>
        <h1>Chính sách quyền riêng tư</h1>
      </header>
      <div aria-label="Cách biểu mẫu xử lý dữ liệu hiện tại">
        <p>
          Trang này mô tả đúng phạm vi xử lý dữ liệu của các biểu mẫu đang có trên
          website GISA. Các biểu mẫu hiện chỉ kiểm tra thông tin ngay trong trình
          duyệt; dữ liệu không được gửi tới GISA và không được lưu trên máy chủ của GISA.
        </p>

        <h2>Dữ liệu xuất hiện trong biểu mẫu</h2>
        <p>
          Tùy loại biểu mẫu, bạn có thể nhập họ tên, email, số điện thoại, tổ chức,
          nội dung trao đổi hoặc khóa học quan tâm. Những thông tin này chỉ được dùng
          để kiểm tra trường bắt buộc và định dạng trong phiên trình duyệt hiện tại.
        </p>

        <h2>Không có thao tác gửi trực tuyến</h2>
        <p>
          Nút kiểm tra thông tin không gửi yêu cầu qua mạng và không tạo hồ sơ tiếp
          nhận tại GISA. Bạn có thể rời trang mà không thực hiện bước kiểm tra.
        </p>

        <h2>Khi phạm vi xử lý thay đổi</h2>
        <p>
          Nếu website bắt đầu tiếp nhận dữ liệu trực tuyến, chính sách này cần được
          cập nhật trước khi thu thập để nêu rõ đơn vị chịu trách nhiệm, mục đích xử
          lý, thời gian lưu trữ và kênh liên hệ liên quan.
        </p>
      </div>
    </main>
  );
}
