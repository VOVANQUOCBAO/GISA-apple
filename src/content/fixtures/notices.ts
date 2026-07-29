import type { ContentRecord } from '../types';

export const noticeFixtures = [
  {
    id: 'notice-research-assistant-recruitment-2024',
    kind: 'notice',
    collection: 'notices',
    slug: 'tuyen-dung-vi-tri-tro-ly-nghien-cuu',
    path: '/tin-tuc/thong-bao-lich/tuyen-dung-vi-tri-tro-ly-nghien-cuu',
    locale: 'vi',
    translationKey: 'notice-research-assistant-recruitment-2024',
    title: 'Tuyển Dụng Vị Trí Trợ Lý Nghiên Cứu',
    summary:
      'Thông báo được GISA công khai ngày 08/05/2024; fixture chỉ chứng minh template và không xác nhận đợt tuyển dụng còn hiệu lực.',
    body: [
      {
        type: 'paragraph',
        text: 'Nội dung chi tiết và trạng thái hiện hành cần được đối chiếu trực tiếp với nguồn GISA.',
      },
    ],
    publishedAt: '2024-05-08',
    tags: ['thông báo', 'tuyển dụng lưu trữ'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/tuyen-dung-vi-tri-tro-ly-nghien-cuu',
    sourceLabel: 'Website công khai GISA — thông báo tuyển dụng trợ lý nghiên cứu',
    checkedAt: '2026-07-18',
    metadata: { status: 'Không xác nhận còn hiệu lực' },
  },
] satisfies ContentRecord[];
