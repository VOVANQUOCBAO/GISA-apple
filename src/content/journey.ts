/**
 * Content model for the "TRI THỨC TẠO CHUYỂN BIẾN" editorial slide sequence.
 *
 * Chapter copy and legends live here. **Numbers do not.** Every figure the
 * section publishes comes from `@/content/verified-metrics`, where each value
 * carries its source, cut-off date and counting scope; see
 * `docs/content-source-register.md`.
 *
 * `lead` may describe what a plate draws, but it may not assert a quantity the
 * plate cannot show. Chapter 03's lead used to say "sau mỗi đợt hỗ trợ, năng
 * lực được đo lại" — there is no measurement, and the curve that implied one
 * has been removed.
 */

export type JourneyChartName =
  | 'research'
  | 'strategy'
  | 'training'
  | 'transfer'
  | 'network'
  | 'impact';

export type LegendTone = 'teal' | 'aqua' | 'orange' | 'muted';

export interface JourneyLegendItem {
  label: string;
  mark: 'line' | 'band' | 'dot' | 'square';
  tone: LegendTone;
}

/**
 * `legend` must describe marks that the chapter's plate actually draws, in the
 * words a non-specialist would use. It is the reader's key to the figure, not a
 * restatement of the methodology.
 */
export interface JourneyChapter {
  chart: JourneyChartName;
  href: string;
  id: string;
  image: string;
  imageAlt: string;
  legend: JourneyLegendItem[];
  /** Long-form body shown in the copy column of the active slide. */
  lead: string;
  title: string;
}

export const journeyChapters: JourneyChapter[] = [
  {
    chart: 'research',
    href: '/nghien-cuu',
    id: 'nghien-cuu-ung-dung',
    image: '/images/knowledge-journey/research-field-editorial.png',
    imageAlt: 'Nhà nghiên cứu trao đổi và ghi chép cùng người dân tại thực địa miền núi.',
    legend: [],
    lead: 'Tạo bằng chứng liên ngành cho quyết định phát triển bền vững.',
    title: 'Nghiên cứu ứng dụng',
  },
  {
    chart: 'strategy',
    href: '/tu-van',
    id: 'tu-van-chien-luoc',
    image: '/images/knowledge-journey/consulting-workshop-editorial.png',
    imageAlt: 'Nhóm chuyên gia cùng thảo luận và xây dựng định hướng chiến lược.',
    legend: [],
    lead: 'Chuyển mục tiêu ESG thành lộ trình quản trị có thể triển khai.',
    title: 'Tư vấn chiến lược',
  },
  {
    chart: 'training',
    href: '/dao-tao',
    id: 'dao-tao-nang-luc',
    image: '/images/knowledge-journey/training-session-editorial.png',
    imageAlt: 'Giảng viên chia sẻ trong một chương trình đào tạo dành cho người đi làm.',
    legend: [],
    lead: 'Phát triển năng lực linh hoạt và chuyên môn sâu.',
    title: 'Đào tạo năng lực',
  },
  {
    chart: 'transfer',
    href: '/ung-dung',
    id: 'ung-dung-chuyen-giao',
    image: '/images/knowledge-journey/transfer-field-editorial.png',
    imageAlt: 'Chuyên gia và nông dân cùng trao đổi giải pháp tại khu sản xuất.',
    legend: [],
    lead: 'Đưa tri thức vào bốn hướng ứng dụng trong thực tiễn.',
    title: 'Ứng dụng & Chuyển giao',
  },
  {
    chart: 'impact',
    href: '/cong-dong',
    id: 'cong-dong-tac-dong',
    image: '/images/knowledge-journey/community-action-editorial.png',
    imageAlt: 'Nhóm tình nguyện viên cùng thực hiện hoạt động bảo vệ môi trường.',
    legend: [],
    lead: 'Ba trụ cột định hướng cho tác động bền vững.',
    title: 'Cộng đồng & Tác động',
  },
];

/**
 * Con số GISA tự công bố trên trang chủ và trang giới thiệu.
 *
 * Khác hẳn `verifiedJourneyMetrics` về mặt chứng cứ: đây là tuyên bố của tổ
 * chức, không phải phép đếm. Các trang công bố chúng không nêu thời điểm chốt
 * số liệu, cách tính hay danh mục đi kèm — nên chúng không mang đủ tám trường
 * của `JourneyMetric`, không bao giờ được đặt trong hàng số chính, và chỉ được
 * render dưới nhãn "theo GISA công bố" ở cỡ chữ chú thích.
 *
 * Đây là ranh giới cần được quyết định lại nếu quy tắc siết chặt hơn: hoặc GISA
 * cung cấp kỳ thống kê và phương pháp tính để chúng lên được bảng trên, hoặc
 * chúng rời khỏi giao diện. Xem `docs/data-replacement-report.md`.
 */
export interface ClaimedMetric {
  id: string;
  label: string;
  sourceLabel: string;
  sourcePath: string;
  updatedAt: string;
  value: string;
}

export const claimedMetrics: ClaimedMetric[] = [
  {
    id: 'years-experience',
    label: 'năm kinh nghiệm',
    sourceLabel: 'Trang chủ GISA',
    sourcePath: 'https://gisa.edu.vn/',
    updatedAt: '2026-08-03',
    value: '10+',
  },
  {
    id: 'global-partners',
    label: 'đối tác toàn cầu',
    sourceLabel: 'Trang chủ GISA',
    sourcePath: 'https://gisa.edu.vn/',
    updatedAt: '2026-08-03',
    value: '20+',
  },
  {
    id: 'projects-delivered',
    label: 'dự án đã thực hiện',
    sourceLabel: 'Trang chủ GISA',
    sourcePath: 'https://gisa.edu.vn/',
    updatedAt: '2026-08-03',
    value: '500+',
  },
  {
    id: 'research-articles',
    label: 'bài nghiên cứu quốc tế',
    sourceLabel: 'Trang giới thiệu GISA',
    sourcePath: 'https://gisa.edu.vn/gioi-thieu',
    updatedAt: '2026-08-03',
    value: '1.000+',
  },
];
