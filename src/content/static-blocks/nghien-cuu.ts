import type { ContentBlock } from '../types';

/**
 * Nội dung trang Lĩnh vực nghiên cứu, lấy từ `2c Web research.docx` và đối chiếu
 * với trang công khai gisa.edu.vn/linh-vuc-nghien-cuu.
 */
export const nghienCuuBlocks: Record<string, ContentBlock[]> = {
  '/nghien-cuu/linh-vuc': [
    {
      type: 'paragraph',
      text: 'Nghiên cứu là trụ cột cốt lõi và mang tính chiến lược của GISA, giữ vai trò dẫn dắt trong việc tạo ra tri thức mới và chuyển hóa tri thức thành các giải pháp có giá trị thực tiễn. GISA đồng thời triển khai nghiên cứu khoa học hàn lâm và nghiên cứu ứng dụng liên ngành, nhằm giải quyết các vấn đề cấp thiết trong kinh tế, kinh doanh và xã hội, đồng thời đóng góp vào hoạch định chính sách và nâng cao năng lực cạnh tranh của quốc gia cũng như doanh nghiệp.',
    },
    {
      type: 'paragraph',
      text: 'Các chương trình, dự án và đề tài nghiên cứu của GISA tập trung vào sáu lĩnh vực trọng điểm dưới đây.',
    },

    { type: 'heading', level: 2, text: 'Phát triển bền vững' },
    {
      type: 'paragraph',
      text: 'GISA tập trung nghiên cứu và phát triển các giải pháp tiên tiến để giải quyết những thách thức môi trường, kinh tế và xã hội, giúp tổ chức đạt được sự cân bằng giữa tăng trưởng kinh tế, bảo vệ môi trường và trách nhiệm xã hội.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Hành vi tiêu dùng bền vững và bảo vệ môi trường',
        'Chuỗi giá trị bền vững và kinh tế tuần hoàn',
        'ESG, CSR, CSV trong chiến lược doanh nghiệp',
        'Sản xuất sạch hơn, công việc tốt hơn',
        'Quản lý tổ chức và lãnh đạo vì phát triển bền vững',
      ],
    },

    { type: 'heading', level: 2, text: 'Quản lý và kinh doanh' },
    {
      type: 'paragraph',
      text: 'GISA nghiên cứu toàn diện các lĩnh vực quản trị, quản lý và kinh doanh hiện đại, nhằm hỗ trợ doanh nghiệp nâng cao năng lực quản trị, hiệu quả vận hành và khả năng thích ứng trong môi trường thay đổi nhanh.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Chiến lược doanh nghiệp, lãnh đạo chuyển đổi, ra quyết định dựa trên dữ liệu số',
        'Quản trị tổ chức linh hoạt và đổi mới mô hình kinh doanh',
        'Tiếp thị kỹ thuật số, hành vi người tiêu dùng và trải nghiệm khách hàng',
        'Quản lý nhân sự, phát triển tài năng và năng lực đội ngũ',
        'Quản trị chuỗi cung ứng, logistics và công nghệ thông minh (AI, IoT, blockchain)',
        'Quản trị tài chính, đổi mới sáng tạo, khởi nghiệp và quốc tế hóa doanh nghiệp',
      ],
    },

    { type: 'heading', level: 2, text: 'Tâm lý học hành vi' },
    {
      type: 'paragraph',
      text: 'GISA nghiên cứu các yếu tố tâm lý và hành vi ảnh hưởng đến ra quyết định, hiệu quả tổ chức, hành vi tiêu dùng và động lực phát triển cá nhân, từ đó hỗ trợ xây dựng chiến lược quản lý con người hiệu quả và chính sách phát triển xã hội bền vững.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Tâm lý tổ chức và hành vi lãnh đạo',
        'Động lực, niềm tin và cảm xúc trong môi trường làm việc',
        'Hành vi tiêu dùng bền vững và ra quyết định dưới rủi ro',
        'Tâm lý học tích cực và sức khỏe tinh thần',
        'Thiết kế hành vi (behavioral design) trong chính sách và truyền thông xã hội',
      ],
    },

    { type: 'heading', level: 2, text: 'Kinh tế thực phẩm, nông nghiệp và nông thôn' },
    {
      type: 'paragraph',
      text: 'GISA phát triển các nghiên cứu nhằm nâng cao giá trị chuỗi nông sản, tối ưu hóa hệ thống nông nghiệp – thực phẩm, cải thiện đời sống nông thôn và đảm bảo an ninh lương thực trong bối cảnh biến đổi khí hậu và chuyển đổi hệ thống thực phẩm.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Chuỗi giá trị, chuỗi cung ứng và logistics nông sản',
        'Hành vi tiêu dùng thực phẩm và phát triển thị trường',
        'Nông nghiệp tuần hoàn, hữu cơ và bền vững',
        'Chính sách nông nghiệp, phát triển nông thôn và giảm nghèo',
        'Ứng dụng công nghệ và chuyển đổi số trong sản xuất – chế biến – phân phối thực phẩm',
      ],
    },

    { type: 'heading', level: 2, text: 'Kinh tế môi trường và tài nguyên thiên nhiên' },
    {
      type: 'paragraph',
      text: 'GISA nghiên cứu các công cụ kinh tế và mô hình chính sách nhằm tối ưu hóa sử dụng tài nguyên, giảm thiểu tác động môi trường và thúc đẩy quá trình chuyển đổi xanh trong kinh tế – xã hội.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Định giá tài nguyên và hệ sinh thái',
        'Chính sách môi trường: thuế, phí, tín chỉ carbon, thị trường phát thải',
        'Phân tích chi phí – lợi ích môi trường và đầu tư xanh',
        'Kinh tế tuần hoàn và mô hình phục hồi sinh thái',
        'Biến đổi khí hậu: thích ứng, giảm nhẹ và chiến lược phát triển bền vững',
      ],
    },

    { type: 'heading', level: 2, text: 'Kinh tế quốc tế và năng lực cạnh tranh toàn cầu' },
    {
      type: 'paragraph',
      text: 'GISA nghiên cứu các chiến lược phát triển trong bối cảnh hội nhập kinh tế toàn cầu, nhằm nâng cao năng lực cạnh tranh quốc gia, ngành và doanh nghiệp. Lĩnh vực này hỗ trợ hoạch định chính sách, định vị thương hiệu quốc gia và phát triển năng lực xuất khẩu.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Năng lực cạnh tranh và chỉ số xếp hạng quốc tế (GCI, GII)',
        'Tác động của hiệp định thương mại (FTA, CPTPP, EVFTA)',
        'Chuỗi giá trị toàn cầu và chuyển giao công nghệ',
        'FDI, thương mại xuyên biên giới và logistics quốc tế',
        'Chuyển đổi số và chiến lược quốc tế hóa của doanh nghiệp',
      ],
    },
  ],
};
