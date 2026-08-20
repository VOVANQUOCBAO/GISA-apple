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
    expect(container).toHaveTextContent(record.title);
  });

  test('only claims the four assigned detail kinds', () => {
    expect(supportsEcosystemDetailTemplate(newsFixtures[0])).toBe(true);
    expect(supportsEcosystemDetailTemplate({ ...newsFixtures[0], kind: 'project' })).toBe(false);
  });

  test('keeps nested detail breadcrumbs concise without redundant section roots', () => {
    const { unmount } = render(<EcosystemDetailTemplate record={initiativeFixtures[0]} />);
    let breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn' });

    expect(within(breadcrumb).getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/');
    expect(within(breadcrumb).queryByRole('link', { name: 'Cộng đồng' })).not.toBeInTheDocument();
    expect(within(breadcrumb).queryByRole('link', { name: 'Kinh tế bền vững' })).not.toBeInTheDocument();

    unmount();
    render(<EcosystemDetailTemplate record={newsFixtures[0]} />);
    breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn' });
    expect(within(breadcrumb).queryByText('Tin tức')).not.toBeInTheDocument();
  });

  test('uses concise, evidence-limited copy for partner details', () => {
    render(<EcosystemDetailTemplate record={partnerFixtures[0]} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Phạm vi thông tin hiện có' }),
    ).toBeVisible();
    expect(
      screen.getByText(/Chưa có dữ liệu đã xác minh về dự án, vai trò hoặc giai đoạn hợp tác/i),
    ).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Mạng lưới' })).not.toBeInTheDocument();
  });

  test('uses consistent Vietnamese labels for archived notices', () => {
    render(<EcosystemDetailTemplate record={noticeFixtures[0]} />);
    const breadcrumb = screen.getByRole('navigation', { name: 'Đường dẫn' });

    expect(within(breadcrumb).getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/');
    expect(within(breadcrumb).queryByRole('link', { name: 'Tin tức' })).not.toBeInTheDocument();
    expect(within(breadcrumb).queryByRole('link', { name: 'Thông báo & lịch' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Tuyển dụng vị trí trợ lý nghiên cứu' }),
    ).toBeVisible();
  });
});
