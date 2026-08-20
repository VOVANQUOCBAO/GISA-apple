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
    expect(screen.queryByRole('link', { name: 'Đào tạo' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Nội dung chính' })).toBeVisible();
    expect(container.querySelector('section#noi-dung-chinh')).toBeInTheDocument();
    expect(container.querySelectorAll('section#noi-dung-chinh img').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('section#noi-dung-chinh svg').length).toBeGreaterThan(0);
    expect(screen.queryByText('Hành trình năng lực')).not.toBeInTheDocument();
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
    expect(screen.queryByRole('link', { name: 'Ứng dụng' })).not.toBeInTheDocument();
    expect(container.querySelectorAll('article').length).toBeGreaterThan(1);
    expect(container.querySelectorAll('[class*="applicationChapter"] img').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[class*="applicationItem"] svg').length).toBeGreaterThan(0);
    expect(container.querySelector('br')).not.toBeInTheDocument();
  });
});
