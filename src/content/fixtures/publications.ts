import type { ContentRecord } from '../types';

export const publicationFixtures = [
  {
    id: 'publication-benchmarking-performance',
    kind: 'publication',
    collection: 'publications',
    slug: 'mo-hinh-chuan-doi-sanh-do-luong-hieu-suat',
    path:
      '/nghien-cuu/bai-bao-khoa-hoc/mo-hinh-chuan-doi-sanh-do-luong-hieu-suat',
    locale: 'vi',
    translationKey: 'publication-benchmarking-performance',
    title:
      'Nghiên cứu phát triển mô hình chuẩn đối sánh đo lường hiệu suất hoạt động',
    summary:
      'Bài nghiên cứu về mô hình chuẩn đối sánh trong trường hợp doanh nghiệp Việt Nam.',
    body: [
      {
        type: 'paragraph',
        text: 'Thông tin tóm tắt được dẫn về trang công khai của GISA để đối chiếu.',
      },
    ],
    tags: ['nghiên cứu', 'quản lý', 'chuẩn đối sánh'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/nghien-cuu-phat-trien-mo-hinh-chuan-doi-sanh-benchmarking-do-luong-hieu-suat-hoat-dong-phan-tich-truong-hop-cac-doanh-nghiep-viet-nam',
    sourceLabel: 'Website công khai GISA — bài nghiên cứu chuẩn đối sánh',
    checkedAt: '2026-07-18',
    metadata: { type: 'Bài nghiên cứu' },
  },
] satisfies ContentRecord[];
