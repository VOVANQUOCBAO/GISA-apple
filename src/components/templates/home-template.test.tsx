import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { getHomePageModel } from '@/content/home';
import { getContentRepository } from '@/content/repositories';

import { HomeTemplate } from './home-template';

/**
 * `getByText` compares one element's own text. Vietnamese words render inside
 * `white-space: nowrap` spans so a line break cannot split them (see
 * src/lib/vietnamese-text.tsx), which spreads a sentence over several nodes.
 * Matching on the container's full textContent sees the sentence again.
 */
const byFullText = (value: string) => (_: string, element: Element | null) =>
  element?.textContent === value &&
  // Every ancestor up to <body> can also hold exactly this text. Keep only the
  // innermost match, or the query reports "found multiple elements".
  ![...element.children].some((child) => child.textContent === value);

describe('HomeTemplate', () => {
  test('renders the confirmed evidence-led homepage structure', async () => {
    const model = await getHomePageModel(getContentRepository());
    render(<HomeTemplate model={model} />);

    expect(document.querySelector('h1')?.textContent).toMatch(
      /TRI THỨCGIẢI PHÁPTÁC ĐỘNG BỀN VỮNG/,
    );
    expect(screen.queryByText('GISA trong 60 giây')).not.toBeInTheDocument();
    expect(screen.getByText(byFullText('Kiến trúc tri thức'))).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: 'TRI THỨC CHO PHÁT TRIỂN BỀN VỮNG',
      }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'GIÁ TRỊ NỀN TẢNG — RISES' })).toBeVisible();
    expect(screen.getByText(byFullText('Từ cam kết đến hành động'))).toBeVisible();
    expect(screen.getByRole('heading', { name: 'QUY TRÌNH TƯ VẤN 5 BƯỚC' })).toBeVisible();
    expect(screen.getByText(byFullText('GISA kết nối cam kết phát triển bền vững với năng lực nghiên cứu, tư vấn và triển khai thực tiễn.'))).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Nghiên cứu ứng dụng' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Cộng đồng & Tác động' })).toBeVisible();
    expect(screen.getByText(byFullText('Đồng hành cùng doanh nghiệp từ phân tích đến triển khai và tối ưu giá trị bền vững.'))).toBeVisible();
    expect(screen.getByRole('heading', { name: 'NGHIÊN CỨU TRỌNG ĐIỂM' })).toBeVisible();
    expect(screen.getByText(byFullText('Những hợp tác nghiên cứu tiêu biểu kết nối tri thức quốc tế với nhu cầu phát triển tại Việt Nam.'))).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'TRADE4SD' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'VALUMICS' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'STRENGTH2FOOD' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'BRITISH COUNCIL' })).toBeVisible();
  });

  test('shows all six supplied course images by default', async () => {
    const model = await getHomePageModel(getContentRepository());
    const { container } = render(<HomeTemplate model={model} />);

    expect(screen.getByRole('tab', { name: 'Khóa học' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getAllByRole('tab')[0]).toHaveTextContent('Khóa học');
    const courseImages = container.querySelectorAll('#knowledge-panel img');
    expect(courseImages).toHaveLength(6);
    expect(
      [...courseImages].every((image) =>
        decodeURIComponent(image.getAttribute('src') ?? '').includes('/images/course-'),
      ),
    ).toBe(true);
  });

  test('opens the consultation form from the advisory process button', async () => {
    const model = await getHomePageModel(getContentRepository());
    render(<HomeTemplate model={model} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Trao đổi cùng chuyên gia' }));
    expect(screen.getByRole('dialog', { name: 'Trao đổi cùng GISA' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Đóng bảng trao đổi' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('keeps the partner marquee duplicated for a seamless loop', async () => {
    const model = await getHomePageModel(getContentRepository());
    const { container } = render(<HomeTemplate model={model} />);

    const partnerLists = container.querySelectorAll('#doi-tac ul');
    expect(partnerLists).toHaveLength(2);
    // One tile per logo in `public/icons/logos`, and the second copy is an exact
    // duplicate of the first so the marquee loops without a visible seam.
    expect(partnerLists[0]?.querySelectorAll('li')).toHaveLength(28);
    expect(partnerLists[1]?.querySelectorAll('li')).toHaveLength(
      partnerLists[0]?.querySelectorAll('li').length ?? 0,
    );
    expect(partnerLists[1]).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('[autoplay]')).toBeNull();
    expect(document.querySelector('[aria-roledescription="carousel"]')).toBeNull();
  });

  test('assigns tailored bidirectional scroll motion to the highlighted sections', async () => {
    const model = await getHomePageModel(getContentRepository());
    const { container } = render(<HomeTemplate model={model} />);

    expect(
      container.querySelectorAll(
        '#phat-trien-ben-vung [data-scroll-motion="commitment-card"]',
      ).length,
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('#kien-truc [data-scroll-motion="rises-card"]'),
    ).toHaveLength(5);
    expect(
      container.querySelectorAll('#doi-tac [data-scroll-motion="partner-card"]'),
    ).toHaveLength(56);
    expect(
      container.querySelectorAll(
        '#du-an-nghien-cuu-trong-diem [data-scroll-motion="research-card"]',
      ),
    ).toHaveLength(4);
    expect(
      container.querySelector('#doi-tac [data-scroll-motion="partner-cta"]'),
    ).toBeInTheDocument();
  });
});
