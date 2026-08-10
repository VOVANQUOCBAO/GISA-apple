import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { resolvePage } from '@/content/pages';

import { CapabilityStaticTemplate } from './capability-static-template';

function staticDefinition(path: string) {
  const definition = resolvePage(path);
  if (!definition || definition.template !== 'static') {
    throw new Error(`Missing static definition for ${path}`);
  }
  return definition;
}

describe('CapabilityStaticTemplate', () => {
  test('renders training as a capability journey without forced line breaks', () => {
    const definition = staticDefinition('/dao-tao/gisa-core');
    const { container } = render(
      <CapabilityStaticTemplate definition={definition} path="/dao-tao/gisa-core" />,
    );

    expect(container.querySelector('[data-capability="training"]')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Đào tạo' })).toHaveAttribute('href', '/dao-tao');
    expect(screen.getByRole('heading', { level: 2, name: 'Nội dung chính' })).toBeVisible();
    expect(container.querySelector('section#noi-dung-chinh')).toBeInTheDocument();
    expect(container.querySelector('br')).not.toBeInTheDocument();
  });

  test('renders application subtopics as a practical editorial grid', () => {
    const definition = staticDefinition('/ung-dung/quan-ly-kinh-doanh');
    const { container } = render(
      <CapabilityStaticTemplate
        definition={definition}
        path="/ung-dung/quan-ly-kinh-doanh"
      />,
    );

    expect(container.querySelector('[data-capability="application"]')).toBeInTheDocument();
    expect(screen.getByText('Bối cảnh')).toBeVisible();
    expect(screen.getByText('Cách tiếp cận')).toBeVisible();
    expect(screen.getByText('Giá trị')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Ứng dụng' })).toHaveAttribute('href', '/ung-dung');
    expect(container.querySelectorAll('article').length).toBeGreaterThan(1);
    expect(container.querySelector('br')).not.toBeInTheDocument();
  });
});
