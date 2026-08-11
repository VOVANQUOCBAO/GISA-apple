import type { ContentBlock } from '../types';

/**
 * Nội dung nhánh Ứng dụng, lấy từ `2f Web application.docx`. Mỗi mục giữ đúng
 * cặp "tóm tắt — giá trị mang lại" của tài liệu gốc, gộp thành một dòng danh
 * sách để trang đọc được liền mạch.
 */
export const ungDungBlocks: Record<string, ContentBlock[]> = {
  '/ung-dung/linh-vuc': [
    {
      type: 'paragraph',
      text: 'GISA chủ động tiên phong trong nghiên cứu, phát triển và hợp tác liên ngành với các tổ chức khoa học – công nghệ uy tín trong và ngoài nước, với sứ mệnh chuyển hóa tri thức học thuật thành các giải pháp có tính ứng dụng cao, phù hợp với thực tiễn tại địa phương, doanh nghiệp và cộng đồng.',
    },
    {
      type: 'paragraph',
      text: 'Chúng tôi không dừng lại ở nghiên cứu, mà đồng hành cùng đối tác trong suốt quá trình thiết kế, thử nghiệm và chuyển giao các mô hình đột phá, nhằm tạo ra tác động thực chất và bền vững.',
    },
    { type: 'heading', level: 2, text: 'Bốn lĩnh vực ứng dụng chiến lược' },
    { type: 'heading', level: 3, text: 'Mô hình quản lý và kinh doanh tiên tiến' },
    {
      type: 'paragraph',
      text: 'GISA xây dựng và chuyển giao các mô hình quản trị linh hoạt, hệ thống quản lý hiệu quả và chiến lược kinh doanh bền vững phù hợp với bối cảnh thị trường đang thay đổi nhanh chóng, giúp tổ chức tối ưu hóa vận hành, nâng cao năng lực ra quyết định và cải thiện hiệu quả tổng thể.',
    },
    { type: 'heading', level: 3, text: 'Giải pháp khoa học và công nghệ đổi mới' },
    {
      type: 'paragraph',
      text: 'GISA thúc đẩy ứng dụng các công nghệ mới và chuyển giao công nghệ phù hợp với điều kiện thực tiễn của địa phương, doanh nghiệp hoặc cộng đồng, đặc biệt trong chuyển đổi số, nông nghiệp thông minh, công nghệ môi trường và AI ứng dụng.',
    },
    { type: 'heading', level: 3, text: 'Sáng kiến phát triển kinh tế bền vững' },
    {
      type: 'paragraph',
      text: 'GISA thiết kế và triển khai các mô hình kinh tế tuần hoàn, kinh tế địa phương và chiến lược phát triển xanh gắn với năng lực cộng đồng, góp phần giải quyết các thách thức môi trường – xã hội – kinh tế một cách tích hợp và thích ứng dài hạn.',
    },
    { type: 'heading', level: 3, text: 'Khung tâm lý và phát triển con người toàn diện' },
    {
      type: 'paragraph',
      text: 'GISA phát triển các khung năng lực và chương trình dựa trên tâm lý học ứng dụng, giúp cá nhân, nhóm và tổ chức tăng cường nhận thức, khả năng thích nghi, lãnh đạo cảm xúc và phát triển nội lực.',
    },
    { type: 'heading', level: 2, text: 'Hệ thống công cụ triển khai' },
    { type: 'heading', level: 3, text: 'Đánh giá và thiết kế đổi mới' },
    {
      type: 'paragraph',
      text: 'Nhóm công cụ này hỗ trợ tổ chức nhận diện mức độ sẵn sàng, kiểm chứng ý tưởng và đánh giá năng lực phát triển bền vững.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Innovation Readiness Assessment — đánh giá mức độ sẵn sàng đổi mới.',
        'Lean Startup Canvas — thiết kế và kiểm chứng mô hình đổi mới sáng tạo.',
        'Sustainability Scorecard — đánh giá năng lực phát triển bền vững của doanh nghiệp, tổ chức, cộng đồng.',
      ],
    },
    { type: 'heading', level: 3, text: 'Rủi ro và năng lực tổ chức' },
    {
      type: 'paragraph',
      text: 'Nhóm tiếp theo tập trung vào rủi ro ESG, khả năng hấp thụ công nghệ và năng lực điều phối thay đổi.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'ESG Risk Analysis Tools — phân tích và quản trị rủi ro môi trường – xã hội – quản trị.',
        'Absorptive Capacity Matrix — đánh giá năng lực hấp thụ và vận dụng công nghệ.',
        'Organizational Capability Map — lập bản đồ năng lực tổ chức để điều phối thay đổi.',
      ],
    },
    { type: 'heading', level: 3, text: 'Công nghệ, tác động và mô hình kinh doanh' },
    {
      type: 'paragraph',
      text: 'Các công cụ trong nhóm này kết nối lựa chọn công nghệ với lập kế hoạch tác động và thiết kế mô hình kinh doanh bền vững.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Technology Matching Framework — xác định giải pháp công nghệ phù hợp với mục tiêu ứng dụng.',
        'Impact Mapping Toolkit — lập kế hoạch và đo lường tác động của chương trình can thiệp.',
        'Sustainable Business Model Generator — thiết kế mô hình kinh doanh tích hợp yếu tố bền vững.',
      ],
    },
    { type: 'heading', level: 3, text: 'Hành vi, đồng thuận và lộ trình' },
    {
      type: 'paragraph',
      text: 'Nhóm cuối hỗ trợ thiết kế thay đổi hành vi, thống nhất vai trò giữa các bên và xây dựng lộ trình thích ứng.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Behavioral Change Framework — thiết kế chương trình thay đổi hành vi cá nhân và tổ chức.',
        'Stakeholder Alignment Canvas — định hình sự đồng thuận và vai trò giữa các bên liên quan.',
        'Adaptive Roadmap Planner — xây dựng lộ trình chuyển đổi phù hợp với năng lực thực tế.',
      ],
    },
  ],

  '/ung-dung/quan-ly-kinh-doanh': [
    {
      type: 'paragraph',
      text: 'GISA tiên phong trong việc nghiên cứu, phát triển và triển khai ứng dụng các mô hình quản lý và kinh doanh tiên tiến, phù hợp với xu hướng chuyển đổi số và bối cảnh kinh tế toàn cầu hiện nay. GISA đồng hành cùng doanh nghiệp và tổ chức trong việc thiết kế, thử nghiệm và chuyển giao các mô hình quản trị đổi mới.',
    },
    { type: 'heading', level: 2, text: 'Các mô hình được chuyển giao' },
    { type: 'heading', level: 3, text: 'Thiết kế mô hình và mục tiêu' },
    {
      type: 'paragraph',
      text: 'Nhóm này hỗ trợ tổ chức mô tả mô hình kinh doanh, kiểm chứng giả định và chuyển chiến lược thành mục tiêu có thể đo lường.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Business Model Canvas — mô tả, thiết kế và phân tích mô hình kinh doanh qua chín yếu tố cốt lõi. Công cụ giúp doanh nghiệp hình dung toàn cảnh hoạt động và xác định điểm mạnh, điểm yếu.',
        'Lean Startup — phát triển sản phẩm tối thiểu khả dụng, kiểm chứng thị trường sớm và cải tiến liên tục. Cách tiếp cận này giảm rủi ro, tiết kiệm chi phí và rút ngắn thời gian ra thị trường.',
        'OKRs — thiết lập mục tiêu rõ ràng và kết quả then chốt đo lường được. Phương pháp này nâng cao tính minh bạch, cam kết nội bộ và hiệu quả triển khai chiến lược.',
        'Balanced Scorecard — đo lường thành công trên bốn khía cạnh gồm tài chính, khách hàng, quy trình nội bộ và học hỏi, phát triển. Khung đánh giá giúp cân bằng tăng trưởng ngắn hạn với phát triển dài hạn.',
      ],
    },
    { type: 'heading', level: 3, text: 'Quản trị linh hoạt và phân quyền' },
    {
      type: 'paragraph',
      text: 'Nhóm mô hình này tập trung vào tốc độ thích ứng, tư duy lấy người dùng làm trung tâm và cơ chế tự chủ trong tổ chức.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Agile Management — quản trị linh hoạt với nhóm nhỏ tự tổ chức và cải tiến liên tục. Mô hình này tăng khả năng thích nghi và tốc độ ra quyết định.',
        'Design Thinking — giải quyết vấn đề qua thấu hiểu người dùng, tạo ý tưởng, thử nghiệm và cải tiến. Quy trình thúc đẩy đổi mới từ nhu cầu thực tiễn.',
        'ESG-based Governance — lồng ghép yếu tố môi trường, xã hội và quản trị vào chiến lược và vận hành. Cách quản trị này gia tăng uy tín thương hiệu và năng lực quản lý rủi ro dài hạn.',
        'Holacracy — phân phối quyền lực vào các nhóm tự chủ thay vì cấu trúc cấp bậc cứng nhắc. Mô hình tăng tính linh hoạt, sáng tạo và quyền sở hữu công việc.',
      ],
    },
    { type: 'heading', level: 3, text: 'Bền vững và giá trị xã hội' },
    {
      type: 'paragraph',
      text: 'Các mô hình trong nhóm này tìm kiếm hiệu quả tài nguyên, đổi mới phù hợp nguồn lực và giá trị chung cho doanh nghiệp với cộng đồng.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Circular Business Model — tối ưu hóa tài nguyên, kéo dài vòng đời sản phẩm và giảm chất thải. Mô hình giúp giảm chi phí nguyên liệu và tạo lợi thế cạnh tranh xanh.',
        'Frugal Innovation — đổi mới sản phẩm và quy trình với chi phí thấp, tận dụng tài nguyên sẵn có. Cách làm này phù hợp với bối cảnh hạn chế ngân sách hoặc hạ tầng.',
        'Shared Value Business Model — tích hợp mục tiêu kinh tế với giá trị xã hội trong cùng một chiến lược. Mô hình tạo sự kết nối chặt chẽ với cộng đồng.',
      ],
    },
    { type: 'heading', level: 3, text: 'Nền tảng, trải nghiệm và chuyển đổi số' },
    {
      type: 'paragraph',
      text: 'Nhóm cuối mở rộng mô hình kinh doanh qua nền tảng số, trải nghiệm khách hàng và cơ hội tham gia của nhiều nhóm đối tượng.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Platform Business Model — tạo giá trị qua việc kết nối nhiều bên. Mô hình tối ưu chi phí giao dịch và hỗ trợ mở rộng nhanh thị trường số.',
        'Customer Experience-Centric Model — lấy trải nghiệm khách hàng làm trung tâm khi thiết kế sản phẩm, dịch vụ và quy trình. Cách tiếp cận này tăng sự hài lòng và lòng trung thành.',
        'Digital Transformation Framework — tái cấu trúc hoạt động và ứng dụng công nghệ mới vào quy trình, dịch vụ và mô hình kinh doanh.',
        'Inclusive Business Model — tạo cơ hội cho nhóm yếu thế tham gia chuỗi giá trị. Mô hình tăng tính bền vững xã hội và mở rộng thị trường tiềm năng.',
      ],
    },
  ],

  '/ung-dung/khoa-hoc-cong-nghe': [
    {
      type: 'paragraph',
      text: 'Tại GISA, khoa học và công nghệ không chỉ là nền tảng nghiên cứu mà còn là động lực thiết thực cho đổi mới và phát triển. Chúng tôi chủ động nghiên cứu, chuyển giao và tích hợp các giải pháp công nghệ tiên tiến nhằm giúp doanh nghiệp, tổ chức và cộng đồng giải quyết các thách thức trong thực tiễn.',
    },
    {
      type: 'paragraph',
      text: 'GISA đồng hành cùng đối tác trong toàn bộ quá trình từ đánh giá hiện trạng, thiết kế công nghệ, thử nghiệm, đào tạo đến vận hành thực tế, đảm bảo sự chuyển giao bền vững.',
    },
    { type: 'heading', level: 2, text: 'Các giải pháp tiêu biểu' },
    { type: 'heading', level: 3, text: 'Dữ liệu, học tập và hành vi' },
    {
      type: 'paragraph',
      text: 'Nhóm giải pháp này sử dụng dữ liệu để theo dõi phát triển bền vững, cá nhân hóa học tập và phân tích hành vi người dùng.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Hệ thống giám sát phát triển bền vững — nền tảng số tích hợp dữ liệu giúp tổ chức và địa phương theo dõi tiến độ thực hiện các mục tiêu phát triển bền vững theo thời gian thực, kèm trực quan hóa và cảnh báo sớm.',
        'Nền tảng đào tạo số cá nhân hóa — ứng dụng AI để xây dựng lộ trình học tập phù hợp với từng cá nhân theo năng lực, mục tiêu và hành vi học tập.',
        'Công cụ phân tích hành vi người tiêu dùng — kết hợp phân tích dữ liệu lớn và tâm lý học hành vi để dự đoán xu hướng tiêu dùng và phân khúc thị trường.',
      ],
    },
    { type: 'heading', level: 3, text: 'Nông nghiệp, ESG và năng lực chuyển đổi' },
    {
      type: 'paragraph',
      text: 'Nhóm này kết nối công nghệ nông nghiệp, hỗ trợ quyết định ESG và các công cụ giúp tổ chức chuẩn bị cho quá trình chuyển đổi.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Ứng dụng IoT trong nông nghiệp thông minh — cảm biến và Internet vạn vật để giám sát môi trường, điều khiển tưới tiêu, quản lý phân bón và theo dõi sức khỏe cây trồng.',
        'Nền tảng hỗ trợ ra quyết định ESG — phân tích và gợi ý hành động theo các tiêu chí môi trường – xã hội – quản trị cho tổ chức muốn tích hợp yếu tố bền vững.',
        'Bộ công cụ phân tích năng lực hấp thụ công nghệ — đánh giá khả năng tiếp nhận, tích hợp và khai thác công nghệ mới, từ đó xây dựng lộ trình chuyển đổi phù hợp.',
        'Giải pháp truyền thông số thay đổi hành vi — chiến dịch truyền thông dựa trên công nghệ số và dữ liệu hành vi, thúc đẩy thay đổi tích cực về sức khỏe, môi trường và giáo dục.',
        'Hệ thống phát triển năng lực nhân sự — đánh giá năng lực nhân viên theo chuẩn năng lực cốt lõi và đề xuất lộ trình đào tạo cá nhân hóa.',
      ],
    },
    { type: 'heading', level: 3, text: 'Chuỗi cung ứng, AI và truy xuất nguồn gốc' },
    {
      type: 'paragraph',
      text: 'Nhóm giải pháp này tập trung vào dữ liệu chuỗi cung ứng, dự báo rủi ro và tính minh bạch của thông tin sản phẩm.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Mô hình số hóa chuỗi cung ứng địa phương — blockchain và nền tảng số để truy xuất nguồn gốc, kết nối cung – cầu và tối ưu hóa chuỗi nông sản, thủ công mỹ nghệ, sản phẩm địa phương.',
        'Giải pháp AI hỗ trợ chẩn đoán và dự báo — phân tích dữ liệu trong y tế, giáo dục, tài chính và nông nghiệp để phát hiện sớm rủi ro và hỗ trợ ra quyết định.',
        'Giải pháp blockchain truy xuất nguồn gốc — đảm bảo minh bạch và xác thực thông tin trong chuỗi cung ứng nông sản, dược liệu và thực phẩm sạch.',
      ],
    },
    { type: 'heading', level: 3, text: 'Dữ liệu cộng đồng và hỗ trợ quyết định' },
    {
      type: 'paragraph',
      text: 'Nhóm cuối đưa dữ liệu vào quy hoạch, mô phỏng chính sách, quản lý hợp tác xã và phân tích tương tác xã hội.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Nền tảng số hóa dữ liệu cộng đồng — thu thập và phân tích dữ liệu từ cộng đồng để phục vụ quy hoạch đô thị, y tế công cộng, giáo dục địa phương và quản trị xã hội.',
        'Nền tảng thiết kế chính sách mô phỏng — mô phỏng tác động của chính sách dựa trên dữ liệu thực tế và phản hồi của các bên liên quan.',
        'Hệ thống hỗ trợ ra quyết định cho hợp tác xã — quản lý tổng thể tài chính, sản xuất – kinh doanh, lập kế hoạch và tiếp cận thị trường cho hợp tác xã và doanh nghiệp nhỏ.',
        'Công nghệ phân tích cảm xúc và tương tác — AI và cảm biến để phân tích cảm xúc, tâm trạng và mức độ tương tác trong các chương trình giáo dục, truyền thông và can thiệp cộng đồng.',
      ],
    },
  ],

  '/ung-dung/kinh-te-ben-vung': [
    {
      type: 'paragraph',
      text: 'GISA xác định phát triển kinh tế bền vững là trục xuyên suốt trong mọi chương trình nghiên cứu, tư vấn và ứng dụng. Chúng tôi không chỉ đưa ra khuyến nghị chính sách, mà trực tiếp cùng đối tác thiết kế và triển khai các mô hình, sáng kiến và giải pháp nhằm thúc đẩy tăng trưởng xanh, kinh tế tuần hoàn và nâng cao năng lực tự cường địa phương.',
    },
    { type: 'heading', level: 2, text: 'Các mô hình và sáng kiến tiêu biểu' },
    { type: 'heading', level: 3, text: 'Kinh tế tuần hoàn và nông nghiệp thông minh' },
    {
      type: 'paragraph',
      text: 'Nhóm này kết nối sử dụng hiệu quả tài nguyên, khởi nghiệp xanh và dữ liệu phục vụ phát triển nông nghiệp tại địa phương.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Mô hình phát triển kinh tế tuần hoàn tại địa phương — hệ sinh thái sản xuất – tiêu dùng khép kín tại cấp xã, cụm dân cư hoặc làng nghề, tận dụng phụ phẩm và tái sử dụng tài nguyên.',
        'Chương trình khởi nghiệp bền vững cho thanh niên nông thôn — kiến thức khởi nghiệp xanh, mô hình sản xuất nông nghiệp tuần hoàn và thương mại hóa sản phẩm qua nền tảng số.',
        'Hệ thống đánh giá phát triển bền vững cấp địa phương — bộ chỉ số và dashboard theo dõi tiến độ thực hiện các mục tiêu phát triển bền vững ở cấp tỉnh, huyện, xã.',
      ],
    },
    { type: 'heading', level: 3, text: 'Học tập và tiêu dùng bền vững' },
    {
      type: 'paragraph',
      text: 'Nhóm sáng kiến này mở rộng thực hành bền vững qua sản xuất nông nghiệp, học tập cộng đồng và lựa chọn tiêu dùng.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Cụm nông nghiệp thông minh – bền vững — tích hợp cảm biến, IoT và dữ liệu lớn vào sản xuất theo nhóm hộ và hợp tác xã, kết nối đầu ra trên nền tảng số.',
        'Trung tâm học tập cộng đồng về phát triển bền vững — không gian mở kết hợp học tập, thực hành và tương tác về năng lượng tái tạo, sống xanh và tiêu dùng có trách nhiệm.',
        'Hệ sinh thái tiêu dùng xanh và công bằng — từ truyền thông thay đổi hành vi đến chuỗi cung ứng xanh, xây dựng văn hóa tiêu dùng bền vững.',
      ],
    },
    { type: 'heading', level: 3, text: 'Nguồn lực địa phương và hành động khí hậu' },
    {
      type: 'paragraph',
      text: 'Nhóm này tập trung vào cơ chế hỗ trợ sáng kiến, giáo dục khí hậu và lộ trình chuyển đổi xanh cho doanh nghiệp.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Quỹ sáng kiến địa phương vì phát triển bền vững — cơ chế tài trợ và cố vấn kỹ thuật cho các nhóm dân cư, tổ chức xã hội hoặc doanh nghiệp địa phương có ý tưởng đổi mới.',
        'Nền tảng học tập và hành động vì khí hậu — công nghệ giáo dục với chương trình học tương tác, trò chơi hóa và hệ thống hành động thực tiễn.',
        'Chương trình hỗ trợ doanh nghiệp chuyển đổi xanh — đánh giá hiện trạng ESG, đề xuất lộ trình chuyển đổi, kết hợp công nghệ, tài chính xanh và đào tạo nhân lực.',
      ],
    },
    { type: 'heading', level: 3, text: 'Phân tích chính sách và minh bạch sản phẩm' },
    {
      type: 'paragraph',
      text: 'Nhóm cuối sử dụng phân tích đa chiều và dữ liệu không gian để hỗ trợ hoạch định, đồng thời làm rõ tiêu chí bền vững của sản phẩm.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Giải pháp phân tích tác động đa chiều của chính sách — mô phỏng tác động kinh tế – xã hội – môi trường bằng công cụ định lượng và đánh giá có sự tham gia.',
        'Bản đồ dữ liệu bền vững địa phương — tích hợp dữ liệu dân cư, tài nguyên, môi trường và năng lực kinh tế theo không gian số để hỗ trợ hoạch định.',
        'Hệ thống chấm điểm và nhãn xanh cho sản phẩm cộng đồng — đánh giá sản phẩm theo tiêu chí môi trường, xã hội và tính minh bạch.',
      ],
    },
  ],

  '/ung-dung/tam-ly-phat-trien-con-nguoi': [
    {
      type: 'paragraph',
      text: 'GISA xem phát triển con người là trung tâm của mọi tiến trình chuyển đổi bền vững. Với nền tảng khoa học hành vi, tâm lý học ứng dụng và tiếp cận hệ thống, chúng tôi phát triển và triển khai các khung chương trình, giải pháp can thiệp và mô hình đào tạo nhằm nâng cao năng lực cảm xúc – xã hội, sức khỏe tâm thần, tư duy tích cực và khả năng thích ứng.',
    },
    {
      type: 'paragraph',
      text: 'Chúng tôi đồng hành cùng đối tác trong cả thiết kế, triển khai và đánh giá tác động, nhằm tạo ra thay đổi thực chất và dài hạn.',
    },
    { type: 'heading', level: 2, text: 'Các khung chương trình và giải pháp' },
    { type: 'heading', level: 3, text: 'Năng lực cảm xúc, sức khỏe và hành vi học đường' },
    {
      type: 'paragraph',
      text: 'Nhóm giải pháp này xây dựng năng lực cảm xúc – xã hội, hỗ trợ sức khỏe tâm thần và thiết kế can thiệp trong môi trường học đường.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Khung năng lực cảm xúc – xã hội cho học sinh và người trưởng thành gồm năm nhóm kỹ năng là nhận thức bản thân, quản lý cảm xúc, nhận thức xã hội, kỹ năng quan hệ và ra quyết định có trách nhiệm.',
        'Chương trình chăm sóc sức khỏe tâm thần trong doanh nghiệp — đánh giá tâm lý, workshop, tư vấn cá nhân, xây dựng môi trường làm việc lành mạnh và hỗ trợ sau khủng hoảng.',
        'Hệ thống đánh giá và hỗ trợ hành vi học đường toàn diện — bộ công cụ đánh giá hành vi học sinh kết hợp mô hình can thiệp ba cấp độ trường – lớp – cá nhân.',
      ],
    },
    { type: 'heading', level: 3, text: 'Học tập cá nhân hóa và phát triển nội lực' },
    {
      type: 'paragraph',
      text: 'Nhóm này kết nối tâm lý học nhận thức với phát triển năng lực lãnh đạo và khả năng tự điều chỉnh của thanh thiếu niên.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Nền tảng học tập cá nhân hóa dựa trên tâm lý học nhận thức — mô hình nhận thức – hành vi và dữ liệu hành vi học để cá nhân hóa nội dung học.',
        'Mô hình “lãnh đạo từ nội tâm” cho cán bộ và nhà giáo dục — đào tạo lãnh đạo tập trung vào trí tuệ cảm xúc, khả năng phục hồi và đạo đức nghề nghiệp.',
        'Bộ công cụ “Tự hiểu – Tự trị – Tự trưởng thành” cho thanh thiếu niên — giúp hiểu rõ giá trị bản thân, xây dựng mục tiêu sống và tăng năng lực tự điều chỉnh.',
      ],
    },
    { type: 'heading', level: 3, text: 'Trị liệu, kỹ năng sống và năng lực giáo viên' },
    {
      type: 'paragraph',
      text: 'Nhóm giải pháp này mở rộng hỗ trợ qua nghệ thuật, nền tảng số và năng lực đồng hành tâm lý của giáo viên.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Chương trình trị liệu nhóm ứng dụng nghệ thuật và chuyển động — các hình thức trị liệu phi ngôn ngữ giúp giải tỏa căng thẳng, tăng kết nối và khám phá nội tâm.',
        'Nền tảng số về sức khỏe tinh thần và kỹ năng sống — bài giảng ngắn, kiểm tra tâm lý, tư vấn tự động và hệ thống gợi ý học tập.',
        'Khung năng lực giáo dục cảm xúc – xã hội cho giáo viên — giúp giáo viên tự quản lý cảm xúc, đồng hành tâm lý với học sinh và lồng ghép vào giảng dạy.',
      ],
    },
    { type: 'heading', level: 3, text: 'Phục hồi cộng đồng, gia đình và nghề nghiệp' },
    {
      type: 'paragraph',
      text: 'Nhóm cuối tập trung vào hỗ trợ tâm lý sau khủng hoảng, nuôi dưỡng tích cực và sự phù hợp giữa con người với công việc.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Mô hình “Tâm lý cộng đồng chủ động” tại vùng chịu khủng hoảng — chuỗi hoạt động tâm lý phục hồi tại vùng chịu thiên tai, dịch bệnh hoặc biến động xã hội.',
        'Chương trình hỗ trợ phụ huynh trong nuôi dưỡng tích cực — tài liệu, lớp học và video tương tác về kỹ năng lắng nghe, hỗ trợ cảm xúc và thiết lập giới hạn lành mạnh.',
        'Hệ thống đánh giá năng lực tâm lý nghề nghiệp — đo lường các yếu tố tâm lý ảnh hưởng đến hiệu suất và sự phù hợp nghề nghiệp, phục vụ tuyển dụng và phát triển đội ngũ.',
      ],
    },
  ],
};
