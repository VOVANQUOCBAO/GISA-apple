import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { ContentBlock } from '@/content/types';

vi.mock('@/content/assets', () => ({
  resolvePublishableAsset: (assetId: string) =>
    assetId === '/images/duyet-roi.png'
      ? {
          publicPath: '/images/duyet-roi.png',
          sourcePath: 'GISA',
          sourceType: 'provided_by_gisa',
          rightsStatus: 'approved_for_web',
          alt: 'Học viên trao đổi trong lớp đào tạo GISA',
          reviewedAt: '2026-08-05',
          notes: 'Ảnh do GISA cung cấp, đã xác nhận quyền đăng.',
          width: 1600,
          height: 900,
        }
      : null,
}));

const { ContentBlocks } = await import('./content-blocks');

describe('ContentBlocks — khối ảnh', () => {
  test('gắn anchor ổn định cho từng hạng mục dưới tiêu đề gần nhất', () => {
    const blocks: ContentBlock[] = [
      { type: 'heading', level: 2, text: 'Phát triển bền vững' },
      { type: 'list', ordered: false, items: ['Đánh giá và giảm thiểu tác động môi trường'] },
    ];

    const { container } = render(<ContentBlocks blocks={blocks} />);

    expect(container.querySelector('h2')).toHaveAttribute('id', 'phat-trien-ben-vung');
    expect(container.querySelector('li')).toHaveAttribute(
      'id',
      'phat-trien-ben-vung-danh-gia-va-giam-thieu-tac-dong-moi-truong',
    );
  });

  test('dựng ảnh khi manifest đã xác nhận quyền đăng', () => {
    const blocks: ContentBlock[] = [
      { type: 'image', assetId: '/images/duyet-roi.png', caption: 'Lớp đào tạo tháng 5' },
    ];

    const { container } = render(<ContentBlocks blocks={blocks} />);

    const image = screen.getByRole('img', {
      name: 'Học viên trao đổi trong lớp đào tạo GISA',
    });
    expect(image).toBeVisible();
    // Chú thích của khối và mô tả thay thế của ảnh là hai thứ khác nhau: một cái
    // để đọc, một cái để trình đọc màn hình mô tả ảnh. Đọc thẳng `figcaption` vì
    // `bindPhrases` chẻ câu thành nhiều thẻ con để giữ cụm từ tiếng Việt không bị
    // ngắt dòng giữa chừng, nên tìm theo chuỗi liền sẽ không khớp.
    expect(container.querySelector('figcaption')?.textContent).toBe(
      'Lớp đào tạo tháng 5',
    );
  });

  test('chỉ hiện chú thích khi ảnh chưa được xác nhận quyền đăng', () => {
    const blocks: ContentBlock[] = [
      { type: 'image', assetId: '/images/chua-duyet.png', caption: 'Ảnh khảo sát thực địa' },
    ];

    render(<ContentBlocks blocks={blocks} />);

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('Ảnh khảo sát thực địa')).toBeVisible();
  });

  test('không dựng gì khi ảnh chưa duyệt và cũng không có chú thích', () => {
    const { container } = render(
      <ContentBlocks blocks={[{ type: 'image', assetId: '/images/chua-duyet.png' }]} />,
    );

    expect(container.querySelector('figure')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
  });
});
