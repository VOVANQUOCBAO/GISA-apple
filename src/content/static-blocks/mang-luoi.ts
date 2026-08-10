import type { ContentBlock } from '../types';

/**
 * Nội dung nhánh Mạng lưới, lấy từ `2g Web network.docx`. Danh sách quỹ và nhà
 * tài trợ lấy theo mục "Các Quỹ và Nhà Tài Trợ" trên gisa.edu.vn/mang-luoi,
 * giữ nguyên tên tổ chức và liên kết chính thức mà trang nguồn công bố.
 */
export const mangLuoiBlocks: Record<string, ContentBlock[]> = {
  '/mang-luoi/thuc-day-hop-tac': [
    {
      type: 'paragraph',
      text: 'Trong bối cảnh thế giới đang chuyển mình mạnh mẽ theo hướng đổi mới sáng tạo, phát triển bền vững và hội nhập toàn cầu, GISA định vị trụ cột thúc đẩy hợp tác và kết nối như một động lực chiến lược để tạo lập hệ sinh thái tri thức – hành động – chính sách gắn kết chặt chẽ.',
    },
    {
      type: 'paragraph',
      text: 'GISA chủ động thiết kế các cơ chế hợp tác đa ngành, tổ chức các chương trình kết nối xuyên lĩnh vực và xây dựng nền tảng trao đổi liên quốc gia, nhằm phát huy vai trò kết nối giữa nhà nghiên cứu, doanh nghiệp, chuyên gia, nhà hoạch định chính sách và cộng đồng thực hành.',
    },

    { type: 'heading', level: 2, text: 'Các hướng hợp tác chiến lược' },
    { type: 'heading', level: 3, text: 'Chương trình hợp tác nghiên cứu liên ngành và quốc tế' },
    {
      type: 'paragraph',
      text: 'GISA đóng vai trò xúc tác và điều phối các chương trình nghiên cứu hợp tác có chiều sâu giữa các viện trường, tổ chức khoa học – công nghệ và chuyên gia đa lĩnh vực trong nước và quốc tế, nhằm đồng kiến tạo tri thức mới, giải pháp thực tiễn và mô hình triển khai thích ứng.',
    },
    { type: 'heading', level: 3, text: 'Nền tảng kết nối tri thức – thị trường – chính sách' },
    {
      type: 'paragraph',
      text: 'GISA phát triển nền tảng dữ liệu động và hệ thống kết nối giúp liên thông giữa nhà nghiên cứu, doanh nghiệp và cơ quan hoạch định chính sách; tích hợp thông tin nghiên cứu, sáng kiến thị trường và vấn đề chính sách trọng tâm để rút ngắn khoảng cách giữa nghiên cứu và triển khai thực tế.',
    },
    { type: 'heading', level: 3, text: 'Diễn đàn học thuật – chính sách – thị trường' },
    {
      type: 'paragraph',
      text: 'GISA tổ chức các diễn đàn chiến lược kết nối ba trụ cột tác động: học thuật, chính sách và thị trường. Diễn đàn là không gian đối thoại, phân tích, phản biện và đồng kiến tạo nhằm định hình giải pháp, định hướng chính sách và xác định ưu tiên nghiên cứu.',
    },
    { type: 'heading', level: 3, text: 'Chương trình đồng hành khởi nghiệp và đổi mới sáng tạo' },
    {
      type: 'paragraph',
      text: 'GISA hỗ trợ trực tiếp các nhóm khởi nghiệp, doanh nghiệp nhỏ và sáng kiến cộng đồng thông qua cố vấn chuyên môn, huấn luyện mô hình kinh doanh, kết nối chuyên gia và gọi vốn xã hội, đặc biệt với các sáng kiến hướng phát triển bền vững và tác động xã hội.',
    },
    { type: 'heading', level: 3, text: 'Mạng lưới hợp tác công – tư' },
    {
      type: 'paragraph',
      text: 'GISA xây dựng một trung tâm kết nối giữa khu vực công và khu vực tư, hỗ trợ thiết kế và triển khai các mô hình hợp tác linh hoạt, minh bạch và hiệu quả — từ đầu tư cơ sở hạ tầng xã hội đến các sáng kiến đổi mới cộng đồng.',
    },
    { type: 'heading', level: 3, text: 'GISA Bridge — cầu nối chuyên gia và địa phương' },
    {
      type: 'paragraph',
      text: 'GISA Bridge kết nối các nhà khoa học, chuyên gia kỹ thuật, nhà thiết kế và chuyên gia hành vi với các địa phương đang trong quá trình chuyển đổi kinh tế – xã hội, tập trung vào huấn luyện, đồng thiết kế và hỗ trợ triển khai sáng kiến tại chỗ.',
    },
    { type: 'heading', level: 3, text: 'GISA OpenConnect — nền tảng chia sẻ và học tập mở' },
    {
      type: 'paragraph',
      text: 'OpenConnect là hệ sinh thái học tập và chia sẻ mở, nơi mọi cá nhân và tổ chức có thể tiếp cận nguồn tri thức thực tiễn, công cụ ứng dụng và các khóa học liên ngành, gồm nền tảng số, thư viện công cụ, diễn đàn học tập và cộng đồng thực hành.',
    },
    { type: 'heading', level: 3, text: 'Liên minh đổi mới sáng tạo liên vùng – liên ngành' },
    {
      type: 'paragraph',
      text: 'GISA thúc đẩy hình thành và điều phối các liên minh chiến lược giữa các khu vực, lĩnh vực và tổ chức khác biệt, kết hợp các địa phương có tiềm năng phát triển đặc thù, các nhóm ngành chủ lực và các tác nhân trung tâm như doanh nghiệp dẫn dắt, viện nghiên cứu, mạng lưới chuyên gia và tổ chức cộng đồng.',
    },

    { type: 'heading', level: 2, text: 'Tám hình thức kết nối tiêu biểu' },
    { type: 'heading', level: 3, text: 'Đối thoại, chuyên gia và dự án mở' },
    {
      type: 'paragraph',
      text: 'Nhóm hình thức này tạo không gian đối thoại đa bên, kết nối chuyên gia và mở rộng nguồn lực cho nghiên cứu cùng sáng kiến cộng đồng.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Đối thoại chính sách và tư vấn đa bên — diễn đàn, hội thảo và nhóm tư vấn đa bên quy tụ nhà nghiên cứu, doanh nghiệp, cộng đồng và nhà quản lý cùng thảo luận các vấn đề chính sách cụ thể.',
        'Mạng lưới chuyên gia liên lĩnh vực — tập hợp chuyên gia trong kinh tế, công nghệ, môi trường, giáo dục, sức khỏe tinh thần; GISA điều phối và kết nối với các dự án, chính sách và tổ chức có nhu cầu.',
        'Bản đồ nghiên cứu và dự án hợp tác mở — nền tảng số cập nhật, theo dõi và công bố các dự án nghiên cứu, đổi mới, chuyển giao công nghệ và sáng kiến cộng đồng đang triển khai.',
        'Chương trình đồng tài trợ sáng kiến cộng đồng — quỹ đồng tài trợ cùng doanh nghiệp, tổ chức xã hội hoặc chính quyền để hỗ trợ các sáng kiến địa phương có tiềm năng lan tỏa.',
      ],
    },
    { type: 'heading', level: 3, text: 'Học thuật, tri thức và mạng lưới hành động' },
    {
      type: 'paragraph',
      text: 'Nhóm tiếp theo kết nối hợp tác học thuật với chia sẻ tri thức, cố vấn và hành động địa phương vì phát triển bền vững.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Liên minh học thuật – doanh nghiệp — hợp tác lâu dài giữa trường đại học, viện nghiên cứu và doanh nghiệp để cùng phát triển chương trình đào tạo, nghiên cứu ứng dụng và nguồn nhân lực.',
        'Nền tảng học tập mở và chia sẻ tri thức — hệ sinh thái số cho phép chia sẻ bộ công cụ, dữ liệu, khóa học ngắn, tài nguyên học thuật và mô hình triển khai.',
        'Mô hình cố vấn và kết nối học tập — kết nối cố vấn giữa chuyên gia với nhóm khởi nghiệp, cán bộ địa phương hoặc học viên cao học, kèm hình thức học tập ngang hàng.',
        'Liên kết mạng lưới hành động vì các mục tiêu phát triển bền vững — hình thành mạng lưới hành động tại cấp địa phương để chia sẻ sáng kiến, hỗ trợ kỹ thuật và kết nối chính sách – thực tiễn – cộng đồng.',
      ],
    },
  ],

  '/mang-luoi/quy-nha-tai-tro': [
    {
      type: 'paragraph',
      text: 'Nguồn lực từ các quỹ, tổ chức học thuật và đối tác đã góp phần mở rộng năng lực nghiên cứu của GISA. Dưới đây là những đơn vị được ghi nhận trong thông tin mạng lưới đã công bố.',
    },
    {
      type: 'linkGroup',
      links: [
        { label: 'Quỹ Phát triển Nông nghiệp Quốc tế (IFAD)', href: 'https://www.ifad.org/en/' },
        { label: 'Đại học Kinh tế Thành phố Hồ Chí Minh (UEH)', href: 'https://www.ueh.edu.vn/' },
        { label: 'Hội đồng Anh (British Council)', href: 'https://www.britishcouncil.org/' },
        { label: 'Tổ chức Lao động Quốc tế (ILO)', href: 'https://www.ilo.org/' },
        {
          label: 'Chương trình Horizon 2020, Liên minh châu Âu',
          href: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/programmes/h2020',
        },
        { label: 'Bộ Giáo dục và Đào tạo', href: 'https://www.moet.gov.vn/' },
        { label: 'Sở Khoa học và Công nghệ Thành phố Hồ Chí Minh', href: 'https://dost.hochiminhcity.gov.vn/' },
        { label: 'Sở Khoa học và Công nghệ Bến Tre', href: 'http://www.dost-bentre.gov.vn/' },
        { label: 'PARC Mall', href: 'https://www.parcmall.com.vn/' },
        { label: 'Saky Foods', href: 'https://sakyfoods.com/' },
        { label: 'Trung Quy', href: 'https://trungquy.com.vn/' },
      ],
    },
  ],
};
