import type { ContentRecord } from '../types';

/**
 * Trang "Đội ngũ chuyên gia & giảng viên" của gisa.edu.vn công bố đúng ba dòng cho
 * mỗi hồ sơ: họ tên kèm học hàm/học vị, chức danh và nơi công tác, rồi danh sách
 * lĩnh vực chuyên môn. Fixture giữ nguyên ba dòng đó và không suy diễn thêm tiểu
 * sử, vì mọi chi tiết ngoài trang nguồn đều chưa có bằng chứng riêng.
 */
const SOURCE_URL = 'https://gisa.edu.vn/doi-ngu-chuyen-gia-giang-vien';
const SOURCE_LABEL = 'Website công khai GISA — trang đội ngũ chuyên gia & giảng viên';
const CHECKED_AT = '2026-08-05';

interface ExpertSeed {
  affiliation: string;
  expertise: string[];
  id: string;
  image?: ContentRecord['image'];
  slug: string;
  tags: string[];
  title: string;
}

const seeds: ExpertSeed[] = [
  {
    id: 'expert-hoang-van-viet',
    slug: 'hoang-van-viet',
    title: 'TS. Hoàng Văn Việt',
    affiliation: 'Giảng viên - Đại học Kinh tế TP.HCM (UEH)',
    expertise: ['Phát triển Bền vững', 'Tâm lý học', 'Nghiên cứu Khoa học'],
    image: {
      alt: 'Chân dung TS. Hoàng Văn Việt',
      height: 615,
      src: '/images/experts/hoang-van-viet.png',
      width: 405,
    },
    tags: ['phát triển bền vững', 'tâm lý học'],
  },
  {
    id: 'expert-le-khanh-lam',
    slug: 'le-khanh-lam',
    title: 'TS. Lê Khánh Lâm',
    affiliation: 'Chủ tịch HĐTV & Phó Tổng Giám đốc - RSM Việt Nam',
    expertise: ['Thuế', 'Quản trị rủi ro', 'Quản trị doanh nghiệp'],
    tags: ['quản trị', 'tài chính'],
  },
  {
    id: 'expert-tran-anh-khang',
    slug: 'tran-anh-khang',
    title: 'ThS. NCS.TS Trần Anh Khang',
    affiliation: 'Tổng Giám đốc Công ty Đầu tư Giáo dục Quốc tế Engonow',
    expertise: ['Quản trị Vận hành', 'Ứng dụng AI trong Kinh doanh & Networking'],
    image: {
      alt: 'Chân dung ThS. NCS.TS Trần Anh Khang',
      height: 1487,
      src: '/images/experts/tran-anh-khang.png',
      width: 1058,
    },
    tags: ['quản trị', 'công nghệ'],
  },
  {
    id: 'expert-attila-jambor',
    slug: 'attila-jambor',
    title: 'GS. TS. Attila Jambor',
    affiliation:
      'Viện trưởng Viện Phát triển Bền vững, Đại học Corvinus Budapest',
    expertise: ['Phát triển kinh tế', 'An ninh Lương thực', 'Phát triển Bền vững'],
    tags: ['phát triển bền vững', 'kinh tế'],
  },
  {
    id: 'expert-marion-drut',
    slug: 'marion-drut',
    title: 'Dr. Marion Drut',
    affiliation: 'Giảng viên - Đại học Lille',
    expertise: ['Phát triển bền vững', 'Kinh tế học'],
    tags: ['phát triển bền vững', 'kinh tế'],
  },
  {
    id: 'expert-konstadinos-mattas',
    slug: 'konstadinos-mattas',
    title: 'Prof. Konstadinos Mattas',
    affiliation: 'Giảng viên - Đại học Aristotle',
    expertise: ['Phát triển nông nghiệp', 'Tiếp thị & Đầu tư', 'Thương mại quốc tế'],
    tags: ['nông nghiệp', 'kinh tế quốc tế'],
  },
  {
    id: 'expert-marina-tomic-maksan',
    slug: 'marina-tomic-maksan',
    title: 'Prof. Marina Tomić Maksan',
    affiliation: 'Giảng viên - Đại học Zagreb',
    expertise: ['Tiếp thị Nông nghiệp', 'Hành vi Người tiêu dùng', 'Tiếp thị số'],
    tags: ['marketing', 'hành vi người tiêu dùng'],
  },
  {
    id: 'expert-thomas-pomeon',
    slug: 'thomas-pomeon',
    title: 'Dr. Thomas Poméon',
    affiliation:
      'Tiến sĩ Kỹ thuật - Viện Nghiên cứu Quốc gia Pháp về Nông nghiệp, Thực phẩm và Môi trường (INRAE)',
    expertise: ['Phát triển nông thôn', 'Phân tích Chính sách công và Kinh tế'],
    tags: ['nông thôn', 'chính sách công'],
  },
  {
    id: 'expert-jack-peerlings',
    slug: 'jack-peerlings',
    title: 'Prof. Jack Peerlings',
    affiliation: 'Giảng viên - Đại học Wageningen',
    expertise: ['Kinh tế nông nghiệp', 'Nghiên cứu, giảng dạy & tư vấn chính sách'],
    tags: ['nông nghiệp', 'chính sách công'],
  },
  {
    id: 'expert-orachos-napasintuwong',
    slug: 'orachos-napasintuwong',
    title: 'Prof. Orachos Napasintuwong',
    affiliation: 'Phó giáo sư - Đại học Kasetsart',
    expertise: ['Chính sách Nông nghiệp', 'Hệ thống Thực phẩm', 'Kinh tế học'],
    tags: ['nông nghiệp', 'chính sách công'],
  },
  {
    id: 'expert-agata-malak-rawlikowska',
    slug: 'agata-malak-rawlikowska',
    title: 'Prof. Agata Malak-Rawlikowska',
    affiliation: 'Phó giáo sư - Đại học Khoa học Đời sống Warsaw',
    expertise: [
      'Phát triển nông thôn & nông nghiệp',
      'Khởi nghiệp & Quản trị chiến lược',
    ],
    tags: ['nông thôn', 'quản trị'],
  },
  {
    id: 'expert-jelena-filipovic',
    slug: 'jelena-filipovic',
    title: 'Prof. Jelena Filipovic',
    affiliation: 'Giáo sư - Đại học Belgrade',
    expertise: ['Tiếp thị số & Thương mại điện tử', 'Hành vi người tiêu dùng'],
    tags: ['marketing', 'hành vi người tiêu dùng'],
  },
  {
    id: 'expert-nina-maria-saviolidis',
    slug: 'nina-maria-saviolidis',
    title: 'Prof. Nína María Saviolidis',
    affiliation: 'Giảng viên - Đại học Iceland',
    expertise: [
      'Trách nhiệm xã hội của doanh nghiệp',
      'Quản trị doanh nghiệp',
    ],
    tags: ['quản trị', 'phát triển bền vững'],
  },
  {
    id: 'expert-natalia-yannopoulou',
    slug: 'natalia-yannopoulou',
    title: 'Prof. Natalia Yannopoulou',
    affiliation: 'Giảng viên - Đại học Newcastle',
    expertise: ['Quảng cáo', 'Truyền thông & Marketing'],
    tags: ['marketing', 'truyền thông'],
  },
  {
    id: 'expert-carmen-hubbard',
    slug: 'carmen-hubbard',
    title: 'Prof. Carmen Hubbard',
    affiliation: 'Giảng viên - Đại học Newcastle',
    expertise: ['Kinh tế học', 'Hành vi người tiêu dùng', 'Đổi mới sáng tạo'],
    tags: ['kinh tế', 'đổi mới sáng tạo'],
  },
  {
    id: 'expert-matthew-gorton',
    slug: 'matthew-gorton',
    title: 'Prof. Matthew Gorton',
    affiliation: 'Giảng viên - Đại học Newcastle',
    expertise: ['Marketing', 'Quản trị Thương hiệu', 'Hành vi người tiêu dùng'],
    tags: ['marketing', 'hành vi người tiêu dùng'],
  },
  {
    id: 'expert-phan-thi-kim-anh',
    slug: 'phan-thi-kim-anh',
    title: 'TS. Phan Thị Kim Anh',
    affiliation: 'Giảng viên - Trường Đại học Công nghệ Hutech',
    expertise: [],
    tags: ['đào tạo'],
  },
  {
    id: 'expert-ngo-thanh-hanh',
    slug: 'ngo-thanh-hanh',
    title: 'ThS. Ngô Thanh Hạnh',
    affiliation: 'Giám đốc Công ty TNHH Đào tạo và Tư vấn THTAX',
    expertise: ['Kế toán, Đại lý Thuế và Pháp lý'],
    tags: ['kế toán', 'thuế'],
  },
  {
    id: 'expert-nguyen-thi-nhat-phuong',
    slug: 'nguyen-thi-nhat-phuong',
    title: 'ThS. Nguyễn Thị Nhất Phương',
    affiliation: 'Nghiên cứu viên GISA, Chánh văn phòng',
    expertise: [],
    tags: ['nghiên cứu'],
  },
  {
    id: 'expert-nguyen-van-hung',
    slug: 'nguyen-van-hung',
    title: 'ThS. Nguyễn Văn Hùng',
    affiliation: 'Giảng viên - Trường Đại học Kinh tế - Tài chính TP. HCM',
    expertise: [],
    tags: ['đào tạo'],
  },
];

export const expertFixtures = seeds.map((seed) => ({
  id: seed.id,
  kind: 'expert',
  collection: 'experts',
  slug: seed.slug,
  path: `/chuyen-gia/${seed.slug}`,
  locale: 'vi',
  translationKey: seed.id,
  title: seed.title,
  summary: seed.affiliation,
  ...(seed.image ? { image: seed.image } : {}),
  body: [
    { type: 'paragraph', text: seed.affiliation },
    ...(seed.expertise.length
      ? ([
          { type: 'heading', level: 3, text: 'Lĩnh vực chuyên môn' },
          { type: 'list', ordered: false, items: seed.expertise },
        ] as const)
      : []),
    {
      type: 'paragraph',
      text: 'Trang nguồn chỉ công bố chức danh, nơi công tác và lĩnh vực chuyên môn. Tiểu sử đầy đủ, danh mục công bố và thông tin liên hệ cần được xác minh riêng trước khi bổ sung.',
    },
  ],
  tags: seed.tags,
  evidenceStatus: 'verified',
  sourceUrl: SOURCE_URL,
  sourceLabel: SOURCE_LABEL,
  checkedAt: CHECKED_AT,
  metadata: seed.expertise.length ? { expertise: seed.expertise } : {},
})) satisfies ContentRecord[];
