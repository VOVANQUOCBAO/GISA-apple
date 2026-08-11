import type { ContentRecord } from '../types';

/**
 * Sáu nhóm công cụ tư vấn, giữ đúng cách phân nhóm của trang nguồn thay vì tách
 * từng công cụ thành một bản ghi riêng: trang `/tu-van/cong-cu` là danh sách thẻ,
 * nên 29 thẻ chỉ có tên công cụ sẽ không nói được công cụ đó dùng khi nào.
 */
export const toolFixtures = [
  {
    id: 'tool-strategy-policy-analysis',
    kind: 'tool',
    collection: 'tools',
    slug: 'cong-cu-phan-tich-chien-luoc-va-hoach-dinh-chinh-sach',
    path: '/tu-van/cong-cu/cong-cu-phan-tich-chien-luoc-va-hoach-dinh-chinh-sach',
    locale: 'vi',
    translationKey: 'tool-strategy-policy-analysis',
    title: 'Công cụ phân tích chiến lược và hoạch định chính sách',
    summary:
      'Nhóm công cụ dùng để đọc bối cảnh, xác định vị thế và dựng lộ trình chuyển đổi cho tổ chức, ngành hoặc địa phương.',
    body: [
      {
        type: 'paragraph',
        text: 'Nhóm công cụ này được dùng ở giai đoạn đầu của một dự án tư vấn, khi cần đọc bối cảnh, xác định vị thế hiện tại và dựng lộ trình chuyển đổi cho tổ chức, ngành hoặc địa phương.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Các công cụ trong nhóm',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'SWOT / PESTEL / STEEP / TOWS matrix',
          'Mô hình Canvas (Business Model Canvas, Policy Canvas...)',
          'Lập bản đồ hệ sinh thái (ecosystem mapping)',
          'Phân tích chuỗi giá trị (Value Chain Analysis)',
          'Lập kế hoạch chiến lược & lộ trình chuyển đổi (Strategic Roadmapping)',
        ],
      },
    ],
    tags: ['tư vấn', 'chiến lược', 'chính sách'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/cong-cu-tu-van',
    sourceLabel: 'Website công khai GISA — Công cụ tư vấn',
    checkedAt: '2026-08-05',
    metadata: {
      group: 'Phân tích chiến lược và hoạch định chính sách',
      toolCount: '5',
    },
  },
  {
    id: 'tool-research-evaluation',
    kind: 'tool',
    collection: 'tools',
    slug: 'cong-cu-nghien-cuu-va-danh-gia',
    path: '/tu-van/cong-cu/cong-cu-nghien-cuu-va-danh-gia',
    locale: 'vi',
    translationKey: 'tool-research-evaluation',
    title: 'Công cụ nghiên cứu và đánh giá',
    summary:
      'Nhóm công cụ thu thập và phân tích dữ liệu, đo lường tác động và đối chiếu khoảng trống chính sách.',
    body: [
      {
        type: 'paragraph',
        text: 'Nhóm công cụ này phục vụ việc thu thập bằng chứng và kiểm chứng giả định thông qua khảo sát hiện trạng, phân tích dữ liệu, đo lường tác động và đối chiếu khoảng trống chính sách trước khi đề xuất giải pháp.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Các công cụ trong nhóm',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Khảo sát định tính và định lượng (survey, interview, FGD)',
          'Phân tích dữ liệu (data analytics, econometrics, BI tools, SPSS, Stata, R)',
          'Đánh giá tác động (Impact Assessment, EIA, SIA...)',
          'Phân tích chính sách (Policy Gap Analysis, Cost–Benefit Analysis)',
          'Trắc nghiệm và đo lường hành vi (Behavioral Assessment Tools)',
        ],
      },
    ],
    tags: ['tư vấn', 'nghiên cứu', 'đánh giá tác động'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/cong-cu-tu-van',
    sourceLabel: 'Website công khai GISA — Công cụ tư vấn',
    checkedAt: '2026-08-05',
    metadata: {
      group: 'Nghiên cứu và đánh giá',
      toolCount: '5',
    },
  },
  {
    id: 'tool-organisation-people-development',
    kind: 'tool',
    collection: 'tools',
    slug: 'cong-cu-phat-trien-to-chuc-va-nhan-su',
    path: '/tu-van/cong-cu/cong-cu-phat-trien-to-chuc-va-nhan-su',
    locale: 'vi',
    translationKey: 'tool-organisation-people-development',
    title: 'Công cụ phát triển tổ chức và nhân sự',
    summary:
      'Nhóm công cụ đánh giá năng lực, thiết kế hệ thống hiệu suất và định hình văn hóa doanh nghiệp.',
    body: [
      {
        type: 'paragraph',
        text: 'Nhóm công cụ này dùng khi tổ chức cần nhìn lại năng lực đội ngũ, thiết kế hệ thống quản lý hiệu suất và định hình văn hóa doanh nghiệp gắn với chiến lược.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Các công cụ trong nhóm',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '360° Feedback và đánh giá năng lực (Competency Framework)',
          'KPIs, OKRs và hệ thống quản lý hiệu suất',
          'Career Pathing Tools, Leadership Development Matrix',
          'Công cụ đánh giá EQ, động lực nội tại, phong cách lãnh đạo',
          'Bộ công cụ xây dựng văn hóa doanh nghiệp (Culture Mapping, Values Survey)',
        ],
      },
    ],
    tags: ['tư vấn', 'phát triển tổ chức', 'nhân sự'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/cong-cu-tu-van',
    sourceLabel: 'Website công khai GISA — Công cụ tư vấn',
    checkedAt: '2026-08-05',
    metadata: {
      group: 'Phát triển tổ chức và nhân sự',
      toolCount: '5',
    },
  },
  {
    id: 'tool-sustainable-development-advisory',
    kind: 'tool',
    collection: 'tools',
    slug: 'cong-cu-tu-van-phat-trien-ben-vung',
    path: '/tu-van/cong-cu/cong-cu-tu-van-phat-trien-ben-vung',
    locale: 'vi',
    translationKey: 'tool-sustainable-development-advisory',
    title: 'Công cụ tư vấn phát triển bền vững',
    summary:
      'Nhóm công cụ triển khai ESG, áp dụng bộ tiêu chuẩn quốc tế và thiết kế mô hình kinh tế tuần hoàn.',
    body: [
      {
        type: 'paragraph',
        text: 'Nhóm công cụ này phục vụ các dự án triển khai ESG, áp dụng bộ tiêu chuẩn quốc tế, thiết kế mô hình kinh tế tuần hoàn và theo dõi tác động xã hội – môi trường theo thời gian.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Các công cụ trong nhóm',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Đánh giá ESG (ESG Materiality Assessment)',
          'Bộ tiêu chuẩn ISO (ISO 14001, ISO 26000...)',
          'Global Reporting Initiative (GRI), SDG Compass',
          'Thiết kế mô hình kinh tế tuần hoàn, mô hình CSV, CSR',
          'Khung theo dõi và đo lường tác động xã hội – môi trường',
          'Các mô hình và chỉ số phân tích phát triển bền vững',
        ],
      },
    ],
    tags: ['tư vấn', 'phát triển bền vững', 'ESG'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/cong-cu-tu-van',
    sourceLabel: 'Website công khai GISA — Công cụ tư vấn',
    checkedAt: '2026-08-05',
    metadata: {
      group: 'Tư vấn phát triển bền vững',
      toolCount: '6',
    },
  },
  {
    id: 'tool-coaching-mentoring',
    kind: 'tool',
    collection: 'tools',
    slug: 'cong-cu-huan-luyen-va-co-van',
    path: '/tu-van/cong-cu/cong-cu-huan-luyen-va-co-van',
    locale: 'vi',
    translationKey: 'tool-coaching-mentoring',
    title: 'Công cụ huấn luyện và cố vấn',
    summary:
      'Nhóm công cụ đồng hành cùng cá nhân và đội ngũ qua các mô hình coaching, mentoring và theo dõi tiến độ phát triển.',
    body: [
      {
        type: 'paragraph',
        text: 'Nhóm công cụ này dùng cho phần đồng hành sau tư vấn, bao gồm huấn luyện cá nhân và đội ngũ theo các mô hình coaching, mentoring có cấu trúc, kèm cơ chế theo dõi tiến độ phát triển.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Các công cụ trong nhóm',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Coaching models gồm GROW, CLEAR và OSKAR',
          'Mentoring Frameworks gồm 70-20-10 và Developmental Mentoring',
          'Coaching cards, hỏi mở (powerful questions), phản hồi 2 chiều',
          'Hệ thống theo dõi tiến độ phát triển cá nhân và đội ngũ',
        ],
      },
    ],
    tags: ['tư vấn', 'huấn luyện', 'cố vấn'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/cong-cu-tu-van',
    sourceLabel: 'Website công khai GISA — Công cụ tư vấn',
    checkedAt: '2026-08-05',
    metadata: {
      group: 'Huấn luyện và cố vấn',
      toolCount: '4',
    },
  },
  {
    id: 'tool-design-innovation',
    kind: 'tool',
    collection: 'tools',
    slug: 'cong-cu-thiet-ke-va-doi-moi-sang-tao',
    path: '/tu-van/cong-cu/cong-cu-thiet-ke-va-doi-moi-sang-tao',
    locale: 'vi',
    translationKey: 'tool-design-innovation',
    title: 'Công cụ thiết kế và đổi mới sáng tạo',
    summary:
      'Nhóm công cụ thiết kế giải pháp lấy con người làm trung tâm, dựng lý thuyết thay đổi và thử nghiệm nhanh ý tưởng.',
    body: [
      {
        type: 'paragraph',
        text: 'Nhóm công cụ này dùng khi cần thiết kế giải pháp mới, đặt con người ở trung tâm, dựng lý thuyết thay đổi cho chương trình và thử nghiệm nhanh ý tưởng trước khi triển khai diện rộng.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Các công cụ trong nhóm',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Design Thinking – Human-Centered Design (HCD)',
          'Theory of Change (ToC), Logical Framework (Logframe)',
          'Innovation Audit Tools, Idea Prioritization Matrix',
          'Sprint Design, Lean Startup Tools',
        ],
      },
    ],
    tags: ['tư vấn', 'thiết kế', 'đổi mới sáng tạo'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/cong-cu-tu-van',
    sourceLabel: 'Website công khai GISA — Công cụ tư vấn',
    checkedAt: '2026-08-05',
    metadata: {
      group: 'Thiết kế và đổi mới sáng tạo',
      toolCount: '4',
    },
  },
] satisfies ContentRecord[];
