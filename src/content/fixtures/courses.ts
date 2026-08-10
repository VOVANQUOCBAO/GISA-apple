import type { ContentBlock, ContentRecord } from '../types';

/**
 * 49 khóa học thuộc năm dòng chương trình đào tạo của GISA.
 *
 * Mỗi trang khóa học ghép hai lớp nội dung: mô tả riêng của khóa, và phần khung
 * chung của dòng chương trình (giới thiệu, người học phù hợp, mục tiêu, giá trị).
 * Khung chung khai báo một lần cho mỗi dòng thay vì lặp lại ở 49 bản ghi, nên khi
 * trang nguồn sửa lời giới thiệu của một dòng thì chỉ phải sửa đúng một chỗ.
 *
 * Học phí và lịch khai giảng không có trên trang nguồn nên không bản ghi nào công
 * bố hai thông tin đó; `docs/content-source-register.md` cũng ghi rõ "không gồm
 * học phí và không gồm lịch khai giảng" cho mọi dòng khóa học.
 */

const CHECKED_AT = '2026-08-05';

const enrolmentNote: ContentBlock = {
  type: 'paragraph',
  text: 'GISA sẽ thông báo thông tin tuyển sinh, lịch khai giảng và hướng dẫn đăng ký theo từng đợt. Người học nên kiểm tra cập nhật trước khi lựa chọn khóa học.',
};

interface Program {
  audience: string[];
  intro: string[];
  label: string;
  objectives: string[];
  sourceLabel: string;
  sourceUrl: string;
  summaryPrefix: string;
  values: string[];
}

const programs = {
  core: {
    label: 'GISA Core',
    sourceUrl: 'https://gisa.edu.vn/dao-tao-chuyen-mon-gisa-core',
    sourceLabel: 'Website công khai GISA — Đào tạo chuyên môn GISA Core',
    summaryPrefix: 'Khóa học thuộc chương trình Đào tạo chuyên môn GISA Core',
    intro: [
      'GISA Core là chuỗi chương trình đào tạo chuyên sâu về kiến thức, kỹ năng và công cụ thiết yếu trong các lĩnh vực trọng điểm mà GISA nghiên cứu và tư vấn. Chương trình được thiết kế theo hướng chuẩn hóa và thực tiễn, bám sát nhu cầu của tổ chức, doanh nghiệp và xu thế phát triển bền vững.',
      'Mỗi khóa học tập trung vào một nhóm nghiệp vụ chuyên môn then chốt, kỹ năng cứng quan trọng hoặc công cụ điều hành – quản lý có tính ứng dụng cao. Phương pháp đào tạo là tương tác, case study và mô phỏng tình huống sát thực tế, với đội ngũ chuyên gia đầu ngành và giảng viên giàu kinh nghiệm thực chiến.',
    ],
    audience: [
      'Chuyên viên, cán bộ nghiệp vụ, nhà quản lý cấp trung và chuyên gia độc lập muốn phát triển chuyên môn sâu theo hướng chuẩn hóa.',
      'Cá nhân đang làm việc trong doanh nghiệp, tổ chức xã hội, viện nghiên cứu, trường đại học và tổ chức phát triển.',
      'Người đang chuyển đổi nghề nghiệp hoặc được quy hoạch lên vai trò cao hơn.',
    ],
    objectives: [
      'Trang bị kiến thức nền tảng và công cụ chuyên môn tiên tiến theo từng lĩnh vực GISA nghiên cứu và tư vấn.',
      'Nâng cao hiệu quả công việc, khả năng ra quyết định và giải quyết vấn đề dựa trên tư duy khoa học và thực tiễn.',
      'Chuẩn hóa nghiệp vụ, tăng năng lực thích ứng với tiêu chuẩn nghề nghiệp quốc tế và yêu cầu phát triển bền vững.',
      'Tạo nền tảng để phát triển sự nghiệp lên các cấp độ cao hơn trong hành trình đào tạo của GISA.',
    ],
    values: [
      'Kiến thức chuyên sâu, cập nhật và có tính thực tiễn cao.',
      'Bộ công cụ và mô hình áp dụng được ngay vào công việc.',
      'Kỹ năng xử lý tình huống, lập kế hoạch và báo cáo chuyên môn.',
      'Nghiệp vụ được chuẩn hóa theo tiêu chuẩn quốc tế.',
      'Góc nhìn rộng hơn và khả năng phân tích đa chiều.',
      'Chứng nhận đào tạo chuyên môn của GISA.',
    ],
  },
  edge: {
    label: 'GISA Edge',
    sourceUrl: 'https://gisa.edu.vn/trai-nghiem-thuc-chien-gisa-edge',
    sourceLabel: 'Website công khai GISA — Trải nghiệm thực chiến GISA Edge',
    summaryPrefix: 'Khóa học thuộc chương trình Trải nghiệm thực chiến GISA Edge',
    intro: [
      'GISA Edge là chương trình đào tạo ứng dụng cao, kết hợp giữa học tập thực tiễn, huấn luyện cá nhân và trải nghiệm dự án thật, dành riêng cho những người đang trong giai đoạn khởi nghiệp nghề nghiệp.',
      'Chương trình được thiết kế theo mô hình hybrid linh hoạt, gồm các khóa học tương tác, hoạt động nhóm, thực hành tình huống và kết nối mentor, giúp người học va chạm đúng lúc với môi trường doanh nghiệp và phát triển đồng thời kỹ năng, tư duy và thái độ.',
    ],
    audience: [
      'Sinh viên năm cuối, học viên đang thực tập, người mới tốt nghiệp hoặc mới đi làm dưới hai năm.',
      'Người đang thiếu định hướng nghề nghiệp rõ ràng, cần va chạm thực tế để hiểu bản thân và thị trường.',
      'Người có tinh thần cầu tiến, muốn học cách làm việc thực sự trong môi trường chuyên nghiệp.',
      'Người muốn tạo dựng thương hiệu cá nhân và kỹ năng nổi bật để tăng cơ hội tuyển dụng.',
    ],
    objectives: [
      'Trang bị kỹ năng nền tảng và tư duy làm việc chuyên nghiệp để hội nhập hiệu quả vào doanh nghiệp.',
      'Rút ngắn khoảng cách giữa học thuật và thực tiễn qua dự án thực hành, tình huống mô phỏng và huấn luyện 1:1.',
      'Hỗ trợ xác định định hướng nghề nghiệp phù hợp, nhận diện điểm mạnh và điểm yếu để phát triển cá nhân.',
      'Xây dựng hồ sơ nghề nghiệp và kết nối với hệ sinh thái chuyên gia, doanh nghiệp sau tốt nghiệp.',
    ],
    values: [
      'Trải nghiệm thực tế mô phỏng môi trường doanh nghiệp chuyên nghiệp.',
      'Rèn luyện kỹ năng làm việc, giao tiếp, xử lý tình huống và làm việc nhóm.',
      'Tư duy phản biện, giải quyết vấn đề và thích ứng với sự thay đổi.',
      'Hiểu rõ bản thân để xác định đúng định hướng nghề nghiệp.',
      'Hồ sơ nghề nghiệp nổi bật: CV, LinkedIn và kỹ năng phỏng vấn.',
      'Kết nối với mentor, chuyên gia và cộng đồng nghề nghiệp thực tế.',
      'Huấn luyện cá nhân hóa qua phản hồi trực tiếp và hướng dẫn thực chiến.',
      'Tư duy phát triển bền vững trong sự nghiệp ngay từ giai đoạn khởi đầu.',
    ],
  },
  rise: {
    label: 'GISA Rise',
    sourceUrl: 'https://gisa.edu.vn/but-pha-su-nghiep-gisa-rise',
    sourceLabel: 'Website công khai GISA — Bứt phá sự nghiệp GISA Rise',
    summaryPrefix: 'Khóa học thuộc chương trình Bứt phá sự nghiệp GISA Rise',
    intro: [
      'GISA Rise là chương trình đào tạo chuyên sâu nhằm trang bị tư duy lãnh đạo, năng lực quản trị và khả năng thích ứng chiến lược cho những cá nhân đang ở ngưỡng phát triển vượt bậc trong sự nghiệp.',
      'Chương trình giúp học viên nhận diện trần phát triển, xác lập tầm nhìn mới và xây dựng năng lực lõi để chuyển mình từ người giỏi chuyên môn sang người có ảnh hưởng, thông qua huấn luyện thực chiến, mentoring 1:1 và kết nối chuyên gia. Khóa học được thiết kế linh hoạt theo mô hình hybrid hoặc retreat ngắn ngày, phù hợp với người đi làm.',
    ],
    audience: [
      'Trưởng nhóm, giám sát, trưởng phòng, chuyên viên kỳ cựu hoặc quản lý cấp trung đang chuẩn bị thăng tiến.',
      'Người có nhiều kinh nghiệm thực tế nhưng thiếu nền tảng quản lý, lãnh đạo hoặc tư duy chiến lược bài bản.',
      'Người đang ở ngưỡng bão hòa sự nghiệp, cần tái tạo năng lượng, tư duy và năng lực cho giai đoạn mới.',
      'Cá nhân muốn trở thành người dẫn dắt, có ảnh hưởng và tạo giá trị thực cho tổ chức và đội ngũ.',
    ],
    objectives: [
      'Vượt qua điểm nghẽn nghề nghiệp để bước vào cấp độ mới: từ thực hiện sang định hướng, từ chuyên môn sang lãnh đạo.',
      'Xây dựng tư duy chiến lược, tư duy hệ thống và khả năng ra quyết định trong môi trường bất định.',
      'Phát triển kỹ năng quản lý đội nhóm, điều hành hiệu suất và tạo động lực dài hạn cho tổ chức.',
      'Kích hoạt tinh thần lãnh đạo, sự tự tin và khả năng truyền cảm hứng để tạo dấu ấn cá nhân.',
    ],
    values: [
      'Phá vỡ điểm nghẽn phát triển và xác lập lộ trình nghề nghiệp mới.',
      'Tư duy chiến lược và năng lực hoạch định linh hoạt, thực tiễn.',
      'Kỹ năng quản lý đội nhóm, hiệu suất và truyền động lực.',
      'Nâng cao năng lực giao tiếp, thương thuyết và xử lý xung đột.',
      'Xây dựng bản sắc lãnh đạo và phong cách quản trị cá nhân.',
      'Kết nối mentor và cộng đồng quản lý – lãnh đạo cùng chí hướng.',
      'Khai mở sức mạnh nội tại, củng cố trí lực, cảm xúc và giá trị.',
      'Cập nhật xu hướng quản trị hiện đại và bài học thực chiến.',
    ],
  },
  ascend: {
    label: 'GISA Ascend',
    sourceUrl: 'https://gisa.edu.vn/lanh-dao-thanh-cong-gisa-ascend',
    sourceLabel: 'Website công khai GISA — Lãnh đạo thành công GISA Ascend',
    summaryPrefix: 'Khóa học thuộc chương trình Lãnh đạo thành công GISA Ascend',
    intro: [
      'GISA Ascend là chương trình đào tạo chiến lược dành cho các nhà lãnh đạo đang điều hành tổ chức, doanh nghiệp hoặc các dự án có tác động xã hội, tập trung phát triển tư duy hệ thống, năng lực lãnh đạo chuyển đổi, ra quyết định cấp cao và xây dựng ảnh hưởng bền vững.',
      'Học viên tiếp cận các mô hình quản trị hiện đại và bài học toàn cầu qua đối thoại chiến lược, thảo luận tình huống thực tế, mentoring cấp cao và mô hình đồng kiến tạo. Chương trình có thể triển khai theo mô hình hybrid hoặc retreat chuyên sâu dành cho lãnh đạo bận rộn.',
    ],
    audience: [
      'Lãnh đạo cấp trung đến cấp cao trong doanh nghiệp, tổ chức phi lợi nhuận, cơ quan công quyền hoặc chương trình phát triển.',
      'Người đang gánh vác vai trò điều hành chiến lược, xây dựng tổ chức và dẫn dắt đội ngũ quy mô lớn.',
      'Lãnh đạo muốn cập nhật xu hướng mới, nâng cấp khả năng dẫn dắt và tạo dấu ấn ảnh hưởng bền vững.',
      'Người đã vững vàng về chuyên môn và kinh nghiệm, nay cần bước lên tầm ảnh hưởng sâu rộng hơn.',
    ],
    objectives: [
      'Phát triển năng lực tư duy chiến lược, hoạch định tầm nhìn và kiến tạo văn hóa tổ chức bền vững.',
      'Nâng cao khả năng lãnh đạo trong môi trường biến động và quản trị sự thay đổi phức tạp.',
      'Mở rộng ảnh hưởng và khả năng dẫn dắt các hệ thống đa bên.',
      'Xây dựng bản sắc lãnh đạo có chiều sâu, để lại di sản cá nhân và tổ chức mang tính chuyển hóa.',
    ],
    values: [
      'Tư duy lãnh đạo chiến lược và dẫn dắt toàn hệ thống.',
      'Công cụ và mô hình lãnh đạo toàn cầu, ứng dụng thực tiễn.',
      'Phát triển bản sắc lãnh đạo và dấu ấn cá nhân.',
      'Kỹ năng quản trị sự thay đổi, điều phối xung đột và ra quyết định cấp cao.',
      'Tái tạo năng lượng lãnh đạo, làm chủ sức mạnh nội tâm và khả năng ảnh hưởng.',
      'Mạng lưới kết nối với lãnh đạo đa lĩnh vực.',
      'Mentoring 1:1 với các nhà lãnh đạo cấp cao nhiều kinh nghiệm.',
      'Hành trình học tập sâu, kết hợp trải nghiệm thực tế và tư vấn cá nhân hóa.',
    ],
  },
  legacy: {
    label: 'GISA Legacy',
    sourceUrl: 'https://gisa.edu.vn/su-nghiep-vien-man-gisa-legacy',
    sourceLabel: 'Website công khai GISA — Sự nghiệp viên mãn GISA Legacy',
    summaryPrefix: 'Khóa học thuộc chương trình Sự nghiệp viên mãn GISA Legacy',
    intro: [
      'GISA Legacy là chương trình đào tạo đỉnh cao dành cho những nhà lãnh đạo đã thành công và muốn kiến tạo di sản có giá trị, kết nối tinh hoa tri thức, triết lý phát triển bền vững và hành trình tìm về sự cân bằng giữa thành tựu cá nhân và đóng góp cộng đồng.',
      'Thông qua các chuyên đề chuyên sâu, đối thoại lãnh đạo và trải nghiệm tương tác, người học được dẫn dắt tái định hình mục tiêu sống và tư duy lãnh đạo dài hạn — một hành trình chuyển hóa từ thành công sang viên mãn.',
    ],
    audience: [
      'Lãnh đạo cấp cao, CEO, chủ doanh nghiệp, nhà sáng lập, nhà hoạch định chính sách hoặc cá nhân đã đạt vị thế nghề nghiệp cao và đang tìm kiếm chiều sâu mới.',
      'Người muốn kiến tạo ảnh hưởng vượt khỏi tổ chức, mở rộng đóng góp cho cộng đồng và thế hệ kế tiếp.',
      'Cá nhân đã về đích trong sự nghiệp, nay muốn chuyển hóa để kiến tạo một di sản sống.',
    ],
    objectives: [
      'Khám phá lại bản thân, sứ mệnh sống và triết lý lãnh đạo cá nhân ở giai đoạn viên mãn.',
      'Xây dựng kế hoạch kế thừa, phát triển tổ chức bền vững và gắn kết các thế hệ tiếp nối.',
      'Kết nối với cộng đồng lãnh đạo cùng chí hướng để lan tỏa giá trị vượt thời gian.',
      'Tạo ra sự thịnh vượng toàn diện: trí tuệ, tâm hồn, cộng đồng và di sản.',
    ],
    values: [
      'Tư duy lãnh đạo chuyển hóa: từ điều hành sang truyền cảm hứng và dẫn dắt thế hệ kế thừa.',
      'Nền tảng phát triển bền vững cá nhân và tổ chức ở cấp độ chiến lược.',
      'Cơ hội xây dựng cộng đồng tinh hoa để chia sẻ, đồng hành và tạo ảnh hưởng sâu rộng.',
      'Khả năng thiết kế di sản cá nhân từ giá trị sống, kinh nghiệm và trí tuệ.',
      'Kỹ năng truyền lửa và phát triển thế hệ kế cận trong tổ chức và gia đình.',
      'Trải nghiệm không gian học tập riêng tư, kết nối sâu và giàu cảm hứng.',
    ],
  },
} satisfies Record<string, Program>;

type ProgramKey = keyof typeof programs;

interface CourseSeed {
  description: string;
  id: string;
  objective: string;
  program: ProgramKey;
  slug: string;
  tags: string[];
  title: string;
}

const seeds: CourseSeed[] = [
  {
    id: 'course-practical-accounting-tax',
    program: 'core',
    slug: 'ke-toan-thuc-hanh-va-toi-uu-hoa-thue',
    title: 'Kế toán thực hành và tối ưu hóa thuế',
    description:
      'Trang bị kỹ năng kế toán doanh nghiệp thực tiễn: xử lý chứng từ, lập báo cáo tài chính và quyết toán thuế. Hướng dẫn các nguyên tắc tối ưu thuế đúng luật và phòng tránh rủi ro kiểm toán – thanh tra.',
    objective: 'Chuẩn hóa nghiệp vụ kế toán, lập báo cáo tài chính và tối ưu thuế đúng luật',
    tags: ['kế toán', 'thuế'],
  },
  {
    id: 'course-sme-financial-management',
    program: 'core',
    slug: 'quan-tri-tai-chinh-doanh-nghiep-vua-va-nho',
    title: 'Quản trị tài chính doanh nghiệp vừa và nhỏ',
    description:
      'Cung cấp công cụ phân tích và quản trị tài chính doanh nghiệp một cách chủ động. Học viên làm chủ các quyết định về dòng tiền, chi phí, đòn bẩy tài chính và tăng trưởng bền vững.',
    objective: 'Làm chủ quyết định về dòng tiền, chi phí và đòn bẩy tài chính',
    tags: ['tài chính', 'doanh nghiệp vừa và nhỏ'],
  },
  {
    id: 'course-digital-ai-marketing',
    program: 'core',
    slug: 'digital-va-ai-marketing-toi-uu-hoa-chien-luoc-so',
    title: 'Digital & AI Marketing: Tối ưu hóa chiến lược số',
    description:
      'Kết hợp marketing kỹ thuật số với các công cụ AI để phân tích hành vi khách hàng, tối ưu hóa nội dung và tự động hóa chiến dịch đa kênh. Dành cho marketer muốn nâng cấp năng lực công nghệ.',
    objective: 'Ứng dụng AI vào phân tích hành vi khách hàng và tự động hóa chiến dịch đa kênh',
    tags: ['marketing', 'trí tuệ nhân tạo'],
  },
  {
    id: 'course-multichannel-effective-sales',
    program: 'core',
    slug: 'multi-channel-va-effective-sales',
    title: 'Multi-channel & Effective Sales',
    description:
      'Xây dựng kỹ năng bán hàng đa nền tảng (offline, online, thương mại điện tử), quản lý pipeline, kỹ thuật chốt sale hiệu quả và chăm sóc khách hàng bền vững.',
    objective: 'Bán hàng đa nền tảng, quản lý pipeline và chăm sóc khách hàng bền vững',
    tags: ['bán hàng', 'thương mại điện tử'],
  },
  {
    id: 'course-digital-supply-chain-logistics',
    program: 'core',
    slug: 'quan-ly-chuoi-cung-ung-va-logistics-trong-thoi-dai-so',
    title: 'Quản lý chuỗi cung ứng và logistics trong thời đại số',
    description:
      'Trang bị tư duy hệ thống về chuỗi cung ứng, quản trị hàng tồn kho, phân phối và logistics. Áp dụng công nghệ số và dữ liệu lớn trong tối ưu vận hành.',
    objective: 'Tối ưu vận hành chuỗi cung ứng bằng công nghệ số và dữ liệu lớn',
    tags: ['chuỗi cung ứng', 'logistics'],
  },
  {
    id: 'course-strategic-human-resources',
    program: 'core',
    slug: 'quan-ly-nhan-su-chien-luoc-cho-to-chuc-nho-va-vua',
    title: 'Quản lý nhân sự chiến lược cho tổ chức nhỏ và vừa',
    description:
      'Hướng dẫn xây dựng hệ thống nhân sự bài bản từ tuyển dụng, đánh giá hiệu suất đến phát triển nhân tài và văn hóa doanh nghiệp trong bối cảnh nhiều thách thức nguồn lực.',
    objective: 'Xây dựng hệ thống nhân sự bài bản từ tuyển dụng đến phát triển nhân tài',
    tags: ['nhân sự', 'văn hóa doanh nghiệp'],
  },
  {
    id: 'course-customer-behaviour-analysis',
    program: 'core',
    slug: 'phan-tich-hanh-vi-khach-hang-va-ung-dung-trong-kinh-doanh',
    title: 'Phân tích hành vi khách hàng và ứng dụng trong kinh doanh',
    description:
      'Áp dụng tâm lý học hành vi, dữ liệu thị trường và công cụ nghiên cứu thực địa để hiểu sâu hơn về quyết định mua hàng, xây dựng trải nghiệm khách hàng phù hợp và hiệu quả.',
    objective: 'Hiểu quyết định mua hàng và thiết kế trải nghiệm khách hàng phù hợp',
    tags: ['hành vi khách hàng', 'nghiên cứu thị trường'],
  },
  {
    id: 'course-esg-corporate-sustainability',
    program: 'core',
    slug: 'esg-va-phat-trien-ben-vung-trong-doanh-nghiep',
    title: 'ESG và phát triển bền vững trong doanh nghiệp',
    description:
      'Giải thích rõ ESG là gì, tại sao cần thiết và làm sao để tích hợp vào chiến lược doanh nghiệp. Học viên học cách đánh giá rủi ro phi tài chính và xây dựng báo cáo ESG cơ bản.',
    objective: 'Tích hợp ESG vào chiến lược và xây dựng báo cáo ESG cơ bản',
    tags: ['ESG', 'phát triển bền vững'],
  },
  {
    id: 'course-circular-economy-business-models',
    program: 'core',
    slug: 'kinh-te-tuan-hoan-va-mo-hinh-kinh-doanh-ben-vung',
    title: 'Kinh tế tuần hoàn và mô hình kinh doanh bền vững',
    description:
      'Tìm hiểu các mô hình kinh doanh dựa trên tái chế và tái tạo, thiết kế vòng đời sản phẩm khép kín, đổi mới mô hình kinh doanh theo hướng bền vững và hiệu quả tài nguyên.',
    objective: 'Thiết kế mô hình kinh doanh tuần hoàn và vòng đời sản phẩm khép kín',
    tags: ['kinh tế tuần hoàn', 'mô hình kinh doanh'],
  },
  {
    id: 'course-development-social-impact-projects',
    program: 'core',
    slug: 'quan-ly-du-an-phat-trien-va-tac-dong-xa-hoi',
    title: 'Quản lý dự án phát triển và tác động xã hội',
    description:
      'Trang bị các kỹ thuật thiết kế, giám sát và đánh giá dự án, cách xây dựng logical framework, lập ngân sách và theo dõi kết quả đầu ra – đầu vào của các dự án cộng đồng.',
    objective: 'Thiết kế, giám sát và đánh giá dự án cộng đồng theo logical framework',
    tags: ['quản lý dự án', 'tác động xã hội'],
  },
  {
    id: 'course-agricultural-value-chain-development',
    program: 'core',
    slug: 'phat-trien-chuoi-gia-tri-nong-nghiep-nong-thon',
    title: 'Phát triển chuỗi giá trị nông nghiệp – nông thôn',
    description:
      'Tập trung vào tổ chức sản xuất, liên kết thị trường và phát triển sản phẩm OCOP. Học viên học cách xây dựng và vận hành chuỗi giá trị từ người dân đến thị trường hiệu quả.',
    objective: 'Xây dựng và vận hành chuỗi giá trị từ người sản xuất đến thị trường',
    tags: ['chuỗi giá trị', 'nông nghiệp'],
  },
  {
    id: 'course-systems-thinking-complex-problems',
    program: 'core',
    slug: 'tu-duy-he-thong-va-giai-quyet-van-de-phuc-hop',
    title: 'Tư duy hệ thống và giải quyết vấn đề phức hợp',
    description:
      'Giới thiệu tư duy hệ thống, bản đồ nguyên nhân – hệ quả và cách giải quyết các vấn đề có tính liên ngành, mâu thuẫn lợi ích hoặc diễn biến dài hạn trong tổ chức và xã hội.',
    objective: 'Giải quyết vấn đề liên ngành bằng tư duy hệ thống và bản đồ nguyên nhân – hệ quả',
    tags: ['tư duy hệ thống', 'giải quyết vấn đề'],
  },
  {
    id: 'course-public-policy-local-strategy',
    program: 'core',
    slug: 'phan-tich-chinh-sach-cong-va-hoach-dinh-chien-luoc-dia-phuong',
    title: 'Phân tích chính sách công và hoạch định chiến lược địa phương',
    description:
      'Trang bị công cụ phân tích chính sách dựa trên bằng chứng, cách xây dựng kế hoạch chiến lược phù hợp với bối cảnh địa phương, đặc biệt trong môi trường biến động và nguồn lực hạn chế.',
    objective: 'Phân tích chính sách dựa trên bằng chứng và hoạch định chiến lược địa phương',
    tags: ['chính sách công', 'chiến lược địa phương'],
  },
  {
    id: 'course-market-research-product-positioning',
    program: 'core',
    slug: 'nghien-cuu-thi-truong-va-dinh-vi-chien-luoc-san-pham',
    title: 'Nghiên cứu thị trường và định vị chiến lược sản phẩm',
    description:
      'Giúp học viên biết cách triển khai khảo sát định lượng và định tính, phân tích dữ liệu thị trường và xây dựng chiến lược sản phẩm phù hợp với nhu cầu thực tế và lợi thế cạnh tranh.',
    objective: 'Triển khai khảo sát thị trường và định vị sản phẩm theo lợi thế cạnh tranh',
    tags: ['nghiên cứu thị trường', 'chiến lược sản phẩm'],
  },
  {
    id: 'course-risk-management-compliance',
    program: 'core',
    slug: 'quan-tri-rui-ro-va-tuan-thu-trong-to-chuc-hien-dai',
    title: 'Quản trị rủi ro và tuân thủ trong tổ chức hiện đại',
    description:
      'Khóa học giúp học viên xây dựng hệ thống kiểm soát nội bộ, đánh giá rủi ro vận hành, pháp lý và tài chính. Đặc biệt hữu ích cho doanh nghiệp đang phát triển nhanh hoặc chuẩn bị gọi vốn.',
    objective: 'Xây dựng kiểm soát nội bộ và đánh giá rủi ro vận hành, pháp lý, tài chính',
    tags: ['quản trị rủi ro', 'tuân thủ'],
  },

  {
    id: 'course-self-discovery-career-direction',
    program: 'edge',
    slug: 'kham-pha-ban-than-va-dinh-huong-nghe-nghiep-ca-nhan',
    title: 'Khám phá bản thân & định hướng nghề nghiệp cá nhân',
    description:
      'Giúp học viên hiểu sâu về giá trị, năng lực, sở thích và động lực cá nhân để chọn đúng hướng đi nghề nghiệp.',
    objective: 'Nhận diện giá trị, năng lực và động lực cá nhân để chọn hướng nghề nghiệp',
    tags: ['định hướng nghề nghiệp', 'phát triển bản thân'],
  },
  {
    id: 'course-critical-thinking-problem-solving',
    program: 'edge',
    slug: 'tu-duy-phan-bien-va-giai-quyet-van-de-thuc-te',
    title: 'Tư duy phản biện & giải quyết vấn đề thực tế',
    description:
      'Rèn luyện kỹ năng phân tích, đánh giá và đưa ra quyết định thông minh trong các tình huống mô phỏng thực tế doanh nghiệp.',
    objective: 'Phân tích, đánh giá và ra quyết định trong tình huống doanh nghiệp mô phỏng',
    tags: ['tư duy phản biện', 'giải quyết vấn đề'],
  },
  {
    id: 'course-teamwork-collaboration',
    program: 'edge',
    slug: 'lam-viec-nhom-va-cong-tac-hieu-qua',
    title: 'Làm việc nhóm và cộng tác hiệu quả',
    description:
      'Giúp học viên hiểu vai trò trong nhóm, phát triển kỹ năng phối hợp, xử lý mâu thuẫn và làm việc đa chiều trong môi trường chuyên nghiệp.',
    objective: 'Phối hợp nhóm, xử lý mâu thuẫn và làm việc đa chiều',
    tags: ['làm việc nhóm', 'kỹ năng mềm'],
  },
  {
    id: 'course-understanding-business-from-inside',
    program: 'edge',
    slug: 'hieu-doanh-nghiep-tu-ben-trong-cau-truc-van-hanh-chien-luoc',
    title: 'Hiểu doanh nghiệp từ bên trong: cấu trúc – vận hành – chiến lược',
    description:
      'Khóa học mở góc nhìn hệ thống về tổ chức, cách các phòng ban liên kết và vai trò của từng cá nhân trong vận hành tổng thể.',
    objective: 'Nhìn tổ chức theo hệ thống: cấu trúc, liên kết phòng ban và vai trò cá nhân',
    tags: ['vận hành doanh nghiệp', 'tư duy hệ thống'],
  },
  {
    id: 'course-professional-conduct-communication',
    program: 'edge',
    slug: 'tac-phong-va-giao-tiep-chuyen-nghiep-trong-cong-viec',
    title: 'Tác phong và giao tiếp chuyên nghiệp trong công việc',
    description:
      'Trang bị kỹ năng giao tiếp qua email, thuyết trình, báo cáo và ứng xử phù hợp trong các tình huống công sở thực tế.',
    objective: 'Giao tiếp chuyên nghiệp qua email, thuyết trình và báo cáo',
    tags: ['giao tiếp', 'kỹ năng công sở'],
  },
  {
    id: 'course-first-90-days-at-work',
    program: 'edge',
    slug: '90-ngay-dau-di-lam-hoi-nhap-nhanh-tao-dau-an',
    title: '90 ngày đầu đi làm: hội nhập nhanh – tạo dấu ấn',
    description:
      'Hướng dẫn cách xây dựng uy tín, thiết lập mối quan hệ và thích nghi nhanh chóng trong giai đoạn then chốt của người mới đi làm.',
    objective: 'Xây dựng uy tín và thích nghi nhanh trong giai đoạn đầu đi làm',
    tags: ['hội nhập', 'người mới đi làm'],
  },
  {
    id: 'course-real-project-practice-with-mentor',
    program: 'edge',
    slug: 'thuc-hanh-du-an-thuc-te-lam-viec-voi-mentor-va-doanh-nghiep',
    title: 'Thực hành dự án thực tế: làm việc với mentor và doanh nghiệp',
    description:
      'Học viên tham gia dự án thực tế hoặc mô phỏng, cùng giải quyết vấn đề doanh nghiệp, được mentor hướng dẫn sát sao.',
    objective: 'Giải quyết vấn đề doanh nghiệp trong dự án thực tế dưới hướng dẫn của mentor',
    tags: ['dự án thực tế', 'mentoring'],
  },
  {
    id: 'course-personal-brand-career-profile',
    program: 'edge',
    slug: 'xay-dung-thuong-hieu-ca-nhan-va-ho-so-nghe-nghiep',
    title: 'Xây dựng thương hiệu cá nhân & hồ sơ nghề nghiệp',
    description:
      'Giúp học viên tạo dựng hình ảnh chuyên nghiệp, xây dựng CV/LinkedIn và chuẩn bị kỹ năng phỏng vấn hiệu quả.',
    objective: 'Dựng hình ảnh chuyên nghiệp, hồ sơ CV/LinkedIn và kỹ năng phỏng vấn',
    tags: ['thương hiệu cá nhân', 'hồ sơ nghề nghiệp'],
  },

  {
    id: 'course-career-repositioning',
    program: 'rise',
    slug: 'tai-dinh-vi-su-nghiep-nhin-lai-but-pha-tai-tao',
    title: 'Tái định vị sự nghiệp: Nhìn lại – Bứt phá – Tái tạo',
    description:
      'Khóa học giúp học viên phân tích hành trình nghề nghiệp hiện tại, nhận diện điểm giới hạn và xây dựng kế hoạch phát triển sự nghiệp có chủ đích cho giai đoạn mới.',
    objective: 'Nhận diện điểm giới hạn và lập kế hoạch phát triển sự nghiệp có chủ đích',
    tags: ['phát triển sự nghiệp', 'tái định vị'],
  },
  {
    id: 'course-effective-team-management',
    program: 'rise',
    slug: 'quan-ly-doi-ngu-hieu-qua-tu-ca-nhan-manh-den-tap-the-vung',
    title: 'Quản lý đội ngũ hiệu quả: Từ cá nhân mạnh đến tập thể vững',
    description:
      'Trang bị năng lực quản trị con người, xây dựng tinh thần đội nhóm, phân công công việc hợp lý và phát triển năng lực nội tại cho nhân sự.',
    objective: 'Quản trị con người, phân công hợp lý và phát triển năng lực nhân sự',
    tags: ['quản lý đội ngũ', 'quản trị nhân sự'],
  },
  {
    id: 'course-strategic-thinking-decision-making',
    program: 'rise',
    slug: 'tu-duy-chien-luoc-va-ra-quyet-dinh-trong-moi-truong-bat-dinh',
    title: 'Tư duy chiến lược và ra quyết định trong môi trường bất định',
    description:
      'Giúp người học hình thành tư duy hệ thống, phân tích đa chiều, ra quyết định linh hoạt trong điều kiện thay đổi liên tục và áp lực cao.',
    objective: 'Ra quyết định linh hoạt dựa trên tư duy hệ thống và phân tích đa chiều',
    tags: ['tư duy chiến lược', 'ra quyết định'],
  },
  {
    id: 'course-communication-negotiation-conflict',
    program: 'rise',
    slug: 'ky-nang-giao-tiep-thuong-luong-xu-ly-xung-dot-cho-quan-ly',
    title: 'Kỹ năng giao tiếp – thương lượng – xử lý xung đột cho quản lý',
    description:
      'Tập trung vào các kỹ năng then chốt để quản lý mối quan hệ đa tầng trong doanh nghiệp, từ giao tiếp với cấp trên, đồng cấp đến nhân viên và đối tác.',
    objective: 'Quản lý quan hệ đa tầng qua giao tiếp, thương lượng và xử lý xung đột',
    tags: ['giao tiếp', 'thương lượng'],
  },
  {
    id: 'course-influence-change-leadership-brand',
    program: 'rise',
    slug: 'tao-anh-huong-dan-dat-thay-doi-xay-dung-thuong-hieu-lanh-dao',
    title: 'Tạo ảnh hưởng – Dẫn dắt thay đổi – Xây dựng thương hiệu lãnh đạo',
    description:
      'Trang bị cho học viên cách truyền cảm hứng, dẫn dắt sự thay đổi và xây dựng thương hiệu cá nhân có ảnh hưởng tích cực trong nội bộ và cộng đồng nghề nghiệp.',
    objective: 'Truyền cảm hứng, dẫn dắt thay đổi và xây dựng thương hiệu lãnh đạo',
    tags: ['tạo ảnh hưởng', 'thương hiệu lãnh đạo'],
  },
  {
    id: 'course-time-work-energy-management',
    program: 'rise',
    slug: 'ky-nang-quan-ly-thoi-gian-cong-viec-nang-luong',
    title: 'Kỹ năng quản lý thời gian – công việc – năng lượng',
    description:
      'Giúp học viên quản trị tốt hơn ba nguồn lực quan trọng nhất để đảm bảo hiệu suất, cân bằng và sức bền trong giai đoạn phát triển sự nghiệp.',
    objective: 'Quản trị thời gian, công việc và năng lượng để giữ hiệu suất bền',
    tags: ['quản lý thời gian', 'hiệu suất'],
  },
  {
    id: 'course-inner-strength-emotional-intelligence',
    program: 'rise',
    slug: 'khai-pha-suc-manh-noi-tai-va-tri-tue-cam-xuc-trong-quan-tri',
    title: 'Khai phá sức mạnh nội tại và trí tuệ cảm xúc trong quản trị',
    description:
      'Khóa học phát triển năng lực cảm xúc, tự nhận thức và thấu cảm — nền tảng quan trọng để lãnh đạo bằng nhân tâm và phát triển bền vững.',
    objective: 'Phát triển tự nhận thức, thấu cảm và năng lực cảm xúc trong quản trị',
    tags: ['trí tuệ cảm xúc', 'lãnh đạo'],
  },
  {
    id: 'course-okr-kpi-performance-management',
    program: 'rise',
    slug: 'quan-tri-muc-tieu-hieu-suat-ket-qua-okr-kpi',
    title: 'Quản trị mục tiêu – hiệu suất – kết quả OKR/KPI',
    description:
      'Cung cấp công cụ và phương pháp để xây dựng, triển khai và đo lường mục tiêu đội nhóm hiệu quả, tạo sự đồng thuận và thúc đẩy kết quả thực chất.',
    objective: 'Xây dựng, triển khai và đo lường mục tiêu đội nhóm bằng OKR và KPI',
    tags: ['OKR', 'quản trị hiệu suất'],
  },

  {
    id: 'course-systems-thinking-leadership-strategy',
    program: 'ascend',
    slug: 'tu-duy-he-thong-va-hoach-dinh-chien-luoc-lanh-dao',
    title: 'Tư duy hệ thống và hoạch định chiến lược lãnh đạo',
    description:
      'Khóa học giúp lãnh đạo hiểu và vận hành hệ thống tổ chức trong bối cảnh phức tạp, xác lập chiến lược dài hạn và đồng bộ hóa với văn hóa doanh nghiệp.',
    objective: 'Vận hành hệ thống tổ chức và xác lập chiến lược dài hạn',
    tags: ['tư duy hệ thống', 'chiến lược lãnh đạo'],
  },
  {
    id: 'course-transformational-leadership-change',
    program: 'ascend',
    slug: 'lanh-dao-chuyen-doi-va-quan-tri-su-thay-doi-phuc-tap',
    title: 'Lãnh đạo chuyển đổi và quản trị sự thay đổi phức tạp',
    description:
      'Trang bị tư duy chuyển đổi tổ chức trong thời kỳ bất ổn, bao gồm thay đổi nhân sự, mô hình kinh doanh và hành vi tổ chức.',
    objective: 'Dẫn dắt chuyển đổi tổ chức về nhân sự, mô hình kinh doanh và hành vi',
    tags: ['lãnh đạo chuyển đổi', 'quản trị thay đổi'],
  },
  {
    id: 'course-executive-decision-making',
    program: 'ascend',
    slug: 'nghe-thuat-ra-quyet-dinh-cap-cao-va-dieu-hanh-trong-bat-dinh',
    title: 'Nghệ thuật ra quyết định cấp cao và điều hành trong bất định',
    description:
      'Nâng cao năng lực đánh giá rủi ro, phân tích kịch bản và ra quyết định với sự bình tĩnh và chiến lược trong tình huống không chắc chắn.',
    objective: 'Đánh giá rủi ro, phân tích kịch bản và ra quyết định cấp cao',
    tags: ['ra quyết định', 'điều hành'],
  },
  {
    id: 'course-organisational-culture-succession',
    program: 'ascend',
    slug: 'xay-dung-van-hoa-to-chuc-va-kien-tao-doi-ngu-ke-thua',
    title: 'Xây dựng văn hóa tổ chức và kiến tạo đội ngũ kế thừa',
    description:
      'Hướng đến xây dựng một tổ chức vững vàng với văn hóa học tập, đổi mới và phát triển kế thừa — yếu tố sống còn của lãnh đạo bền vững.',
    objective: 'Xây dựng văn hóa học tập, đổi mới và đội ngũ kế thừa',
    tags: ['văn hóa tổ chức', 'kế thừa'],
  },
  {
    id: 'course-leadership-brand-systemic-influence',
    program: 'ascend',
    slug: 'thuong-hieu-lanh-dao-va-anh-huong-he-thong',
    title: 'Thương hiệu lãnh đạo và ảnh hưởng hệ thống',
    description:
      'Phát triển hình ảnh lãnh đạo có chiều sâu, đồng thời lan tỏa giá trị cá nhân và tổ chức đến cộng đồng, đối tác và hệ sinh thái liên quan.',
    objective: 'Lan tỏa giá trị lãnh đạo tới cộng đồng, đối tác và hệ sinh thái',
    tags: ['thương hiệu lãnh đạo', 'ảnh hưởng'],
  },
  {
    id: 'course-strategic-dialogue-stakeholders',
    program: 'ascend',
    slug: 'doi-thoai-chien-luoc-va-ket-noi-da-chieu',
    title: 'Đối thoại chiến lược và kết nối đa chiều',
    description:
      'Tăng cường năng lực lắng nghe, đàm phán, đối thoại cấp cao để điều phối các bên liên quan, đặc biệt trong tổ chức đa tầng hoặc liên ngành.',
    objective: 'Điều phối các bên liên quan qua đối thoại và đàm phán cấp cao',
    tags: ['đối thoại chiến lược', 'các bên liên quan'],
  },
  {
    id: 'course-leading-with-emotional-intelligence',
    program: 'ascend',
    slug: 'lanh-dao-bang-tri-tue-cam-xuc-va-suc-manh-noi-tam',
    title: 'Lãnh đạo bằng trí tuệ cảm xúc và sức mạnh nội tâm',
    description:
      'Giúp người lãnh đạo phát triển trí tuệ cảm xúc, bản lĩnh nội tâm để duy trì sự điềm tĩnh, minh triết và nhân văn trong mọi quyết định.',
    objective: 'Giữ điềm tĩnh và nhân văn trong quyết định bằng trí tuệ cảm xúc',
    tags: ['trí tuệ cảm xúc', 'nội lực lãnh đạo'],
  },
  {
    id: 'course-leadership-in-digital-esg-globalisation',
    program: 'ascend',
    slug: 'lanh-dao-co-tam-anh-huong-trong-thoi-dai-so-ai-esg-va-toan-cau-hoa',
    title: 'Lãnh đạo có tầm ảnh hưởng trong thời đại số – AI, ESG và toàn cầu hóa',
    description:
      'Cập nhật những xu hướng lớn gồm AI, ESG và toàn cầu hóa, cùng vai trò của người lãnh đạo trong việc định hướng phát triển bền vững và có trách nhiệm.',
    objective: 'Định hướng phát triển bền vững trước các xu hướng AI, ESG và toàn cầu hóa',
    tags: ['AI', 'ESG', 'toàn cầu hóa'],
  },

  {
    id: 'course-transformational-leadership-legacy-thinking',
    program: 'legacy',
    slug: 'lanh-dao-chuyen-hoa-tu-dieu-hanh-den-dan-dat-bang-tu-duy-di-san',
    title: 'Lãnh đạo chuyển hóa: Từ điều hành đến dẫn dắt bằng tư duy di sản',
    description:
      'Khám phá hành trình lãnh đạo ở cấp độ cao nhất, nơi nhà lãnh đạo truyền cảm hứng bằng chính giá trị sống và di sản cá nhân, tái định hình vai trò lãnh đạo để lan tỏa ảnh hưởng bền vững.',
    objective: 'Tái định hình vai trò lãnh đạo quanh giá trị sống và di sản cá nhân',
    tags: ['lãnh đạo chuyển hóa', 'di sản'],
  },
  {
    id: 'course-succession-strategy-next-generation',
    program: 'legacy',
    slug: 'chien-luoc-ke-thua-va-phat-trien-the-he-lanh-dao-tiep-noi',
    title: 'Chiến lược kế thừa và phát triển thế hệ lãnh đạo tiếp nối',
    description:
      'Thiết kế hệ sinh thái kế thừa cho doanh nghiệp, tổ chức và gia đình, giúp chuẩn bị thế hệ kế nhiệm về tầm nhìn, năng lực và bản sắc tổ chức.',
    objective: 'Thiết kế hệ sinh thái kế thừa và chuẩn bị thế hệ kế nhiệm',
    tags: ['kế thừa', 'thế hệ lãnh đạo'],
  },
  {
    id: 'course-sustainable-leadership-vuca',
    program: 'legacy',
    slug: 'lanh-dao-ben-vung-trong-thoi-dai-bat-dinh',
    title: 'Lãnh đạo bền vững trong thời đại bất định (VUCA+)',
    description:
      'Tư duy chiến lược trong môi trường biến động, phát triển năng lực ứng biến và đổi mới trên nền tảng bền vững, giúp nhà lãnh đạo duy trì sức mạnh tổ chức khi thay đổi liên tục.',
    objective: 'Duy trì sức mạnh tổ chức bằng năng lực ứng biến và đổi mới bền vững',
    tags: ['lãnh đạo bền vững', 'VUCA'],
  },
  {
    id: 'course-personal-legacy-design',
    program: 'legacy',
    slug: 'thiet-ke-di-san-ca-nhan-tam-nhin-gia-tri-va-dau-an-de-lai',
    title: 'Thiết kế di sản cá nhân: Tầm nhìn, giá trị và dấu ấn để lại',
    description:
      'Dẫn dắt học viên hệ thống hóa giá trị sống, kinh nghiệm và triết lý lãnh đạo thành di sản truyền đời — một hành trình nội tâm sâu sắc và đầy cảm hứng.',
    objective: 'Hệ thống hóa giá trị sống và triết lý lãnh đạo thành di sản truyền đời',
    tags: ['di sản cá nhân', 'triết lý lãnh đạo'],
  },
  {
    id: 'course-advanced-emotional-intelligence-inspiration',
    program: 'legacy',
    slug: 'tri-tue-cam-xuc-cap-cao-va-nghe-thuat-truyen-cam-hung',
    title: 'Trí tuệ cảm xúc cấp cao & nghệ thuật truyền cảm hứng',
    description:
      'Phát triển chiều sâu cảm xúc, khả năng truyền động lực và thấu hiểu con người, xây dựng sức mạnh ảnh hưởng dựa trên nhân tâm và kết nối thật.',
    objective: 'Xây dựng ảnh hưởng dựa trên nhân tâm và khả năng truyền cảm hứng',
    tags: ['trí tuệ cảm xúc', 'truyền cảm hứng'],
  },
  {
    id: 'course-liberal-thinking-art-of-living',
    program: 'legacy',
    slug: 'tu-duy-khai-phong-va-nghe-thuat-song-tron-ven',
    title: 'Tư duy khai phóng và nghệ thuật sống trọn vẹn',
    description:
      'Mở rộng tầm nhìn cuộc sống, vượt qua giới hạn cũ để tìm thấy sự tự do, an yên và mục đích sâu sắc, hướng người học tới cách sống đủ, sống sâu và sống đẹp.',
    objective: 'Mở rộng tầm nhìn cuộc sống và tìm lại tự do, an yên, mục đích',
    tags: ['tư duy khai phóng', 'nghệ thuật sống'],
  },
  {
    id: 'course-community-leadership-social-impact',
    program: 'legacy',
    slug: 'lanh-dao-cong-dong-va-tao-anh-huong-xa-hoi',
    title: 'Lãnh đạo cộng đồng và tạo ảnh hưởng xã hội',
    description:
      'Phát triển năng lực kiến tạo sáng kiến xã hội và kết nối cộng đồng, giúp nhà lãnh đạo mở rộng vòng tròn ảnh hưởng ra ngoài tổ chức.',
    objective: 'Kiến tạo sáng kiến xã hội và mở rộng ảnh hưởng ra ngoài tổ chức',
    tags: ['lãnh đạo cộng đồng', 'tác động xã hội'],
  },
  {
    id: 'course-life-philosophy-leader-wellbeing',
    program: 'legacy',
    slug: 'triet-ly-song-va-nang-luc-song-hanh-phuc-cua-nha-lanh-dao',
    title: 'Triết lý sống và năng lực sống hạnh phúc của nhà lãnh đạo',
    description:
      'Kết hợp giữa quản trị cuộc sống cá nhân và nghệ thuật lãnh đạo đời sống tinh thần, tìm sự hài hòa giữa thành công, gia đình, sức khỏe và tâm hồn.',
    objective: 'Tìm sự hài hòa giữa thành công, gia đình, sức khỏe và đời sống tinh thần',
    tags: ['triết lý sống', 'cân bằng'],
  },
  {
    id: 'course-organisational-transformation-collective-legacy',
    program: 'legacy',
    slug: 'chuyen-hoa-to-chuc-tu-hieu-suat-den-di-san-tap-the',
    title: 'Chuyển hóa tổ chức: Từ hiệu suất đến di sản tập thể',
    description:
      'Tái cấu trúc tổ chức theo hướng nhân văn và bền vững, xây dựng văn hóa tổ chức lan tỏa giá trị lãnh đạo và tạo ảnh hưởng dài lâu.',
    objective: 'Tái cấu trúc tổ chức theo hướng nhân văn và bền vững',
    tags: ['chuyển hóa tổ chức', 'di sản tập thể'],
  },
  {
    id: 'course-multidimensional-prosperity-leadership',
    program: 'legacy',
    slug: 'thinh-vuong-da-chieu-va-mo-hinh-lanh-dao-vien-man',
    title: 'Thịnh vượng đa chiều & mô hình lãnh đạo viên mãn',
    description:
      'Tổng kết hành trình cá nhân và tổ chức với mô hình thịnh vượng đa chiều gồm tài chính, cảm xúc, tri thức, ảnh hưởng và di sản, biến lãnh đạo thành nghệ thuật sống toàn diện.',
    objective: 'Tổng hòa tài chính, cảm xúc, tri thức, ảnh hưởng và di sản',
    tags: ['thịnh vượng đa chiều', 'lãnh đạo viên mãn'],
  },
];

export const courseFixtures = seeds.map((seed) => {
  const program = programs[seed.program];

  return {
    id: seed.id,
    kind: 'course',
    collection: 'courses',
    slug: seed.slug,
    path: `/khoa-hoc/${seed.slug}`,
    locale: 'vi',
    translationKey: seed.id,
    title: seed.title,
    summary: `${program.summaryPrefix}. ${seed.description.split('. ')[0]}.`,
    body: [
      { type: 'paragraph', text: seed.description },
      { type: 'heading', level: 2, text: `Khóa học nằm trong chương trình ${program.label}` },
      ...program.intro.map((text): ContentBlock => ({ type: 'paragraph', text })),
      { type: 'heading', level: 2, text: 'Người học phù hợp' },
      { type: 'list', ordered: false, items: program.audience },
      { type: 'heading', level: 2, text: 'Mục tiêu của chương trình' },
      { type: 'list', ordered: false, items: program.objectives },
      { type: 'heading', level: 2, text: 'Giá trị người tham gia nhận được' },
      { type: 'list', ordered: false, items: program.values },
      enrolmentNote,
    ],
    tags: ['đào tạo', program.label, ...seed.tags],
    evidenceStatus: 'verified',
    sourceUrl: program.sourceUrl,
    sourceLabel: program.sourceLabel,
    checkedAt: CHECKED_AT,
    metadata: {
      format: 'Đang cập nhật',
      program: program.label,
      audience: program.audience[0],
      objectives: seed.objective,
    },
  };
}) satisfies ContentRecord[];
