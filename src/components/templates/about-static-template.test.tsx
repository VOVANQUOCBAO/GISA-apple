import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { resolvePage } from '@/content/pages';

import { AboutStaticTemplate, isAboutStaticPath } from './about-static-template';

const ABOUT_CASES = [
  ['/gioi-thieu/cau-chuyen-gisa', 'Câu chuyện GISA', 'Bối cảnh và vấn đề đặt ra'],
  ['/gioi-thieu/linh-vuc-hoat-dong', 'Lĩnh vực hoạt động', 'Nghiên cứu'],
] as const;

describe('AboutStaticTemplate', () => {
  test.each(ABOUT_CASES)('renders a dedicated composition for %s', (path, title, sectionTitle) => {
    const definition = resolvePage(path);
    expect(definition?.template).toBe('static');
    if (!definition || definition.template !== 'static') throw new Error(`Missing ${path}`);

    const { container, unmount } = render(
      <AboutStaticTemplate definition={definition} path={path} />,
    );

    expect(screen.getByRole('heading', { level: 1, name: title })).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: sectionTitle })).toBeVisible();
    expect(container.textContent).not.toMatch(/ {2,}/);
    const bridgedDashes = container.querySelectorAll('[data-dash-bridge]');
    expect(bridgedDashes.length).toBeGreaterThan(0);
    for (const bridge of bridgedDashes) expect(bridge.textContent).toMatch(/^[-–—]\s+\S/u);
    unmount();
  });

  test('limits the custom template contract to the two approved child pages', () => {
    for (const [path] of ABOUT_CASES) expect(isAboutStaticPath(path)).toBe(true);
    expect(isAboutStaticPath('/gioi-thieu')).toBe(false);
    expect(isAboutStaticPath('/')).toBe(false);
  });

  test('renders the bilingual slogan as two semantic lines without language labels', () => {
    const definition = resolvePage('/gioi-thieu/cau-chuyen-gisa');
    if (!definition || definition.template !== 'static') throw new Error('Missing story page');

    render(<AboutStaticTemplate definition={definition} path={definition.path} />);

    const slogan = screen.getByRole('heading', { level: 2, name: 'Khẩu hiệu' }).parentElement;
    const lines = slogan?.querySelectorAll('p > span');

    expect(lines).toHaveLength(2);
    expect(lines?.[0]).toHaveTextContent('Kiến tạo tri thức, lan tỏa giá trị');
    expect(lines?.[1]).toHaveTextContent('Advancing Knowledge, Sharing Values');
    expect(slogan).not.toHaveTextContent(/Tiếng Việt:|Tiếng Anh:/);
  });

  test('consolidates vision, mission, slogan and RISES without the duplicate pillars', () => {
    const definition = resolvePage('/gioi-thieu/cau-chuyen-gisa');
    if (!definition || definition.template !== 'static') throw new Error('Missing story page');

    const { container } = render(
      <AboutStaticTemplate definition={definition} path={definition.path} />,
    );

    expect(container.querySelector('#tam-nhin')).toBeInTheDocument();
    expect(container.querySelector('#su-menh')).toBeInTheDocument();
    expect(container.querySelector('#khau-hieu')).toBeInTheDocument();
    expect(container.querySelector('#gia-tri-cot-loi-rises')).toBeInTheDocument();
    expect(container.querySelectorAll('#su-menh li')).toHaveLength(6);
    expect(container.querySelectorAll('[data-story-icon]')).toHaveLength(3);
    expect(screen.queryByRole('heading', { name: 'Sáu trụ cột hoạt động' })).not.toBeInTheDocument();
  });
});
