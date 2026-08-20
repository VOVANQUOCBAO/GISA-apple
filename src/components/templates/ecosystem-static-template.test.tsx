import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { resolvePage, type PageDefinition } from '@/content/pages';

import {
  ECOSYSTEM_STATIC_PATHS,
  EcosystemStaticTemplate,
  supportsEcosystemStaticTemplate,
} from './ecosystem-static-template';

const definition: Extract<PageDefinition, { template: 'static' }> = {
  blocks: [
    { type: 'paragraph', text: 'GISA kết nối tri thức – hành động trong thực tiễn.' },
    { type: 'heading', level: 2, text: 'Phát triển bền vững' },
    {
      type: 'list',
      ordered: false,
      items: ['Nghiên cứu liên ngành — kết nối bằng chứng với quyết định.'],
    },
  ],
  description: 'Khám phá các hướng nghiên cứu liên ngành mà GISA theo đuổi.',
  path: '/nghien-cuu/linh-vuc',
  template: 'static',
  title: 'Lĩnh vực nghiên cứu',
};

describe('EcosystemStaticTemplate', () => {
  test('renders a semantic editorial page without forced line breaks', () => {
    const { container } = render(
      <EcosystemStaticTemplate definition={definition} path={definition.path} />,
    );

    expect(screen.getByRole('heading', { level: 1, name: definition.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Phát triển bền vững' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Xem dự án nghiên cứu' })).toHaveAttribute(
      'href',
      '/nghien-cuu/du-an',
    );
    expect(container.querySelector('br')).toBeNull();
    expect(container).toHaveTextContent('GISA kết nối tri thức – hành động trong thực tiễn.');
    expect(container).toHaveTextContent('Nghiên cứu liên ngành — kết nối bằng chứng với quyết định.');
  });

  test('limits the template contract to the assigned child routes', () => {
    expect(supportsEcosystemStaticTemplate('/cong-dong/bao-ve-moi-truong')).toBe(true);
    expect(supportsEcosystemStaticTemplate('/')).toBe(false);
    expect(supportsEcosystemStaticTemplate('/landing-lp')).toBe(false);
  });

  test.each(ECOSYSTEM_STATIC_PATHS)('renders existing content for %s', (path) => {
    const page = resolvePage(path);
    expect(page?.template).toBe('static');
    if (!page || page.template !== 'static') return;

    const { container } = render(
      <EcosystemStaticTemplate definition={page} path={path} />,
    );

    expect(screen.getByRole('heading', { level: 1, name: page.title })).toBeInTheDocument();
    expect(container.querySelector('br')).toBeNull();
  });

  test('adds visual anchors to cooperation subsections', () => {
    const page = resolvePage('/mang-luoi/thuc-day-hop-tac');
    expect(page?.template).toBe('static');
    if (!page || page.template !== 'static') return;

    const { container } = render(
      <EcosystemStaticTemplate definition={page} path={page.path} />,
    );

    const subsections = container.querySelectorAll('[data-mode="network"] section[class*="subsection"]');
    expect(subsections.length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-mode="network"] section[class*="subsection"] img').length).toBe(
      subsections.length,
    );
    expect(
      container.querySelectorAll('[data-mode="network"] span[class*="subsectionIcon"] svg').length,
    ).toBe(subsections.length);
  });

  test.each(['/cong-dong/bao-ve-moi-truong', '/cong-dong/quan-tri-hieu-qua'])(
    'marks %s for centered community chapter styling',
    (path) => {
      const page = resolvePage(path);
      expect(page?.template).toBe('static');
      if (!page || page.template !== 'static') return;

      const { container } = render(
        <EcosystemStaticTemplate definition={page} path={path} />,
      );

      expect(container.querySelector('[data-mode="community"]')).toHaveAttribute(
        'data-page',
        path.split('/').at(-1),
      );
      expect(screen.getByRole('heading', { name: 'Tư duy và định hướng' })).toBeVisible();
      expect(screen.getByRole('heading', { name: 'Các nội dung trọng tâm' })).toBeVisible();
    },
  );
});
