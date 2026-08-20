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
    expect(within(breadcrumbs).getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/');
    expect(within(breadcrumbs).queryByText('Tư vấn')).not.toBeInTheDocument();
    expect(within(breadcrumbs).getByText(record.title).closest('li')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test.each([
    ['/nghien-cuu/du-an/trade4sd'],
    ['/tu-van/du-an/du-an-mau'],
  ] as const)(
    'keeps a compact breadcrumb for %s',
    (path) => {
      render(
        <ProjectToolDetailTemplate
          record={makeRecord({ kind: 'project', path })}
        />,
      );
      const breadcrumbs = screen.getByRole('navigation', { name: 'Đường dẫn' });

      expect(within(breadcrumbs).getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/');
      expect(within(breadcrumbs).getByText('Hồ sơ kiểm thử').closest('li')).toHaveAttribute(
        'aria-current',
        'page',
      );
    },
  );

  test('renders the project image and verified program logo together', () => {
    render(
      <ProjectToolDetailTemplate
        record={makeRecord({
          image: {
            alt: 'Minh họa dự án TRADE4SD',
            height: 1024,
            src: '/images/project-trade4sd.png',
            width: 1536,
          },
          kind: 'project',
          metadata: { logo: '/icons/logos/02_trade4sd.png' },
          path: '/nghien-cuu/du-an/trade4sd',
          title: 'TRADE4SD',
        })}
      />,
    );

    expect(screen.getByRole('img', { name: 'Minh họa dự án TRADE4SD' })).toBeVisible();
    expect(document.querySelector('[class*="projectLogo"] img')).toBeInTheDocument();
  });
});
