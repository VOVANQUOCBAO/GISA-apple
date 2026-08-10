import type { ContentBlock } from '../types';

/**
 * Nội dung nhánh Tư vấn, lấy từ `2d Web consulting.docx`.
 *
 * `/tu-van/thanh-qua` cố ý không có nội dung mô tả: tài liệu gốc chỉ ghi các
 * hướng còn phải thu thập (lời chứng của doanh nghiệp, kết quả dự án) chứ chưa
 * có dữ liệu đã được phép công bố, và trang tương ứng trên gisa.edu.vn cũng
 * trống. Trang nói rõ tình trạng đó thay vì dựng nội dung chưa có nguồn.
 */
export const tuVanBlocks: Record<string, ContentBlock[]> = {
  '/tu-van/linh-vuc': [
    {
      type: 'paragraph',
      text: 'Tư vấn là một trong những trụ cột chiến lược của GISA, đóng vai trò cầu nối giữa tri thức khoa học và hành động thực tiễn, đồng hành cùng các tổ chức, doanh nghiệp và cá nhân trong việc định hình tương lai một cách chủ động và bền vững.',
    },
    {
      type: 'paragraph',
      text: 'GISA cung cấp các dịch vụ tư vấn đa dạng, kết hợp linh hoạt giữa tư vấn chuyên môn (consulting), tư vấn phát triển (advising), cố vấn định hướng (mentoring) và huấn luyện cá nhân – tổ chức (coaching). Mỗi hình thức được thiết kế để phù hợp với đặc thù từng đối tượng, từ cơ quan quản lý nhà nước, tổ chức phi lợi nhuận, doanh nghiệp đến lãnh đạo và nhân sự chuyên môn cao.',
    },

    { type: 'heading', level: 2, text: 'Phát triển bền vững' },
    {
      type: 'paragraph',
      text: 'GISA đồng hành cùng doanh nghiệp, cơ quan quản lý nhà nước và tổ chức trong việc định hình chiến lược phát triển bền vững — tích hợp hài hòa giữa hiệu quả kinh tế, công bằng xã hội và bảo vệ môi trường. Chúng tôi không chỉ đưa ra khuyến nghị, mà còn hỗ trợ triển khai thực tế, đo lường tác động và truyền thông bền vững.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Xây dựng và thực thi chiến lược phát triển bền vững dài hạn',
        'Đánh giá và giảm thiểu tác động môi trường',
        'Thiết kế mô hình kinh tế tuần hoàn, chuỗi giá trị xanh',
        'Hướng dẫn áp dụng bộ tiêu chuẩn ESG, CSV (tạo giá trị chung) và CSR (trách nhiệm xã hội doanh nghiệp)',
      ],
    },

    { type: 'heading', level: 2, text: 'Quản lý và kinh doanh' },
    {
      type: 'paragraph',
      text: 'Trong bối cảnh cạnh tranh toàn cầu, đổi mới và khả năng thích ứng là yếu tố sống còn. GISA cung cấp các giải pháp tư vấn đa chiều để nâng cao năng lực quản trị, thiết kế mô hình kinh doanh linh hoạt và xây dựng thương hiệu gắn với giá trị bền vững.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Chiến lược kinh doanh, tái cấu trúc và quản trị tổ chức',
        'Quản lý đổi mới sáng tạo và chuyển đổi số',
        'Xây dựng thương hiệu, chiến lược tiếp thị, truyền thông bền vững',
        'Quản trị vận hành và chuỗi cung ứng',
        'Quản lý tài chính và rủi ro',
      ],
    },

    { type: 'heading', level: 2, text: 'Tâm lý học hành vi' },
    {
      type: 'paragraph',
      text: 'GISA ứng dụng tâm lý học hành vi trong phân tích và thiết kế các giải pháp hành vi hiệu quả — từ giáo dục, truyền thông đến cải thiện môi trường làm việc và chính sách công. Chúng tôi tin rằng hiểu con người, cả về lý trí và cảm xúc, là chìa khóa để thay đổi bền vững.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Tư vấn hành vi trong lãnh đạo, quản lý và phát triển cá nhân',
        'Phân tích hành vi tiêu dùng, xã hội và thiết kế can thiệp hành vi',
        'Tư vấn giáo dục cảm xúc – xã hội trong trường học và môi trường đào tạo',
        'Hỗ trợ cải thiện sức khỏe tâm thần và khả năng thích ứng tổ chức',
        'Phát triển năng lực con người và điều chỉnh hành vi tích cực',
      ],
    },

    { type: 'heading', level: 2, text: 'Phát triển nhân lực và tổ chức' },
    {
      type: 'paragraph',
      text: 'Nguồn nhân lực là tài sản quý giá nhất của mỗi tổ chức. GISA cung cấp các dịch vụ tư vấn phát triển nhân lực với trọng tâm là xây dựng đội ngũ linh hoạt, sáng tạo và gắn kết, đáp ứng những yêu cầu ngày càng cao từ thị trường lao động và xã hội.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Xây dựng chiến lược nhân sự gắn với mục tiêu tổ chức',
        'Thiết kế hệ thống đánh giá hiệu suất làm việc và năng lực cá nhân',
        'Tư vấn chương trình đào tạo và phát triển kỹ năng (reskilling và upskilling)',
        'Hỗ trợ xây dựng văn hóa tổ chức, văn hóa doanh nghiệp',
        'Sức khỏe tinh thần và hạnh phúc tại nơi làm việc',
      ],
    },

    { type: 'heading', level: 2, text: 'Kinh tế thực phẩm, nông nghiệp và nông thôn' },
    {
      type: 'paragraph',
      text: 'GISA kết hợp nghiên cứu định tính – định lượng, khảo sát thực địa và phân tích hệ thống để đưa ra các giải pháp toàn diện cho phát triển nông nghiệp bền vững và hiện đại hóa nông thôn.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Chiến lược nông nghiệp bền vững và sinh kế bao trùm',
        'Phát triển mô hình chuỗi giá trị nông nghiệp công bằng và hiệu quả',
        'An ninh lương thực, quản lý tài nguyên và chất thải nông nghiệp',
        'Xây dựng cộng đồng nông thôn hiện đại, sinh kế bền vững, giảm nghèo và phát triển địa phương',
      ],
    },

    { type: 'heading', level: 2, text: 'Chính sách phát triển kinh tế' },
    {
      type: 'paragraph',
      text: 'GISA cung cấp dịch vụ tư vấn chuyên sâu trong lĩnh vực chính sách phát triển kinh tế, hỗ trợ các cơ quan quản lý nhà nước, tổ chức phát triển và chính quyền địa phương xây dựng, điều chỉnh và thực thi các chính sách kinh tế phù hợp với thực tiễn và xu hướng toàn cầu.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Chính sách kinh tế vĩ mô và phát triển bền vững: tư vấn chiến lược tăng trưởng xanh, kinh tế tuần hoàn, kinh tế số.',
        'Phát triển vùng và địa phương: xây dựng chiến lược phát triển kinh tế vùng gắn kết ngành – địa phương, thu hút đầu tư và nâng cao năng lực cạnh tranh cấp tỉnh.',
        'Phát triển ngành và hệ sinh thái kinh tế: hỗ trợ đổi mới ngành công nghiệp, nông nghiệp, dịch vụ theo chuỗi giá trị và phát triển cụm ngành.',
        'Chính sách hỗ trợ doanh nghiệp và thị trường: thiết kế chính sách cho doanh nghiệp nhỏ và vừa, startup và doanh nghiệp xã hội.',
        'Phát triển nguồn nhân lực và giáo dục – đào tạo: gắn kết đào tạo với nhu cầu thị trường lao động và cơ cấu ngành nghề tương lai.',
        'Đối ngoại kinh tế và hội nhập toàn cầu: phân tích tác động và tận dụng cơ hội từ các hiệp định thương mại tự do, phát triển thương hiệu quốc gia.',
      ],
    },
  ],

  '/tu-van/thanh-qua': [
    {
      type: 'paragraph',
      text: 'Thành quả tư vấn phản ánh cách GISA đồng hành cùng tổ chức để chuyển định hướng thành thay đổi có thể kiểm chứng. Mỗi hồ sơ chỉ được giới thiệu khi khách hàng hoặc đối tác đồng ý công bố.',
    },
    {
      type: 'paragraph',
      text: 'Các hồ sơ sẽ tập trung vào bối cảnh, cách tiếp cận và giá trị đã được bên liên quan xác nhận; thông tin bảo mật của từng dự án luôn được tôn trọng.',
    },
  ],
};
