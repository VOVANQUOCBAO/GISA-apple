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
      /TRI THỨC GIẢI PHÁPTÁC ĐỘNG BỀN VỮNG/,
    );
    expect(screen.queryByText('GISA trong 60 giây')).not.toBeInTheDocument();
    expect(screen.getByText(byFullText('Kiến trúc tri thức'))).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: 'TRI THỨC CHO PHÁT TRIỂN BỀN VỮNG',
      }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'GIÁ TRỊ NỀN TẢNG — RISES' })).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'GÓC NHÌN & NGHIÊN CỨU MỚI' }),
    ).not.toBeInTheDocument();
    const knowledgeHeading = screen.getByText(byFullText('TRI THỨCDẪN LỐIHÀNH ĐỘNG'));
    expect(knowledgeHeading).toBeVisible();
    expect(knowledgeHeading.tagName).toBe('H2');
    // Khối quy trình tư vấn đã gỡ hẳn khỏi repo, không phải chỉ unmount. Giữ hai
    // phép kiểm này để lần dựng lại nào cũng phải là một quyết định có ý thức chứ
    // không phải một bản sao chép nửa vời của tiêu đề cũ.
    expect(screen.queryByText(byFullText('QUY TRÌNH TƯ VẤN 5 BƯỚC'))).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'TỪ NHU CẦU ĐẾN GIÁ TRỊ BỀN VỮNG' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(byFullText('GISA kết nối cam kết phát triển bền vững với năng lực nghiên cứu, tư vấn và triển khai thực tiễn.'))).toBeVisible();
    expect(screen.getByRole('heading', { name: 'TRI THỨC TẠO CHUYỂN BIẾN' })).toBeVisible();
    expect(document.querySelectorAll('#phat-trien-ben-vung img')).toHaveLength(5);
    expect(document.querySelectorAll('#phat-trien-ben-vung h3')).toHaveLength(5);
    expect(screen.getAllByRole('link', { name: /Tìm hiểu thêm về/ })).toHaveLength(5);
    expect(screen.getByRole('heading', { name: 'Mạng lưới tri thức GISA' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Xem hồ sơ ThS. NCS.TS Trần Anh Khang' })).toHaveAttribute(
      'href',
      '/chuyen-gia/tran-anh-khang',
    );
    expect(screen.getByRole('heading', { name: 'NGHIÊN CỨU TRỌNG ĐIỂM' })).toBeVisible();
    expect(screen.getByText(byFullText('Tri thức quốc tế, tác động tại Việt Nam.'))).toBeVisible();
    expect(screen.getByRole('link', { name: 'Khám phá dự án TRADE4SD' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Khám phá dự án VALUMICS' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Khám phá dự án STRENGTH2FOOD' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Khám phá dự án BRITISH COUNCIL' })).toBeVisible();
  });

  test('connects service gateways and capability cards to their real destinations', async () => {
    const model = await getHomePageModel(getContentRepository());
    render(<HomeTemplate model={model} />);

    const expectedLinks = [
      ['Nghiên cứu', '/nghien-cuu'],
      ['Tư vấn', '/tu-van'],
      ['Đào tạo', '/dao-tao'],
      ['Ứng dụng', '/ung-dung'],
      ['Mạng lưới', '/mang-luoi'],
      ['Cộng đồng', '/cong-dong'],
      ['Khám phá Nghiên cứu & phân tích', '/nghien-cuu/linh-vuc'],
      ['Khám phá Tư vấn chiến lược', '/tu-van/linh-vuc'],
      ['Khám phá Chuyển giao tri thức & đào tạo', '/dao-tao/linh-vuc'],
      ['Khám phá Đo lường & đánh giá', '/tu-van/cong-cu/cong-cu-nghien-cuu-va-danh-gia'],
      ['Khám phá giải pháp', '/ung-dung/linh-vuc'],
    ] as const;

    for (const [name, href] of expectedLinks) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
    }
    expect(screen.queryByRole('link', { name: 'Tải hồ sơ năng lực' })).not.toBeInTheDocument();
  });

  test('uses the same four-poster deck across knowledge tabs', async () => {
    const model = await getHomePageModel(getContentRepository());
    const { container } = render(<HomeTemplate model={model} />);

    expect(screen.getByRole('tab', { name: 'Tin mới' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Tin mới',
      'Bài nghiên cứu',
      'Khóa học',
    ]);
    let deckImages = container.querySelectorAll('#knowledge-panel img');
    expect(deckImages).toHaveLength(4);
    expect(
      [...deckImages].every((image) =>
        decodeURIComponent(image.getAttribute('src') ?? '').includes('/images/knowledge-deck/news-'),
      ),
    ).toBe(true);
    expect(screen.getByRole('link', { name: /Xem tin Chuyển đổi mô hình viện nghiên cứu và phát triển đại học đẳng cấp/ })).toBeVisible();

    fireEvent.click(screen.getByRole('tab', { name: 'Bài nghiên cứu' }));
    expect(screen.getByRole('tab', { name: 'Bài nghiên cứu' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    deckImages = container.querySelectorAll('#knowledge-panel img');
    expect(deckImages).toHaveLength(4);
    expect(screen.getByRole('link', { name: /Xem bài nghiên cứu Nghiên cứu phát triển mô hình chuẩn đối sánh đo lường hiệu suất hoạt động/ })).toBeVisible();

    fireEvent.click(screen.getByRole('tab', { name: 'Khóa học' }));
    expect(screen.getByRole('tab', { name: 'Khóa học' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(container.querySelectorAll('#knowledge-panel img')).toHaveLength(4);
    expect(screen.getByRole('link', { name: /Xem khóa học Multi-channel & Effective Sales/ })).toBeVisible();
  });

  /*
    "Đề nghị hợp tác" dưới dải logo đối tác là lối vào duy nhất của bảng trao đổi.
    Trigger cũ nằm trong khối quy trình tư vấn đã gỡ, và suốt thời gian đó dialog
    cùng phần bẫy phím Escape trong `home-template.tsx` không ai với tới được.
    Test này giữ lối vào đó tồn tại.
  */
  test('opens the consultation dialog from the partner call to action', async () => {
    const model = await getHomePageModel(getContentRepository());
    render(<HomeTemplate model={model} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: /Đề nghị hợp tác/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Trao đổi cùng GISA' })).toBeVisible();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Đóng bảng trao đổi' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('keeps the partner marquee duplicated for a seamless loop', async () => {
    const model = await getHomePageModel(getContentRepository());
    const { container } = render(<HomeTemplate model={model} />);

    expect(
      screen.getByRole('heading', { name: 'KẾT NỐI TOÀN CẦU' }),
    ).toBeInTheDocument();
    expect(container.querySelector('#doi-tac')).toHaveTextContent(
      'GISA kết nối các trường đại học, viện nghiên cứu và tổ chức phát triển toàn cầu.',
    );

    // Hai hàng chạy ngược chiều, mỗi hàng có bản sao thứ hai để vòng lặp không hở
    // mối, nên tổng cộng bốn danh sách.
    const partnerLists = container.querySelectorAll('#doi-tac ul');
    expect(partnerLists).toHaveLength(4);
    // 48 logo trong `public/icons/logos` chia đôi đều: mỗi hàng 24.
    expect(partnerLists[0]?.querySelectorAll('li')).toHaveLength(24);
    expect(partnerLists[2]?.querySelectorAll('li')).toHaveLength(24);
    expect(partnerLists[1]?.querySelectorAll('li')).toHaveLength(
      partnerLists[0]?.querySelectorAll('li').length ?? 0,
    );
    expect(partnerLists[3]?.querySelectorAll('li')).toHaveLength(
      partnerLists[2]?.querySelectorAll('li').length ?? 0,
    );
    expect(partnerLists[1]).toHaveAttribute('aria-hidden', 'true');
    expect(partnerLists[3]).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('[autoplay]')).toBeNull();
    expect(document.querySelector('[aria-roledescription="carousel"]')).toBeNull();
  });

  test('keeps perpetual motion independent while revealing static content', async () => {
    const model = await getHomePageModel(getContentRepository());
    const { container } = render(<HomeTemplate model={model} />);

    // The knowledge section is now a normal vertical document flow. It must not
    // opt out of the shared director or reintroduce its own pinned-scroll state.
    const journey = container.querySelector('#phat-trien-ben-vung');
    expect(journey).not.toHaveAttribute('data-scroll-motion-ignore');
    expect(journey?.querySelectorAll('[data-scroll-motion]')).toHaveLength(0);
    expect(
      container.querySelectorAll('#phat-trien-ben-vung ol[aria-label] > li'),
    ).toHaveLength(5);
    expect(
      container.querySelectorAll('#kien-truc [data-scroll-motion="rises-card"]'),
    ).toHaveLength(5);
    expect(
      container.querySelector('#kien-truc [data-scroll-motion="reveal"]'),
    ).toBeInTheDocument();
    // Logo lanes own a perpetual CSS loop. Scroll-linked markers would park each
    // logo until the section enters the viewport and fight the track transform.
    expect(
      container.querySelectorAll('#doi-tac [data-scroll-motion="partner-card"]'),
    ).toHaveLength(0);
    expect(
      container.querySelectorAll(
        '#du-an-nghien-cuu-trong-diem [data-scroll-motion="item"]',
      ),
    ).toHaveLength(4);
    expect(
      container.querySelector('#doi-tac [data-scroll-motion="reveal"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '#du-an-nghien-cuu-trong-diem [data-scroll-motion="reveal"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('nav[aria-label="Lối tắt dịch vụ"] [data-scroll-motion="item"]'),
    ).toHaveLength(6);
    expect(
      container.querySelectorAll('#du-an-nghien-cuu-trong-diem a img'),
    ).toHaveLength(4);
    expect(
      container.querySelector('#doi-tac [data-scroll-motion="partner-cta"]'),
    ).toBeInTheDocument();
  });
});
