import type { ContentBlock } from '../types';

/**
 * Nội dung nhánh Cộng đồng, lấy từ `2h Web community.docx`.
 *
 * `/cong-dong/kinh-te-ben-vung` không nằm ở đây vì đó là trang danh sách sáng
 * kiến (`initiatives`), không phải trang tĩnh.
 */
export const congDongBlocks: Record<string, ContentBlock[]> = {
  '/cong-dong/trach-nhiem-xa-hoi': [
    {
      type: 'paragraph',
      text: 'Trách nhiệm xã hội là một trong những định hướng chiến lược của GISA nhằm thúc đẩy phát triển bền vững, bao trùm và nhân văn trong cộng đồng, doanh nghiệp và các tổ chức xã hội. GISA xem trách nhiệm xã hội không chỉ là một nghĩa vụ đạo đức, mà là năng lực tạo giá trị chung — nơi lợi ích của tổ chức và xã hội cùng song hành và phát triển.',
    },
    { type: 'heading', level: 2, text: 'Tư duy và định hướng' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Lồng ghép trách nhiệm xã hội vào chiến lược phát triển tổ chức, không chỉ dừng ở các hoạt động thiện nguyện truyền thống.',
        'Xây dựng mô hình can thiệp xã hội dựa trên dữ liệu, bằng chứng và sự tham gia của cộng đồng.',
        'Thúc đẩy phát triển con người và nâng cao năng lực cộng đồng, đặc biệt ở nhóm yếu thế và vùng khó khăn.',
        'Tăng cường hợp tác liên ngành và huy động nguồn lực đa bên cho các sáng kiến có tác động xã hội lâu dài.',
        'Đo lường, tối ưu và lan tỏa tác động xã hội, hướng đến hiệu quả và tính bền vững trong từng dự án.',
      ],
    },
    { type: 'heading', level: 2, text: 'Các nội dung trọng tâm' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Tư vấn chiến lược và mô hình CSR/ESG cho doanh nghiệp, tổ chức và địa phương.',
        'Thiết kế và triển khai các chương trình can thiệp xã hội hướng đến giáo dục, y tế, sinh kế, giới, di cư và phát triển cộng đồng.',
        'Nâng cao năng lực lãnh đạo cộng đồng và tổ chức xã hội, đặc biệt ở khu vực phi lợi nhuận và nhóm yếu thế.',
        'Ươm tạo sáng kiến vì cộng đồng và hỗ trợ đổi mới xã hội.',
        'Đo lường và đánh giá tác động xã hội, kết hợp định lượng, định tính và phân tích dữ liệu.',
        'Thúc đẩy bình đẳng và tiếp cận công bằng trong giáo dục, đào tạo, dịch vụ và cơ hội phát triển.',
      ],
    },
    { type: 'heading', level: 2, text: 'Các chương trình và sáng kiến tiêu biểu' },
    {
      type: 'paragraph',
      text: 'Các sáng kiến được tổ chức theo ba hướng tác động: mở rộng cơ hội tiếp cận, củng cố năng lực công dân và thử nghiệm cách đo lường giá trị xã hội.',
    },
    { type: 'heading', level: 3, text: 'Bình đẳng, giáo dục và sức khỏe' },
    {
      type: 'paragraph',
      text: 'Nhóm sáng kiến này hướng đến cơ hội tiếp cận công bằng, năng lực công dân và chất lượng sống của cộng đồng.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA EqualLife — bình đẳng và hòa nhập: thúc đẩy hòa nhập xã hội, công bằng giới và trao quyền cho các nhóm yếu thế thông qua truyền thông, tập huấn kỹ năng và kết nối cộng đồng hành động.',
        'GISA EDU+ — giáo dục cho sự phát triển bền vững: hỗ trợ phát triển chương trình giáo dục khai phóng trong trường học, tập trung vào kỹ năng sống, trách nhiệm công dân và tư duy phản biện.',
        'GISA Wellbeing4All — sức khỏe và hạnh phúc cộng đồng: cải thiện sức khỏe tinh thần và thể chất cho cộng đồng, đặc biệt là các nhóm dễ bị tổn thương.',
      ],
    },
    { type: 'heading', level: 3, text: 'Công dân và hỗ trợ cộng đồng' },
    {
      type: 'paragraph',
      text: 'Các hướng trong nhóm này tập trung vào sự tham gia chủ động, hoạt động tình nguyện và gìn giữ giá trị cộng đồng.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA CivicLab — công dân tích cực: thúc đẩy vai trò chủ động của người dân trong phát triển cộng đồng và giám sát chính sách qua đào tạo, diễn đàn và nền tảng phản hồi xã hội.',
        'GISA Youth Social Action — thanh niên hành động xã hội: hỗ trợ các sáng kiến xã hội do thanh niên lãnh đạo bằng huấn luyện, cố vấn, kết nối chuyên gia và tài trợ nhỏ.',
        'GISA CareConnect — kết nối vì cộng đồng: hệ thống tình nguyện và hỗ trợ xã hội tại các địa bàn khó khăn, vùng chuyển đổi hoặc gặp khủng hoảng.',
        'GISA HomeCulture — văn hóa và cộng đồng: bảo tồn và phát huy các giá trị văn hóa cộng đồng gắn với phát triển xã hội bền vững.',
      ],
    },
    { type: 'heading', level: 3, text: 'Thử nghiệm và đo lường tác động' },
    {
      type: 'paragraph',
      text: 'Nhóm nội dung này quy tụ các hướng thử nghiệm mô hình, theo dõi đóng góp và cải thiện môi trường làm việc.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA Social Lab — thử nghiệm sáng kiến xã hội: không gian nghiên cứu, thử nghiệm và nhân rộng các mô hình đổi mới xã hội có căn cứ khoa học.',
        'GISA SDG Impact Tracker — nền tảng số theo dõi, đo lường và báo cáo đóng góp của tổ chức và cộng đồng vào các mục tiêu phát triển bền vững.',
        'GISA Work+Well — công việc nhân văn và môi trường làm việc bền vững: bộ công cụ đánh giá, đào tạo nội bộ và sáng kiến nhân sự vì phát triển con người.',
      ],
    },
    { type: 'heading', level: 3, text: 'Kết nối địa phương và chính sách' },
    {
      type: 'paragraph',
      text: 'Hai hướng cuối nhấn mạnh vai trò của cá nhân tạo thay đổi và đối thoại chính sách dựa trên dữ liệu cộng đồng.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA Local Heroes — tôn vinh và kết nối người kiến tạo cộng đồng: tìm kiếm, tôn vinh và hỗ trợ các cá nhân, nhóm nhỏ đang tạo thay đổi tích cực ở địa phương.',
        'GISA Social Policy Hack — đối thoại và đổi mới chính sách xã hội: diễn đàn, trại sáng tạo và cuộc thi mô phỏng nhằm đề xuất cải tiến chính sách dựa trên dữ liệu và tiếng nói người dân.',
      ],
    },
  ],

  '/cong-dong/bao-ve-moi-truong': [
    {
      type: 'paragraph',
      text: 'GISA xem bảo vệ môi trường xã hội và hệ sinh thái tự nhiên không chỉ là một nhiệm vụ cấp bách mà còn là nền tảng thiết yếu để đảm bảo phát triển bền vững, phồn vinh dài hạn và chất lượng sống cho các thế hệ tương lai.',
    },
    { type: 'heading', level: 2, text: 'Tư duy và định hướng' },
    {
      type: 'paragraph',
      text: 'GISA tiếp cận bảo vệ môi trường từ tư duy tích hợp, dựa trên các nguyên tắc của phát triển bền vững, khoa học hệ thống và công lý môi trường. GISA tập trung vào đổi mới chính sách, công nghệ và hành vi nhằm chuyển dịch sang nền kinh tế xanh, giảm phát thải, tăng cường khả năng phục hồi hệ sinh thái và huy động sự tham gia của toàn xã hội.',
    },
    { type: 'heading', level: 2, text: 'Các nội dung trọng tâm' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Thúc đẩy chuyển đổi sang mô hình phát triển kinh tế ít phát thải và sử dụng hiệu quả tài nguyên.',
        'Xây dựng các giải pháp thích ứng với biến đổi khí hậu tại địa phương, cộng đồng và doanh nghiệp.',
        'Bảo tồn đa dạng sinh học và phục hồi hệ sinh thái đất, nước, rừng và biển.',
        'Phòng ngừa và giảm thiểu ô nhiễm môi trường: không khí, nước, rác thải, nhựa.',
        'Thay đổi hành vi và lối sống theo hướng thân thiện với môi trường.',
        'Kết nối khoa học, chính sách và cộng đồng trong các sáng kiến môi trường.',
      ],
    },
    { type: 'heading', level: 2, text: 'Các chương trình và sáng kiến tiêu biểu' },
    {
      type: 'paragraph',
      text: 'Các sáng kiến kết nối nghiên cứu với hành động khí hậu, phục hồi hệ sinh thái và thay đổi hành vi trong đời sống hằng ngày.',
    },
    { type: 'heading', level: 3, text: 'Nghiên cứu, thích ứng và phục hồi hệ sinh thái' },
    {
      type: 'paragraph',
      text: 'Nhóm này kết nối thử nghiệm mô hình xanh với thích ứng khí hậu và bảo tồn đa dạng sinh học.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA Green Futures Lab — không gian nghiên cứu, thiết kế và thử nghiệm các mô hình phát triển thân thiện với môi trường, từ kiến trúc xanh, quy hoạch đô thị sinh thái đến sản xuất sạch hơn.',
        'Climate Resilience+ — xây dựng năng lực thích ứng với biến đổi khí hậu cho cộng đồng, doanh nghiệp nhỏ và vùng dễ bị tổn thương.',
        'GISA EcoAction — chuỗi sáng kiến môi trường do cộng đồng khởi xướng: quản lý chất thải, làm sạch không gian công cộng, vườn sinh thái đô thị và truyền thông nâng cao nhận thức.',
        'GISA Biodiversity+ — bảo tồn đa dạng sinh học gắn với phát triển sinh kế và văn hóa bản địa, phục hồi sinh cảnh rừng, biển và hệ sinh thái ngập mặn.',
      ],
    },
    { type: 'heading', level: 3, text: 'Giảm chất thải và mua sắm xanh' },
    {
      type: 'paragraph',
      text: 'Nhóm giải pháp này tập trung vào giảm rác thải, thay đổi lựa chọn mua sắm và hạn chế nhựa dùng một lần.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA Zero Waste Campus — hỗ trợ các trường đại học và tổ chức giáo dục xây dựng mô hình không rác thải qua phân loại tại nguồn, tái chế sáng tạo và truyền thông thay đổi hành vi.',
        'Green Procurement Guide — hướng dẫn và tiêu chuẩn hóa mua sắm công – tư theo tiêu chí xanh, ưu tiên nhà cung cấp thân thiện với môi trường.',
        'GISA Plastic Reduction Challenge — chiến dịch giảm nhựa dùng một lần trong hệ sinh thái tiêu dùng, giáo dục, du lịch và sự kiện.',
      ],
    },
    { type: 'heading', level: 3, text: 'Đối thoại, lối sống và không gian đô thị' },
    {
      type: 'paragraph',
      text: 'Nhóm cuối mở rộng hành động môi trường sang chính sách, thói quen hằng ngày và chất lượng không gian sống.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA Environmental Policy Dialogue — diễn đàn đối thoại chính sách và chia sẻ sáng kiến giữa giới nghiên cứu, hoạch định, doanh nghiệp và xã hội dân sự.',
        'Green Citizen — hành trình truyền thông, đào tạo và khơi dậy lối sống xanh thông qua thử thách, tài liệu hướng dẫn và sự kiện cộng đồng.',
        'GISA Urban Greening Project — phủ xanh và phục hồi không gian xanh đô thị: vườn cộng đồng, tường cây xanh, mái nhà xanh và cây xanh công cộng.',
      ],
    },
  ],

  '/cong-dong/quan-tri-hieu-qua': [
    {
      type: 'paragraph',
      text: 'Trong bối cảnh toàn cầu hóa, khủng hoảng khí hậu và áp lực phát triển bền vững, yêu cầu về một mô hình quản trị hiệu quả, minh bạch, có trách nhiệm và tích hợp các nguyên tắc môi trường – xã hội ngày càng trở nên cấp thiết. GISA thúc đẩy tư duy và hành động quản trị hiệu quả và bền vững như một trụ cột chiến lược.',
    },
    { type: 'heading', level: 2, text: 'Tư duy và định hướng' },
    {
      type: 'paragraph',
      text: 'GISA tiếp cận quản trị từ mô hình hệ thống và hướng đến quản trị chuyển đổi: tổ chức phải có khả năng thích nghi, minh bạch, đồng kiến tạo và hướng đến giá trị bền vững cho đa bên liên quan. Quản trị xanh không chỉ gắn với giảm thiểu tác động môi trường, mà còn lồng ghép nguyên tắc ESG vào cơ chế vận hành, ra quyết định và đánh giá tác động.',
    },
    { type: 'heading', level: 2, text: 'Các nội dung trọng tâm' },
    {
      type: 'list',
      ordered: false,
      items: [
        'Thúc đẩy mô hình quản trị đa bên, minh bạch, có trách nhiệm và dựa trên bằng chứng.',
        'Lồng ghép nguyên tắc phát triển bền vững, ESG và chuyển đổi xanh vào hệ thống quản trị.',
        'Xây dựng bộ công cụ đánh giá, giám sát và cải tiến hiệu quả tổ chức và chính sách.',
        'Hỗ trợ chuyển đổi số trong quản trị cộng đồng, đô thị và doanh nghiệp.',
        'Thúc đẩy quản trị dữ liệu và đổi mới sáng tạo trong ra quyết định.',
        'Phát triển năng lực lãnh đạo chuyển đổi bền vững và xây dựng tổ chức học tập.',
      ],
    },
    { type: 'heading', level: 2, text: 'Các chương trình và sáng kiến tiêu biểu' },
    {
      type: 'paragraph',
      text: 'Các sáng kiến tập trung vào ba lớp năng lực: khung quản trị, hạ tầng dữ liệu và khả năng lãnh đạo quá trình chuyển đổi.',
    },
    { type: 'heading', level: 3, text: 'Khung quản trị và thực hành ESG' },
    {
      type: 'paragraph',
      text: 'Nhóm này tập trung vào đánh giá ESG, quản trị tạo tác động và thử nghiệm cơ chế vận hành xanh.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA ESG Navigator — bộ công cụ hỗ trợ doanh nghiệp, tổ chức và địa phương đánh giá, hoạch định và nâng cao hiệu quả thực hiện các tiêu chí ESG, gắn với tiêu chuẩn quốc tế và điều kiện thực tiễn Việt Nam.',
        'Governance for Impact — hỗ trợ tổ chức xã hội, doanh nghiệp và chính quyền địa phương xây dựng hệ thống quản trị tập trung vào hiệu quả, công bằng, minh bạch và trách nhiệm.',
        'GISA Green Governance Lab — không gian thử nghiệm mô hình quản trị xanh, nơi chính quyền địa phương, doanh nghiệp và cộng đồng đồng kiến tạo chính sách và cơ chế vận hành bền vững.',
      ],
    },
    { type: 'heading', level: 3, text: 'Đô thị và dữ liệu bền vững' },
    {
      type: 'paragraph',
      text: 'Hai hướng trong nhóm này kết nối quản trị đô thị với dữ liệu phục vụ quyết định về tài nguyên và phát triển.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA Smart & Green City Governance — hỗ trợ các đô thị và khu công nghiệp xây dựng hệ thống quản trị số hóa, hiệu quả năng lượng và thân thiện với môi trường.',
        'Data for Sustainability — nền tảng dữ liệu mở và công cụ phân tích hỗ trợ ra quyết định trong quản lý tài nguyên, biến đổi khí hậu, an ninh lương thực và quy hoạch không gian.',
      ],
    },
    { type: 'heading', level: 3, text: 'Lãnh đạo, môi trường làm việc và đối thoại' },
    {
      type: 'paragraph',
      text: 'Nhóm này chú trọng năng lực lãnh đạo, thực hành văn phòng xanh và trao đổi về chuẩn mực quản trị.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA Future Leadership for Sustainability — phát triển năng lực lãnh đạo xanh và bền vững cho nhà quản lý doanh nghiệp, cán bộ chính quyền, tổ chức xã hội và thanh niên.',
        'GISA Green Office Toolkit — hướng dẫn xây dựng văn phòng làm việc xanh: sử dụng năng lượng hiệu quả, giảm chất thải, quản lý tài nguyên số và tổ chức sự kiện thân thiện môi trường.',
        'GISA Ethical Governance Dialogues — chuỗi đối thoại, nghiên cứu và xuất bản nhằm thúc đẩy thực hành quản trị đạo đức trong doanh nghiệp, tổ chức xã hội và khu vực công.',
      ],
    },
    { type: 'heading', level: 3, text: 'Năng lực tổ chức và tư vấn cải tiến' },
    {
      type: 'paragraph',
      text: 'Nhóm cuối tập trung vào củng cố năng lực thể chế và đánh giá hệ thống quản trị theo tiêu chí bền vững.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GISA Institutional Capacity+ — nâng cao năng lực tổ chức cho các cơ quan, tổ chức phi lợi nhuận và mạng lưới cộng đồng.',
        'GISA Sustainability Audit & Advisory — đánh giá và tư vấn cải tiến hệ thống quản trị theo tiêu chí bền vững, bao gồm ESG, các mục tiêu phát triển bền vững, phát thải carbon và văn hóa nội bộ.',
      ],
    },
  ],
};
