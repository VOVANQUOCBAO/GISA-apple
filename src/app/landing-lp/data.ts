/**
 * Landing page content for "Tâm lý học Lãnh đạo — Chuyển hóa từ bên trong".
 *
 * Everything here comes from the programme proposal, EXCEPT blocks marked
 * `MOCK` — cohort dates, tuition and testimonials were not in the proposal and
 * stand in for layout only. Replace them before this page is linked publicly.
 */

export const COURSE_SLUG = 'leadership-psychology-transformation';

export const REGISTER_HREF = `/dang-ky/khoa-hoc?course=${encodeURIComponent(COURSE_SLUG)}`;

export const hero = {
  eyebrow: 'Chương trình phát triển lãnh đạo — GISA',
  title: 'TÂM LÝ HỌC LÃNH ĐẠO',
  subtitle: 'Chuyển hóa từ bên trong — Vươn tới nhà lãnh đạo xuất sắc',
  tagline: 'Nâng tầm bản thân · Dẫn dắt người khác · Kiến tạo giá trị',
  lead: 'Muốn dẫn dắt người khác hiệu quả, trước hết phải hiểu và dẫn dắt được chính mình.',
};

/** MOCK — commercial facts pending confirmation. */
export const facts: Array<{ label: string; value: string }> = [
  { label: 'Thời lượng', value: '12 buổi · 50–60 giờ' },
  { label: 'Quy mô', value: '60–80 học viên mỗi khóa' },
  { label: 'Hình thức', value: 'Trực tiếp & trực tuyến' },
  { label: 'Khai giảng', value: '03/10/2026' },
];

export const openingStatement = {
  eyebrow: 'Khoảng cách ít ai nói đến',
  title: 'GIỎI CHUYÊN MÔN KHÔNG TỰ ĐỘNG THÀNH LÃNH ĐẠO GIỎI',
  body: [
    'Rất nhiều người sở hữu năng lực chuyên môn tốt, tinh thần trách nhiệm cao và khát vọng phát triển mạnh mẽ. Nhưng khi chuyển từ vai trò người thực hiện sang vai trò dẫn dắt người khác, những yếu tố quyết định thành công không còn chỉ là kiến thức hay kỹ năng nghề nghiệp.',
    'Khả năng thấu hiểu bản thân, quản trị cảm xúc, làm chủ hành vi, tạo ảnh hưởng tích cực, xây dựng niềm tin và phát triển con người mới là những năng lực cốt lõi của lãnh đạo.',
  ],
};

export const comparison: Array<{ traditional: string; ours: string }> = [
  { ours: 'Tập trung vào chuyển hóa lãnh đạo', traditional: 'Tập trung vào kỹ năng lãnh đạo' },
  { ours: 'Tập trung vào nhận thức, kết quả', traditional: 'Tập trung vào thông tin, kiến thức' },
  { ours: 'Học cách dẫn dắt bản thân trước', traditional: 'Học cách quản lý người khác' },
  { ours: 'Tư duy, hành vi và phát triển con người', traditional: 'Công cụ và kỹ thuật' },
  { ours: 'Phát triển năng lực lãnh đạo bền vững', traditional: 'Phát triển năng lực quản lý' },
  { ours: 'Học để phát triển sự nghiệp cao hơn', traditional: 'Học để làm tốt hơn' },
];

export const utli: Array<{
  letter: string;
  en: string;
  vi: string;
  text: string;
}> = [
  {
    en: 'Understand Yourself',
    letter: 'U',
    text: 'Nhận diện giá trị, động lực, điểm mạnh, điểm hạn chế và các khuôn mẫu hành vi đang định hình cuộc sống và sự nghiệp của mỗi cá nhân.',
    vi: 'Hiểu bản thân',
  },
  {
    en: 'Transform Yourself',
    letter: 'T',
    text: 'Điều chỉnh tư duy, cảm xúc, thói quen và hành vi nhằm trở thành phiên bản tốt hơn của chính mình.',
    vi: 'Chuyển hóa bản thân',
  },
  {
    en: 'Lead Others',
    letter: 'L',
    text: 'Phát triển khả năng tạo ảnh hưởng tích cực, xây dựng niềm tin, truyền cảm hứng, phát triển và dẫn dắt đội ngũ.',
    vi: 'Dẫn dắt người khác',
  },
  {
    en: 'Create Impact',
    letter: 'I',
    text: 'Tạo ra những kết quả tích cực và bền vững cho tổ chức, cộng đồng và xã hội.',
    vi: 'Kiến tạo giá trị và ảnh hưởng',
  },
];

export const pillars: Array<{ index: string; title: string; text: string }> = [
  {
    index: '01',
    text: 'Trang bị những hiểu biết cốt lõi về tâm lý học, khoa học hành vi, tư duy phát triển, trí tuệ cảm xúc và tâm lý học lãnh đạo.',
    title: 'Nền tảng khoa học về hành vi con người và phát triển lãnh đạo',
  },
  {
    index: '02',
    text: 'Giúp học viên khám phá bản thân, đánh giá hiện trạng, xác định tầm nhìn và xây dựng chiến lược phát triển cá nhân.',
    title: 'Hành trình chuyển hóa lãnh đạo',
  },
  {
    index: '03',
    text: 'Chuyển hóa nhận thức thành hành động thông qua thực hành, peer-coaching, phản hồi và ứng dụng thực tế trong môi trường của mỗi người.',
    title: 'Thực hành và Peer-Coaching',
  },
  {
    index: '04',
    text: 'Mở rộng mối quan hệ, học hỏi từ cộng đồng và xây dựng những nguồn lực cho sự phát triển lâu dài.',
    title: 'Kết nối và xây dựng vốn xã hội',
  },
];

export const philosophy = [
  'Không chỉ học để biết.',
  'Không chỉ học để làm.',
  'Mà học để chuyển hóa và tạo ra những kết quả có ý nghĩa.',
];

export const methods: Array<{ en: string; vi: string }> = [
  { en: 'Evidence-Based Learning', vi: 'Học tập dựa trên bằng chứng khoa học' },
  { en: 'Experiential Learning', vi: 'Học tập trải nghiệm và phản tư' },
  { en: 'Coaching & Mentoring', vi: 'Đồng hành cá nhân hóa' },
  { en: 'Peer Learning', vi: 'Học tập đồng đẳng' },
  { en: 'Action Learning', vi: 'Học tập thông qua hành động' },
  { en: 'Community-Based Learning', vi: 'Học tập trong cộng đồng phát triển' },
];

/**
 * The proposal lists these four lines under "12 buổi" without reconciling the
 * arithmetic (6 + 6 describes content; 3 + 3 describes delivery). Rendered as
 * written rather than re-derived — confirm the intended split with the faculty.
 */
export const formatBreakdown: Array<{ count: string; text: string }> = [
  { count: '06', text: 'buổi học tập trung nền tảng và chuyển hóa' },
  { count: '06', text: 'buổi thực hành, coaching và networking' },
  { count: '03', text: 'buổi trực tuyến' },
  { count: '03', text: 'buổi trực tiếp và kết nối' },
];

export const objectives: Array<{ en: string; vi: string; text: string }> = [
  {
    en: 'Self-Awareness',
    text: 'Hiểu rõ giá trị, động lực, điểm mạnh, điểm hạn chế và các khuôn mẫu hành vi đang ảnh hưởng đến cuộc sống, công việc và sự phát triển nghề nghiệp.',
    vi: 'Thấu hiểu bản thân',
  },
  {
    en: 'Self-Transformation',
    text: 'Phát triển tư duy, cảm xúc, thói quen và năng lực cần thiết để thích nghi, trưởng thành và phát huy tối đa tiềm năng của bản thân.',
    vi: 'Chuyển hóa bản thân',
  },
  {
    en: 'Leadership Capability',
    text: 'Nâng cao khả năng giao tiếp, tạo ảnh hưởng, xây dựng niềm tin, truyền động lực và phát triển đội ngũ.',
    vi: 'Dẫn dắt người khác',
  },
  {
    en: 'Create Impact',
    text: 'Tạo ra những kết quả tích cực cho tổ chức, cộng đồng và xã hội thông qua năng lực lãnh đạo hiệu quả và có trách nhiệm.',
    vi: 'Kiến tạo giá trị và ảnh hưởng',
  },
];

export const valueGroups: Array<{ title: string; items: string[] }> = [
  {
    items: [
      'Hiểu rõ bản thân hơn',
      'Gia tăng khả năng tự nhận thức',
      'Nâng cao trí tuệ cảm xúc và khả năng thích nghi',
      'Phát triển tư duy lãnh đạo và tinh thần trách nhiệm',
    ],
    title: 'Về bản thân',
  },
  {
    items: [
      'Giao tiếp hiệu quả hơn',
      'Tạo ảnh hưởng tích cực hơn',
      'Quản lý con người hiệu quả hơn',
      'Nâng cao năng lực ra quyết định và giải quyết vấn đề',
    ],
    title: 'Về năng lực lãnh đạo',
  },
  {
    items: [
      'Có lộ trình phát triển lãnh đạo rõ ràng',
      'Có chiến lược và kế hoạch hành động cụ thể',
      'Gia tăng khả năng được giao nhiệm vụ, bổ nhiệm và thăng tiến',
    ],
    title: 'Về phát triển sự nghiệp',
  },
  {
    items: [
      'Xây dựng mạng lưới quan hệ chất lượng cao',
      'Kết nối với những người cùng chí hướng',
      'Mở rộng cơ hội nghề nghiệp, hợp tác và phát triển kinh doanh',
    ],
    title: 'Về mạng lưới và cơ hội',
  },
];

export const careerLadder: Array<{ step: string; title: string; text: string }> = [
  {
    step: 'I',
    text: 'Phát triển năng lực đào tạo, hướng dẫn và điều phối học tập.',
    title: 'Train-the-Trainers (TTT)',
  },
  {
    step: 'II',
    text: 'Đồng hành cùng giảng viên trong các khóa học và chương trình tiếp theo.',
    title: 'Trợ giảng',
  },
  {
    step: 'III',
    text: 'Trở thành Giảng viên, Facilitator hoặc Coach trong hệ sinh thái GISA.',
    title: 'Giảng viên · Facilitator · Coach',
  },
  {
    step: 'IV',
    text: 'Tham gia cộng đồng chuyên gia, mở rộng cơ hội hợp tác và triển khai chương trình phát triển lãnh đạo.',
    title: 'Cộng đồng chuyên gia',
  },
];

export const deliverables: Array<{ en: string; vi: string }> = [
  { en: 'Leadership Readiness Assessment', vi: 'Đánh giá năng lực lãnh đạo' },
  { en: 'Leadership Development Profile', vi: 'Hồ sơ phát triển lãnh đạo' },
  { en: 'Personal Transformation Plan', vi: 'Kế hoạch chuyển đổi cá nhân' },
  { en: 'Leadership Action Project', vi: 'Dự án hành động lãnh đạo' },
  { en: 'Peer Coaching Network', vi: 'Mạng lưới huấn luyện đồng nghiệp' },
  { en: 'Certificate of Completion', vi: 'Chứng chỉ hoàn thành khóa học' },
];

export const audience: string[] = [
  'Người đi làm từ 23–35 tuổi',
  'Cá nhân có từ 2–10 năm kinh nghiệm làm việc',
  'Chuyên viên, trưởng nhóm hoặc giám sát đang chuẩn bị cho vị trí quản lý',
  'Người có tiềm năng lãnh đạo và mong muốn phát triển sự nghiệp nhanh hơn',
  'Nhà sáng lập trẻ, chủ doanh nghiệp muốn nâng cao năng lực lãnh đạo đội ngũ',
  'Cá nhân đang tìm kiếm sự chuyển hóa và phát triển toàn diện',
];

export const instructors: Array<{ name: string; title: string }> = [
  { name: 'ThS. Trần Anh Khang', title: 'Phó Viện trưởng — GISA' },
  { name: 'TS. Hoàng Văn Việt', title: 'Giảng viên phụ trách' },
];

/** MOCK — tuition and cohort pending confirmation. */
export const enrolment = {
  cohort: 'Khóa 01 / 2026',
  deadline: '26/09/2026',
  earlyPrice: '21.000.000 ₫',
  earlyUntil: 'Ghi danh trước 12/09/2026',
  groupNote: 'Từ 3 học viên cùng tổ chức — giảm 12%',
  schedule: 'Tối T4 & sáng T7',
  seats: 'Nhận 60–80 học viên · nhóm đồng hành 8–10 người',
  start: '03/10/2026',
  standardPrice: '24.800.000 ₫',
};

export const closingQuote = {
  en: 'Leadership is not a destination. It is a lifelong journey of understanding, transformation, influence and impact.',
  vi: 'Lãnh đạo không phải là một đích đến, mà là hành trình không ngừng thấu hiểu, chuyển hóa, dẫn dắt và kiến tạo giá trị.',
};
