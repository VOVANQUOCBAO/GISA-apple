import { blocksForPath } from './static-blocks';
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
      /**
       * Bộ lọc trang tự áp, người xem không đổi được. Dùng khi hai trang danh sách
       * cùng đọc một collection nhưng phải hiển thị hai tập khác nhau — ví dụ dự án
       * nghiên cứu và dự án tư vấn đều nằm trong `projects`. Không có nó thì hai
       * trang hiện y hệt nhau.
       */
      fixedFilters?: Record<string, string>;
    }
  | { template: 'detail'; pathPattern: string; collection: Collection }
  | {
      template: 'static';
      path: string;
      title: string;
      description: string;
      blocks: ContentBlock[];
    };

/**
 * Thân trang lấy từ `static-blocks` theo đúng route, nên trang menu nào đã có
 * nội dung biên tập thì hiển thị luôn; trang chức năng chưa có khóa vẫn giữ
 * mảng rỗng như trước.
 */
const staticPage = (
  path: string,
  title: string,
  description: string,
): PageDefinition => ({
  template: 'static',
  path,
  title,
  description,
  blocks: blocksForPath(path),
});

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
  fixedFilters?: Record<string, string>,
): PageDefinition => ({
  template: 'listing',
  path,
  title,
  description,
  collection,
  filters,
  fixedFilters,
});

export const PAGE_REGISTRY: PageDefinition[] = [
  staticPage('/', 'GISA', 'Kiến tạo tri thức, lan tỏa giá trị.'),
  staticPage('/tim-kiem', 'Tìm kiếm', 'Tìm nội dung công khai trên website GISA.'),
  staticPage('/lien-he', 'Liên hệ', 'Trao đổi với GISA về nghiên cứu, tư vấn, đào tạo và hợp tác.'),
  staticPage('/dang-ky/tu-van', 'Đăng ký tư vấn', 'Chia sẻ nhu cầu để GISA hiểu rõ vấn đề bạn đang quan tâm.'),
  staticPage('/dang-ky/khoa-hoc', 'Đăng ký khóa học', 'Gửi thông tin về khóa học và năng lực bạn muốn phát triển.'),
  staticPage('/dang-ky/hop-tac', 'Đề nghị hợp tác', 'Giới thiệu nhu cầu và định hướng hợp tác của tổ chức bạn.'),
  staticPage('/chinh-sach-quyen-rieng-tu', 'Chính sách quyền riêng tư', 'Cách GISA tiếp nhận và xử lý dữ liệu được gửi qua biểu mẫu trên website.'),

  hubPage('/gioi-thieu', 'Giới thiệu', 'Tìm hiểu GISA, định hướng và lĩnh vực hoạt động.', [
    '/gioi-thieu/cau-chuyen-gisa',
    '/gioi-thieu/linh-vuc-hoat-dong',
    '/chuyen-gia',
  ]),
  staticPage('/gioi-thieu/cau-chuyen-gisa', 'Câu chuyện GISA', 'Hành trình hình thành, triết lý và động lực phát triển của GISA.'),
  staticPage('/gioi-thieu/linh-vuc-hoat-dong', 'Lĩnh vực hoạt động', 'Các nhóm hoạt động chính của GISA.'),
  listingPage('/chuyen-gia', 'Chuyên gia', 'Tìm hiểu đội ngũ chuyên gia và các lĩnh vực chuyên môn tại GISA.', 'experts'),
  { template: 'detail', pathPattern: '/chuyen-gia/[slug]', collection: 'experts' },

  hubPage('/nghien-cuu', 'Nghiên cứu', 'Nghiên cứu, dự án và ấn phẩm của GISA.', [
    '/nghien-cuu/linh-vuc',
    '/nghien-cuu/du-an',
    '/nghien-cuu/bai-bao-khoa-hoc',
    '/nghien-cuu/bai-bao-ung-dung',
  ]),
  staticPage('/nghien-cuu/linh-vuc', 'Lĩnh vực nghiên cứu', 'Khám phá các hướng nghiên cứu liên ngành mà GISA theo đuổi.'),
  listingPage('/nghien-cuu/du-an', 'Dự án nghiên cứu', 'Khám phá các dự án và cách GISA chuyển tri thức thành hành động.', 'projects', ['topic'], { projectType: 'Nghiên cứu' }),
  { template: 'detail', pathPattern: '/nghien-cuu/du-an/[slug]', collection: 'projects' },
  listingPage('/nghien-cuu/bai-bao-khoa-hoc', 'Bài báo khoa học', 'Tiếp cận các kết quả nghiên cứu và đóng góp học thuật của GISA.', 'publications', ['topic'], { type: 'Bài báo khoa học' }),
  { template: 'detail', pathPattern: '/nghien-cuu/bai-bao-khoa-hoc/[slug]', collection: 'publications' },
  listingPage('/nghien-cuu/bai-bao-ung-dung', 'Bài báo ứng dụng', 'Đọc các phân tích đưa kết quả nghiên cứu đến gần hơn với thực tiễn.', 'publications', ['topic'], { type: 'Chuyên khảo' }),
  { template: 'detail', pathPattern: '/nghien-cuu/bai-bao-ung-dung/[slug]', collection: 'publications' },

  hubPage('/tu-van', 'Tư vấn', 'Lĩnh vực, công cụ và dự án tư vấn.', [
    '/tu-van/linh-vuc', '/tu-van/cong-cu', '/tu-van/du-an', '/tu-van/thanh-qua', '/dang-ky/tu-van',
  ]),
  staticPage('/tu-van/linh-vuc', 'Lĩnh vực tư vấn', 'Tìm hiểu các vấn đề GISA đồng hành cùng tổ chức và doanh nghiệp.'),
  listingPage('/tu-van/cong-cu', 'Công cụ tư vấn', 'Khám phá các công cụ hỗ trợ phân tích, ra quyết định và triển khai giải pháp.', 'tools'),
  { template: 'detail', pathPattern: '/tu-van/cong-cu/[slug]', collection: 'tools' },
  listingPage('/tu-van/du-an', 'Dự án tư vấn', 'Tìm hiểu cách GISA tiếp cận các bài toán tư vấn trong thực tiễn.', 'projects', [], { projectType: 'Tư vấn' }),
  { template: 'detail', pathPattern: '/tu-van/du-an/[slug]', collection: 'projects' },
  staticPage('/tu-van/thanh-qua', 'Thành quả', 'Những kết quả và giá trị được tạo ra trong quá trình đồng hành cùng đối tác.'),

  hubPage('/dao-tao', 'Đào tạo', 'Các dòng chương trình và khóa học.', [
    '/dao-tao/linh-vuc', '/dao-tao/gisa-core', '/dao-tao/gisa-edge', '/dao-tao/gisa-rise',
    '/dao-tao/gisa-ascend', '/dao-tao/gisa-legacy', '/khoa-hoc', '/dang-ky/khoa-hoc',
  ]),
  staticPage('/dao-tao/linh-vuc', 'Lĩnh vực đào tạo', 'Chọn hướng phát triển năng lực phù hợp với vai trò và mục tiêu nghề nghiệp.'),
  staticPage('/dao-tao/gisa-core', 'GISA Core', 'Dòng chương trình chuyên môn.'),
  staticPage('/dao-tao/gisa-edge', 'GISA Edge', 'Dòng chương trình trải nghiệm thực chiến.'),
  staticPage('/dao-tao/gisa-rise', 'GISA Rise', 'Dòng chương trình phát triển sự nghiệp.'),
  staticPage('/dao-tao/gisa-ascend', 'GISA Ascend', 'Dòng chương trình lãnh đạo.'),
  staticPage('/dao-tao/gisa-legacy', 'GISA Legacy', 'Dòng chương trình phát triển dài hạn.'),
  listingPage('/khoa-hoc', 'Khóa học', 'Tìm khóa học phù hợp với nhu cầu chuyên môn và hành trình phát triển của bạn.', 'courses', ['format']),
  { template: 'detail', pathPattern: '/khoa-hoc/[slug]', collection: 'courses' },

  hubPage('/ung-dung', 'Ứng dụng', 'Chuyển giao tri thức và các lĩnh vực ứng dụng.', [
    '/ung-dung/linh-vuc', '/ung-dung/quan-ly-kinh-doanh', '/ung-dung/khoa-hoc-cong-nghe',
    '/ung-dung/kinh-te-ben-vung', '/ung-dung/tam-ly-phat-trien-con-nguoi',
  ]),
  staticPage('/ung-dung/linh-vuc', 'Lĩnh vực ứng dụng', 'Khám phá cách tri thức liên ngành được chuyển thành giải pháp cho thực tiễn.'),
  staticPage('/ung-dung/quan-ly-kinh-doanh', 'Quản lý & Kinh doanh', 'Ứng dụng trong quản lý và kinh doanh.'),
  staticPage('/ung-dung/khoa-hoc-cong-nghe', 'Khoa học & Công nghệ', 'Ứng dụng khoa học và công nghệ.'),
  staticPage('/ung-dung/kinh-te-ben-vung', 'Kinh tế bền vững', 'Ứng dụng hướng tới kinh tế bền vững.'),
  staticPage('/ung-dung/tam-ly-phat-trien-con-nguoi', 'Tâm lý & Phát triển con người', 'Ứng dụng cho phát triển con người.'),
  // Không khai route chi tiết `/ung-dung/[slug]`: công cụ tư vấn có đường dẫn thật
  // là `/tu-van/cong-cu/<slug>`, nên mẫu cũ trỏ vào collection `tools` chỉ tạo ra
  // một dải URL luôn trả 404.

  hubPage('/mang-luoi', 'Mạng lưới', 'Hợp tác, đối tác, quỹ và nhà tài trợ.', [
    '/mang-luoi/thuc-day-hop-tac', '/mang-luoi/doi-tac', '/mang-luoi/quy-nha-tai-tro', '/dang-ky/hop-tac',
  ]),
  staticPage('/mang-luoi/thuc-day-hop-tac', 'Thúc đẩy hợp tác', 'Cách GISA kết nối hợp tác.'),
  listingPage('/mang-luoi/doi-tac', 'Đối tác', 'Khám phá mạng lưới tổ chức cùng GISA kết nối tri thức và nguồn lực.', 'partners'),
  { template: 'detail', pathPattern: '/mang-luoi/doi-tac/[slug]', collection: 'partners' },
  staticPage('/mang-luoi/quy-nha-tai-tro', 'Quỹ & nhà tài trợ', 'Tìm hiểu các hướng đồng hành và nguồn lực hỗ trợ cho hoạt động tạo tác động.'),

  hubPage('/cong-dong', 'Cộng đồng', 'Các nhánh nội dung và sáng kiến cộng đồng.', [
    '/cong-dong/kinh-te-ben-vung', '/cong-dong/trach-nhiem-xa-hoi',
    '/cong-dong/bao-ve-moi-truong', '/cong-dong/quan-tri-hieu-qua',
  ]),
  listingPage('/cong-dong/kinh-te-ben-vung', 'Kinh tế bền vững', 'Sáng kiến thuộc nhánh cộng đồng.', 'initiatives', ['pillar']),
  staticPage('/cong-dong/trach-nhiem-xa-hoi', 'Trách nhiệm xã hội', 'Nội dung cộng đồng về trách nhiệm xã hội.'),
  staticPage('/cong-dong/bao-ve-moi-truong', 'Bảo vệ môi trường', 'Nội dung cộng đồng về bảo vệ môi trường.'),
  staticPage('/cong-dong/quan-tri-hieu-qua', 'Quản trị hiệu quả', 'Nội dung cộng đồng về quản trị hiệu quả.'),
  { template: 'detail', pathPattern: '/cong-dong/[slug]', collection: 'initiatives' },

  listingPage('/tin-tuc', 'Tin tức', 'Cập nhật hoạt động, góc nhìn và những câu chuyện mới từ GISA.', 'news'),
  { template: 'detail', pathPattern: '/tin-tuc/[slug]', collection: 'news' },
  listingPage('/tin-tuc/thong-bao-lich', 'Thông báo & lịch', 'Theo dõi thông báo và lịch hoạt động do GISA công bố.', 'notices'),
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
