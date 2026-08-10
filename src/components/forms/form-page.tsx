import { Breadcrumbs, type BreadcrumbItem } from '@/components/site/breadcrumbs';
import { NAVIGATION } from '@/content/navigation';

import { GisaForm } from './gisa-form';
import type { FormKind } from './form-types';
import styles from './form.module.css';

interface FormPageCopy {
  description: string;
  eyebrow: string;
  expectationTitle: string;
  expectations: readonly string[];
  formDescription: string;
  formTitle: string;
  title: string;
}

const pageCopy: Record<FormKind, FormPageCopy> = {
  'tu-van': {
    eyebrow: 'Trao đổi chuyên môn',
    title: 'Bắt đầu từ nhu cầu của bạn',
    description:
      'Chuẩn bị bối cảnh, vấn đề cần giải quyết và kết quả bạn đang hướng tới. Cách trình bày rõ ràng ngay từ đầu sẽ giúp yêu cầu tư vấn tập trung hơn vào nhu cầu thực tế.',
    expectationTitle: 'Để GISA hiểu đúng yêu cầu tư vấn',
    expectations: [
      'Nêu bối cảnh và vấn đề bạn đang gặp.',
      'Mô tả mục tiêu hoặc kết quả mong muốn.',
      'Cho biết phạm vi công việc cần được trao đổi.',
    ],
    formTitle: 'Thông tin yêu cầu tư vấn',
    formDescription:
      'Điền các trường bên dưới và trình bày yêu cầu bằng ngôn ngữ cụ thể, dễ hiểu.',
  },
  'khoa-hoc': {
    eyebrow: 'Học tập và phát triển',
    title: 'Tìm khóa học phù hợp với mục tiêu của bạn',
    description:
      'Chuẩn bị thông tin về năng lực bạn muốn phát triển và khóa học đang quan tâm. Bối cảnh học tập cụ thể giúp bạn xác định nhu cầu đầy đủ hơn.',
    expectationTitle: 'Thông tin hữu ích cho việc tìm hiểu khóa học',
    expectations: [
      'Nêu khóa học hoặc chủ đề bạn quan tâm.',
      'Chia sẻ mục tiêu học tập và kiến thức hiện có.',
      'Mô tả điều bạn muốn ứng dụng sau khóa học.',
    ],
    formTitle: 'Thông tin quan tâm khóa học',
    formDescription:
      'Điền thông tin cơ bản và mô tả mục tiêu học tập của bạn trong phần nội dung.',
  },
  'hop-tac': {
    eyebrow: 'Kết nối cùng GISA',
    title: 'Cùng định hình một cơ hội hợp tác có giá trị',
    description:
      'Phác thảo tổ chức, định hướng hợp tác và giá trị hai bên có thể cùng tạo ra. Một đề xuất có bối cảnh rõ ràng là nền tảng cho cuộc trao đổi chuyên môn hiệu quả.',
    expectationTitle: 'Một đề xuất hợp tác nên làm rõ',
    expectations: [
      'Vai trò và lĩnh vực hoạt động của tổ chức.',
      'Mục tiêu cùng hướng tới trong hợp tác.',
      'Phạm vi hoặc ý tưởng bạn muốn trao đổi với GISA.',
    ],
    formTitle: 'Thông tin đề nghị hợp tác',
    formDescription:
      'Cung cấp thông tin về tổ chức và trình bày ngắn gọn định hướng hợp tác đề xuất.',
  },
  'lien-he': {
    eyebrow: 'Kết nối với GISA',
    title: 'Một cuộc trao đổi rõ ràng bắt đầu từ đây',
    description:
      'Chuẩn bị câu hỏi chung hoặc đề xuất chưa thuộc các nhóm tư vấn, khóa học và hợp tác. Hãy nêu chủ đề chính để nội dung sẵn sàng cho bước liên hệ tiếp theo.',
    expectationTitle: 'Giúp nội dung liên hệ rõ ràng hơn',
    expectations: [
      'Nêu chủ đề bạn muốn trao đổi.',
      'Cung cấp bối cảnh cần thiết cho câu hỏi.',
      'Cho biết điều bạn mong muốn làm rõ trong bước tiếp theo.',
    ],
    formTitle: 'Nội dung liên hệ',
    formDescription:
      'Điền thông tin liên hệ và trình bày câu hỏi hoặc đề xuất để kiểm tra ngay trong trình duyệt.',
  },
};

function pathForForm(kind: FormKind) {
  return kind === 'lien-he' ? '/lien-he' : `/dang-ky/${kind}`;
}

export function breadcrumbItemsForForm(kind: FormKind): BreadcrumbItem[] {
  const path = pathForForm(kind);
  const copy = pageCopy[kind];
  const parent = NAVIGATION.find(
    (group) => group.href === path || group.children.some((item) => item.href === path),
  );

  return [
    { href: '/', label: 'Trang chủ' },
    ...(parent && parent.href !== path
      ? [{ href: parent.href, label: parent.label }]
      : []),
    { label: copy.formTitle },
  ];
}

export function FormPage({
  courseSlug,
  kind,
}: {
  courseSlug?: string;
  kind: FormKind;
}) {
  const copy = pageCopy[kind];
  const expectationsId = `${kind}-expectations-title`;
  const titleId = `${kind}-page-title`;

  return (
    <main className={styles.page} data-intent={kind} id="main-content" tabIndex={-1}>
      <Breadcrumbs
        items={breadcrumbItemsForForm(kind)}
      />

      <section className={styles.stage} aria-labelledby={titleId}>
        <div className={styles.introduction}>
          <header className={styles.pageHeader}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 id={titleId}>{copy.title}</h1>
            <p className={styles.lede}>{copy.description}</p>
          </header>

          <aside
            aria-labelledby={expectationsId}
            className={styles.expectations}
          >
            <p className={styles.expectationTitle} id={expectationsId}>
              {copy.expectationTitle}
            </p>
            <ol>
              {copy.expectations.map((expectation) => (
                <li key={expectation}>{expectation}</li>
              ))}
            </ol>
          </aside>
        </div>

        <div className={styles.formStage}>
          <header className={styles.formHeader}>
            <p>Thông tin cần thiết</p>
            <h2>{copy.formTitle}</h2>
            <p>{copy.formDescription}</p>
          </header>
          <GisaForm courseSlug={courseSlug} kind={kind} />
        </div>
      </section>
    </main>
  );
}
