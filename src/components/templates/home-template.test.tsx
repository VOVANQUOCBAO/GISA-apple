import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

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
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('renders the confirmed evidence-led homepage structure', async () => {
    const model = await getHomePageModel(getContentRepository());
    render(<HomeTemplate model={model} />);

    expect(document.querySelector('h1')?.textContent).toMatch(
      /KIẾN TẠO TRI THỨCLAN TỎA GIÁ TRỊ/,
    );
    expect(screen.queryAllByRole('button', { name: /Hiển thị slide/ })).toHaveLength(0);
    expect(screen.queryByText('GISA trong 60 giây')).not.toBeInTheDocument();
    expect(screen.getByText(byFullText('Kiến trúc tri thức'))).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: 'TRI THỨC CHO PHÁT TRIỂN BỀN VỮNG',
      }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'GIÁ TRỊ NỀN TẢNG — RISES' })).toBeVisible();
    const missionSection = document.querySelector('#su-menh-gisa');
    expect(missionSection).toBeInTheDocument();
    expect(within(missionSection as HTMLElement).getAllByRole('listitem')).toHaveLength(6);
    for (const title of [
      'Nghiên cứu và phát triển tri thức liên ngành',
      'Thúc đẩy đổi mới sáng tạo và tư duy đột phá',
      'Chuyển giao tri thức và công nghệ ứng dụng',
      'Kết nối và hợp tác toàn cầu',
      'Ứng dụng khoa học – công nghệ vào thực tiễn',
      'Kiến tạo giá trị và lan tỏa tác động xã hội',
    ]) {
      expect(within(missionSection as HTMLElement).getByRole('heading', { name: title })).toBeVisible();
    }
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
    expect(document.querySelectorAll('#phat-trien-ben-vung img')).toHaveLength(6);
    expect(document.querySelectorAll('#phat-trien-ben-vung h3')).toHaveLength(6);
    expect(screen.getAllByRole('link', { name: /Tìm hiểu thêm về/ })).toHaveLength(6);
    expect(screen.getByRole('heading', { name: 'Mạng lưới & Hợp tác' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Đội ngũ chuyên gia' })).toBeInTheDocument();
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
    expect(screen.getByText('5.000+')).toBeVisible();
    expect(screen.getByText('400+')).toBeVisible();
    expect(screen.getByText('200+')).toBeVisible();
    expect(screen.getByText('30+')).toBeVisible();
  });

  /* jsdom không có `IntersectionObserver` lẫn `requestAnimationFrame` thật, nên
     bài này tự dựng cả hai để chạy đúng vòng đời: dựng xong hiện số cuối, cuộn
     tới thì tụt về 0 rồi bò lên lại. */
  test('counts the impact metrics up from zero once the strip scrolls into view', async () => {
    const callbacks: IntersectionObserverCallback[] = [];
    class StubIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        callbacks.push(callback);
      }
      disconnect() {}
      observe() {}
      unobserve() {}
    }

    const frames: FrameRequestCallback[] = [];
    let now = 0;

    vi.stubGlobal('IntersectionObserver', StubIntersectionObserver);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.spyOn(performance, 'now').mockImplementation(() => now);

    const model = await getHomePageModel(getContentRepository());
    render(<HomeTemplate model={model} />);

    expect(screen.getAllByText('0+')).toHaveLength(4);

    act(() => {
      for (const callback of callbacks) {
        callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      }
    });

    // Nửa quãng: số đã rời 0 nhưng chưa tới đích.
    now = 800;
    act(() => {
      for (const frame of frames.splice(0)) frame(now);
    });
    expect(screen.queryByText('5.000+')).not.toBeInTheDocument();
    expect(screen.queryAllByText('0+')).toHaveLength(0);

    // Hết quãng: đúng bốn con số thật.
    now = 2000;
    act(() => {
      for (const frame of frames.splice(0)) frame(now);
    });
    expect(screen.getByText('5.000+')).toBeVisible();
    expect(screen.getByText('400+')).toBeVisible();
    expect(screen.getByText('200+')).toBeVisible();
    expect(screen.getByText('30+')).toBeVisible();
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
    expect(screen.getByRole('link', { name: /Tầm nhìn/ })).toHaveAttribute(
      'href',
      '/gioi-thieu/cau-chuyen-gisa#tam-nhin',
    );
    expect(screen.getByRole('link', { name: /Sứ mệnh/ })).toHaveAttribute(
      'href',
      '/gioi-thieu/cau-chuyen-gisa#su-menh',
    );
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

  test('opens the consultation dialog from the journey call to action', async () => {
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

  test('moves the network chapter into the journey and removes the duplicate partner marquee', async () => {
    const model = await getHomePageModel(getContentRepository());
    const { container } = render(<HomeTemplate model={model} />);

    const chapters = container.querySelectorAll('#phat-trien-ben-vung ol[aria-label] > li');
    expect(chapters).toHaveLength(6);
    expect(chapters[4]).toHaveTextContent('Mạng lưới & Hợp tác');
    expect(container.querySelector('#doi-tac')).toBeNull();
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
    ).toHaveLength(6);
    expect(
      container.querySelectorAll('#kien-truc [data-scroll-motion="rises-card"]'),
    ).toHaveLength(5);
    expect(
      container.querySelector('#kien-truc [data-scroll-motion="reveal"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(
        '#du-an-nghien-cuu-trong-diem [data-scroll-motion="item"]',
      ),
    ).toHaveLength(4);
    expect(
      container.querySelector(
        '#du-an-nghien-cuu-trong-diem [data-scroll-motion="reveal"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('nav[aria-label="Lối tắt dịch vụ"] [data-scroll-motion="item"]'),
    ).toHaveLength(6);
    // Bốn dự án, mỗi dự án một ảnh nền và một logo tổ chức đè lên.
    expect(
      container.querySelectorAll('#du-an-nghien-cuu-trong-diem a img'),
    ).toHaveLength(8);
    expect(
      container.querySelectorAll('#du-an-nghien-cuu-trong-diem a img[alt^="Logo "]'),
    ).toHaveLength(4);
    expect(screen.getByRole('button', { name: /Đề nghị hợp tác/ }).parentElement).toHaveAttribute(
      'data-scroll-motion',
      'section',
    );
  });
});
