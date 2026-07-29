import type { ContentRecord } from '../types';

export const newsFixtures = [
  {
    id: 'news-climate-development-finance',
    kind: 'news',
    collection: 'news',
    slug: 'tai-chinh-khi-hau-va-phat-trien',
    path: '/tin-tuc/tai-chinh-khi-hau-va-phat-trien',
    locale: 'vi',
    translationKey: 'news-climate-development-finance',
    title:
      'Tài chính khí hậu và phát triển: Không thể tách rời nếu muốn tương lai bền vững',
    summary:
      'Bài viết công khai của GISA về mối liên hệ giữa tài chính khí hậu và tài chính phát triển.',
    body: [
      {
        type: 'paragraph',
        text: 'Đọc nội dung và nguồn tham khảo trên trang bài viết công khai của GISA.',
      },
    ],
    publishedAt: '2025-06-21',
    tags: ['tin tức', 'khí hậu', 'phát triển bền vững'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://www.gisa.edu.vn/tai-chinh-khi-hau-va-phat-trien-khong-the-tach-roi-neu-muon-tuong-lai-ben-vung',
    sourceLabel: 'Website công khai GISA — bài tài chính khí hậu',
    checkedAt: '2026-07-18',
    metadata: { topic: 'Phát triển bền vững' },
  },
  {
    id: 'news-sea-soluble-plastic',
    kind: 'news',
    collection: 'news',
    slug: 'nhua-tan-trong-nuoc-bien',
    path: '/tin-tuc/nhua-tan-trong-nuoc-bien',
    locale: 'vi',
    translationKey: 'news-sea-soluble-plastic',
    title: 'Các nhà khoa học Nhật Bản sáng chế nhựa tan trong nước biển',
    summary:
      'Bài tin công khai trên GISA về một hướng nghiên cứu vật liệu liên quan đến ô nhiễm nhựa biển.',
    body: [
      {
        type: 'paragraph',
        text: 'Thông tin chi tiết cần được đọc cùng nguồn bài viết công khai.',
      },
    ],
    publishedAt: '2025-06-09',
    tags: ['tin tức', 'môi trường', 'nghiên cứu'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/tin-tuc',
    sourceLabel: 'Website công khai GISA — danh sách tin tức',
    checkedAt: '2026-07-18',
    metadata: { topic: 'Môi trường' },
  },
] satisfies ContentRecord[];
