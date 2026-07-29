import type { ContentRecord } from '../types';

export const expertFixtures = [
  {
    id: 'expert-nguyen-minh-khoi',
    kind: 'expert',
    collection: 'experts',
    slug: 'nguyen-minh-khoi',
    path: '/chuyen-gia/nguyen-minh-khoi',
    locale: 'vi',
    translationKey: 'expert-nguyen-minh-khoi',
    title: 'Nguyễn Minh Khôi',
    summary:
      'Hồ sơ tối giản dựa trên tên được nêu trong một bài nghiên cứu công khai của GISA.',
    body: [
      {
        type: 'paragraph',
        text: 'Chức danh, chuyên môn và tiểu sử cần được xác minh riêng trước khi bổ sung.',
      },
    ],
    tags: ['nghiên cứu'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/nang-cao-trai-nghiem-khach-hang-voi-chatbot-van-hanh-boi-tri-tue-nhan-tao-ai-vai-tro-cua-chat-luong-dich-vu-tri-tue-cam-xuc-va-su-ca-nhan-hoa-cua-thuat-toan',
    sourceLabel: 'Website công khai GISA — bài nghiên cứu về chatbot AI',
    checkedAt: '2026-07-18',
    metadata: {},
  },
] satisfies ContentRecord[];
