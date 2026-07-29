import type { ContentRecord } from '../types';

export const projectFixtures = [
  {
    id: 'project-trade4sd',
    kind: 'project',
    collection: 'projects',
    slug: 'trade4sd',
    path: '/nghien-cuu/du-an/trade4sd',
    locale: 'vi',
    translationKey: 'project-trade4sd',
    title: 'TRADE4SD',
    summary:
      'Dữ liệu mô tả dự án đang được đối chiếu với nguồn công khai của GISA.',
    body: [
      {
        type: 'paragraph',
        text: 'Nội dung chi tiết chỉ hiển thị sau khi phần mô tả được xác minh.',
      },
    ],
    tags: ['nghiên cứu', 'phát triển bền vững'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://www.gisa.edu.vn/du-an-nghien-cuu',
    sourceLabel: 'Website công khai GISA — mục dự án TRADE4SD',
    checkedAt: '2026-07-18',
    metadata: { topic: 'Phát triển bền vững' },
  },
] satisfies ContentRecord[];
