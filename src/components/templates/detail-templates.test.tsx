import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type {
  Collection,
  ContentKind,
  ContentRecord,
} from '@/content/types';

import { DetailTemplate } from './detail-template';

const collectionByKind: Record<ContentKind, Collection> = {
  course: 'courses',
  expert: 'experts',
  initiative: 'initiatives',
  news: 'news',
  notice: 'notices',
  partner: 'partners',
  project: 'projects',
  publication: 'publications',
  tool: 'tools',
};

function makeFixtureForKind(kind: ContentKind): ContentRecord {
  return {
    body: [{ type: 'paragraph', text: `Nội dung ${kind}` }],
    checkedAt: '2026-07-18',
    collection: collectionByKind[kind],
    evidenceStatus: 'verified',
    id: `${kind}-fixture`,
    kind,
    locale: 'vi',
    metadata: {},
    path: `/chi-tiet/${kind}`,
    slug: `${kind}-fixture`,
    sourceLabel: 'Nguồn kiểm thử GISA',
    sourceUrl: 'https://gisa.edu.vn/',
    summary: `Tóm tắt ${kind}`,
    tags: [],
    title: `Tiêu đề ${kind}`,
    translationKey: `${kind}-fixture`,
  };
}

describe('kind-specific detail templates', () => {
  test.each([
    ['project', 'Dự án'],
    ['course', 'Khóa học'],
    ['expert', 'Chuyên gia'],
    ['initiative', 'Sáng kiến'],
    ['news', 'Góc nhìn và cập nhật'],
    ['notice', 'Thông báo lưu trữ'],
  ] as const)('renders %s with its explicit content label', (kind, label) => {
    const record = makeFixtureForKind(kind);
    render(<DetailTemplate record={record} />);

    expect(
      screen.getByRole('heading', { level: 1, name: record.title }),
    ).toBeVisible();
    expect(screen.getByText(label)).toBeVisible();
    expect(document.body).not.toHaveTextContent('undefined');
  });

  test('publication detail shows its facts and the suggested-reading block', () => {
    const record: ContentRecord = {
      ...makeFixtureForKind('publication'),
      metadata: { topic: 'Chuỗi giá trị', year: '2015', authors: 'Hoàng Văn Việt' },
      tags: ['Chuỗi giá trị'],
    };
    const related = [
      {
        ...makeFixtureForKind('publication'),
        id: 'publication-related',
        path: '/nghien-cuu/bai-bao-khoa-hoc/bai-lien-quan',
        tags: ['Chuỗi giá trị'],
        title: 'Bài liên quan',
      },
    ];

    const { container } = render(
      <DetailTemplate record={record} related={related} />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: record.title }),
    ).toBeVisible();
    expect(container.textContent).not.toContain('Hoàng Văn Việt');
    expect(container.textContent).toContain('2015');
    expect(screen.getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: 'Nghiên cứu' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Bài nghiên cứu liên quan' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Bài liên quan' })).toHaveAttribute(
      'href',
      '/nghien-cuu/bai-bao-khoa-hoc/bai-lien-quan',
    );
    expect(document.body).not.toHaveTextContent('undefined');
  });

  test('applied publication keeps its listing and related-content context', () => {
    const record: ContentRecord = {
      ...makeFixtureForKind('publication'),
      metadata: { type: 'Chuyên khảo' },
      path: '/nghien-cuu/bai-bao-ung-dung/chuyen-khao',
    };
    const related = [
      {
        ...makeFixtureForKind('publication'),
        id: 'applied-related',
        metadata: { type: 'Chuyên khảo' },
        path: '/nghien-cuu/bai-bao-ung-dung/bai-ung-dung-lien-quan',
        title: 'Bài ứng dụng liên quan',
      },
      {
        ...makeFixtureForKind('publication'),
        id: 'scientific-related',
        metadata: { type: 'Bài báo khoa học' },
        path: '/nghien-cuu/bai-bao-khoa-hoc/bai-khoa-hoc-lien-quan',
        title: 'Bài khoa học khác nhóm',
      },
    ];

    render(<DetailTemplate record={record} related={related} />);

    expect(screen.getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: 'Nghiên cứu' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Xem tất cả bài ứng dụng/ }),
    ).toHaveAttribute('href', '/nghien-cuu/bai-bao-ung-dung');
    expect(screen.getByRole('link', { name: 'Bài ứng dụng liên quan' })).toBeVisible();
    expect(screen.queryByText('Bài khoa học khác nhóm')).not.toBeInTheDocument();
  });

  test('publication without suggestions omits the block entirely', () => {
    render(<DetailTemplate record={makeFixtureForKind('publication')} />);

    expect(
      screen.queryByRole('heading', { name: 'Bài nghiên cứu liên quan' }),
    ).not.toBeInTheDocument();
  });

  test('course CTA carries the slug without inventing optional facts', () => {
    const record = makeFixtureForKind('course');
    render(<DetailTemplate record={record} />);

    expect(screen.getByRole('link', { name: 'Đăng ký quan tâm khóa học' })).toHaveAttribute(
      'href',
      '/dang-ky/khoa-hoc?course=course-fixture',
    );
    expect(document.body).not.toHaveTextContent(/Học phí|Giảng viên|Lịch học/);
  });
});
