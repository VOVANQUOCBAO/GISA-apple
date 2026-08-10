import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { ContentRecord } from '@/content/types';

import { ProjectToolDetailTemplate } from './project-tool-detail-template';

function makeRecord(
  overrides: Partial<ContentRecord> & Pick<ContentRecord, 'kind' | 'path'>,
): ContentRecord {
  return {
    body: [{ type: 'paragraph', text: 'Nội dung kiểm thử' }],
    checkedAt: '2026-08-10',
    collection: overrides.kind === 'tool' ? 'tools' : 'projects',
    evidenceStatus: 'verified',
    id: 'detail-fixture',
    locale: 'vi',
    metadata: {},
    slug: 'detail-fixture',
    sourceLabel: 'Nguồn kiểm thử GISA',
    sourceUrl: 'https://gisa.edu.vn/',
    summary: 'Tóm tắt hồ sơ kiểm thử',
    tags: [],
    title: 'Hồ sơ kiểm thử',
    translationKey: 'detail-fixture',
    ...overrides,
  };
}

describe('ProjectToolDetailTemplate', () => {
  test('uses verified Vietnamese tool metadata in the non-image fallback', () => {
    const record = makeRecord({
      kind: 'tool',
      metadata: { group: 'Huấn luyện và cố vấn', toolCount: '4' },
      path: '/tu-van/cong-cu/huan-luyen-va-co-van',
    });

    const { container } = render(<ProjectToolDetailTemplate record={record} />);
    const fallback = container.querySelector('[data-has-image="false"]');
    const breadcrumbs = screen.getByRole('navigation', { name: 'Đường dẫn' });

    expect(fallback).toHaveTextContent('Nhóm công cụ');
    expect(fallback).toHaveTextContent('Huấn luyện và cố vấn');
    expect(fallback).toHaveTextContent('4 công cụ trong nhóm');
    expect(fallback).not.toHaveTextContent(/METHOD|PROJECT/);
    expect(within(breadcrumbs).getByRole('link', { name: 'Tư vấn' })).toHaveAttribute(
      'href',
      '/tu-van',
    );
    expect(within(breadcrumbs).getByRole('link', { name: 'Công cụ tư vấn' })).toHaveAttribute(
      'href',
      '/tu-van/cong-cu',
    );
  });

  test.each([
    ['/nghien-cuu/du-an/trade4sd', 'Nghiên cứu', '/nghien-cuu', 'Dự án nghiên cứu'],
    ['/tu-van/du-an/du-an-mau', 'Tư vấn', '/tu-van', 'Dự án tư vấn'],
  ] as const)(
    'keeps the section root in breadcrumbs for %s',
    (path, rootLabel, rootHref, parentLabel) => {
      render(
        <ProjectToolDetailTemplate
          record={makeRecord({ kind: 'project', path })}
        />,
      );
      const breadcrumbs = screen.getByRole('navigation', { name: 'Đường dẫn' });

      expect(within(breadcrumbs).getByRole('link', { name: rootLabel })).toHaveAttribute(
        'href',
        rootHref,
      );
      expect(within(breadcrumbs).getByRole('link', { name: parentLabel })).toHaveAttribute(
        'href',
        path.startsWith('/tu-van/') ? '/tu-van/du-an' : '/nghien-cuu/du-an',
      );
    },
  );
});
