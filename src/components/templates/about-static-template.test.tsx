import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { resolvePage } from '@/content/pages';

import { AboutStaticTemplate, isAboutStaticPath } from './about-static-template';

const ABOUT_CASES = [
  ['/gioi-thieu/cau-chuyen-gisa', 'Câu chuyện GISA', 'Bối cảnh và vấn đề đặt ra'],
  ['/gioi-thieu/tam-nhin-su-menh', 'Tầm nhìn & sứ mệnh', 'Sứ mệnh'],
  ['/gioi-thieu/rises-va-sau-tru-cot', 'RISES và sáu trụ cột', 'Giá trị cốt lõi RISES'],
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
    expect(container.textContent).not.toMatch(/[–—]/);
    unmount();
  });

  test('limits the custom template contract to the four approved child pages', () => {
    for (const [path] of ABOUT_CASES) expect(isAboutStaticPath(path)).toBe(true);
    expect(isAboutStaticPath('/gioi-thieu')).toBe(false);
    expect(isAboutStaticPath('/')).toBe(false);
  });

  test('renders the bilingual slogan as two semantic lines without language labels', () => {
    const definition = resolvePage('/gioi-thieu/tam-nhin-su-menh');
    if (!definition || definition.template !== 'static') throw new Error('Missing vision page');

    render(<AboutStaticTemplate definition={definition} path={definition.path} />);

    const slogan = screen.getByRole('heading', { level: 2, name: 'Khẩu hiệu' }).parentElement;
    const lines = slogan?.querySelectorAll('p > span');

    expect(lines).toHaveLength(2);
    expect(lines?.[0]).toHaveTextContent('Kiến tạo tri thức, lan tỏa giá trị');
    expect(lines?.[1]).toHaveTextContent('Advancing Knowledge, Sharing Values');
    expect(slogan).not.toHaveTextContent(/Tiếng Việt:|Tiếng Anh:/);
  });
});
