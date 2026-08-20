import type { Metadata } from 'next';

import { buildMetadata } from '@/components/seo/build-metadata';
import { Breadcrumbs } from '@/components/site/breadcrumbs';

import styles from '../../components/forms/form.module.css';

export const metadata: Metadata = buildMetadata({
  description: 'Chính sách mô tả cách GISA tiếp nhận và xử lý dữ liệu được gửi qua các biểu mẫu trên website.',
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
        <p>Minh bạch dữ liệu</p>
        <h1>Chính sách quyền riêng tư</h1>
      </header>
      <div aria-label="Cách GISA xử lý dữ liệu biểu mẫu">
        <p>
          Khi bạn chủ động gửi biểu mẫu, website chuyển thông tin tới kênh tiếp nhận
          được GISA cấu hình để phản hồi yêu cầu tư vấn, đăng ký, liên hệ hoặc hợp tác.
          Nếu kênh này chưa sẵn sàng, website sẽ báo lỗi và giữ dữ liệu trên biểu mẫu
          để bạn thử lại; website không hiển thị thông báo tiếp nhận giả.
        </p>

        <h2>Dữ liệu được tiếp nhận</h2>
        <p>
          Tùy loại biểu mẫu, bạn có thể nhập họ tên, email, số điện thoại, tổ chức,
          chức vụ, ngành nghề, nội dung trao đổi hoặc khóa học quan tâm. GISA chỉ dùng
          dữ liệu này để xử lý yêu cầu bạn đã gửi và liên hệ lại khi cần thiết.
        </p>

        <h2>Cách truyền và lưu trữ</h2>
        <p>
          Dữ liệu được truyền qua kết nối HTTPS tới kênh tiếp nhận do GISA lựa chọn.
          Website không lưu bản sao lâu dài trong mã nguồn hoặc trình duyệt. Thời gian
          lưu trữ và quyền truy cập tại kênh tiếp nhận được giới hạn theo nhu cầu xử lý
          yêu cầu và quy định áp dụng của GISA.
        </p>

        <h2>Quyền của bạn và kênh liên hệ</h2>
        <p>
          Bạn có thể đề nghị kiểm tra, cập nhật hoặc xóa thông tin đã gửi bằng cách
          liên hệ info@gisa.edu.vn hoặc 0818 711 799. GISA sẽ cập nhật chính sách này
          khi mục đích, đơn vị tiếp nhận hoặc thời gian lưu trữ thay đổi đáng kể.
        </p>
      </div>
    </main>
  );
}
