import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { initiativeFixtures } from '@/content/fixtures/initiatives';
import { newsFixtures } from '@/content/fixtures/news';
import { noticeFixtures } from '@/content/fixtures/notices';
import { partnerFixtures } from '@/content/fixtures/partners';

import {
  EcosystemDetailTemplate,
  supportsEcosystemDetailTemplate,
} from './ecosystem-detail-template';

const records = [
  initiativeFixtures[0],
  newsFixtures[0],
  noticeFixtures[0],
  partnerFixtures[0],
];

describe('EcosystemDetailTemplate', () => {
  test.each(records)('renders verified content for $kind', (record) => {
    const { container } = render(<EcosystemDetailTemplate record={record} />);

    expect(screen.getByRole('heading', { level: 1, name: record.title })).toBeInTheDocument();
    expect(container.querySelector('br')).toBeNull();
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  test('only claims the four assigned detail kinds', () => {
    expect(supportsEcosystemDetailTemplate(newsFixtures[0])).toBe(true);
    expect(supportsEcosystemDetailTemplate({ ...newsFixtures[0], kind: 'project' })).toBe(false);
  });

  test('keeps the section root in nested detail breadcrumbs without duplicating it', () => {
    const { unmount } = render(<EcosystemDetailTemplate record={initiativeFixtures[0]} />);
    let breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn' });

    expect(within(breadcrumb).getByRole('link', { name: 'Cộng đồng' })).toHaveAttribute(
      'href',
      '/cong-dong',
    );
    expect(within(breadcrumb).getByRole('link', { name: 'Kinh tế bền vững' })).toHaveAttribute(
      'href',
      '/cong-dong/kinh-te-ben-vung',
    );

    unmount();
    render(<EcosystemDetailTemplate record={newsFixtures[0]} />);
    breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn' });
    expect(within(breadcrumb).getAllByText('Tin tức')).toHaveLength(1);
  });

  test('uses concise, evidence-limited copy for partner details', () => {
    render(<EcosystemDetailTemplate record={partnerFixtures[0]} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Phạm vi thông tin hiện có' }),
    ).toBeVisible();
    expect(
      screen.getByText(/Chưa có dữ liệu đã xác minh về dự án, vai trò hoặc giai đoạn hợp tác/i),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Mạng lưới' })).toHaveAttribute(
      'href',
      '/mang-luoi',
    );
  });

  test('uses consistent Vietnamese labels for archived notices', () => {
    render(<EcosystemDetailTemplate record={noticeFixtures[0]} />);
    const breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn' });

    expect(within(breadcrumb).getByRole('link', { name: 'Tin tức' })).toHaveAttribute(
      'href',
      '/tin-tuc',
    );
    expect(within(breadcrumb).getByRole('link', { name: 'Thông báo & lịch' })).toHaveAttribute(
      'href',
      '/tin-tuc/thong-bao-lich',
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Tuyển dụng vị trí trợ lý nghiên cứu' }),
    ).toBeVisible();
  });
});
