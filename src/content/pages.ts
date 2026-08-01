import type { Collection, ContentBlock } from './types';

export type PageDefinition =
  | {
      template: 'hub';
      path: string;
      title: string;
      description: string;
      childPaths: string[];
    }
  | {
      template: 'listing';
      path: string;
      title: string;
      description: string;
      collection: Collection;
      filters: string[];
    }
  | { template: 'detail'; pathPattern: string; collection: Collection }
  | {
      template: 'static';
      path: string;
      title: string;
      description: string;
      blocks: ContentBlock[];
    };

const staticPage = (
  path: string,
  title: string,
  description: string,
): PageDefinition => ({ template: 'static', path, title, description, blocks: [] });

const hubPage = (
  path: string,
  title: string,
  description: string,
  childPaths: string[],
): PageDefinition => ({ template: 'hub', path, title, description, childPaths });

const listingPage = (
  path: string,
  title: string,
  description: string,
  collection: Collection,
  filters: string[] = [],
): PageDefinition => ({ template: 'listing', path, title, description, collection, filters });

export const PAGE_REGISTRY: PageDefinition[] = [
  staticPage('/', 'GISA', 'Kiến tạo kiến thức, lan tỏa giá trị.'),
  staticPage('/tim-kiem', 'Tìm kiếm', 'Tìm nội dung công khai trên website GISA.'),
  staticPage('/lien-he', 'Liên hệ', 'Kết nối với GISA qua thông tin đã được xác minh.'),
  staticPage('/dang-ky/tu-van', 'Đăng ký tư vấn', 'Gửi yêu cầu tư vấn trong giao diện mô phỏng.'),
  staticPage('/dang-ky/khoa-hoc', 'Đăng ký khóa học', 'Gửi quan tâm khóa học trong giao diện mô phỏng.'),
  staticPage('/dang-ky/hop-tac', 'Đề nghị hợp tác', 'Gửi đề nghị hợp tác trong giao diện mô phỏng.'),
  staticPage('/chinh-sach-quyen-rieng-tu', 'Chính sách quyền riêng tư', 'Thông tin quyền riêng tư dành cho các biểu mẫu.'),

  hubPage('/gioi-thieu', 'Giới thiệu', 'Tìm hiểu GISA, định hướng và lĩnh vực hoạt động.', [
    '/gioi-thieu/cau-chuyen-gisa',
    '/gioi-thieu/tam-nhin-su-menh',
    '/gioi-thieu/rises-va-sau-tru-cot',
    '/gioi-thieu/linh-vuc-hoat-dong',
    '/chuyen-gia',
  ]),
  staticPage('/gioi-thieu/cau-chuyen-gisa', 'Câu chuyện GISA', 'Nội dung giới thiệu được quản trị theo nguồn.'),
  staticPage('/gioi-thieu/tam-nhin-su-menh', 'Tầm nhìn & sứ mệnh', 'Định hướng của GISA từ nguồn đã xác minh.'),
  staticPage('/gioi-thieu/rises-va-sau-tru-cot', 'RISES và sáu trụ cột', 'Khung giá trị và trụ cột hoạt động của GISA.'),
  staticPage('/gioi-thieu/linh-vuc-hoat-dong', 'Lĩnh vực hoạt động', 'Các nhóm hoạt động chính của GISA.'),
  listingPage('/chuyen-gia', 'Chuyên gia', 'Hồ sơ chuyên gia có nguồn được xác minh.', 'experts'),
  { template: 'detail', pathPattern: '/chuyen-gia/[slug]', collection: 'experts' },

  hubPage('/nghien-cuu', 'Nghiên cứu', 'Nghiên cứu, dự án và ấn phẩm của GISA.', [
    '/nghien-cuu/linh-vuc',
    '/nghien-cuu/du-an',
    '/nghien-cuu/bai-bao-khoa-hoc',
    '/nghien-cuu/bai-bao-ung-dung',
  ]),
  staticPage('/nghien-cuu/linh-vuc', 'Lĩnh vực nghiên cứu', 'Các hướng nghiên cứu được GISA công bố.'),
  listingPage('/nghien-cuu/du-an', 'Dự án nghiên cứu', 'Dự án có nguồn và trạng thái bằng chứng.', 'projects', ['topic']),
  { template: 'detail', pathPattern: '/nghien-cuu/du-an/[slug]', collection: 'projects' },
  listingPage('/nghien-cuu/bai-bao-khoa-hoc', 'Bài báo khoa học', 'Ấn phẩm khoa học có nguồn.', 'publications', ['topic']),
  { template: 'detail', pathPattern: '/nghien-cuu/bai-bao-khoa-hoc/[slug]', collection: 'publications' },
  listingPage('/nghien-cuu/bai-bao-ung-dung', 'Bài báo ứng dụng', 'Ấn phẩm ứng dụng có nguồn.', 'publications', ['type']),
  { template: 'detail', pathPattern: '/nghien-cuu/bai-bao-ung-dung/[slug]', collection: 'publications' },

  hubPage('/tu-van', 'Tư vấn', 'Lĩnh vực, công cụ và dự án tư vấn.', [
    '/tu-van/linh-vuc', '/tu-van/cong-cu', '/tu-van/du-an', '/tu-van/thanh-qua', '/dang-ky/tu-van',
  ]),
  staticPage('/tu-van/linh-vuc', 'Lĩnh vực tư vấn', 'Phạm vi tư vấn được GISA công bố.'),
  listingPage('/tu-van/cong-cu', 'Công cụ tư vấn', 'Công cụ có nguồn công khai.', 'tools'),
  { template: 'detail', pathPattern: '/tu-van/cong-cu/[slug]', collection: 'tools' },
  listingPage('/tu-van/du-an', 'Dự án tư vấn', 'Dự án tư vấn đã được phép công bố.', 'projects'),
  { template: 'detail', pathPattern: '/tu-van/du-an/[slug]', collection: 'projects' },
  staticPage('/tu-van/thanh-qua', 'Thành quả', 'Chỉ hiển thị kết quả có nguồn hoặc được phê duyệt.'),

  hubPage('/dao-tao', 'Đào tạo', 'Các dòng chương trình và khóa học.', [
    '/dao-tao/linh-vuc', '/dao-tao/gisa-core', '/dao-tao/gisa-edge', '/dao-tao/gisa-rise',
    '/dao-tao/gisa-ascend', '/dao-tao/gisa-legacy', '/khoa-hoc', '/dang-ky/khoa-hoc',
  ]),
  staticPage('/dao-tao/linh-vuc', 'Lĩnh vực đào tạo', 'Các lĩnh vực đào tạo được GISA công bố.'),
  staticPage('/dao-tao/gisa-core', 'GISA Core', 'Dòng chương trình chuyên môn.'),
  staticPage('/dao-tao/gisa-edge', 'GISA Edge', 'Dòng chương trình trải nghiệm thực chiến.'),
  staticPage('/dao-tao/gisa-rise', 'GISA Rise', 'Dòng chương trình phát triển sự nghiệp.'),
  staticPage('/dao-tao/gisa-ascend', 'GISA Ascend', 'Dòng chương trình lãnh đạo.'),
  staticPage('/dao-tao/gisa-legacy', 'GISA Legacy', 'Dòng chương trình phát triển dài hạn.'),
  listingPage('/khoa-hoc', 'Khóa học', 'Khóa học có thông tin nguồn rõ ràng.', 'courses', ['format']),
  { template: 'detail', pathPattern: '/khoa-hoc/[slug]', collection: 'courses' },

  hubPage('/ung-dung', 'Ứng dụng', 'Chuyển giao tri thức và các lĩnh vực ứng dụng.', [
    '/ung-dung/linh-vuc', '/ung-dung/quan-ly-kinh-doanh', '/ung-dung/khoa-hoc-cong-nghe',
    '/ung-dung/kinh-te-ben-vung', '/ung-dung/tam-ly-phat-trien-con-nguoi',
  ]),
  staticPage('/ung-dung/linh-vuc', 'Lĩnh vực ứng dụng', 'Các nhóm ứng dụng được GISA công bố.'),
  staticPage('/ung-dung/quan-ly-kinh-doanh', 'Quản lý & Kinh doanh', 'Ứng dụng trong quản lý và kinh doanh.'),
  staticPage('/ung-dung/khoa-hoc-cong-nghe', 'Khoa học & Công nghệ', 'Ứng dụng khoa học và công nghệ.'),
  staticPage('/ung-dung/kinh-te-ben-vung', 'Kinh tế bền vững', 'Ứng dụng hướng tới kinh tế bền vững.'),
  staticPage('/ung-dung/tam-ly-phat-trien-con-nguoi', 'Tâm lý & Phát triển con người', 'Ứng dụng cho phát triển con người.'),
  { template: 'detail', pathPattern: '/ung-dung/[slug]', collection: 'tools' },

  hubPage('/mang-luoi', 'Mạng lưới', 'Hợp tác, đối tác, quỹ và nhà tài trợ.', [
    '/mang-luoi/thuc-day-hop-tac', '/mang-luoi/doi-tac', '/mang-luoi/quy-nha-tai-tro', '/dang-ky/hop-tac',
  ]),
  staticPage('/mang-luoi/thuc-day-hop-tac', 'Thúc đẩy hợp tác', 'Cách GISA kết nối hợp tác.'),
  listingPage('/mang-luoi/doi-tac', 'Đối tác', 'Chỉ hiển thị đối tác đã được phép công bố.', 'partners'),
  staticPage('/mang-luoi/quy-nha-tai-tro', 'Quỹ & nhà tài trợ', 'Route canonical duy nhất cho quỹ và nhà tài trợ.'),

  hubPage('/cong-dong', 'Cộng đồng', 'Các nhánh nội dung và sáng kiến cộng đồng.', [
    '/cong-dong/kinh-te-ben-vung', '/cong-dong/trach-nhiem-xa-hoi',
    '/cong-dong/bao-ve-moi-truong', '/cong-dong/quan-tri-hieu-qua',
  ]),
  listingPage('/cong-dong/kinh-te-ben-vung', 'Kinh tế bền vững', 'Sáng kiến thuộc nhánh cộng đồng.', 'initiatives', ['pillar']),
  staticPage('/cong-dong/trach-nhiem-xa-hoi', 'Trách nhiệm xã hội', 'Nội dung cộng đồng về trách nhiệm xã hội.'),
  staticPage('/cong-dong/bao-ve-moi-truong', 'Bảo vệ môi trường', 'Nội dung cộng đồng về bảo vệ môi trường.'),
  staticPage('/cong-dong/quan-tri-hieu-qua', 'Quản trị hiệu quả', 'Nội dung cộng đồng về quản trị hiệu quả.'),
  { template: 'detail', pathPattern: '/cong-dong/[slug]', collection: 'initiatives' },

  listingPage('/tin-tuc', 'Tin tức', 'Tin tức có ngày và nguồn công khai.', 'news', ['topic']),
  { template: 'detail', pathPattern: '/tin-tuc/[slug]', collection: 'news' },
  listingPage('/tin-tuc/thong-bao-lich', 'Thông báo & lịch', 'Thông báo còn hiệu lực và có nguồn.', 'notices'),
  { template: 'detail', pathPattern: '/tin-tuc/thong-bao-lich/[slug]', collection: 'notices' },
];

function matchesPattern(pattern: string, path: string): boolean {
  const expression = new RegExp(`^${pattern.replace('[slug]', '[^/]+')}$`);
  return expression.test(path);
}

export function resolvePage(path: string): PageDefinition | null {
  const fixedPage = PAGE_REGISTRY.find(
    (page) => 'path' in page && page.path === path,
  );
  if (fixedPage) return fixedPage;

  return (
    PAGE_REGISTRY.find(
      (page) =>
        !('path' in page) && matchesPattern(page.pathPattern, path),
    ) ?? null
  );
}
