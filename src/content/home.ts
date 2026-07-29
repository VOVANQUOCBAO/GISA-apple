import type { ContentRepository } from './repositories';
import type { Collection, ContentSummary } from './types';

export interface HomePageModel {
  courses: ContentSummary[];
  gateways: Array<{ description: string; href: string; title: string }>;
  initiatives: ContentSummary[];
  news: ContentSummary[];
  partners: ContentSummary[] | null;
  pillars: Array<{ description: string; name: string; number: string }>;
  projects: ContentSummary[];
  publications: ContentSummary[];
  risesValues: Array<{ code: string; label: string }>;
  source: {
    checkedAt: string;
    evidenceStatus: 'provided_by_gisa';
    label: string;
    sourcePath: string;
  };
  trustSignals: string[];
}

const risesValues = [
  { code: 'R', label: 'Reliability — Độ tin cậy, uy tín, chính trực' },
  { code: 'I', label: 'Innovation — Đổi mới, sáng tạo, đột phá' },
  { code: 'S', label: 'Science — Khoa học, hàn lâm, chuẩn mực' },
  { code: 'E', label: 'Efficiency — Hiệu quả, giá trị thực tiễn' },
  {
    code: 'S',
    label: 'Sustainability — Bền vững, dài hạn, trách nhiệm liên thế hệ',
  },
];

const pillars = [
  {
    description: 'Kiến tạo tri thức có độ tin cậy, giá trị học thuật và năng lực giải quyết vấn đề thực tiễn.',
    name: 'Nghiên cứu',
    number: '01',
  },
  {
    description: 'Chuyển hóa tri thức thành chiến lược, mô hình quản trị và giải pháp triển khai.',
    name: 'Tư vấn',
    number: '02',
  },
  {
    description: 'Phát triển năng lực lãnh đạo, quản trị, chuyên môn và khả năng thích ứng.',
    name: 'Đào tạo',
    number: '03',
  },
  {
    description: 'Kết nối nghiên cứu với công nghệ, đổi mới mô hình và hiệu quả vận hành.',
    name: 'Ứng dụng và chuyển giao',
    number: '04',
  },
  {
    description: 'Kết nối trí tuệ, nguồn lực, chuyên gia và các hệ sinh thái đổi mới.',
    name: 'Mạng lưới và hợp tác toàn cầu',
    number: '05',
  },
  {
    description: 'Chuyển hóa tri thức thành giá trị nhân văn, phúc lợi xã hội và tác động bền vững.',
    name: 'Cộng đồng và tác động xã hội',
    number: '06',
  },
];

async function listCollection(
  repository: ContentRepository,
  collection: Collection,
): Promise<ContentSummary[]> {
  const result = await repository.list({
    collection,
    filters: {},
    page: 1,
    pageSize: 4,
  });
  return result.items;
}

export async function getHomePageModel(
  repository: ContentRepository,
): Promise<HomePageModel> {
  const [projects, publications, courses, initiatives, news, partners] =
    await Promise.all([
      listCollection(repository, 'projects'),
      listCollection(repository, 'publications'),
      listCollection(repository, 'courses'),
      listCollection(repository, 'initiatives'),
      listCollection(repository, 'news'),
      listCollection(repository, 'partners'),
    ]);

  return {
    courses,
    gateways: [
      {
        description: 'Dự án và ấn phẩm có nguồn công khai.',
        href: '/nghien-cuu',
        title: 'Nghiên cứu',
      },
      {
        description: 'Lĩnh vực, công cụ và nhu cầu tư vấn.',
        href: '/tu-van',
        title: 'Tư vấn',
      },
      {
        description: 'Dòng chương trình và khóa học đại diện.',
        href: '/dao-tao',
        title: 'Đào tạo',
      },
      {
        description: 'Các nhánh ứng dụng và chuyển giao tri thức.',
        href: '/ung-dung',
        title: 'Ứng dụng',
      },
    ],
    initiatives,
    news,
    partners: partners.length > 0 ? partners : null,
    pillars,
    projects,
    publications,
    risesValues,
    source: {
      checkedAt: '2026-07-18',
      evidenceStatus: 'provided_by_gisa',
      label: 'Cẩm nang nhận diện thương hiệu & định hướng nội dung GISA — mục 1.4–1.5',
      sourcePath: 'D:/web/image/ảnh 1  (5).png',
    },
    trustSignals: [
      'Nghiên cứu độc lập',
      'Hướng tới phát triển bền vững',
      'Tri thức toàn cầu',
      'Đồng hành thực tiễn',
    ],
  };
}
