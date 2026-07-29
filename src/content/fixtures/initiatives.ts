import type { ContentRecord } from '../types';

export const initiativeFixtures = [
  {
    id: 'initiative-sustainable-economy',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'kinh-te-ben-vung',
    path: '/cong-dong/sang-kien-kinh-te-ben-vung',
    locale: 'vi',
    translationKey: 'initiative-sustainable-economy',
    title: 'Kinh tế bền vững',
    summary:
      'Nhánh nội dung công khai của GISA về kinh tế bền vững và các sáng kiến liên quan.',
    body: [
      {
        type: 'paragraph',
        text: 'Các kết quả và tác động chỉ được bổ sung khi có bằng chứng xác minh trực tiếp.',
      },
    ],
    tags: ['cộng đồng', 'kinh tế bền vững'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/kinh-te-ben-vung',
    sourceLabel: 'Website công khai GISA — Kinh tế bền vững',
    checkedAt: '2026-07-18',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
] satisfies ContentRecord[];
