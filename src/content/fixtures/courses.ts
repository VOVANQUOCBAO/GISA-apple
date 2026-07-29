import type { ContentRecord } from '../types';

export const courseFixtures = [
  {
    id: 'course-practical-accounting-tax',
    kind: 'course',
    collection: 'courses',
    slug: 'ke-toan-thuc-hanh-va-toi-uu-hoa-thue',
    path: '/khoa-hoc/ke-toan-thuc-hanh-va-toi-uu-hoa-thue',
    locale: 'vi',
    translationKey: 'course-practical-accounting-tax',
    title: 'Kế toán thực hành và tối ưu hóa thuế',
    summary:
      'Khóa học tiêu biểu được giới thiệu trên trang công khai của GISA; fixture không công bố học phí.',
    body: [
      {
        type: 'paragraph',
        text: 'Lịch học, giảng viên và học phí chỉ hiển thị khi có nguồn được xác minh riêng.',
      },
    ],
    tags: ['đào tạo', 'kế toán'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/',
    sourceLabel: 'Website công khai GISA — các khóa học tiêu biểu',
    checkedAt: '2026-07-18',
    metadata: { format: 'Chờ xác minh' },
  },
] satisfies ContentRecord[];
