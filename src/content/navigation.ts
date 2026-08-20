export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationGroup extends NavigationItem {
  children: NavigationItem[];
}

export const NAVIGATION: NavigationGroup[] = [
  {
    label: 'Giới thiệu',
    href: '/gioi-thieu/cau-chuyen-gisa',
    children: [
      { label: 'Câu chuyện GISA', href: '/gioi-thieu/cau-chuyen-gisa' },
      { label: 'Lĩnh vực hoạt động', href: '/gioi-thieu/linh-vuc-hoat-dong' },
      { label: 'Đội ngũ chuyên gia', href: '/chuyen-gia' },
    ],
  },
  {
    label: 'Nghiên cứu',
    href: '/nghien-cuu/linh-vuc',
    children: [
      { label: 'Lĩnh vực nghiên cứu', href: '/nghien-cuu/linh-vuc' },
      { label: 'Dự án nghiên cứu', href: '/nghien-cuu/du-an' },
      { label: 'Bài báo khoa học', href: '/nghien-cuu/bai-bao-khoa-hoc' },
      { label: 'Bài báo ứng dụng', href: '/nghien-cuu/bai-bao-ung-dung' },
    ],
  },
  {
    label: 'Tư vấn',
    href: '/tu-van/linh-vuc',
    children: [
      { label: 'Lĩnh vực tư vấn', href: '/tu-van/linh-vuc' },
      { label: 'Công cụ tư vấn', href: '/tu-van/cong-cu' },
      { label: 'Dự án tư vấn', href: '/tu-van/du-an' },
      { label: 'Thành quả', href: '/tu-van/thanh-qua' },
      { label: 'Đăng ký tư vấn', href: '/dang-ky/tu-van' },
    ],
  },
  {
    label: 'Đào tạo',
    href: '/dao-tao/linh-vuc',
    children: [
      { label: 'Lĩnh vực đào tạo', href: '/dao-tao/linh-vuc' },
      { label: 'GISA Core', href: '/dao-tao/gisa-core' },
      { label: 'GISA Edge', href: '/dao-tao/gisa-edge' },
      { label: 'GISA Rise', href: '/dao-tao/gisa-rise' },
      { label: 'GISA Ascend', href: '/dao-tao/gisa-ascend' },
      { label: 'GISA Legacy', href: '/dao-tao/gisa-legacy' },
      { label: 'Khóa học', href: '/khoa-hoc' },
      { label: 'Đăng ký khóa học', href: '/dang-ky/khoa-hoc' },
    ],
  },
  {
    label: 'Ứng dụng',
    href: '/ung-dung/linh-vuc',
    children: [
      { label: 'Lĩnh vực ứng dụng', href: '/ung-dung/linh-vuc' },
      { label: 'Quản lý & Kinh doanh', href: '/ung-dung/quan-ly-kinh-doanh' },
      { label: 'Khoa học & Công nghệ', href: '/ung-dung/khoa-hoc-cong-nghe' },
      { label: 'Kinh tế bền vững', href: '/ung-dung/kinh-te-ben-vung' },
      { label: 'Tâm lý & Phát triển con người', href: '/ung-dung/tam-ly-phat-trien-con-nguoi' },
    ],
  },
  {
    label: 'Mạng lưới',
    href: '/mang-luoi/thuc-day-hop-tac',
    children: [
      { label: 'Thúc đẩy hợp tác', href: '/mang-luoi/thuc-day-hop-tac' },
      { label: 'Đối tác', href: '/mang-luoi/doi-tac' },
      { label: 'Quỹ & nhà tài trợ', href: '/mang-luoi/quy-nha-tai-tro' },
      { label: 'Đề nghị hợp tác', href: '/dang-ky/hop-tac' },
    ],
  },
  {
    label: 'Cộng đồng',
    href: '/cong-dong/kinh-te-ben-vung',
    children: [
      { label: 'Kinh tế bền vững', href: '/cong-dong/kinh-te-ben-vung' },
      { label: 'Trách nhiệm xã hội', href: '/cong-dong/trach-nhiem-xa-hoi' },
      { label: 'Bảo vệ môi trường', href: '/cong-dong/bao-ve-moi-truong' },
      { label: 'Quản trị hiệu quả', href: '/cong-dong/quan-tri-hieu-qua' },
    ],
  },
  {
    label: 'Tin tức',
    href: '/tin-tuc',
    children: [
      { label: 'Thông báo & lịch', href: '/tin-tuc/thong-bao-lich' },
    ],
  },
];

export const LEGACY_MENU_PATHS = [
  '/gioi-thieu',
  '/nghien-cuu',
  '/tu-van',
  '/dao-tao',
  '/mang-luoi',
  '/cong-dong',
  '/tin-tuc',
  '/cau-chuyen-gisa',
  '/linh-vuc-hoat-dong',
  '/doi-ngu-chuyen-gia-giang-vien',
  '/quy-nha-tai-tro',
  '/linh-vuc-nghien-cuu',
  '/du-an-nghien-cuu',
  '/bai-bao-khoa-hoc',
  '/bai-bao-ung-dung',
  '/linh-vuc-tu-van',
  '/cong-cu-tu-van',
  '/du-an-tu-van',
  '/thanh-qua-dat-duoc',
  '/linh-vuc-dao-tao',
  '/dao-tao-chuyen-mon-gisa-core',
  '/trai-nghiem-thuc-chien-gisa-edge',
  '/but-pha-su-nghiep-gisa-rise',
  '/lanh-dao-thanh-cong-gisa-ascend',
  '/su-nghiep-vien-man-gisa-legacy',
  '/linh-vuc-ung-dung',
  '/quan-ly-kinh-doanh',
  '/khoa-hoc-cong-nghe',
  '/kinh-te-ben-vung',
  '/tam-ly-phat-trien-con-nguoi',
  '/thuc-day-hop-tac',
  '/doi-tac-toan-cau',
  '/quy-va-nha-tai-tro',
  '/kinh-te-ben-vung-1751264493',
  '/trach-nhiem-xa-hoi',
  '/bao-ve-moi-truong',
  '/quan-tri-hieu-qua',
  '/tin-tuc-1712655344',
  '/thong-bao-lich',
] as const;
