import type { ContentRecord } from '../types';

/**
 * 14 công trình trong chuyên mục "Bài báo khoa học" của GISA.
 *
 * Mỗi bản ghi được đối chiếu hai lớp: trang công khai trên gisa.edu.vn (tiêu đề
 * tiếng Việt, tóm tắt) và bản ghi của nhà xuất bản qua Crossref (tác giả, năm,
 * tạp chí, tập/số/trang, DOI). Bộ CSV nội bộ chỉ dùng để dò danh sách, nhưng nhiều
 * dòng trong đó thiếu năm hoặc ghi nhầm khoảng dữ liệu thành năm công bố, nên
 * các trường dưới đây lấy theo bản ghi nhà xuất bản.
 *
 * DOI chỉ đặt trong `publication.doi`, không đưa vào `metadata.citation`: chuỗi
 * số của DOI trùng khuôn dạng số điện thoại mà scripts/audit-content.ts dùng để
 * bắt thông tin liên hệ chưa có nguồn.
 *
 * `metadata.topic` vừa là nhãn trên thẻ vừa là bộ lọc của trang danh sách, và
 * cũng là tag đầu tiên để src/content/related.ts chấm điểm bài gợi ý.
 */

const CHECKED_AT = '2026-08-02';

const IMAGE = {
  aiChatbot: {
    src: '/images/article-ai-chatbot.png',
    alt: 'Người dùng trò chuyện với chatbot trên điện thoại',
    width: 1536,
    height: 1024,
  },
  benchmarking: {
    src: '/images/article-performance-benchmarking.png',
    alt: 'Báo cáo phân tích hiệu suất và biểu đồ dữ liệu trên bàn làm việc',
    width: 1536,
    height: 1024,
  },
  foodQuality: {
    src: '/images/article-food-quality-programs.png',
    alt: 'Giỏ hàng đầy rau củ tươi trong siêu thị',
    width: 1536,
    height: 1024,
  },
  pomelo: {
    src: '/images/article-da-xanh-pomelo.png',
    alt: 'Quả bưởi da xanh trên cây trong vườn',
    width: 1536,
    height: 1024,
  },
} as const;

export const publicationFixtures = [
  {
    id: 'publication-benchmarking-performance',
    kind: 'publication',
    collection: 'publications',
    slug: 'mo-hinh-chuan-doi-sanh-do-luong-hieu-suat',
    path: '/nghien-cuu/bai-bao-khoa-hoc/mo-hinh-chuan-doi-sanh-do-luong-hieu-suat',
    locale: 'vi',
    translationKey: 'publication-benchmarking-performance',
    title:
      'Nghiên cứu phát triển mô hình chuẩn đối sánh đo lường hiệu suất hoạt động',
    summary:
      'Xây dựng khung chuẩn đối sánh PMS trên ba trục Năng suất, Quản lý và Bền vững, phân tích trường hợp ngành đồ gỗ Việt Nam.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu xây dựng một khung chuẩn đối sánh tích hợp ba nhóm chỉ số Năng suất, Quản lý và Bền vững, sau đó dùng khung này để đo hiệu suất trong ngành đồ gỗ Việt Nam, xác định nguồn gốc của chênh lệch hiệu suất và nhận diện điều kiện triển khai.',
      },
      {
        type: 'paragraph',
        text: 'Phương pháp kết hợp định tính và định lượng: tổng quan tài liệu, phỏng vấn khám phá và xây dựng lý thuyết nền từ dữ liệu thực địa.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Đề xuất khung chuẩn đối sánh PMS cho đo lường hiệu suất hoạt động.',
          'Chênh lệch hiệu suất bắt nguồn từ thiết kế, nguồn cung nguyên liệu, lợi thế quy mô, thị trường, hệ thống quản lý và mức độ cởi mở của tổ chức.',
          'Rào cản triển khai: khó chọn chỉ số đo, khó tìm tổ chức so sánh phù hợp, thiếu chuyên môn, ngại chia sẻ thông tin và dữ liệu kém tin cậy.',
          'Điều kiện thành công: vai trò dẫn dắt của lãnh đạo cùng các yếu tố hệ thống, sự tham gia của nhân viên, sự gắn kết với chiến lược, văn hóa tổ chức và kết nối với bên liên quan bên ngoài.',
        ],
      },
    ],
    image: IMAGE.benchmarking,
    tags: ['Quản trị hiệu suất', 'chuẩn đối sánh', 'ngành đồ gỗ', 'Việt Nam'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/nghien-cuu-phat-trien-mo-hinh-chuan-doi-sanh-benchmarking-do-luong-hieu-suat-hoat-dong-phan-tich-truong-hop-cac-doanh-nghiep-viet-nam',
    sourceLabel: 'Website công khai GISA: bài nghiên cứu chuẩn đối sánh',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Quản trị hiệu suất',
      year: '2023',
      authors: 'Hoang, V.; Nguyen, K.-D.; Nguyen, H.-L.',
      citation:
        'Hoang, V., Nguyen, K.-D. & Nguyen, H.-L. (2023). Framework and determinants of benchmarking: a theoretical analysis and case study in Vietnam. International Journal of Emerging Markets, 18(10), 4651-4668.',
    },
    publication: {
      journal: 'International Journal of Emerging Markets, 18(10), 4651-4668',
      year: 2023,
      doi: 'https://doi.org/10.1108/IJOEM-04-2021-0553',
    },
  },
  {
    id: 'publication-food-quality-price-premium',
    kind: 'publication',
    collection: 'publications',
    slug: 'chuong-trinh-chat-luong-thuc-pham-va-phi-bao-hiem-gia',
    path: '/nghien-cuu/bai-bao-khoa-hoc/chuong-trinh-chat-luong-thuc-pham-va-phi-bao-hiem-gia',
    locale: 'vi',
    translationKey: 'publication-food-quality-price-premium',
    title: 'Các chương trình chất lượng thực phẩm và phí bảo hiểm giá ròng',
    summary:
      'So sánh mức giá giữa sản phẩm có chứng nhận PDO, PGI, hữu cơ và sản phẩm đối chứng, xét trên từng khâu chuỗi giá trị và từng nhóm ngành.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu xem xét khả năng sinh lợi của sản phẩm thuộc các chương trình chất lượng thực phẩm so với sản phẩm đối chứng không có nhãn, phân tách theo khâu chuỗi giá trị (đầu chuỗi, chế biến, cuối chuỗi), theo nhóm ngành (trồng trọt, chăn nuôi, thủy sản) và theo loại chương trình PDO, PGI, hữu cơ.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Sản phẩm có chứng nhận đạt mức giá cao hơn, không phụ thuộc vào khâu sản xuất hay nhóm ngành.',
          'Phần chênh giá giữ mức tương đồng giữa các khâu chuỗi giá trị và giữa các nhóm ngành.',
          'Sản phẩm hữu cơ có mức chênh giá cao hơn rõ rệt so với PGI ở khâu đầu chuỗi và khâu chế biến.',
          'Toàn bộ sản phẩm hữu cơ và phần lớn sản phẩm PDO, PGI được khảo sát đều hưởng địa tô chất lượng dương.',
          'Chi phí trung gian chiếm tỷ trọng thấp hơn trong cơ cấu chi phí của sản phẩm hữu cơ so với sản phẩm đối chứng.',
        ],
      },
    ],
    image: IMAGE.foodQuality,
    tags: ['Kinh tế thực phẩm', 'chất lượng thực phẩm', 'PDO', 'PGI', 'hữu cơ'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/cac-chuong-trinh-chat-luong-thuc-pham-va-phi-bao-hiem-gia-rong-co-di-cung-nhau-khong',
    sourceLabel: 'Website công khai GISA: chương trình chất lượng thực phẩm',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Kinh tế thực phẩm',
      year: '2020',
      authors: 'Monier-Dilhan, S. và cộng sự',
      citation:
        'Monier-Dilhan, S. và cộng sự (2020). Do Food Quality Schemes and Net Price Premiums Go Together? Journal of Agricultural & Food Industrial Organization, 19(2), 79-94.',
    },
    publication: {
      journal:
        'Journal of Agricultural & Food Industrial Organization, 19(2), 79-94',
      year: 2020,
      doi: 'https://doi.org/10.1515/jafio-2019-0044',
    },
  },
  {
    id: 'publication-pomelo-value-chain-competitiveness',
    kind: 'publication',
    collection: 'publications',
    slug: 'chuoi-gia-tri-va-nang-luc-canh-tranh-buoi-da-xanh',
    path: '/nghien-cuu/bai-bao-khoa-hoc/chuoi-gia-tri-va-nang-luc-canh-tranh-buoi-da-xanh',
    locale: 'vi',
    translationKey: 'publication-pomelo-value-chain-competitiveness',
    title:
      'Phân tích chuỗi giá trị và đánh giá năng lực cạnh tranh ngành bưởi da xanh tại Bến Tre',
    summary:
      'Lập bản đồ chuỗi giá trị, ước tính đóng góp tài chính và đo năng lực cạnh tranh của ngành bưởi da xanh Bến Tre.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Phân tích chuỗi giá trị là phương pháp then chốt để nâng giá trị cho cả người trồng lẫn người tiêu dùng cuối. Nghiên cứu tập trung vào ngành bưởi da xanh tại Bến Tre nhằm mô tả chuỗi, ước tính đóng góp tài chính và đo lường năng lực cạnh tranh.',
      },
      {
        type: 'paragraph',
        text: 'Các tác nhân trồng, chế biến và thương mại hóa được khảo sát để tính giá trị gia tăng và so sánh các chỉ tiêu hiệu quả giữa các khâu.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Ngành tạo đóng góp kinh tế đáng kể cho địa phương.',
          'Lợi ích được phân phối tương đối hợp lý giữa các tác nhân trong chuỗi.',
          'Chuỗi giá trị bưởi có năng lực cạnh tranh cao hơn một số ngành hàng khác.',
          'Hai rủi ro cần xử lý là sâu bệnh và nguy cơ dư cung khi diện tích trồng mở rộng nhanh.',
        ],
      },
    ],
    image: IMAGE.pomelo,
    tags: ['Chuỗi giá trị', 'bưởi da xanh', 'Bến Tre', 'nông nghiệp'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/phan-tich-chuoi-gia-tri-va-danh-gia-nang-luc-canh-tranh-cua-nganh-buoi-da-xanh-tai-ben-tre-viet-nam',
    sourceLabel: 'Website công khai GISA: chuỗi giá trị bưởi da xanh',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Chuỗi giá trị',
      year: '2015',
      authors: 'Van Hoang, V.',
      citation:
        'Van Hoang, V. (2015). Value Chain Analysis and Competitiveness Assessment of Da Xanh Pomelo Sector in Ben Tre, Vietnam. Asian Social Science, 11(2).',
    },
    publication: {
      journal: 'Asian Social Science, 11(2)',
      year: 2015,
      doi: 'https://doi.org/10.5539/ass.v11n2p8',
    },
  },
  {
    id: 'publication-ai-chatbot-customer-experience',
    kind: 'publication',
    collection: 'publications',
    slug: 'trai-nghiem-khach-hang-voi-chatbot-ai',
    path: '/nghien-cuu/bai-bao-khoa-hoc/trai-nghiem-khach-hang-voi-chatbot-ai',
    locale: 'vi',
    translationKey: 'publication-ai-chatbot-customer-experience',
    title: 'Nâng cao trải nghiệm khách hàng với chatbot vận hành bởi AI',
    summary:
      'Vai trò của chất lượng dịch vụ, trí tuệ cảm xúc và cá nhân hóa thuật toán trong trải nghiệm khách hàng, kiểm định qua bảy giả thuyết.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu xem xét việc tích hợp trí tuệ nhân tạo vào dịch vụ thương mại và chatbot tác động ra sao đến trải nghiệm khách hàng, thông qua cảm nhận về sự hài lòng, niềm tin và cam kết quan hệ.',
      },
      {
        type: 'paragraph',
        text: 'Nghiên cứu định lượng vận dụng lý thuyết Cam kết và Niềm tin cùng mô hình Chất lượng dịch vụ để kiểm định bảy giả thuyết.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Chất lượng dịch vụ AI và trí tuệ cảm xúc đều cải thiện đáng kể trải nghiệm khách hàng, trong đó chất lượng dịch vụ có ảnh hưởng mạnh hơn.',
          'Cá nhân hóa tác động tích cực mạnh tới cam kết với thương hiệu, vượt trội so với ảnh hưởng của hệ thống bảo mật.',
          'Cá nhân hóa và bảo mật ảnh hưởng tương đương nhau tới mức độ tin cậy.',
        ],
      },
    ],
    image: IMAGE.aiChatbot,
    tags: ['Trí tuệ nhân tạo', 'trải nghiệm khách hàng', 'chatbot', 'dịch vụ số'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/nang-cao-trai-nghiem-khach-hang-voi-chatbot-van-hanh-boi-tri-tue-nhan-tao-ai-vai-tro-cua-chat-luong-dich-vu-tri-tue-cam-xuc-va-su-ca-nhan-hoa-cua-thuat-toan',
    sourceLabel: 'Website công khai GISA: chatbot vận hành bởi AI',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Trí tuệ nhân tạo',
      year: '2023',
      authors:
        'Le, M.T.H.; Nguyen, K.M.; Nguyen, N.T.; Vo, N.H.; Tran, K.T.; Dao, D.T.',
      citation:
        'Le, M.T.H. và cộng sự (2023). Enhancing customer experience with AI chatbot: service quality, emotional intelligence and personalisation. International Journal of Trade and Global Markets.',
    },
    publication: {
      journal: 'International Journal of Trade and Global Markets',
      year: 2023,
      doi: 'https://doi.org/10.1504/IJTGM.2023.10058887',
    },
  },
  {
    id: 'publication-sustainable-dairy-com-b',
    kind: 'publication',
    collection: 'publications',
    slug: 'dong-luc-va-rao-can-tieu-dung-sua-ben-vung',
    path: '/nghien-cuu/bai-bao-khoa-hoc/dong-luc-va-rao-can-tieu-dung-sua-ben-vung',
    locale: 'vi',
    translationKey: 'publication-sustainable-dairy-com-b',
    title:
      'Động lực và rào cản đối với hành vi tiêu dùng sữa bền vững tại Việt Nam',
    summary:
      'Nghiên cứu khám phá theo mô hình COM-B, nhận diện 32 động lực và 14 rào cản của hành vi tiêu dùng sữa bền vững.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu vận dụng mô hình COM-B (Năng lực, Cơ hội, Động lực, Hành vi) để tìm hiểu điều gì thúc đẩy và điều gì cản trở hành vi tiêu dùng sữa bền vững tại Việt Nam.',
      },
      {
        type: 'paragraph',
        text: 'Dữ liệu thu từ năm nhóm tập trung với 40 người tham gia, cho phép nhận diện 32 động lực và 14 rào cản.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Động lực nổi bật: sức khỏe, thương hiệu và chất lượng, yếu tố gia đình, chương trình khuyến mãi.',
          'Rào cản nổi bật: khẩu vị, giá trị cảm nhận thấp, thói quen, thiếu niềm tin và thông tin, giá cao, khả năng tiếp cận hạn chế.',
          'Đề xuất can thiệp theo cả ba cấu phần Năng lực, Cơ hội và Động lực của mô hình COM-B.',
        ],
      },
    ],
    tags: ['Tiêu dùng bền vững', 'COM-B', 'hành vi tiêu dùng', 'ngành sữa'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/nghien-cuu-kham-pha-dong-luc-va-rao-can-doi-voi-hanh-vi-tieu-dung-sua-ben-vung-tai-viet-nam-ung-dung-mo-hinh-quan-tri-com-b',
    sourceLabel: 'Website công khai GISA: tiêu dùng sữa bền vững',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Tiêu dùng bền vững',
      year: '2023',
      authors:
        'Hoang, V.; Saviolidis, N.M.; Olafsdottir, G.; Bogason, S.; Hubbard, C.; Samoggia, A.; Nguyen, V.; Nguyen, D.',
      citation:
        'Hoang, V. và cộng sự (2023). Investigating and stimulating sustainable dairy consumption behavior: An exploratory study in Vietnam. Sustainable Production and Consumption, 42, 183-195.',
    },
    publication: {
      journal: 'Sustainable Production and Consumption, 42, 183-195',
      year: 2023,
      doi: 'https://doi.org/10.1016/j.spc.2023.09.016',
    },
  },
  {
    id: 'publication-animal-welfare-labels',
    kind: 'publication',
    collection: 'publications',
    slug: 'san-sang-tra-tien-cho-nhan-phuc-loi-dong-vat',
    path: '/nghien-cuu/bai-bao-khoa-hoc/san-sang-tra-tien-cho-nhan-phuc-loi-dong-vat',
    locale: 'vi',
    translationKey: 'publication-animal-welfare-labels',
    title: 'Sự sẵn sàng trả tiền đối với nhãn thực phẩm phúc lợi động vật',
    summary:
      'Thí nghiệm lựa chọn rời rạc trên người tiêu dùng Anh, so sánh hai nhãn RSPCA Assured và Red Tractor cho thịt gà.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu dùng phương pháp thí nghiệm lựa chọn rời rạc để đo mức sẵn lòng chi trả của người tiêu dùng Anh cho thịt gà sản xuất theo tiêu chuẩn phúc lợi động vật cao hơn, đối chiếu hai nhãn RSPCA Assured và Red Tractor.',
      },
      {
        type: 'paragraph',
        text: 'Thiết kế nghiên cứu kết hợp phỏng vấn định tính với khảo sát trực tuyến trên 401 người tham gia.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Người tiêu dùng sẵn sàng trả thêm cho nhãn có yêu cầu phúc lợi động vật nghiêm ngặt hơn.',
          'Cách truyền thông gắn với mục đích của nhãn ảnh hưởng đáng kể tới lựa chọn.',
          'Tính khả thi thương mại có thể hạn chế ở nhóm khách hàng nhạy cảm về giá.',
        ],
      },
    ],
    tags: [
      'Kinh tế thực phẩm',
      'phúc lợi động vật',
      'nhãn thực phẩm',
      'thí nghiệm lựa chọn',
    ],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/nghien-cuu-su-san-sang-tra-tien-doi-voi-nhan-thuc-pham-phuc-loi-dong-vat-ung-dung-phuong-phap-thi-nghiem-lua-chon',
    sourceLabel: 'Website công khai GISA: nhãn phúc lợi động vật',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Kinh tế thực phẩm',
      year: '2023',
      authors:
        'Gorton, M.; Yeh, C.-H.; Chatzopoulou, E.; White, J.; Tocco, B.; Hubbard, C.; Hallam, F.',
      citation:
        'Gorton, M. và cộng sự (2023). Consumers’ willingness to pay for an animal welfare food label. Ecological Economics, 209, 107852.',
    },
    publication: {
      journal: 'Ecological Economics, 209, 107852',
      year: 2023,
      doi: 'https://doi.org/10.1016/j.ecolecon.2023.107852',
    },
  },
  {
    id: 'publication-alternative-crops-comparative-advantage',
    kind: 'publication',
    collection: 'publications',
    slug: 'loi-the-so-sanh-cua-cac-loai-cay-trong-thay-the',
    path: '/nghien-cuu/bai-bao-khoa-hoc/loi-the-so-sanh-cua-cac-loai-cay-trong-thay-the',
    locale: 'vi',
    translationKey: 'publication-alternative-crops-comparative-advantage',
    title: 'Lợi thế so sánh của các loại cây trồng thay thế tại Bến Tre',
    summary:
      'So sánh lúa, dừa và bưởi bằng chỉ số DRC, SCB trong ma trận phân tích chính sách PAM kèm phân tích độ nhạy.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu đo lợi thế so sánh của ba cây trồng thay thế gồm lúa, dừa và bưởi tại Bến Tre, Đồng bằng sông Cửu Long, bằng chỉ số DRC, SCB và các chỉ số cạnh tranh khác trong ma trận phân tích chính sách PAM, kèm phân tích độ nhạy.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Bưởi có năng lực cạnh tranh mạnh nhất, dừa ở mức trung bình, lúa yếu nhất.',
          'Dừa là cây ổn định nhất trước biến động; lúa nhạy cảm nhất với thay đổi khí hậu và thị trường.',
          'Nghiên cứu gợi ý chuyển một phần diện tích lúa sang bưởi hoặc dừa để cải thiện hiệu quả kinh tế và tính bền vững.',
        ],
      },
    ],
    tags: [
      'Kinh tế nông nghiệp',
      'Bến Tre',
      'lợi thế so sánh',
      'chuyển đổi cây trồng',
    ],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/loi-the-so-sanh-cua-cac-loai-cay-trong-thay-the-nghien-cuu-so-sanh-o-ben-tre-dong-bang-song-cuu-long-viet-nam',
    sourceLabel: 'Website công khai GISA: lợi thế so sánh cây trồng thay thế',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Kinh tế nông nghiệp',
      year: '2019',
      authors: 'Hoang, V.V.; Tran, K.T.',
      citation:
        'Hoang, V.V. & Tran, K.T. (2019). Comparative Advantages of Alternative Crops: A Comparison Study in Ben Tre, Mekong Delta, Vietnam. Agris on-line Papers in Economics and Informatics, 11(1), 35-47.',
    },
    publication: {
      journal: 'Agris on-line Papers in Economics and Informatics, 11(1), 35-47',
      year: 2019,
      doi: 'https://doi.org/10.7160/aol.2019.110104',
    },
  },
  {
    id: 'publication-agricultural-competitiveness-rca-nrca',
    kind: 'publication',
    collection: 'publications',
    slug: 'nang-luc-canh-tranh-nong-nghiep-theo-rca-va-nrca',
    path: '/nghien-cuu/bai-bao-khoa-hoc/nang-luc-canh-tranh-nong-nghiep-theo-rca-va-nrca',
    locale: 'vi',
    translationKey: 'publication-agricultural-competitiveness-rca-nrca',
    title:
      'Năng lực cạnh tranh nông nghiệp của Việt Nam theo các chỉ số RCA và NRCA',
    summary:
      'Đo năng lực cạnh tranh tĩnh và động của nông nghiệp Việt Nam, đồng thời kiểm tra mức nhất quán giữa RCA, NRCA và RTA.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu đo năng lực cạnh tranh tĩnh và động của nông nghiệp Việt Nam bằng chỉ số RCA và NRCA. Động thái của các chỉ số được đánh giá qua ba cách tiếp cận: hồi quy OLS, ma trận Markov và phân tích xu hướng.',
      },
      {
        type: 'paragraph',
        text: 'Bài báo cũng kiểm tra mức nhất quán giữa ba chỉ số RCA, NRCA và RTA khi phân loại và khi xếp hạng mức độ lợi thế.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Việt Nam có lợi thế mạnh ở trồng trọt và thủy sản, yếu hơn ở chăn nuôi và thực phẩm chế biến.',
          'Cơ cấu ngành mạnh và yếu hội tụ và giữ mức ổn định cao qua thời gian.',
          'Chiến lược xuất khẩu vẫn dựa nhiều vào sản phẩm truyền thống thâm dụng tài nguyên, cải thiện chậm.',
          'Ba chỉ số nhất quán khi phân loại có hay không có lợi thế, nhưng kém nhất quán khi xếp hạng mức độ.',
        ],
      },
    ],
    tags: ['Thương mại nông nghiệp', 'RCA', 'NRCA', 'năng lực cạnh tranh'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/nang-luc-canh-tranh-nong-nghiep-cua-viet-nam-theo-cac-chi-so-rca-va-nrca-va-tinh-nhat-quan-cua-cac-chi-so-nang-luc-canh-tranh',
    sourceLabel: 'Website công khai GISA: chỉ số RCA và NRCA',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Thương mại nông nghiệp',
      year: '2017',
      authors: 'Hoang, V.V.; Tran, K.T.; Tu, B.V.; Nguyen, V.N.; Nguyen, A.Q.',
      citation:
        'Hoang, V.V. và cộng sự (2017). Agricultural Competitiveness of Vietnam by the RCA and the NRCA Indices, and Consistency of Competitiveness Indices. Agris on-line Papers in Economics and Informatics, 9(4), 53-67.',
    },
    publication: {
      journal: 'Agris on-line Papers in Economics and Informatics, 9(4), 53-67',
      year: 2017,
      doi: 'https://doi.org/10.7160/aol.2017.090406',
    },
  },
  {
    id: 'publication-eu-food-quality-schemes-sustainability',
    kind: 'publication',
    collection: 'publications',
    slug: 'tinh-ben-vung-cua-chuong-trinh-chat-luong-thuc-pham-chau-au',
    path: '/nghien-cuu/bai-bao-khoa-hoc/tinh-ben-vung-cua-chuong-trinh-chat-luong-thuc-pham-chau-au',
    locale: 'vi',
    translationKey: 'publication-eu-food-quality-schemes-sustainability',
    title: 'Tính bền vững của các chương trình chất lượng thực phẩm châu Âu',
    summary:
      'Chuyên khảo Springer mô tả 27 chương trình PDO, PGI và hữu cơ cùng dữ liệu thô về cơ cấu, quản trị và hiệu quả bền vững.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Công trình đánh giá chính sách chất lượng của Liên minh châu Âu, tập trung vào cơ cấu, quản trị và hiệu quả kinh tế, môi trường và xã hội của các chương trình chất lượng thực phẩm tại châu Âu và Đông Nam Á.',
      },
      {
        type: 'paragraph',
        text: 'Đây là chuyên khảo do Filippo Arfini và Valentin Bellassen chủ biên, xuất bản bởi Springer trong khuôn khổ dự án Strength2Food.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Hiệu quả kinh tế biến thiên mạnh giữa các trường hợp: một số sản phẩm tạo giá trị gia tăng đáng kể, nhiều trường hợp khác chưa đạt tính bền vững kinh tế.',
          'Hiệu quả môi trường và xã hội phần lớn chưa được kiểm chứng đầy đủ, trừ nhóm sản phẩm hữu cơ.',
          'Công trình cung cấp mô tả 27 chương trình cùng dữ liệu thô cho phép phân tích lại.',
        ],
      },
    ],
    tags: [
      'Chất lượng thực phẩm',
      'PDO',
      'PGI',
      'hữu cơ',
      'phát triển bền vững',
    ],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/tinh-ben-vung-cua-cac-chuong-trinh-chat-luong-thuc-pham-chau-au-da-hieu-suat-co-cau-va-quan-tri-cac-he-thong-pdo-pgi-va-nong-san-huu-co',
    sourceLabel:
      'Website công khai GISA: chương trình chất lượng thực phẩm châu Âu',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Chuyên khảo',
      topic: 'Chất lượng thực phẩm',
      year: '2019',
      authors: 'Arfini, F. & Bellassen, V. (chủ biên)',
      citation:
        'Arfini, F. & Bellassen, V. (chủ biên) (2019). Sustainability of European Food Quality Schemes: Multi-Performance, Structure, and Governance of PDO, PGI, and Organic Agri-Food Systems. Springer.',
    },
    publication: {
      journal: 'Springer International Publishing',
      year: 2019,
      doi: 'https://doi.org/10.1007/978-3-030-27508-2',
    },
  },
  {
    id: 'publication-short-food-supply-chain-sustainability',
    kind: 'publication',
    collection: 'publications',
    slug: 'do-luong-tinh-ben-vung-chuoi-cung-ung-thuc-pham-ngan',
    path: '/nghien-cuu/bai-bao-khoa-hoc/do-luong-tinh-ben-vung-chuoi-cung-ung-thuc-pham-ngan',
    locale: 'vi',
    translationKey: 'publication-short-food-supply-chain-sustainability',
    title:
      'Đo lường tính bền vững kinh tế, môi trường và xã hội của chuỗi cung ứng thực phẩm ngắn',
    summary:
      'So sánh 486 chuỗi cung ứng ngắn và dài từ dữ liệu 208 nhà sản xuất tại bảy quốc gia, trong đó có Việt Nam.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu đánh giá tính bền vững của các kênh phân phối thực phẩm dựa trên dữ liệu từ 208 nhà sản xuất tại bảy quốc gia gồm Pháp, Hungary, Ý, Na Uy, Ba Lan, Vương quốc Anh và Việt Nam.',
      },
      {
        type: 'paragraph',
        text: 'Phương pháp định lượng được dùng để so sánh 486 chuỗi cung ứng ngắn và dài trên cả ba trục kinh tế, môi trường và xã hội.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Tham gia chuỗi ngắn mang lại lợi ích kinh tế rõ rệt cho nhà sản xuất.',
          'Chuỗi dài đôi khi tạo tác động môi trường thấp hơn tính trên mỗi đơn vị sản lượng.',
          'Kết quả ở khía cạnh xã hội không đồng nhất, khác biệt đáng kể giữa các loại kênh.',
        ],
      },
    ],
    tags: ['Chuỗi cung ứng', 'chuỗi cung ứng ngắn', 'phát triển bền vững'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/do-luong-tinh-ben-vung-ve-kinh-te-moi-truong-va-xa-hoi-cua-chuoi-cung-ung-thuc-pham-ngan-han',
    sourceLabel: 'Website công khai GISA: chuỗi cung ứng thực phẩm ngắn',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Chuỗi cung ứng',
      year: '2019',
      authors: 'Malak-Rawlikowska, A.; Majewski, E.; Wąs, A. và cộng sự',
      citation:
        'Malak-Rawlikowska, A. và cộng sự (2019). Measuring the Economic, Environmental, and Social Sustainability of Short Food Supply Chains. Sustainability, 11(15), 4004.',
    },
    publication: {
      journal: 'Sustainability, 11(15), 4004',
      year: 2019,
      doi: 'https://doi.org/10.3390/su11154004',
    },
  },
  {
    id: 'publication-intra-industry-agricultural-trade',
    kind: 'publication',
    collection: 'publications',
    slug: 'dong-luc-cua-thuong-mai-noi-nganh-nong-nghiep',
    path: '/nghien-cuu/bai-bao-khoa-hoc/dong-luc-cua-thuong-mai-noi-nganh-nong-nghiep',
    locale: 'vi',
    translationKey: 'publication-intra-industry-agricultural-trade',
    title: 'Động lực của thương mại nội ngành nông nghiệp tại Việt Nam',
    summary:
      'Dùng chỉ số Grubel-Lloyd để phân loại 42 ngành thương mại liên ngành và 19 ngành thương mại nội ngành.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu khảo sát thương mại nội ngành của nông nghiệp Việt Nam trên thị trường toàn cầu thông qua chỉ số Grubel-Lloyd, kết hợp hồi quy OLS, ma trận Markov và phân tích xu hướng.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Nông nghiệp Việt Nam có 42 ngành thương mại liên ngành nhưng chỉ 19 ngành thương mại nội ngành.',
          'Tỷ trọng thương mại nội ngành tăng dần theo thời gian, chủ yếu do chuyển dịch cơ cấu kinh tế.',
          'Thương mại nội ngành có quan hệ nghịch với mức độ chuyên môn hóa thương mại.',
        ],
      },
    ],
    tags: ['Thương mại nông nghiệp', 'thương mại nội ngành', 'cơ cấu kinh tế'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/dong-luc-cua-thuong-mai-noi-nganh-nong-nghiep-mot-nghien-cuu-dien-hinh-toan-dien-o-viet-nam',
    sourceLabel: 'Website công khai GISA: thương mại nội ngành nông nghiệp',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Thương mại nông nghiệp',
      year: '2019',
      authors: 'Hoang, V.',
      citation:
        'Hoang, V. (2019). The dynamics of agricultural intra-industry trade: A comprehensive case study in Vietnam. Structural Change and Economic Dynamics, 49, 74-82.',
    },
    publication: {
      journal: 'Structural Change and Economic Dynamics, 49, 74-82',
      year: 2019,
      doi: 'https://doi.org/10.1016/j.strueco.2019.04.004',
    },
  },
  {
    id: 'publication-agricultural-trade-specialisation',
    kind: 'publication',
    collection: 'publications',
    slug: 'chuyen-mon-hoa-thuong-mai-nong-nghiep-o-nen-kinh-te-chuyen-doi',
    path: '/nghien-cuu/bai-bao-khoa-hoc/chuyen-mon-hoa-thuong-mai-nong-nghiep-o-nen-kinh-te-chuyen-doi',
    locale: 'vi',
    translationKey: 'publication-agricultural-trade-specialisation',
    title:
      'Sự phát triển của chuyên môn hóa thương mại nông nghiệp ở các nền kinh tế chuyển đổi',
    summary:
      'Phân tích chỉ số Lafay cho nông sản Việt Nam giai đoạn 1997-2014 bằng OLS, ma trận Markov và phân tích xu hướng.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Bài báo nghiên cứu chuyên môn hóa thương mại nông sản của Việt Nam trên thị trường thế giới bằng chỉ số Lafay. Biến động của chỉ số trong giai đoạn 1997-2014 được phân tích theo ba cách: hồi quy OLS, ma trận Markov và phân tích xu hướng.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Việt Nam chuyên môn hóa cao ở trồng trọt và thủy sản, thấp ở chăn nuôi và thực phẩm chế biến.',
          'Nhóm ngành đang chuyên môn hóa cao có xu hướng giảm dần mức độ chuyên môn hóa.',
          'Nhóm ngành chưa chuyên môn hóa lại có xu hướng tăng.',
          'Mô hình chuyên môn hóa tổng thể và tác động của khủng hoảng 2008 chưa thể hiện rõ.',
        ],
      },
    ],
    tags: ['Thương mại nông nghiệp', 'chỉ số Lafay', 'kinh tế chuyển đổi'],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/nghien-cuu-su-phat-trien-cua-chuyen-mon-hoa-thuong-mai-nong-nghiep-o-cac-nen-kinh-te-chuyen-doi-nghien-cuu-truong-hop-tu-viet-nam',
    sourceLabel:
      'Website công khai GISA: chuyên môn hóa thương mại nông nghiệp',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Thương mại nông nghiệp',
      year: '2019',
      authors: 'Hoang, V.V.',
      citation:
        'Hoang, V.V. (2019). Investigating the evolution of agricultural trade specialization in transition economies: A case study from Vietnam. The International Trade Journal, 33(4), 361-378.',
    },
    publication: {
      journal: 'The International Trade Journal, 33(4), 361-378',
      year: 2019,
      doi: 'https://doi.org/10.1080/08853908.2018.1543622',
    },
  },
  {
    id: 'publication-pomelo-value-chain-ben-tre',
    kind: 'publication',
    collection: 'publications',
    slug: 'nghien-cuu-chuoi-gia-tri-buoi-da-xanh-ben-tre',
    path: '/nghien-cuu/bai-bao-khoa-hoc/nghien-cuu-chuoi-gia-tri-buoi-da-xanh-ben-tre',
    locale: 'vi',
    translationKey: 'publication-pomelo-value-chain-ben-tre',
    title: 'Nghiên cứu chuỗi giá trị bưởi da xanh Bến Tre',
    summary:
      'Khảo sát chuỗi tại Bến Tre và thị trường TP. Hồ Chí Minh theo khung GTZ kết hợp M4P và FAO.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu được thực hiện tại tỉnh Bến Tre và thị trường tiêu thụ bưởi da xanh ở Thành phố Hồ Chí Minh, nhằm phân tích hiện trạng vận hành của chuỗi giá trị.',
      },
      {
        type: 'paragraph',
        text: 'Lý thuyết chuỗi giá trị của GTZ được kết hợp với khung phân tích của M4P và FAO để làm rõ quan hệ giữa các tác nhân, chi phí, lợi nhuận và giá trị gia tăng.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Chuỗi giá trị bưởi da xanh Bến Tre đạt hiệu quả kinh tế và xã hội cao.',
          'Lợi nhuận được phân bổ tương đối công bằng giữa các tác nhân.',
          'Khó khăn chính là sâu bệnh và việc mở rộng diện tích nhanh.',
          'Cần phát triển thị trường tiêu thụ đa dạng hơn để giảm rủi ro đầu ra.',
        ],
      },
    ],
    image: IMAGE.pomelo,
    tags: ['Chuỗi giá trị', 'bưởi da xanh', 'Bến Tre', 'nông nghiệp'],
    evidenceStatus: 'provided_by_gisa',
    sourceUrl: 'https://gisa.edu.vn/nghien-cuu-chuoi-gia-tri-buoi-da-xanh-ben-tre',
    sourceLabel: 'Website công khai GISA: chuỗi giá trị bưởi da xanh Bến Tre',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Chuỗi giá trị',
      year: '2016',
      authors: 'Van Hoang, V.',
      citation:
        'Van Hoang, V. (2016). Nghiên cứu chuỗi giá trị bưởi da xanh Bến Tre. Trường Đại học Kinh tế Thành phố Hồ Chí Minh.',
    },
    publication: {
      journal: 'Trường Đại học Kinh tế Thành phố Hồ Chí Minh',
      year: 2016,
    },
  },
  {
    id: 'publication-short-food-supply-chain-framework',
    kind: 'publication',
    collection: 'publications',
    slug: 'chuoi-cung-ung-thuc-pham-ngan-ben-vung-va-binh-dang',
    path: '/nghien-cuu/bai-bao-khoa-hoc/chuoi-cung-ung-thuc-pham-ngan-ben-vung-va-binh-dang',
    locale: 'vi',
    translationKey: 'publication-short-food-supply-chain-framework',
    title:
      'Chuỗi cung ứng thực phẩm ngắn: Động lực bền vững và bình đẳng cho tương lai',
    summary:
      'Khung khái niệm sáu trụ cột với 28 chỉ số cho chuỗi cung ứng thực phẩm ngắn, áp dụng cho chuỗi rau tại Việt Nam.',
    body: [
      { type: 'heading', level: 2, text: 'Bối cảnh và mục tiêu' },
      {
        type: 'paragraph',
        text: 'Nghiên cứu đề xuất khung khái niệm cho chuỗi cung ứng thực phẩm ngắn gồm sáu trụ cột và 28 chỉ số, rồi áp dụng cho chuỗi rau tại Việt Nam để kiểm định trong thực tế.',
      },
      { type: 'heading', level: 2, text: 'Kết quả chính' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Chuỗi rau ngắn làm tăng thu nhập và việc làm cho nông hộ.',
          'Giảm ô nhiễm môi trường và hao hụt thực phẩm.',
          'Cải thiện chất lượng thực phẩm và sức khỏe người tiêu dùng.',
          'Tăng giáo dục nông trại và gắn kết quan hệ cộng đồng.',
          'Thực hành nông nghiệp tốt và tính bền vững gắn chặt với nhau, đều là yếu tố nội tại của chuỗi cung ứng ngắn.',
        ],
      },
    ],
    tags: [
      'Chuỗi cung ứng',
      'chuỗi cung ứng ngắn',
      'phát triển bền vững',
      'cộng đồng',
    ],
    evidenceStatus: 'verified',
    sourceUrl:
      'https://gisa.edu.vn/chuoi-cung-ung-thuc-pham-ngan-han-dong-luc-ben-vung-va-binh-dang-cho-tuong-lai',
    sourceLabel: 'Website công khai GISA: chuỗi cung ứng thực phẩm ngắn',
    checkedAt: CHECKED_AT,
    metadata: {
      type: 'Bài báo khoa học',
      topic: 'Chuỗi cung ứng',
      year: '2021',
      authors: 'Hoang, V.',
      citation:
        'Hoang, V. (2021). Modern Short Food Supply Chain, Good Agricultural Practices, and Sustainability: A Conceptual Framework and Case Study in Vietnam. Agronomy, 11(12), 2408.',
    },
    publication: {
      journal: 'Agronomy, 11(12), 2408',
      year: 2021,
      doi: 'https://doi.org/10.3390/agronomy11122408',
    },
  },
] satisfies ContentRecord[];
