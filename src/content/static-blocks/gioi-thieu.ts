import type { ContentBlock } from '../types';

/**
 * Nội dung các trang tĩnh nhánh Giới thiệu, lấy nguyên văn từ tài liệu nội dung
 * do GISA cung cấp (`0 Nội dung Web_GISA/2b Web introduction.docx`) và đối chiếu
 * với trang công khai gisa.edu.vn. Các ghi chú biên tập trong tài liệu gốc
 * (tên người phụ trách, việc còn phải làm) không được đưa lên trang.
 */
const consolidatedStoryBlocks: ContentBlock[] = [
    {
      type: 'quote',
      text: 'Từ tri thức – Đến hành động – Vì tương lai bền vững',
    },
    { type: 'heading', level: 2, text: 'Bối cảnh và vấn đề đặt ra' },
    {
      type: 'paragraph',
      text: 'Thế giới hiện đại đang đối mặt với những thách thức ngày càng phức tạp và mang tính toàn cầu như biến đổi khí hậu, cạn kiệt tài nguyên, bất ổn kinh tế – xã hội, chuyển đổi số và trí tuệ nhân tạo, cùng với nhu cầu cấp thiết về phát triển bền vững và hệ thống quản trị hiện đại. Trong bối cảnh đó, khoảng cách giữa nghiên cứu học thuật và ứng dụng thực tiễn, giữa tư duy khoa học và hành động xã hội vẫn là một rào cản lớn trong hành trình phát triển của nhiều quốc gia và tổ chức.',
    },
    { type: 'heading', level: 2, text: 'Động lực hình thành' },
    {
      type: 'paragraph',
      text: 'Xuất phát từ kinh nghiệm thực tiễn đa lĩnh vực và liên ngành — từ nghiên cứu phát triển, tư vấn chiến lược, giáo dục đào tạo, đến kinh tế, kinh doanh, quản trị, tâm lý học, nông nghiệp thực phẩm, môi trường và phát triển bền vững — các nhà sáng lập nhận thấy nhu cầu cấp thiết về một tổ chức có khả năng kết nối tri thức khoa học liên ngành với thực tiễn doanh nghiệp và thị trường.',
    },
    {
      type: 'paragraph',
      text: 'Một tổ chức như vậy không chỉ góp phần giải quyết các vấn đề phức hợp của thời đại mà còn hướng tới giá trị lâu dài và sự thịnh vượng bền vững cho xã hội. GISA ra đời từ khát vọng đó, với sự đồng hành của các nhà khoa học, chuyên gia, doanh nhân, nhà lãnh đạo và tổ chức toàn cầu cùng chung lý tưởng cống hiến vì một thế giới tốt đẹp hơn.',
    },
    { type: 'heading', level: 2, text: 'Giới thiệu về GISA' },
    {
      type: 'paragraph',
      text: 'Viện Phát triển Bền vững và Quản lý Nâng cao Toàn cầu (GISA – Global Institute for Sustainable Development and Advanced Management) là một tổ chức khoa học và công nghệ hoạt động theo định hướng phi lợi nhuận, được xây dựng trên nền tảng kết hợp giữa tư duy học thuật – khoa học sâu sắc và hành động chiến lược – thực tiễn hiệu quả.',
    },
    {
      type: 'quote',
      text: 'Kinh nghiệm thực tiễn làm định hướng\nNghiên cứu khoa học làm nền tảng\nMạng lưới toàn cầu làm sức mạnh.',
      attribution: 'Triết lý cốt lõi của GISA',
    },
    {
      type: 'paragraph',
      text: 'Chúng tôi tích hợp các tiếp cận liên ngành, ứng dụng công nghệ, dữ liệu, đổi mới sáng tạo và năng lực thực thi đa chiều nhằm góp phần giải quyết các vấn đề phức hợp trong phát triển và quản trị hiện đại. GISA tiên phong trong các lĩnh vực nghiên cứu, tư vấn, đào tạo và chuyển giao tri thức, với trọng tâm là ứng dụng công nghệ hiện đại và mô hình quản trị tiên tiến để mang đến các giải pháp đột phá giúp doanh nghiệp, tổ chức và cộng đồng phát triển bền vững, hiệu quả và thích ứng trong kỷ nguyên số.',
    },
    { type: 'heading', level: 2, text: 'Tầm nhìn' },
    {
      type: 'quote',
      text: 'Tới năm 2030, GISA trở thành đơn vị tiên phong, uy tín cao và được biết đến rộng rãi về tri thức và thực hành trong lĩnh vực đổi mới sáng tạo, phát triển bền vững và quản lý nâng cao tại Việt Nam và khu vực thông qua các trụ cột hoạt động gồm nghiên cứu, tư vấn, đào tạo, chuyển giao ứng dụng, thúc đẩy mạng lưới hợp tác toàn cầu và đóng góp cộng đồng.',
    },
    { type: 'heading', level: 2, text: 'Sứ mệnh' },
    {
      type: 'paragraph',
      text: 'GISA thúc đẩy phát triển bền vững và thịnh vượng toàn cầu thông qua nghiên cứu liên ngành, đổi mới sáng tạo, chuyển giao tri thức, ứng dụng khoa học – công nghệ và kiến tạo các giá trị xã hội. Chúng tôi kết nối các nhà khoa học, chuyên gia, nhà lãnh đạo, doanh nghiệp và tổ chức trên toàn thế giới nhằm đưa ra các giải pháp thực tiễn, hiệu quả và có tác động sâu rộng, dựa trên nền tảng khoa học vững chắc — vì một thế giới văn minh, thịnh vượng và phát triển bền vững.',
    },
    { type: 'heading', level: 3, text: 'Sáu sứ mệnh cụ thể' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Nghiên cứu và phát triển tri thức liên ngành. GISA thực hiện các nghiên cứu khoa học chuyên sâu và nghiên cứu ứng dụng đa ngành nhằm tạo ra tri thức có giá trị thực tiễn, phục vụ chiến lược phát triển bền vững và quản trị hiện đại.',
        'Thúc đẩy đổi mới sáng tạo và tư duy đột phá. GISA khuyến khích, hỗ trợ và lan tỏa các sáng kiến đổi mới trong quản trị, công nghệ, giáo dục và mô hình kinh doanh.',
        'Chuyển giao tri thức và công nghệ ứng dụng. GISA biến các công trình nghiên cứu và tri thức học thuật thành giải pháp thực tiễn thông qua tư vấn, đào tạo và chuyển giao công nghệ.',
        'Kết nối và hợp tác toàn cầu. GISA xây dựng mạng lưới tri thức toàn cầu, kết nối các nhà khoa học, chuyên gia, lãnh đạo và doanh nhân để chia sẻ, cộng tác và tạo ra các giải pháp liên kết quốc tế vì lợi ích chung.',
        'Ứng dụng khoa học – công nghệ vào thực tiễn. GISA phát triển và triển khai các mô hình, công nghệ, công cụ và giải pháp hiện đại nhằm nâng cao hiệu quả hoạt động, năng lực cạnh tranh và khả năng thích ứng trong kỷ nguyên số.',
        'Kiến tạo giá trị và lan tỏa tác động xã hội. GISA thực hiện các sáng kiến, chương trình và dự án vì cộng đồng, hướng tới nâng cao phúc lợi xã hội, bảo vệ môi trường và thúc đẩy sự phát triển nhân văn, bền vững.',
      ],
    },
    { type: 'heading', level: 2, text: 'Khẩu hiệu' },
    {
      type: 'paragraph',
      text: '“Kiến tạo tri thức, lan tỏa giá trị” “Advancing Knowledge, Sharing Values”',
    },
    { type: 'heading', level: 2, text: 'Giá trị cốt lõi RISES' },
    {
      type: 'paragraph',
      text: 'GISA dựa trên giá trị cốt lõi “RISES” với năm trụ cột nhằm hướng tới tầm nhìn dài hạn và hoàn thành sứ mệnh đã đặt ra. Các trụ cột gồm độ tin cậy, uy tín và chính trực (R), đổi mới, sáng tạo và đột phá (I), khoa học và chuẩn mực (S), hiệu quả và ý nghĩa thực tiễn (E), cùng tính bền vững (S). Giá trị cốt lõi này liên tục được cải thiện và nâng cao.',
    },
    {
      type: 'table',
      headers: ['Chữ cái', 'Giá trị', 'Nội dung'],
      rows: [
        ['R', 'Reliability', 'Giá trị và uy tín dựa trên các nghiên cứu và tri thức có độ tin cậy cao.'],
        ['I', 'Innovation', 'Có tính đổi mới, sáng tạo và đột phá.'],
        ['S', 'Science', 'Cách tiếp cận khoa học, hàn lâm và chuẩn mực.'],
        ['E', 'Efficiency', 'Tính hiệu quả, ý nghĩa và giá trị thiết thực cho doanh nghiệp và xã hội.'],
        ['S', 'Sustainability', 'Một cách bền vững và lâu dài.'],
      ],
    },
];

export const gioiThieuBlocks: Record<string, ContentBlock[]> = {
  '/gioi-thieu/cau-chuyen-gisa': consolidatedStoryBlocks,

  '/gioi-thieu/linh-vuc-hoat-dong': [
    {
      type: 'paragraph',
      text: 'Sáu lĩnh vực hoạt động của GISA gắn với nhau thành một chuỗi liên kết, trong đó nghiên cứu tạo ra tri thức, tư vấn và đào tạo đưa tri thức vào tổ chức, ứng dụng chuyển giao thành giải pháp, mạng lưới mở rộng nguồn lực và cộng đồng lan tỏa tác động. Mỗi lĩnh vực đi kèm một bộ công cụ chuyên môn được sử dụng thường xuyên.',
    },
    { type: 'heading', level: 2, text: 'Nghiên cứu' },
    {
      type: 'paragraph',
      text: 'Thực hiện nghiên cứu khoa học chuyên sâu và nghiên cứu ứng dụng liên ngành, tạo ra tri thức có giá trị thực tiễn và độ tin cậy cao nhằm giải quyết các vấn đề phát triển bền vững và quản trị hiện đại.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Khảo sát định lượng và định tính (Survey, FGD, In-depth Interview)',
        'Phân tích dữ liệu thống kê (SPSS, STATA, R)',
        'Mô hình hóa và phân tích chính sách (System Dynamics, Cost–Benefit Analysis)',
        'Phân tích chuỗi giá trị và tác động (Value Chain Mapping, Impact Assessment)',
        'Khung đánh giá phát triển bền vững (SDG Framework, ESG Mapping)',
      ],
    },
    { type: 'heading', level: 2, text: 'Tư vấn' },
    {
      type: 'paragraph',
      text: 'Đồng hành cùng các cá nhân và tổ chức trong việc hoạch định chiến lược toàn diện, triển khai ESG hiệu quả, tối ưu hóa mô hình quản trị và thúc đẩy sản xuất kinh doanh thành công trong dài hạn.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'SWOT, PESTEL, TOWS Matrix',
        'Business Model Canvas và Policy Canvas',
        'ESG/CSR/CSV Assessment Tools',
        'Stakeholder Mapping và Power–Interest Grid',
        'Theory of Change (ToC), Logic Model (LogFrame)',
      ],
    },
    { type: 'heading', level: 2, text: 'Đào tạo' },
    {
      type: 'paragraph',
      text: 'Phát triển khả năng lãnh đạo, quản trị và chuyên môn, giúp các cá nhân và tổ chức nâng cao hiệu quả hoạt động và thích ứng với chuyển đổi số, kinh tế xanh và xu thế phát triển toàn cầu.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '360° Feedback và Competency Assessment',
        'KPIs/OKRs — thiết lập và theo dõi mục tiêu cá nhân và tổ chức',
        'Career Pathing và Learning Roadmap',
        'Bộ trắc nghiệm năng lực (EQ, MBTI, DISC, VIA)',
        'E-learning Design Tools, Interactive Learning Canvas',
      ],
    },
    { type: 'heading', level: 2, text: 'Ứng dụng' },
    {
      type: 'paragraph',
      text: 'GISA chủ động nghiên cứu, phát triển và hợp tác với các tổ chức khoa học – công nghệ nhằm chuyển hóa tri thức học thuật thành các giải pháp có tính ứng dụng cao, tập trung vào mô hình quản lý và kinh doanh tiên tiến, giải pháp khoa học và công nghệ đổi mới, sáng kiến phát triển kinh tế bền vững, và khung tâm lý – phát triển con người toàn diện.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Innovation Readiness Assessment',
        'Lean Startup Canvas — thiết kế mô hình đổi mới',
        'Sustainability Scorecard cho doanh nghiệp, tổ chức và cộng đồng',
        'ESG Risk Analysis Tools',
        'Absorptive Capacity Matrix — đánh giá năng lực hấp thụ công nghệ',
      ],
    },
    { type: 'heading', level: 2, text: 'Mạng lưới' },
    {
      type: 'paragraph',
      text: 'Xây dựng nền tảng kết nối và hợp tác giữa các nhà khoa học, chuyên gia, lãnh đạo và doanh nghiệp toàn cầu nhằm chia sẻ giá trị, lan tỏa tri thức đa chiều và thúc đẩy hợp tác chiến lược.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Ecosystem Mapping và Stakeholder Alignment Tools',
        'Strategic Partnership Assessment',
        'Community of Practice (CoP) Framework',
        'Cross-sector Collaboration Toolkit',
        'Knowledge Sharing Canvas',
      ],
    },
    { type: 'heading', level: 2, text: 'Cộng đồng' },
    {
      type: 'paragraph',
      text: 'Thực thi các chương trình và sáng kiến cộng đồng, góp phần nâng cao phúc lợi xã hội, bảo vệ môi trường và thúc đẩy phát triển bền vững vì lợi ích chung của hành tinh.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Social Impact Assessment (SIA)',
        'Community Needs Assessment Toolkit',
        'Behavior Change Design (COM-B Model, Nudge Tools)',
        'Participatory Action Research (PAR)',
        'SDG Impact Tracker',
      ],
    },
  ],
};
