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
      'Trước thềm Hội nghị Liên Hợp Quốc lần thứ tư về Tài trợ Phát triển, Germanwatch cảnh báo việc tách biệt tài chính khí hậu và tài chính phát triển đang làm suy yếu nỗ lực toàn cầu.',
    body: [
      {
        type: 'paragraph',
        text: 'Seville, Tây Ban Nha — Trước thềm Hội nghị Liên Hợp Quốc lần thứ tư về Tài trợ Phát triển (FfD4), tổ chức Germanwatch đã đưa ra một cảnh báo quan trọng: việc tách biệt giữa tài chính khí hậu và tài chính phát triển đang làm suy yếu những nỗ lực toàn cầu nhằm đạt được phát triển bền vững.',
      },
      {
        type: 'paragraph',
        text: 'Nội dung này được GISA đăng lại trong mục tin tức như một tham chiếu cho chủ đề tài chính bền vững; toàn văn và các dẫn chứng gốc nằm ở trang bài viết công khai bên dưới.',
      },
    ],
    publishedAt: '2025-06-21',
    tags: ['tin tức', 'khí hậu', 'tài chính bền vững', 'phát triển bền vững'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://www.gisa.edu.vn/tai-chinh-khi-hau-va-phat-trien-khong-the-tach-roi-neu-muon-tuong-lai-ben-vung',
    sourceLabel: 'Website công khai GISA — bài tài chính khí hậu',
    checkedAt: '2026-08-05',
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
