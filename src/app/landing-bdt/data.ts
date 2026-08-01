/**
 * Landing page content for the "Behavioral Design Thinking for Sustainable
 * Sales & Marketing" programme.
 *
 * Everything here comes from the programme proposal document, EXCEPT the blocks
 * marked `MOCK` below — duration, tuition, cohort dates, venue, class size and
 * testimonials were not in the proposal and are placeholders for layout only.
 * Replace every `MOCK` block with confirmed information before this page is
 * linked from the public site.
 */

export const COURSE_SLUG = 'behavioral-design-thinking-for-sustainable-sales';

export const REGISTER_HREF = `/dang-ky/khoa-hoc?course=${encodeURIComponent(COURSE_SLUG)}`;

export const hero = {
  eyebrow: 'Chương trình đào tạo ứng dụng — GISA',
  titleLines: ['BEHAVIORAL', 'DESIGN THINKING'],
  titleAccent: 'for Sustainable Sales & Marketing',
  tagline: 'Thấu hiểu khách hàng — Kiến tạo giá trị — Tăng trưởng bền vững',
  lead: 'Kết hợp khoa học hành vi và tư duy thiết kế để hiểu đúng khách hàng, xác định đúng vấn đề và thiết kế giải pháp bán hàng — marketing tạo ra kết quả kinh doanh bền vững.',
};

/** MOCK — commercial facts pending confirmation. */
export const facts: Array<{ icon: string; label: string; value: string }> = [
  { icon: 'calendar', label: 'Thời lượng', value: '12 buổi · 48 giờ · 3 tháng' },
  { icon: 'training', label: 'Hình thức', value: 'Hybrid — trực tiếp & trực tuyến' },
  { icon: 'users', label: 'Sĩ số', value: 'Tối đa 24 học viên' },
  { icon: 'location', label: 'Địa điểm', value: 'GISA Campus, TP. Hồ Chí Minh' },
];

/** MOCK — cohort schedule pending confirmation. */
export const cohorts: Array<{
  code: string;
  start: string;
  deadline: string;
  mode: string;
  seats: string;
  highlight?: boolean;
}> = [
  {
    code: 'Khóa 01 / 2026',
    start: '12/09/2026',
    deadline: '05/09/2026',
    mode: 'Tối T3 & T5 · 18:30–21:30',
    seats: 'Còn 9 / 24 chỗ',
    highlight: true,
  },
  {
    code: 'Khóa 02 / 2026',
    start: '07/11/2026',
    deadline: '31/10/2026',
    mode: 'Cả ngày T7 · 08:30–16:30',
    seats: 'Đang mở đăng ký',
  },
];

/** MOCK — tuition pending confirmation. */
export const tuition: Array<{
  name: string;
  price: string;
  note: string;
  perks: string[];
  featured?: boolean;
}> = [
  {
    name: 'Ưu đãi đăng ký sớm',
    price: '15.700.000 ₫',
    note: 'Áp dụng đến 22/08/2026',
    perks: [
      'Trọn 12 buổi và toàn bộ tài liệu',
      'Coaching dự án 1-1 (2 phiên)',
      'Bộ 12 mẫu công cụ bản quyền GISA',
    ],
    featured: true,
  },
  {
    name: 'Học phí tiêu chuẩn',
    price: '18.500.000 ₫',
    note: 'Áp dụng từ 23/08/2026',
    perks: [
      'Trọn 12 buổi và toàn bộ tài liệu',
      'Coaching dự án 1-1 (2 phiên)',
      'Chứng nhận hoàn thành do GISA cấp',
    ],
  },
  {
    name: 'Nhóm doanh nghiệp',
    price: 'Giảm 15%',
    note: 'Từ 3 học viên cùng một tổ chức',
    perks: [
      'Dự án chung theo bài toán doanh nghiệp',
      'Một phiên tư vấn nội bộ sau khóa',
      'Báo cáo tổng hợp gửi ban lãnh đạo',
    ],
  },
];

export const pains: string[] = [
  'Có nhiều dữ liệu và network nhưng chưa chuyển hóa thành khách hàng.',
  'Có nhiều khách hàng hỏi nhưng tỷ lệ chốt thấp.',
  'Khách hàng thường xuyên so sánh giá và chưa nhìn thấy giá trị khác biệt.',
  'Khách hàng mua một lần nhưng không quay lại.',
  'Khách hàng hài lòng nhưng chưa sẵn sàng giới thiệu cho người khác.',
  'Sản phẩm hoặc dịch vụ chưa thực sự đáp ứng đúng nhu cầu khách hàng.',
  'Hoạt động sales và marketing còn rời rạc, ngắn hạn và phụ thuộc khuyến mãi.',
  'Cần một phương pháp thử nghiệm và cải tiến trước khi đầu tư lớn.',
];

export const foundations: Array<{
  art: string;
  name: string;
  vi: string;
  text: string;
  color: string;
}> = [
  {
    art: 'applied-research',
    color: '#006b75',
    name: 'Behavioral Science',
    vi: 'Khoa học hành vi',
    text: 'Hiểu sâu hơn về nhu cầu, động cơ, cảm xúc, niềm tin, rào cản và quá trình ra quyết định của khách hàng.',
  },
  {
    art: 'responsible-innovation',
    color: '#f15b2a',
    name: 'Design Thinking',
    vi: 'Tư duy thiết kế',
    text: 'Quy trình lấy con người làm trung tâm để xác định đúng vấn đề, kiến tạo giải pháp, thử nghiệm và cải tiến.',
  },
  {
    art: 'impact-measurement',
    color: '#69a52b',
    name: 'Sustainable Sales & Marketing',
    vi: 'Bán hàng và marketing bền vững',
    text: 'Tạo ra giá trị thực, niềm tin, trải nghiệm tích cực, quan hệ khách hàng dài hạn và kết quả kinh doanh ổn định.',
  },
];

export const journey: Array<{ en: string; vi: string }> = [
  { en: 'Know', vi: 'Biết đến' },
  { en: 'Trust', vi: 'Tin tưởng' },
  { en: 'Buy', vi: 'Mua' },
  { en: 'Use', vi: 'Sử dụng' },
  { en: 'Happy', vi: 'Hài lòng' },
  { en: 'Engage', vi: 'Gắn kết' },
  { en: 'Advocate', vi: 'Giới thiệu' },
  { en: 'Sustain', vi: 'Bền vững' },
];

export interface Stage {
  id: string;
  index: string;
  name: string;
  vi: string;
  color: string;
  contents: string[];
  questions: string[];
  outputs: string[];
}

export const stages: Stage[] = [
  {
    id: 'empathize',
    index: '01',
    name: 'EMPATHIZE',
    vi: 'Thấu hiểu khách hàng và hành vi khách hàng',
    color: '#006b75',
    contents: [
      'Nhu cầu, động cơ và kỳ vọng của khách hàng',
      'Hành vi và bối cảnh ra quyết định',
      'Functional, emotional, social và identity needs',
      'Customer interview và behavioral observation',
      'Empathy Map · Customer Journey · Jobs to Be Done',
      'Khoảng cách giữa điều khách hàng nói và điều khách hàng làm',
    ],
    questions: [
      'Khách hàng thực sự cần gì?',
      'Họ đang gặp khó khăn và thách thức nào?',
      'Tại sao họ có hành vi như hiện tại?',
      'Những nhu cầu nào chưa được nói ra?',
    ],
    outputs: [
      'Customer Behavioral Profile — Persona',
      'Empathy Map',
      'Customer Journey Map',
      'Danh sách nhu cầu, động cơ, điểm đau và insight',
    ],
  },
  {
    id: 'define',
    index: '02',
    name: 'DEFINE',
    vi: 'Xác định đúng vấn đề và rào cản khách hàng',
    color: '#1765aa',
    contents: [
      'Phân biệt symptom, problem và root cause',
      'Phân tích rào cản hành vi và customer friction',
      'Rào cản về nhận thức, niềm tin, giá trị, rủi ro và trải nghiệm',
      'Customer decision journey',
      'Behavioral Problem Statement · How Might We Questions',
      'Xác định vấn đề ưu tiên',
    ],
    questions: [
      'Tại sao khách hàng hỏi nhiều nhưng chưa chốt?',
      'Tại sao khách hàng chỉ tập trung vào giá?',
      'Tại sao khách hàng mua nhưng không sử dụng hoặc không quay lại?',
      'Vấn đề nằm ở khách hàng, sản phẩm, thông điệp, trải nghiệm hay quy trình?',
    ],
    outputs: [
      'Behavioral Barrier Map',
      'Customer Problem Statement',
      'Sales and Marketing Challenge',
      'Bộ tiêu chí đánh giá thành công của giải pháp',
    ],
  },
  {
    id: 'ideate',
    index: '03',
    name: 'IDEATE',
    vi: 'Kiến tạo giá trị và phát triển giải pháp',
    color: '#f15b2a',
    contents: [
      'Behavioral Value Ideation',
      'Value Proposition Design',
      'Product, service và offer innovation',
      'Thiết kế thông điệp và trải nghiệm',
      'Nudge, framing, social proof, simplification và choice architecture',
      'AI-assisted ideation',
      'Đánh giá theo desirability, feasibility, viability và sustainability',
    ],
    questions: [
      'Khách hàng thực sự cần sản phẩm hay kết quả nào?',
      'Làm thế nào để khách hàng nhìn thấy giá trị vượt ra ngoài giá cả?',
      'Giải pháp nào có thể giảm rào cản và gia tăng niềm tin?',
      'Làm thế nào để tạo giá trị cho cả khách hàng và doanh nghiệp?',
    ],
    outputs: [
      'Sustainable Value Proposition',
      'Danh mục ý tưởng giải pháp',
      'Customer Value Concept',
      'Giải pháp ưu tiên để phát triển prototype',
    ],
  },
  {
    id: 'prototype',
    index: '04',
    name: 'PROTOTYPE',
    vi: 'Chuyển ý tưởng thành trải nghiệm có thể kiểm chứng',
    color: '#69a52b',
    contents: [
      'Minimum Viable Offer',
      'Prototype sản phẩm hoặc dịch vụ',
      'Prototype thông điệp, landing page hoặc nội dung marketing',
      'Sales pitch và sales conversation prototype',
      'Customer onboarding prototype · Experience blueprint',
      'Thiết kế hoạt động dùng thử hoặc pilot',
    ],
    questions: [
      'Khách hàng cần nhìn thấy hoặc trải nghiệm điều gì trước khi mua?',
      'Làm thế nào để giúp khách hàng cảm nhận được giá trị?',
      'Làm thế nào để giảm rủi ro cảm nhận?',
      'Cần thu thập phản hồi gì từ khách hàng?',
    ],
    outputs: [
      'Prototype hoặc Minimum Viable Offer',
      'Kịch bản trải nghiệm khách hàng',
      'Kịch bản bán hàng hoặc truyền thông',
      'Kế hoạch thử nghiệm',
    ],
  },
  {
    id: 'test',
    index: '05',
    name: 'TEST',
    vi: 'Kiểm chứng hành vi và hoàn thiện giải pháp',
    color: '#7a5cc4',
    contents: [
      'Customer testing · Usability và experience testing',
      'Message testing · Offer testing · Pilot campaign',
      'A/B testing ở mức độ phù hợp',
      'Phân tích phản hồi định tính và định lượng',
      'Đánh giá willingness to try, to pay và to recommend',
    ],
    questions: [
      'Khách hàng có hiểu giá trị của giải pháp không?',
      'Họ có sẵn sàng dùng thử, mua hoặc giới thiệu không?',
      'Phần nào của giải pháp tạo ra giá trị?',
      'Cần giữ lại, thay đổi, bổ sung hay loại bỏ điều gì?',
    ],
    outputs: [
      'Customer Testing Report',
      'Behavioral and Business Evidence',
      'Phiên bản giải pháp đã điều chỉnh',
      'Kết luận về khả năng tiếp tục hoặc thay đổi hướng',
    ],
  },
  {
    id: 'implement',
    index: '06',
    name: 'IMPLEMENT & IMPROVE',
    vi: 'Triển khai, tạo kết quả và cải tiến liên tục',
    color: '#0b3455',
    contents: [
      'Kế hoạch triển khai 30–60–90 ngày',
      'Customer onboarding · Sales and marketing alignment',
      'Customer success và after-sales experience',
      'Retention và customer lifetime value',
      'Referral và advocacy',
      'Hệ thống đo lường, phản hồi và continuous improvement',
      'AI hỗ trợ triển khai, cá nhân hóa và phân tích dữ liệu',
    ],
    questions: [
      'Làm thế nào để chuyển từ khách hàng mua sang khách hàng sử dụng?',
      'Làm thế nào để khách hàng nhận được giá trị sớm?',
      'Làm thế nào để khách hàng sẵn sàng giới thiệu cho người khác?',
      'Làm thế nào để duy trì kết quả trong dài hạn?',
    ],
    outputs: [
      'Sustainable Sales and Marketing Action Plan',
      'Customer Retention and Referral Plan',
      'Bộ chỉ số theo dõi kết quả',
      'Dự án ứng dụng hoàn chỉnh của người học',
    ],
  },
];

export const method: Array<{ share: number; title: string; text: string; color: string }> = [
  {
    color: '#006b75',
    share: 30,
    title: 'Kiến thức nền tảng',
    text: 'Behavioral Science, Design Thinking, tâm lý khách hàng, kiến tạo giá trị và tăng trưởng bền vững.',
  },
  {
    color: '#1765aa',
    share: 30,
    title: 'Kiến thức thực tiễn',
    text: 'Tình huống doanh nghiệp, case study, công cụ, mô hình và phân tích các vấn đề sales — marketing.',
  },
  {
    color: '#f15b2a',
    share: 40,
    title: 'Thực hành và coaching',
    text: 'Làm việc trên dự án thật, nghiên cứu khách hàng, thiết kế giải pháp, prototype, testing và coaching.',
  },
];

export const deliverables: string[] = [
  'Business Challenge Statement',
  'Customer Behavioral Profile',
  'Empathy Map',
  'Customer Journey Map',
  'Behavioral Barrier Map',
  'Customer Insight',
  'Sustainable Value Proposition',
  'Sales hoặc Marketing Solution',
  'Prototype hoặc Minimum Viable Offer',
  'Customer Testing Report',
  'Kế hoạch giữ chân và phát triển khách hàng',
  'Kế hoạch triển khai 30–60–90 ngày',
];

export const outcomes: Record<'individual' | 'organisation', string[]> = {
  individual: [
    'Hiểu khách hàng sâu hơn và giảm phụ thuộc vào phỏng đoán.',
    'Chuyển data và network thành các cơ hội khách hàng phù hợp.',
    'Xác định đúng lý do khách hàng chưa mua, chưa dùng hoặc chưa quay lại.',
    'Chuyển từ cạnh tranh bằng giá sang cạnh tranh bằng giá trị.',
    'Nâng cao khả năng thiết kế sản phẩm, dịch vụ, offer và trải nghiệm.',
    'Phát triển khả năng thử nghiệm trước khi đầu tư lớn.',
    'Tự tin hơn trong giao tiếp, tư vấn và trình bày giải pháp.',
    'Xây dựng tư duy bán hàng dựa trên niềm tin và quan hệ dài hạn.',
    'Biết cách sử dụng AI hỗ trợ, không thay thế sự thấu hiểu con người.',
    'Hoàn thành một dự án thực tế có khả năng triển khai.',
  ],
  organisation: [
    'Nâng cao chất lượng customer insight.',
    'Cải thiện tỷ lệ chuyển đổi từ quan tâm sang mua hàng.',
    'Giảm sự phụ thuộc vào giảm giá và khuyến mãi.',
    'Gia tăng mức độ phù hợp của sản phẩm và dịch vụ.',
    'Cải thiện trải nghiệm khách hàng trước, trong và sau bán hàng.',
    'Tăng tỷ lệ sử dụng, mua lại và giữ chân khách hàng.',
    'Gia tăng referral và khách hàng đến từ giới thiệu.',
    'Rút ngắn quá trình thử nghiệm ý tưởng mới.',
    'Tăng phối hợp giữa sales, marketing, product và customer service.',
    'Xây dựng văn hóa lấy khách hàng làm trung tâm.',
  ],
};

export const audience: string[] = [
  'Chủ doanh nghiệp, nhà sáng lập, lãnh đạo và quản lý doanh nghiệp vừa và nhỏ',
  'Giám đốc, trưởng phòng sales, marketing hoặc phát triển kinh doanh',
  'Nhân viên bán hàng, marketing và chuyên viên phát triển thị trường',
  'Key Account Managers và nhân sự phụ trách khách hàng chiến lược',
  'Product Managers, Brand Managers và Customer Experience Managers',
  'Chuyên viên tư vấn, business coach và chuyên gia đào tạo doanh nghiệp',
  'Nhân sự phụ trách đổi mới sáng tạo và phát triển sản phẩm',
  'Người đi làm muốn nâng cao năng lực thấu hiểu khách hàng và kiến tạo giá trị',
];

export const learningFormats: string[] = [
  'Học tập tương tác trên lớp',
  'Phân tích tình huống doanh nghiệp',
  'Workshop sử dụng công cụ',
  'Fieldwork và nghiên cứu khách hàng',
  'Thực hành phỏng vấn và quan sát',
  'Phát triển prototype',
  'Thử nghiệm với khách hàng',
  'Peer review & group coaching',
  'Project clinic',
  'Phản biện từ giảng viên và chuyên gia',
  'Trình bày dự án cuối khóa',
  'Hoạt động ngoại khóa và networking',
];

export const instructors: Array<{ name: string; title: string; org: string }> = [
  {
    name: 'ThS. Trần Anh Khang',
    org: 'Viện Phát triển Bền vững & Quản lý Nâng cao Toàn cầu — GISA',
    title: 'Phó Viện trưởng',
  },
  {
    name: 'TS. Hoàng Văn Việt',
    org: 'Viện Phát triển Bền vững & Quản lý Nâng cao Toàn cầu — GISA',
    title: 'Giảng viên phụ trách',
  },
];

/**
 * MOCK — placeholder testimonials for layout only. These are NOT real quotes
 * from real people. The section renders a visible "dữ liệu mẫu" badge so the
 * page cannot be published as-is with fabricated reviews.
 */
export const testimonials: Array<{ quote: string; who: string; role: string }> = [
  {
    quote: 'Nội dung minh họa — thay bằng phản hồi thật của học viên sau khóa đầu tiên.',
    role: 'Giám đốc kinh doanh, doanh nghiệp SME',
    who: 'Học viên A',
  },
  {
    quote: 'Nội dung minh họa — thay bằng phản hồi thật của học viên sau khóa đầu tiên.',
    role: 'Trưởng phòng Marketing, ngành dịch vụ',
    who: 'Học viên B',
  },
  {
    quote: 'Nội dung minh họa — thay bằng phản hồi thật của học viên sau khóa đầu tiên.',
    role: 'Nhà sáng lập, thương hiệu tiêu dùng',
    who: 'Học viên C',
  },
];

export const faqs: Array<{ q: string; a: string }> = [
  {
    a: 'Không. Chương trình được thiết kế theo tỷ lệ 30% nền tảng — 30% thực tiễn — 40% thực hành và coaching. Mỗi học viên mang vào một bài toán sales hoặc marketing thật của mình và giải quyết bài toán đó xuyên suốt sáu giai đoạn.',
    q: 'Chương trình có nặng lý thuyết không?',
  },
  {
    a: 'Có. Nhiều nội dung như Empathy Map, Behavioral Barrier Map, Value Proposition hay Minimum Viable Offer đều áp dụng được cho cá nhân kinh doanh, freelancer và doanh nghiệp siêu nhỏ, không chỉ cho tổ chức lớn.',
    q: 'Tôi kinh doanh cá nhân, chương trình có phù hợp không?',
  },
  {
    a: 'Không bắt buộc. Chương trình sử dụng AI như một công cụ hỗ trợ phân tích, sáng tạo và cá nhân hóa. Giảng viên hướng dẫn trực tiếp trong các buổi ideation và triển khai.',
    q: 'Có cần biết trước về AI hoặc công cụ phân tích không?',
  },
  {
    a: 'Nguyên tắc xuyên suốt là "Influence for Value — Not Manipulation for Conversion". Các nguyên lý khoa học hành vi được dùng để giúp khách hàng hiểu rõ lựa chọn và giảm cảm nhận rủi ro, không dùng để gây áp lực hay tạo hiểu lầm.',
    q: 'Chương trình có dạy kỹ thuật thúc ép khách hàng không?',
  },
  {
    a: 'Học viên hoàn thành dự án nhận chứng nhận do GISA cấp, kèm bộ 12 sản phẩm ứng dụng và kế hoạch triển khai 30–60–90 ngày cho bài toán của mình.',
    q: 'Kết thúc khóa học tôi nhận được gì?',
  },
];
