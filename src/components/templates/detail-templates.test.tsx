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
    ['publication', 'Ấn phẩm'],
    ['course', 'Khóa học'],
    ['expert', 'Chuyên gia'],
    ['initiative', 'Sáng kiến'],
    ['news', 'Tin tức'],
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
