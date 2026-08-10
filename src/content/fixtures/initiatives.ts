import type { ContentRecord } from '../types';

/**
 * Mười hai sáng kiến thuộc nhánh Kinh tế bền vững. Mỗi sáng kiến có trang nguồn
 * riêng trên gisa.edu.vn nên `sourceUrl` trỏ thẳng vào trang đó thay vì trỏ chung
 * vào trang danh sách — đối chiếu lại từng bản ghi sẽ không phải dò trong một
 * trang gộp.
 */
export const initiativeFixtures = [
  {
    id: 'initiative-local-circular-economy',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'mo-hinh-phat-trien-kinh-te-tuan-hoan-tai-dia-phuong',
    path: '/cong-dong/mo-hinh-phat-trien-kinh-te-tuan-hoan-tai-dia-phuong',
    locale: 'vi',
    translationKey: 'initiative-local-circular-economy',
    title: 'Mô hình phát triển kinh tế tuần hoàn tại địa phương',
    summary:
      'Thiết kế hệ sinh thái sản xuất – tiêu dùng khép kín tại cấp xã, cụm dân cư hoặc làng nghề.',
    body: [
      {
        type: 'paragraph',
        text: 'Thiết kế hệ sinh thái sản xuất – tiêu dùng khép kín tại cấp xã, cụm dân cư hoặc làng nghề. Tận dụng phụ phẩm, tái sử dụng tài nguyên và thúc đẩy hợp tác cộng đồng trong vận hành.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Giảm thiểu lãng phí và ô nhiễm.',
          'Tạo sinh kế mới và ổn định thu nhập.',
          'Tăng hiệu quả sử dụng tài nguyên.',
          'Nâng cao năng lực quản trị địa phương.',
        ],
      },
    ],
    tags: ['cộng đồng', 'kinh tế tuần hoàn', 'phát triển địa phương'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/mo-hinh-phat-trien-kinh-te-tuan-hoan-tai-dia-phuong',
    sourceLabel: 'Website công khai GISA — Mô hình phát triển kinh tế tuần hoàn tại địa phương',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-rural-youth-green-startup',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'chuong-trinh-khoi-nghiep-ben-vung-cho-thanh-nien-nong-thon',
    path: '/cong-dong/chuong-trinh-khoi-nghiep-ben-vung-cho-thanh-nien-nong-thon',
    locale: 'vi',
    translationKey: 'initiative-rural-youth-green-startup',
    title: 'Chương trình khởi nghiệp bền vững cho thanh niên nông thôn',
    summary:
      'Hỗ trợ thanh niên tiếp cận kiến thức khởi nghiệp xanh và thương mại hóa sản phẩm bản địa qua nền tảng số.',
    body: [
      {
        type: 'paragraph',
        text: 'Hỗ trợ thanh niên tiếp cận kiến thức khởi nghiệp xanh, xây dựng mô hình sản xuất nông nghiệp tuần hoàn, khai thác tài nguyên bản địa bền vững và thương mại hóa sản phẩm qua nền tảng số.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Giữ chân lao động trẻ tại địa phương.',
          'Đổi mới mô hình kinh tế nông thôn.',
          'Khuyến khích tư duy sáng tạo bền vững.',
        ],
      },
    ],
    tags: ['cộng đồng', 'khởi nghiệp xanh', 'thanh niên nông thôn'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/chuong-trinh-khoi-nghiep-ben-vung-cho-thanh-nien-nong-thon',
    sourceLabel:
      'Website công khai GISA — Chương trình khởi nghiệp bền vững cho thanh niên nông thôn',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-local-sdg-assessment-system',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'he-thong-danh-gia-phat-trien-ben-vung-cap-dia-phuong',
    path: '/cong-dong/he-thong-danh-gia-phat-trien-ben-vung-cap-dia-phuong',
    locale: 'vi',
    translationKey: 'initiative-local-sdg-assessment-system',
    title: 'Hệ thống đánh giá phát triển bền vững cấp địa phương',
    summary:
      'Bộ chỉ số và dashboard theo dõi tiến độ thực hiện các mục tiêu phát triển bền vững ở cấp tỉnh, huyện và xã.',
    body: [
      {
        type: 'paragraph',
        text: 'Bộ chỉ số và dashboard theo dõi tiến độ thực hiện các mục tiêu phát triển bền vững (SDGs) ở cấp tỉnh, huyện và xã, phục vụ quản trị công và định hướng chính sách.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Đo lường hiệu quả chính sách công.',
          'Hỗ trợ quản trị dựa trên bằng chứng.',
          'Tăng tính minh bạch và trách nhiệm giải trình.',
        ],
      },
    ],
    tags: ['cộng đồng', 'SDGs', 'quản trị công'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/he-thong-danh-gia-phat-trien-ben-vung-cap-dia-phuong',
    sourceLabel: 'Website công khai GISA — Hệ thống đánh giá phát triển bền vững cấp địa phương',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-smart-sustainable-agriculture-cluster',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'cum-nong-nghiep-thong-minh-ben-vung',
    path: '/cong-dong/cum-nong-nghiep-thong-minh-ben-vung',
    locale: 'vi',
    translationKey: 'initiative-smart-sustainable-agriculture-cluster',
    title: 'Cụm nông nghiệp thông minh – bền vững',
    summary:
      'Tích hợp cảm biến, IoT và dữ liệu lớn vào sản xuất nông nghiệp theo nhóm hộ và hợp tác xã.',
    body: [
      {
        type: 'paragraph',
        text: 'Tích hợp công nghệ cảm biến, IoT và dữ liệu lớn vào sản xuất nông nghiệp theo nhóm hộ và hợp tác xã, kết nối đầu ra và dịch vụ hỗ trợ trên nền tảng số.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại cho nông dân và hợp tác xã' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Tăng năng suất, tối ưu đầu vào.',
          'Giảm rủi ro mùa vụ và rủi ro do biến đổi khí hậu.',
          'Tăng khả năng cạnh tranh thị trường.',
        ],
      },
    ],
    tags: ['cộng đồng', 'nông nghiệp thông minh', 'IoT'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/cum-nong-nghiep-thong-minh-ben-vung',
    sourceLabel: 'Website công khai GISA — Cụm nông nghiệp thông minh – bền vững',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-community-sustainability-learning-centre',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'trung-tam-hoc-tap-cong-dong-ve-phat-trien-ben-vung',
    path: '/cong-dong/trung-tam-hoc-tap-cong-dong-ve-phat-trien-ben-vung',
    locale: 'vi',
    translationKey: 'initiative-community-sustainability-learning-centre',
    title: 'Trung tâm học tập cộng đồng về phát triển bền vững',
    summary:
      'Không gian mở tại địa phương kết hợp học tập, thực hành và tương tác về sống xanh và đổi mới sáng tạo xã hội.',
    body: [
      {
        type: 'paragraph',
        text: 'Không gian mở tại địa phương kết hợp học tập – thực hành – tương tác về năng lượng tái tạo, sống xanh, tiêu dùng có trách nhiệm và đổi mới sáng tạo xã hội.',
      },
    ],
    tags: ['cộng đồng', 'học tập suốt đời', 'sống xanh'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/trung-tam-hoc-tap-cong-dong-ve-phat-trien-ben-vung',
    sourceLabel: 'Website công khai GISA — Trung tâm học tập cộng đồng về phát triển bền vững',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-green-fair-consumption-ecosystem',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'he-sinh-thai-tieu-dung-xanh-va-cong-bang',
    path: '/cong-dong/he-sinh-thai-tieu-dung-xanh-va-cong-bang',
    locale: 'vi',
    translationKey: 'initiative-green-fair-consumption-ecosystem',
    title: 'Hệ sinh thái tiêu dùng xanh và công bằng',
    summary:
      'Thiết kế hệ thống từ truyền thông thay đổi hành vi đến chuỗi cung ứng xanh để xây dựng văn hóa tiêu dùng bền vững.',
    body: [
      {
        type: 'paragraph',
        text: 'Thiết kế hệ thống từ truyền thông thay đổi hành vi đến chuỗi cung ứng xanh, nhằm xây dựng văn hóa tiêu dùng bền vững trong cộng đồng và doanh nghiệp.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Giảm thiểu rác thải và tiêu dùng quá mức.',
          'Tăng giá trị thương hiệu bền vững.',
          'Gắn kết trách nhiệm xã hội với người tiêu dùng.',
        ],
      },
    ],
    tags: ['cộng đồng', 'tiêu dùng xanh', 'chuỗi cung ứng'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/he-sinh-thai-tieu-dung-xanh-va-cong-bang',
    sourceLabel: 'Website công khai GISA — Hệ sinh thái tiêu dùng xanh và công bằng',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-local-sustainability-innovation-fund',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'quy-sang-kien-dia-phuong-vi-phat-trien-ben-vung',
    path: '/cong-dong/quy-sang-kien-dia-phuong-vi-phat-trien-ben-vung',
    locale: 'vi',
    translationKey: 'initiative-local-sustainability-innovation-fund',
    title: 'Quỹ sáng kiến địa phương vì phát triển bền vững',
    summary:
      'Cơ chế tài trợ và cố vấn kỹ thuật cho nhóm dân cư, tổ chức xã hội và doanh nghiệp địa phương có ý tưởng phục vụ SDGs.',
    body: [
      {
        type: 'paragraph',
        text: 'Cơ chế tài trợ và cố vấn kỹ thuật cho các nhóm dân cư, tổ chức xã hội hoặc doanh nghiệp địa phương có ý tưởng đổi mới phục vụ các mục tiêu phát triển bền vững.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại cho địa phương và cộng đồng' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Khơi dậy sáng tạo từ cộng đồng.',
          'Hỗ trợ giải pháp phù hợp bản địa.',
          'Gắn kết giữa nghiên cứu và hành động.',
        ],
      },
    ],
    tags: ['cộng đồng', 'quỹ sáng kiến', 'SDGs'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/quy-sang-kien-dia-phuong-vi-phat-trien-ben-vung',
    sourceLabel: 'Website công khai GISA — Quỹ sáng kiến địa phương vì phát triển bền vững',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-climate-learning-action-platform',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'nen-tang-hoc-tap-hanh-dong-vi-khi-hau',
    path: '/cong-dong/nen-tang-hoc-tap-hanh-dong-vi-khi-hau',
    locale: 'vi',
    translationKey: 'initiative-climate-learning-action-platform',
    title: 'Nền tảng học tập và hành động vì khí hậu',
    summary:
      'Ứng dụng công nghệ giáo dục để thiết kế chương trình học tương tác và hệ thống hành động khí hậu thực tiễn.',
    body: [
      {
        type: 'paragraph',
        text: 'Ứng dụng công nghệ giáo dục để thiết kế chương trình học tương tác, trò chơi hóa, và hệ thống hành động thực tiễn nhằm tăng hiểu biết và hành động khí hậu.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Nâng cao năng lực thế hệ trẻ về biến đổi khí hậu.',
          'Khuyến khích hành vi thân thiện môi trường.',
          'Kết nối mạng lưới học sinh – giáo viên – gia đình.',
        ],
      },
    ],
    tags: ['cộng đồng', 'biến đổi khí hậu', 'giáo dục'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/nen-tang-hoc-tap-hanh-dong-vi-khi-hau',
    sourceLabel: 'Website công khai GISA — Nền tảng học tập & hành động vì khí hậu',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-green-transition-support-for-business',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'chuong-trinh-ho-tro-doanh-nghiep-chuyen-doi-xanh',
    path: '/cong-dong/chuong-trinh-ho-tro-doanh-nghiep-chuyen-doi-xanh',
    locale: 'vi',
    translationKey: 'initiative-green-transition-support-for-business',
    title: 'Chương trình hỗ trợ doanh nghiệp chuyển đổi xanh',
    summary:
      'Đánh giá hiện trạng ESG – SDGs của doanh nghiệp và đề xuất lộ trình chuyển đổi kèm tài chính xanh và đào tạo nhân lực.',
    body: [
      {
        type: 'paragraph',
        text: 'Đánh giá hiện trạng ESG – SDGs của doanh nghiệp, đề xuất lộ trình chuyển đổi, kết hợp công nghệ, tài chính xanh và đào tạo nhân lực phù hợp.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại cho doanh nghiệp và cộng đồng' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Cải thiện khả năng gọi vốn và thu hút đối tác.',
          'Nâng cao năng lực nội tại doanh nghiệp.',
          'Giảm thiểu rủi ro môi trường – xã hội.',
        ],
      },
    ],
    tags: ['cộng đồng', 'chuyển đổi xanh', 'ESG'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/chuong-trinh-ho-tro-doanh-nghiep-chuyen-doi-xanh',
    sourceLabel: 'Website công khai GISA — Chương trình hỗ trợ doanh nghiệp chuyển đổi xanh',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-multidimensional-policy-impact-analysis',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'giai-phap-phan-tich-tac-dong-da-chieu-cua-chinh-sach',
    path: '/cong-dong/giai-phap-phan-tich-tac-dong-da-chieu-cua-chinh-sach',
    locale: 'vi',
    translationKey: 'initiative-multidimensional-policy-impact-analysis',
    title: 'Giải pháp phân tích tác động đa chiều của chính sách',
    summary:
      'Mô phỏng tác động kinh tế – xã hội – môi trường của chính sách bằng công cụ định lượng và đánh giá có sự tham gia.',
    body: [
      {
        type: 'paragraph',
        text: 'Mô phỏng các tác động kinh tế – xã hội – môi trường của chính sách phát triển bằng công cụ định lượng và đánh giá có sự tham gia, phục vụ điều chỉnh linh hoạt.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại cho nhà lập chính sách và xã hội' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Tối ưu hóa hiệu quả chính sách công.',
          'Hạn chế hệ lụy không mong muốn.',
          'Tăng khả năng phản hồi và thích ứng.',
        ],
      },
    ],
    tags: ['cộng đồng', 'phân tích chính sách', 'đánh giá tác động'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/giai-phap-phan-tich-tac-dong-da-chieu-cua-chinh-sach',
    sourceLabel: 'Website công khai GISA — Giải pháp phân tích tác động đa chiều của chính sách',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-local-sustainability-data-map',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'ban-do-du-lieu-ben-vung-dia-phuong',
    path: '/cong-dong/ban-do-du-lieu-ben-vung-dia-phuong',
    locale: 'vi',
    translationKey: 'initiative-local-sustainability-data-map',
    title: 'Bản đồ dữ liệu bền vững địa phương',
    summary:
      'Tích hợp dữ liệu dân cư, tài nguyên, môi trường và năng lực kinh tế theo không gian số để hỗ trợ hoạch định phát triển.',
    body: [
      {
        type: 'paragraph',
        text: 'Tích hợp dữ liệu dân cư, tài nguyên, môi trường và năng lực kinh tế theo không gian số (GIS) để hỗ trợ hoạch định phát triển bền vững.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại cho xã hội' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Quản trị thông minh và có chiến lược.',
          'Tăng hiệu quả đầu tư công – tư.',
          'Thúc đẩy hợp tác công nghệ – chính sách.',
        ],
      },
    ],
    tags: ['cộng đồng', 'dữ liệu không gian', 'quản trị địa phương'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/ban-do-du-lieu-ben-vung-dia-phuong',
    sourceLabel: 'Website công khai GISA — Bản đồ dữ liệu bền vững địa phương',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
  {
    id: 'initiative-community-product-green-label',
    kind: 'initiative',
    collection: 'initiatives',
    slug: 'he-thong-cham-diem-va-nhan-xanh-cho-san-pham-cong-dong',
    path: '/cong-dong/he-thong-cham-diem-va-nhan-xanh-cho-san-pham-cong-dong',
    locale: 'vi',
    translationKey: 'initiative-community-product-green-label',
    title: 'Hệ thống chấm điểm và nhãn xanh cho sản phẩm cộng đồng',
    summary:
      'Đánh giá sản phẩm theo tiêu chí môi trường, xã hội và tính minh bạch để cộng đồng sản xuất định vị giá trị sản phẩm.',
    body: [
      {
        type: 'paragraph',
        text: 'Hệ thống đánh giá sản phẩm dựa trên tiêu chí môi trường, xã hội và tính minh bạch, giúp cộng đồng sản xuất có thể định vị và nâng cao giá trị sản phẩm địa phương.',
      },
      { type: 'heading', level: 2, text: 'Giá trị mang lại cho xã hội' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Tăng niềm tin người tiêu dùng.',
          'Hỗ trợ sản phẩm địa phương tham gia thị trường rộng hơn.',
          'Thúc đẩy sản xuất có trách nhiệm.',
        ],
      },
    ],
    tags: ['cộng đồng', 'nhãn xanh', 'sản phẩm địa phương'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://gisa.edu.vn/he-thong-cham-diem-va-nhan-xanh-cho-san-pham-cong-dong',
    sourceLabel:
      'Website công khai GISA — Hệ thống chấm điểm và nhãn xanh cho sản phẩm cộng đồng',
    checkedAt: '2026-08-05',
    metadata: { pillar: 'Kinh tế bền vững' },
  },
] satisfies ContentRecord[];
