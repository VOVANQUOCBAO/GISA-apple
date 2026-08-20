import type { ContentBlock } from '../types';

/**
 * Nội dung nhánh Đào tạo, lấy từ `2e Web training.docx` và đối chiếu với các
 * trang chương trình công khai trên gisa.edu.vn.
 *
 * Học phí và lịch khai giảng không xuất hiện ở đây vì cả tài liệu gốc lẫn trang
 * công khai đều không công bố hai thông tin này.
 */

const enrolmentNote: ContentBlock = {
  type: 'paragraph',
  text: 'GISA sẽ thông báo thông tin tuyển sinh, lịch khai giảng và hướng dẫn đăng ký theo từng đợt. Người học nên kiểm tra cập nhật trước khi lựa chọn chương trình.',
};

export const daoTaoBlocks: Record<string, ContentBlock[]> = {
  '/dao-tao/linh-vuc': [
    {
      type: 'paragraph',
      text: 'GISA tổ chức hoạt động đào tạo như một hành trình phát triển năng lực liên tục. Nội dung kết nối nền tảng nghiên cứu, kinh nghiệm tư vấn và thực hành lãnh đạo để người học chuyển hiểu biết thành quyết định và hành động phù hợp với vai trò của mình.',
    },
    { type: 'heading', level: 2, text: 'Các lĩnh vực đào tạo' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Phát triển bền vững và ESG',
        'Quản trị chiến lược và đổi mới sáng tạo',
        'Kinh tế nông nghiệp, thực phẩm và nông thôn',
        'Kinh tế tài nguyên – môi trường',
        'Tâm lý học hành vi và chính sách công',
        'Kinh tế quốc tế và năng lực cạnh tranh',
      ],
    },
    {
      type: 'quote',
      text: 'Học để tư duy sâu, hành động thực và kiến tạo giá trị bền vững.',
      attribution: 'Triết lý đào tạo của GISA',
    },
    {
      type: 'paragraph',
      text: 'GISA thiết kế hệ thống đào tạo theo từng giai đoạn phát triển nghề nghiệp, từ sinh viên mới ra trường, nhà quản lý, đến lãnh đạo và chủ doanh nghiệp. Mỗi chương trình là một hành trình khai phá bản thân, phát triển năng lực và tạo dấu ấn khác biệt trong sự nghiệp và xã hội.',
    },
    { type: 'heading', level: 2, text: 'Năm lộ trình phát triển nghề nghiệp' },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA Core — Đào tạo chuyên môn. Chương trình trang bị kiến thức chuyên sâu, tư duy hệ thống và kỹ năng nghiệp vụ cho chuyên viên, chuyên gia, nhà nghiên cứu, giảng viên và cán bộ kỹ thuật.',
        'GISA Edge — Trải nghiệm thực chiến. Chương trình phát triển kỹ năng nghề nghiệp nền tảng, tư duy thực tiễn và thái độ chuyên nghiệp cho sinh viên chuẩn bị tốt nghiệp và người mới bắt đầu sự nghiệp.',
        'GISA Rise — Bứt phá sự nghiệp. Chương trình nâng tầm tư duy, kỹ năng quản trị và năng lực lãnh đạo đội nhóm cho những cá nhân đang chuẩn bị lên vị trí quản lý.',
        'GISA Ascend — Lãnh đạo thành công. Chương trình phát triển năng lực lãnh đạo chiến lược, xây dựng ảnh hưởng bền vững cho lãnh đạo cấp trung đến cấp cao.',
        'GISA Legacy — Sự nghiệp viên mãn. Chương trình dành cho lãnh đạo cấp cao, doanh nhân và chuyên gia kỳ cựu, hướng tới cân bằng giữa thành công cá nhân, đóng góp xã hội và phát triển thế hệ kế thừa.',
      ],
    },
    {
      type: 'linkGroup',
      links: [
        { label: 'GISA Core — Đào tạo chuyên môn', href: '/dao-tao/gisa-core' },
        { label: 'GISA Edge — Trải nghiệm thực chiến', href: '/dao-tao/gisa-edge' },
        { label: 'GISA Rise — Bứt phá sự nghiệp', href: '/dao-tao/gisa-rise' },
        { label: 'GISA Ascend — Lãnh đạo thành công', href: '/dao-tao/gisa-ascend' },
        { label: 'GISA Legacy — Sự nghiệp viên mãn', href: '/dao-tao/gisa-legacy' },
      ],
    },
  ],

  '/dao-tao/gisa-core': [
    {
      type: 'quote',
      text: 'Xây nền tảng vững chắc, phát triển năng lực chuyên sâu và chuẩn hóa nghề nghiệp.',
    },
    { type: 'heading', level: 2, text: 'Nội dung chính' },
    {
      type: 'paragraph',
      text: 'GISA Core là chuỗi chương trình đào tạo chuyên sâu về kiến thức, kỹ năng và công cụ thiết yếu trong các lĩnh vực trọng điểm mà GISA nghiên cứu và tư vấn. Chương trình được thiết kế theo hướng chuẩn hóa và thực tiễn, bám sát nhu cầu của tổ chức, doanh nghiệp và xu thế phát triển bền vững.',
    },
    {
      type: 'paragraph',
      text: 'Mỗi khóa học tập trung vào nghiệp vụ chuyên môn then chốt, kỹ năng cứng quan trọng hoặc công cụ điều hành – quản lý có tính ứng dụng cao. Phương pháp đào tạo kết hợp tương tác, nghiên cứu tình huống và mô phỏng sát thực tế với sự tham gia của đội ngũ chuyên gia và giảng viên giàu kinh nghiệm.',
    },
    { type: 'heading', level: 2, text: 'Chương trình dành cho ai?' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Chuyên viên, cán bộ nghiệp vụ, nhà quản lý cấp trung, chuyên gia độc lập muốn phát triển chuyên môn sâu theo hướng chuẩn hóa.',
        'Cá nhân đang làm việc trong doanh nghiệp, tổ chức xã hội, viện nghiên cứu, trường đại học, tổ chức phát triển.',
        'Người đang chuyển đổi nghề nghiệp hoặc được quy hoạch lên vai trò cao hơn.',
      ],
    },
    { type: 'heading', level: 2, text: 'Mục tiêu chương trình' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Trang bị kiến thức nền tảng và công cụ chuyên môn tiên tiến theo từng lĩnh vực GISA nghiên cứu và tư vấn.',
        'Nâng cao hiệu quả công việc, khả năng ra quyết định và giải quyết vấn đề dựa trên tư duy khoa học và thực tiễn.',
        'Chuẩn hóa nghiệp vụ, tăng năng lực thích ứng với tiêu chuẩn nghề nghiệp quốc tế và yêu cầu phát triển bền vững.',
        'Tạo nền tảng để phát triển sự nghiệp lên các cấp độ cao hơn trong hành trình đào tạo của GISA.',
      ],
    },
    { type: 'heading', level: 2, text: 'Giá trị mang lại' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Kiến thức chuyên sâu, cập nhật và thực tiễn cao',
        'Bộ công cụ và mô hình ứng dụng ngay vào công việc',
        'Kỹ năng xử lý tình huống, lập kế hoạch và báo cáo chuyên môn',
        'Chuẩn hóa nghiệp vụ theo tiêu chuẩn quốc tế',
        'Mở rộng góc nhìn và khả năng phân tích đa chiều',
        'Chứng nhận đào tạo chuyên môn của GISA',
      ],
    },
    { type: 'heading', level: 2, text: 'Các khóa học tiêu biểu' },
    { type: 'heading', level: 3, text: 'Tài chính và thương mại' },
    {
      type: 'paragraph',
      text: 'Nhóm khóa học này tập trung vào quản trị tài chính, tiếp cận thị trường và phát triển hoạt động kinh doanh trên môi trường số.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Kế toán thực hành và tối ưu hóa thuế — kỹ năng kế toán doanh nghiệp thực tiễn, xử lý chứng từ, lập báo cáo tài chính, quyết toán thuế và tối ưu thuế đúng luật.',
        'Quản trị tài chính doanh nghiệp vừa và nhỏ — công cụ phân tích và quản trị dòng tiền, chi phí, đòn bẩy tài chính và tăng trưởng bền vững.',
        'Digital & AI Marketing — tối ưu hóa chiến lược số, kết hợp marketing kỹ thuật số với công cụ AI để phân tích hành vi khách hàng và tự động hóa chiến dịch đa kênh.',
        'Multi-channel & Effective Sales — kỹ năng bán hàng đa nền tảng, quản lý pipeline, kỹ thuật chốt sale và chăm sóc khách hàng bền vững.',
      ],
    },
    { type: 'heading', level: 3, text: 'Vận hành và phát triển tổ chức' },
    {
      type: 'paragraph',
      text: 'Nhóm nội dung tiếp theo đi vào chuỗi cung ứng, quản trị nhân sự và cách tổ chức thấu hiểu khách hàng.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Quản lý chuỗi cung ứng và logistics trong thời đại số — tư duy hệ thống về chuỗi cung ứng, quản trị hàng tồn kho, phân phối và ứng dụng dữ liệu lớn.',
        'Quản lý nhân sự chiến lược cho tổ chức nhỏ và vừa — xây dựng hệ thống nhân sự từ tuyển dụng, đánh giá hiệu suất đến phát triển nhân tài và văn hóa doanh nghiệp.',
        'Phân tích hành vi khách hàng và ứng dụng trong kinh doanh — tâm lý học hành vi, dữ liệu thị trường và nghiên cứu thực địa để hiểu quyết định mua hàng.',
      ],
    },
    { type: 'heading', level: 3, text: 'Phát triển bền vững và quản lý dự án' },
    {
      type: 'paragraph',
      text: 'Các khóa học trong nhóm này kết nối yêu cầu phát triển bền vững với năng lực thiết kế và triển khai dự án trong thực tiễn.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'ESG và phát triển bền vững trong doanh nghiệp — tích hợp ESG vào chiến lược, đánh giá rủi ro phi tài chính và xây dựng báo cáo ESG cơ bản.',
        'Kinh tế tuần hoàn và mô hình kinh doanh bền vững — mô hình tái chế – tái tạo, thiết kế vòng đời sản phẩm khép kín và hiệu quả tài nguyên.',
        'Quản lý dự án phát triển và tác động xã hội — kỹ thuật thiết kế, giám sát và đánh giá dự án, xây dựng logic framework, lập ngân sách và theo dõi kết quả.',
        'Phát triển chuỗi giá trị nông nghiệp – nông thôn — tổ chức sản xuất, liên kết thị trường và phát triển sản phẩm OCOP.',
      ],
    },
    { type: 'heading', level: 3, text: 'Tư duy, chính sách và quản trị rủi ro' },
    {
      type: 'paragraph',
      text: 'Nhóm cuối hỗ trợ người học phân tích vấn đề phức hợp, hoạch định chính sách và quản trị quyết định trong môi trường nhiều biến động.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Tư duy hệ thống và giải quyết vấn đề phức hợp — bản đồ nguyên nhân – hệ quả và cách xử lý các vấn đề liên ngành, mâu thuẫn lợi ích.',
        'Phân tích chính sách công và hoạch định chiến lược địa phương — công cụ phân tích chính sách dựa trên bằng chứng trong môi trường biến động, nguồn lực hạn chế.',
        'Nghiên cứu thị trường và định vị chiến lược sản phẩm — khảo sát định lượng – định tính, phân tích dữ liệu thị trường và xây dựng chiến lược sản phẩm.',
        'Quản trị rủi ro và tuân thủ trong tổ chức hiện đại — hệ thống kiểm soát nội bộ, đánh giá rủi ro vận hành, pháp lý và tài chính.',
      ],
    },
    enrolmentNote,
  ],

  '/dao-tao/gisa-edge': [
    { type: 'heading', level: 2, text: 'Nội dung chính' },
    {
      type: 'paragraph',
      text: 'GISA Edge là chương trình đào tạo ứng dụng cao dành cho người đang ở giai đoạn khởi đầu sự nghiệp. Chương trình kết hợp học tập thực tiễn, huấn luyện cá nhân và trải nghiệm dự án để người học hiểu môi trường làm việc, đồng thời phát triển kỹ năng, tư duy và thái độ nghề nghiệp.',
    },
    {
      type: 'paragraph',
      text: 'Nội dung được tổ chức theo mô hình kết hợp linh hoạt, gồm khóa học tương tác, hoạt động nhóm, thực hành tình huống và kết nối với người hướng dẫn, qua đó giúp người học liên tục nhận phản hồi, điều chỉnh phương pháp làm việc và từng bước xây dựng năng lực nghề nghiệp phù hợp với mục tiêu cá nhân.',
    },
    { type: 'heading', level: 2, text: 'Chương trình dành cho ai?' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Sinh viên năm cuối, học viên đang thực tập, người mới tốt nghiệp hoặc mới đi làm dưới hai năm.',
        'Người còn thiếu định hướng nghề nghiệp rõ ràng, cần trải nghiệm thực tế để hiểu bản thân và thị trường.',
        'Người có tinh thần cầu tiến, muốn học cách làm việc thực sự trong môi trường chuyên nghiệp.',
        'Người muốn tạo dựng thương hiệu cá nhân và kỹ năng nổi bật để tăng cơ hội tuyển dụng.',
      ],
    },
    { type: 'heading', level: 2, text: 'Mục tiêu chương trình' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Trang bị kỹ năng nền tảng và tư duy làm việc chuyên nghiệp để hội nhập hiệu quả vào doanh nghiệp.',
        'Rút ngắn khoảng cách giữa học thuật và thực tiễn thông qua dự án thực hành, tình huống mô phỏng và huấn luyện cá nhân.',
        'Hỗ trợ xác định định hướng nghề nghiệp phù hợp, nhận diện điểm mạnh và điểm yếu để phát triển cá nhân.',
        'Xây dựng hồ sơ nghề nghiệp và kết nối với hệ sinh thái chuyên gia, doanh nghiệp.',
      ],
    },
    { type: 'heading', level: 2, text: 'Giá trị mang lại' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Trải nghiệm mô phỏng môi trường doanh nghiệp chuyên nghiệp',
        'Kỹ năng làm việc, giao tiếp, xử lý tình huống và teamwork',
        'Tư duy phản biện, giải quyết vấn đề và thích ứng với thay đổi',
        'Hồ sơ nghề nghiệp nổi bật (CV, LinkedIn, phỏng vấn)',
        'Kết nối với mentor, chuyên gia và cộng đồng nghề nghiệp thực tế',
        'Huấn luyện cá nhân hóa qua phản hồi trực tiếp',
      ],
    },
    { type: 'heading', level: 2, text: 'Các khóa học tiêu biểu' },
    { type: 'heading', level: 3, text: 'Nền tảng nghề nghiệp' },
    {
      type: 'paragraph',
      text: 'Nhóm khóa học này giúp người học hiểu bản thân, rèn tư duy giải quyết vấn đề và làm quen với cách tổ chức vận hành.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Khám phá bản thân và định hướng nghề nghiệp cá nhân — hiểu sâu giá trị, năng lực, sở thích và động lực cá nhân để chọn đúng hướng đi.',
        'Tư duy phản biện và giải quyết vấn đề thực tế — phân tích, đánh giá và ra quyết định trong tình huống mô phỏng thực tế doanh nghiệp.',
        'Làm việc nhóm và cộng tác hiệu quả — hiểu vai trò trong nhóm, phối hợp, xử lý mâu thuẫn trong môi trường chuyên nghiệp.',
        'Hiểu doanh nghiệp từ bên trong — cấu trúc, vận hành và chiến lược. Khóa học cung cấp góc nhìn hệ thống về tổ chức và vai trò từng cá nhân.',
      ],
    },
    { type: 'heading', level: 3, text: 'Hội nhập và tạo dấu ấn' },
    {
      type: 'paragraph',
      text: 'Nhóm tiếp theo tập trung vào giao tiếp công sở, giai đoạn đầu đi làm, trải nghiệm dự án và hình ảnh nghề nghiệp.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Tác phong và giao tiếp chuyên nghiệp trong công việc — giao tiếp qua email, thuyết trình, báo cáo và ứng xử công sở.',
        '90 ngày đầu đi làm — hội nhập nhanh, tạo dấu ấn. Người học xây dựng uy tín, thiết lập mối quan hệ và thích nghi trong giai đoạn then chốt.',
        'Thực hành dự án thực tế — làm việc với mentor và doanh nghiệp. Người học cùng giải quyết vấn đề doanh nghiệp dưới hướng dẫn sát sao.',
        'Xây dựng thương hiệu cá nhân và hồ sơ nghề nghiệp — tạo dựng hình ảnh chuyên nghiệp và chuẩn bị kỹ năng phỏng vấn.',
      ],
    },
    enrolmentNote,
  ],

  '/dao-tao/gisa-rise': [
    { type: 'heading', level: 2, text: 'Nội dung chính' },
    {
      type: 'paragraph',
      text: 'GISA Rise là chương trình đào tạo chuyên sâu về tư duy lãnh đạo, năng lực quản trị và khả năng thích ứng chiến lược cho những cá nhân đang bước vào giai đoạn phát triển mới trong sự nghiệp. Chương trình giúp học viên nhận diện giới hạn hiện tại, xác lập tầm nhìn mới và xây dựng năng lực cốt lõi để chuyển từ chuyên môn vững sang khả năng dẫn dắt và tạo ảnh hưởng.',
    },
    {
      type: 'paragraph',
      text: 'Mô hình học tập kết hợp huấn luyện thực tiễn, mentoring cá nhân và kết nối chuyên gia. Hình thức tổ chức linh hoạt, phù hợp với người đang đi làm, giúp học viên áp dụng ngay kiến thức vào công việc, giải quyết thách thức quản trị và từng bước hình thành phong cách lãnh đạo hiệu quả.',
    },
    { type: 'heading', level: 2, text: 'Chương trình dành cho ai?' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Trưởng nhóm, giám sát, trưởng phòng, chuyên viên kỳ cựu hoặc quản lý cấp trung đang chuẩn bị thăng tiến.',
        'Người có nhiều kinh nghiệm thực tế nhưng thiếu nền tảng quản lý, lãnh đạo hoặc tư duy chiến lược bài bản.',
        'Người đang ở ngưỡng bão hòa sự nghiệp, cần tái tạo năng lượng, tư duy và năng lực.',
        'Cá nhân muốn trở thành người dẫn dắt, có ảnh hưởng và tạo giá trị thực sự cho tổ chức và đội ngũ.',
      ],
    },
    { type: 'heading', level: 2, text: 'Mục tiêu chương trình' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Vượt qua điểm nghẽn nghề nghiệp để bước vào cấp độ mới, từ thực hiện đến định hướng và từ chuyên môn đến lãnh đạo.',
        'Xây dựng tư duy chiến lược, tư duy hệ thống và khả năng ra quyết định trong môi trường bất định.',
        'Phát triển kỹ năng quản lý đội nhóm, điều hành hiệu suất và tạo động lực dài hạn.',
        'Kích hoạt lại tinh thần lãnh đạo, sự tự tin và khả năng truyền cảm hứng.',
      ],
    },
    { type: 'heading', level: 2, text: 'Giá trị mang lại' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Phá vỡ điểm nghẽn phát triển và xác lập lộ trình nghề nghiệp mới',
        'Tư duy chiến lược và năng lực hoạch định linh hoạt, thực tiễn',
        'Kỹ năng quản lý đội nhóm, hiệu suất và truyền động lực',
        'Năng lực giao tiếp, thương thuyết và xử lý xung đột',
        'Bản sắc lãnh đạo và phong cách quản trị cá nhân',
        'Kết nối mentor và cộng đồng quản lý – lãnh đạo cùng chí hướng',
      ],
    },
    { type: 'heading', level: 2, text: 'Các khóa học tiêu biểu' },
    { type: 'heading', level: 3, text: 'Quản trị đội ngũ và chiến lược' },
    {
      type: 'paragraph',
      text: 'Nhóm khóa học này hỗ trợ người học tái định vị sự nghiệp, quản lý đội ngũ và ra quyết định trong môi trường biến động.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Tái định vị sự nghiệp — nhìn lại, bứt phá và tái tạo. Người học phân tích hành trình nghề nghiệp hiện tại và xây dựng kế hoạch phát triển có chủ đích.',
        'Quản lý đội ngũ hiệu quả — từ cá nhân mạnh đến tập thể vững. Nội dung gồm quản trị con người, xây dựng tinh thần đội nhóm và phân công hợp lý.',
        'Tư duy chiến lược và ra quyết định trong môi trường bất định — tư duy hệ thống, phân tích đa chiều, quyết định linh hoạt dưới áp lực.',
        'Kỹ năng giao tiếp – thương lượng – xử lý xung đột cho quản lý — quản lý mối quan hệ đa tầng trong doanh nghiệp.',
      ],
    },
    { type: 'heading', level: 3, text: 'Ảnh hưởng và hiệu suất cá nhân' },
    {
      type: 'paragraph',
      text: 'Nhóm tiếp theo đi vào năng lực dẫn dắt thay đổi, quản trị nguồn lực cá nhân, trí tuệ cảm xúc và đo lường hiệu suất.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Tạo ảnh hưởng – dẫn dắt thay đổi – xây dựng thương hiệu lãnh đạo — truyền cảm hứng và dẫn dắt sự thay đổi.',
        'Kỹ năng quản lý thời gian – công việc – năng lượng — quản trị ba nguồn lực quan trọng nhất để đảm bảo hiệu suất và sức bền.',
        'Khai phá sức mạnh nội tại và trí tuệ cảm xúc trong quản trị — năng lực cảm xúc, tự nhận thức và thấu cảm.',
        'Quản trị mục tiêu – hiệu suất – kết quả với OKR/KPI — xây dựng, triển khai và đo lường mục tiêu đội nhóm.',
      ],
    },
    enrolmentNote,
  ],

  '/dao-tao/gisa-ascend': [
    { type: 'heading', level: 2, text: 'Nội dung chính' },
    {
      type: 'paragraph',
      text: 'GISA Ascend là chương trình đào tạo chiến lược dành cho các nhà lãnh đạo đang điều hành tổ chức, doanh nghiệp hoặc dự án có tác động xã hội. Trọng tâm của chương trình là tư duy hệ thống, năng lực lãnh đạo chuyển đổi, ra quyết định cấp cao và xây dựng ảnh hưởng bền vững.',
    },
    {
      type: 'paragraph',
      text: 'Học viên tiếp cận các mô hình quản trị hiện đại và bài học quốc tế thông qua đối thoại chiến lược, thảo luận tình huống thực tế và mentoring cấp cao. Chương trình có thể được tổ chức theo hình thức kết hợp trực tuyến – trực tiếp hoặc chương trình chuyên sâu ngắn ngày.',
    },
    { type: 'heading', level: 2, text: 'Chương trình dành cho ai?' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Lãnh đạo cấp trung đến cấp cao trong doanh nghiệp, tổ chức phi lợi nhuận, cơ quan công quyền hoặc các chương trình phát triển.',
        'Người đang gánh vác vai trò điều hành chiến lược, xây dựng tổ chức và dẫn dắt đội ngũ quy mô lớn.',
        'Lãnh đạo muốn cập nhật xu hướng mới và nâng cấp khả năng dẫn dắt.',
        'Người đã vững vàng về chuyên môn và kinh nghiệm, cần bước lên tầm ảnh hưởng sâu rộng hơn.',
      ],
    },
    { type: 'heading', level: 2, text: 'Mục tiêu chương trình' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Phát triển năng lực tư duy chiến lược, hoạch định tầm nhìn và kiến tạo văn hóa tổ chức bền vững.',
        'Nâng cao khả năng lãnh đạo trong môi trường biến động và quản trị sự thay đổi phức tạp.',
        'Mở rộng ảnh hưởng và khả năng dẫn dắt các hệ thống đa bên.',
        'Xây dựng bản sắc lãnh đạo có chiều sâu, để lại di sản cá nhân và tổ chức mang tính chuyển hóa.',
      ],
    },
    { type: 'heading', level: 2, text: 'Giá trị mang lại' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Tư duy lãnh đạo chiến lược và dẫn dắt toàn hệ thống',
        'Công cụ và mô hình lãnh đạo toàn cầu, ứng dụng thực tiễn',
        'Kỹ năng quản trị sự thay đổi, điều phối xung đột và ra quyết định cấp cao',
        'Tái tạo năng lượng lãnh đạo và khả năng ảnh hưởng',
        'Mạng lưới kết nối với lãnh đạo đa lĩnh vực',
        'Mentoring cá nhân với các nhà lãnh đạo cấp cao nhiều kinh nghiệm',
      ],
    },
    { type: 'heading', level: 2, text: 'Các khóa học tiêu biểu' },
    { type: 'heading', level: 3, text: 'Chiến lược và chuyển đổi tổ chức' },
    {
      type: 'paragraph',
      text: 'Nhóm khóa học này tập trung vào tư duy hệ thống, quản trị thay đổi, quyết định cấp cao và xây dựng đội ngũ kế thừa.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Tư duy hệ thống và hoạch định chiến lược lãnh đạo — vận hành hệ thống tổ chức trong bối cảnh phức tạp, xác lập chiến lược dài hạn.',
        'Lãnh đạo chuyển đổi và quản trị sự thay đổi phức tạp — chuyển đổi tổ chức trong thời kỳ bất ổn về nhân sự, mô hình kinh doanh và hành vi tổ chức.',
        'Nghệ thuật ra quyết định cấp cao và điều hành trong bất định — đánh giá rủi ro, phân tích kịch bản và ra quyết định có chiến lược.',
        'Xây dựng văn hóa tổ chức và kiến tạo đội ngũ kế thừa — văn hóa học tập, đổi mới và phát triển kế thừa.',
      ],
    },
    { type: 'heading', level: 3, text: 'Ảnh hưởng và nội lực lãnh đạo' },
    {
      type: 'paragraph',
      text: 'Nhóm tiếp theo mở rộng năng lực lãnh đạo qua thương hiệu cá nhân, đối thoại chiến lược, trí tuệ cảm xúc và trách nhiệm trong thời đại số.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Thương hiệu lãnh đạo và ảnh hưởng hệ thống — lan tỏa giá trị cá nhân và tổ chức đến cộng đồng, đối tác và hệ sinh thái.',
        'Đối thoại chiến lược và kết nối đa chiều — lắng nghe, đàm phán và đối thoại cấp cao để điều phối các bên liên quan.',
        'Lãnh đạo bằng trí tuệ cảm xúc và sức mạnh nội tâm — duy trì sự điềm tĩnh, minh triết và nhân văn trong mọi quyết định.',
        'Lãnh đạo có tầm ảnh hưởng trong thời đại số với AI, ESG và toàn cầu hóa — vai trò của người lãnh đạo trong định hướng phát triển bền vững, có trách nhiệm.',
      ],
    },
    enrolmentNote,
  ],

  '/dao-tao/gisa-legacy': [
    {
      type: 'quote',
      text: 'Xây sự nghiệp viên mãn sống một cuộc đời trọn vẹn.',
    },
    { type: 'heading', level: 2, text: 'Nội dung chính' },
    {
      type: 'paragraph',
      text: 'GISA Legacy dành cho những nhà lãnh đạo đã có nền tảng sự nghiệp vững vàng và muốn kiến tạo một di sản có giá trị. Chương trình kết nối tri thức, triết lý phát triển bền vững và hành trình tìm kiếm sự cân bằng giữa thành tựu cá nhân với đóng góp cho cộng đồng.',
    },
    {
      type: 'paragraph',
      text: 'Thông qua các chuyên đề chuyên sâu, đối thoại lãnh đạo và trải nghiệm tương tác, người học có không gian nhìn lại mục tiêu sống và phát triển tư duy lãnh đạo dài hạn, đồng thời làm rõ giá trị cốt lõi, trách nhiệm xã hội và hướng đi để kiến tạo ảnh hưởng tích cực cho tổ chức, cộng đồng và thế hệ kế tiếp.',
    },
    { type: 'heading', level: 2, text: 'Chương trình dành cho ai?' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Lãnh đạo cấp cao, giám đốc điều hành, chủ doanh nghiệp, nhà sáng lập, nhà hoạch định chính sách đã đạt vị thế nghề nghiệp cao và đang tìm kiếm chiều sâu mới.',
        'Người muốn kiến tạo ảnh hưởng vượt khỏi tổ chức, mở rộng đóng góp cho cộng đồng và thế hệ kế tiếp.',
        'Cá nhân đã “về đích” trong sự nghiệp, nay muốn chuyển hóa để để lại di sản sống.',
      ],
    },
    { type: 'heading', level: 2, text: 'Mục tiêu chương trình' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Khám phá lại bản thân, sứ mệnh sống và triết lý lãnh đạo cá nhân ở giai đoạn viên mãn.',
        'Xây dựng kế hoạch kế thừa, phát triển tổ chức bền vững và gắn kết các thế hệ tiếp nối.',
        'Kết nối với cộng đồng lãnh đạo cùng chí hướng để lan tỏa giá trị vượt thời gian.',
        'Tạo ra sự thịnh vượng toàn diện trên bốn phương diện gồm trí tuệ, tâm hồn, cộng đồng và di sản.',
      ],
    },
    { type: 'heading', level: 2, text: 'Giá trị mang lại' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Tư duy lãnh đạo chuyển hóa, từ điều hành sang truyền cảm hứng và dẫn dắt thế hệ kế thừa',
        'Nền tảng phát triển bền vững cá nhân và tổ chức ở cấp độ chiến lược',
        'Cơ hội xây dựng cộng đồng tinh hoa để chia sẻ, đồng hành và tạo ảnh hưởng sâu rộng',
        'Khả năng thiết kế di sản cá nhân từ giá trị sống, kinh nghiệm và trí tuệ',
        'Kỹ năng truyền lửa và phát triển thế hệ kế cận trong tổ chức và gia đình',
      ],
    },
    { type: 'heading', level: 2, text: 'Các khóa học tiêu biểu' },
    { type: 'heading', level: 3, text: 'Lãnh đạo và kế thừa' },
    {
      type: 'paragraph',
      text: 'Nhóm khóa học này đặt trọng tâm vào chuyển hóa vai trò lãnh đạo, xây dựng đội ngũ kế thừa và dẫn dắt trong bối cảnh bất định.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Lãnh đạo chuyển hóa, từ điều hành đến dẫn dắt bằng tư duy di sản.',
        'Chiến lược kế thừa và phát triển thế hệ lãnh đạo tiếp nối.',
        'Lãnh đạo bền vững trong thời đại bất định.',
      ],
    },
    { type: 'heading', level: 3, text: 'Di sản cá nhân và nội lực' },
    {
      type: 'paragraph',
      text: 'Nhóm nội dung này giúp người học nhìn lại hệ giá trị, năng lực truyền cảm hứng và chất lượng đời sống của chính mình.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Thiết kế di sản cá nhân dựa trên tầm nhìn, giá trị và dấu ấn để lại.',
        'Trí tuệ cảm xúc cấp cao và nghệ thuật truyền cảm hứng.',
        'Tư duy khai phóng và nghệ thuật sống trọn vẹn.',
      ],
    },
    { type: 'heading', level: 3, text: 'Ảnh hưởng cộng đồng và tổ chức' },
    {
      type: 'paragraph',
      text: 'Nhóm cuối mở rộng góc nhìn từ hành trình cá nhân sang ảnh hưởng xã hội, chuyển hóa tổ chức và thịnh vượng đa chiều.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Lãnh đạo cộng đồng và tạo ảnh hưởng xã hội.',
        'Triết lý sống và năng lực sống hạnh phúc của nhà lãnh đạo.',
        'Chuyển hóa tổ chức, từ hiệu suất đến di sản tập thể.',
        'Thịnh vượng đa chiều và mô hình lãnh đạo viên mãn trên các phương diện tài chính, cảm xúc, tri thức, ảnh hưởng và di sản.',
      ],
    },
    enrolmentNote,
  ],
};
