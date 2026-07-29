import { Breadcrumbs } from '@/components/site/breadcrumbs';

import { GisaForm } from './gisa-form';
import type { FormKind } from './form-types';
import styles from './form.module.css';

const pageCopy: Record<FormKind, { description: string; title: string }> = {
  'tu-van': {
    title: 'Đăng ký tư vấn',
    description: 'Gửi thử yêu cầu tư vấn qua biểu mẫu mô phỏng của website.',
  },
  'khoa-hoc': {
    title: 'Đăng ký quan tâm khóa học',
    description: 'Ghi nhận thử nhu cầu tìm hiểu khóa học trong trình duyệt.',
  },
  'hop-tac': {
    title: 'Đề nghị hợp tác',
    description: 'Mô phỏng luồng tiếp nhận đề nghị hợp tác dành cho tổ chức.',
  },
  'lien-he': {
    title: 'Liên hệ',
    description: 'Mô phỏng biểu mẫu liên hệ chung, không gửi dữ liệu thực tế.',
  },
};

export function FormPage({
  courseSlug,
  kind,
}: {
  courseSlug?: string;
  kind: FormKind;
}) {
  const copy = pageCopy[kind];

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <Breadcrumbs
        items={[{ href: '/', label: 'Trang chủ' }, { label: copy.title }]}
      />
      <header className={styles.pageHeader}>
        <p>Biểu mẫu mô phỏng</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </header>
      <GisaForm courseSlug={courseSlug} kind={kind} />
    </main>
  );
}
