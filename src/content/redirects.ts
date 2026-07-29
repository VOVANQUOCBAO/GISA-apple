export interface LegacyRedirect {
  source: string;
  destination: string;
}

export const OLD_ROUTE_REDIRECTS: LegacyRedirect[] = [
  { source: '/cau-chuyen-gisa', destination: '/gioi-thieu/cau-chuyen-gisa' },
  { source: '/linh-vuc-hoat-dong', destination: '/gioi-thieu/linh-vuc-hoat-dong' },
  { source: '/doi-ngu-chuyen-gia-giang-vien', destination: '/chuyen-gia' },
  { source: '/quy-nha-tai-tro', destination: '/mang-luoi/quy-nha-tai-tro' },
  { source: '/linh-vuc-nghien-cuu', destination: '/nghien-cuu/linh-vuc' },
  { source: '/du-an-nghien-cuu', destination: '/nghien-cuu/du-an' },
  { source: '/bai-bao-khoa-hoc', destination: '/nghien-cuu/bai-bao-khoa-hoc' },
  { source: '/bai-bao-ung-dung', destination: '/nghien-cuu/bai-bao-ung-dung' },
  { source: '/linh-vuc-tu-van', destination: '/tu-van/linh-vuc' },
  { source: '/cong-cu-tu-van', destination: '/tu-van/cong-cu' },
  { source: '/du-an-tu-van', destination: '/tu-van/du-an' },
  { source: '/thanh-qua-dat-duoc', destination: '/tu-van/thanh-qua' },
  { source: '/linh-vuc-dao-tao', destination: '/dao-tao/linh-vuc' },
  { source: '/dao-tao-chuyen-mon-gisa-core', destination: '/dao-tao/gisa-core' },
  { source: '/trai-nghiem-thuc-chien-gisa-edge', destination: '/dao-tao/gisa-edge' },
  { source: '/but-pha-su-nghiep-gisa-rise', destination: '/dao-tao/gisa-rise' },
  { source: '/lanh-dao-thanh-cong-gisa-ascend', destination: '/dao-tao/gisa-ascend' },
  { source: '/su-nghiep-vien-man-gisa-legacy', destination: '/dao-tao/gisa-legacy' },
  { source: '/linh-vuc-ung-dung', destination: '/ung-dung/linh-vuc' },
  { source: '/quan-ly-kinh-doanh', destination: '/ung-dung/quan-ly-kinh-doanh' },
  { source: '/khoa-hoc-cong-nghe', destination: '/ung-dung/khoa-hoc-cong-nghe' },
  { source: '/kinh-te-ben-vung', destination: '/ung-dung/kinh-te-ben-vung' },
  { source: '/tam-ly-phat-trien-con-nguoi', destination: '/ung-dung/tam-ly-phat-trien-con-nguoi' },
  { source: '/thuc-day-hop-tac', destination: '/mang-luoi/thuc-day-hop-tac' },
  { source: '/doi-tac-toan-cau', destination: '/mang-luoi/doi-tac' },
  { source: '/quy-va-nha-tai-tro', destination: '/mang-luoi/quy-nha-tai-tro' },
  { source: '/kinh-te-ben-vung-1751264493', destination: '/cong-dong/kinh-te-ben-vung' },
  { source: '/trach-nhiem-xa-hoi', destination: '/cong-dong/trach-nhiem-xa-hoi' },
  { source: '/bao-ve-moi-truong', destination: '/cong-dong/bao-ve-moi-truong' },
  { source: '/quan-tri-hieu-qua', destination: '/cong-dong/quan-tri-hieu-qua' },
  { source: '/tin-tuc-1712655344', destination: '/tin-tuc' },
  { source: '/thong-bao-lich', destination: '/tin-tuc/thong-bao-lich' },
];
