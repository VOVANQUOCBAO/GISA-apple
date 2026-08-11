import type { ContentRecord } from '../types';

export const projectFixtures = [
  {
    id: 'project-trade4sd',
    kind: 'project',
    collection: 'projects',
    slug: 'trade4sd',
    path: '/nghien-cuu/du-an/trade4sd',
    locale: 'vi',
    translationKey: 'project-trade4sd',
    title: 'TRADE4SD',
    summary:
      'Sáng kiến nghiên cứu hành động do Horizon Europe tài trợ, khai thác thương mại quốc tế như một công cụ thúc đẩy phát triển bền vững trong nông nghiệp và thực phẩm.',
    body: [
      {
        type: 'paragraph',
        text: 'TRADE4SD là sáng kiến nghiên cứu hành động được tài trợ bởi Horizon Europe, nhằm khai thác tiềm năng của thương mại quốc tế như một công cụ thúc đẩy phát triển bền vững, đặc biệt trong lĩnh vực nông nghiệp và thực phẩm.',
      },
      {
        type: 'paragraph',
        text: 'Dự án phân tích mối quan hệ giữa thương mại, môi trường và các mục tiêu phát triển bền vững (SDGs), đồng thời xây dựng các công cụ chính sách và mô hình thực nghiệm hỗ trợ các quốc gia trong việc hình thành chuỗi giá trị hội nhập, bền vững và bao trùm.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Tác động nổi bật',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Làm rõ mối liên kết giữa thương mại nông sản và các mục tiêu phát triển bền vững.',
          'Gợi mở hướng đi cho các chính sách thương mại công bằng, thân thiện với môi trường.',
          'Hỗ trợ quốc gia đang phát triển nâng cao năng lực hội nhập thị trường toàn cầu theo hướng bền vững và trách nhiệm xã hội.',
        ],
      },
      {
        type: 'linkGroup',
        links: [{ label: 'Trang chính thức của dự án TRADE4SD', href: 'https://www.trade4sd.eu/' }],
      },
    ],
    tags: ['nghiên cứu', 'phát triển bền vững', 'thương mại nông sản'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://www.gisa.edu.vn/du-an-nghien-cuu',
    sourceLabel: 'Website công khai GISA — mục dự án TRADE4SD',
    checkedAt: '2026-08-05',
    metadata: {
      projectType: 'Nghiên cứu',
      topic: 'Phát triển bền vững',
      context:
        'Thương mại quốc tế trong nông nghiệp và thực phẩm gắn với các mục tiêu phát triển bền vững',
      method:
        'Nghiên cứu hành động, xây dựng công cụ chính sách và mô hình thực nghiệm',
    },
  },
  {
    id: 'project-valumics',
    kind: 'project',
    collection: 'projects',
    slug: 'valumics',
    path: '/nghien-cuu/du-an/valumics',
    locale: 'vi',
    translationKey: 'project-valumics',
    title: 'VALUMICS',
    summary:
      'Dự án liên ngành thuộc Horizon 2020, phân tích cấu trúc chuỗi cung ứng thực phẩm và cách giá trị được phân bổ giữa các bên tham gia.',
    body: [
      {
        type: 'paragraph',
        text: 'Là dự án liên ngành thuộc Horizon 2020, VALUMICS hướng đến hiểu sâu và cải thiện tính toàn vẹn của chuỗi giá trị thực phẩm thông qua việc phân tích cấu trúc chuỗi cung ứng, phân bổ giá trị, quyền lực thương lượng và các yếu tố ảnh hưởng đến công bằng hệ thống.',
      },
      {
        type: 'paragraph',
        text: 'Dự án tích hợp mô hình phân tích hệ thống, dữ liệu lớn và phương pháp nghiên cứu hành vi để hỗ trợ hoạch định chính sách chuỗi giá trị bền vững hơn.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Tác động nổi bật',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Cung cấp bằng chứng khoa học về sự bất bình đẳng và bất cân xứng trong phân bổ giá trị trong chuỗi thực phẩm.',
          'Hỗ trợ thiết kế chính sách nhằm gia tăng tính minh bạch và công bằng cho các bên liên quan.',
          'Đóng góp vào nâng cao khả năng phục hồi và tính bền vững dài hạn của hệ thống thực phẩm toàn cầu.',
        ],
      },
      {
        type: 'linkGroup',
        links: [{ label: 'Trang chính thức của dự án VALUMICS', href: 'https://valumics.eu/' }],
      },
    ],
    tags: ['nghiên cứu', 'chuỗi giá trị thực phẩm', 'Horizon 2020'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://www.gisa.edu.vn/du-an-nghien-cuu',
    sourceLabel: 'Website công khai GISA — mục dự án VALUMICS',
    checkedAt: '2026-08-05',
    metadata: {
      projectType: 'Nghiên cứu',
      topic: 'Chuỗi giá trị thực phẩm',
      context:
        'Tính toàn vẹn và công bằng trong phân bổ giá trị của chuỗi cung ứng thực phẩm châu Âu',
      method:
        'Phân tích hệ thống, dữ liệu lớn và nghiên cứu hành vi',
    },
  },
  {
    id: 'project-strength2food',
    kind: 'project',
    collection: 'projects',
    slug: 'strength2food',
    path: '/nghien-cuu/du-an/strength2food',
    locale: 'vi',
    translationKey: 'project-strength2food',
    title: 'Strength2Food',
    summary:
      'Dự án Horizon 2020 nghiên cứu tác động của nhãn hiệu chất lượng thực phẩm và chính sách mua sắm công bền vững.',
    body: [
      {
        type: 'paragraph',
        text: 'Dự án Strength2Food, thuộc Chương trình Horizon 2020 của Liên minh Châu Âu, tập trung vào việc cải thiện tính bền vững và hiệu quả kinh tế – xã hội của hệ thống thực phẩm thông qua việc thúc đẩy nhãn hiệu chất lượng thực phẩm (Geographical Indications – GIs) và chính sách mua sắm công bền vững.',
      },
      {
        type: 'paragraph',
        text: 'Dự án kết hợp nghiên cứu định tính và định lượng để đánh giá tác động của các cơ chế chất lượng tới hành vi tiêu dùng, thu nhập của người sản xuất và hiệu quả chuỗi cung ứng.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Tác động nổi bật',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Tăng cường vai trò của nhãn hiệu chất lượng trong cải thiện thu nhập nông hộ và năng lực cạnh tranh nông sản địa phương.',
          'Góp phần định hình chính sách mua sắm công hướng đến phát triển bền vững.',
          'Thúc đẩy nhận thức xã hội về tiêu dùng có trách nhiệm và nguồn gốc thực phẩm.',
        ],
      },
      {
        type: 'linkGroup',
        links: [
          { label: 'Trang chính thức của dự án Strength2Food', href: 'https://www.strength2food.eu/' },
        ],
      },
    ],
    tags: ['nghiên cứu', 'nhãn hiệu chất lượng', 'Horizon 2020'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://www.gisa.edu.vn/du-an-nghien-cuu',
    sourceLabel: 'Website công khai GISA — mục dự án Strength2Food',
    checkedAt: '2026-08-05',
    metadata: {
      projectType: 'Nghiên cứu',
      topic: 'Hệ thống thực phẩm bền vững',
      context:
        'Nhãn hiệu chất lượng thực phẩm và chính sách mua sắm công tại Liên minh châu Âu',
      method:
        'Kết hợp nghiên cứu định tính và định lượng để đánh giá tác động',
    },
  },
  {
    id: 'project-british-council-vietnam',
    kind: 'project',
    collection: 'projects',
    slug: 'british-council-viet-nam',
    path: '/nghien-cuu/du-an/british-council-viet-nam',
    locale: 'vi',
    translationKey: 'project-british-council-vietnam',
    title: 'British Council Việt Nam',
    summary:
      'Sáng kiến hợp tác giữa Đại học Newcastle và các đối tác Việt Nam nhằm nâng cao giá trị gia tăng cho ngành rau quả tươi.',
    body: [
      {
        type: 'paragraph',
        text: 'Dự án British Council Việt Nam là một sáng kiến hợp tác giữa Đại học Newcastle (Vương quốc Anh) và các đối tác tại Việt Nam nhằm thúc đẩy giá trị gia tăng trong ngành nông sản, đặc biệt là lĩnh vực rau quả tươi.',
      },
      {
        type: 'paragraph',
        text: 'Dự án kết hợp giữa công nghệ nông nghiệp chính xác và phân tích chuỗi giá trị toàn cầu để nâng cao năng suất, chất lượng và khả năng cạnh tranh của sản phẩm nông nghiệp Việt Nam trên thị trường quốc tế.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Tác động nổi bật',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Thúc đẩy đổi mới nông nghiệp. Dự án hỗ trợ nông dân tiếp cận và áp dụng công nghệ chính xác, nâng cao hiệu quả sản xuất.',
          'Nâng cao phân tích chuỗi giá trị. Dự án giúp xác định vị trí và cơ hội nâng cấp nông sản Việt Nam trong chuỗi giá trị toàn cầu.',
          'Ra quyết định dựa trên dữ liệu. Dự án phân tích chi phí – lợi ích và hành vi tiêu dùng để định hướng chiến lược sản xuất – tiêu thụ.',
          'Kết nối nghiên cứu và thực tiễn. Dự án gắn kết nhà khoa học, nông dân và nhà hoạch định chính sách để thúc đẩy hợp tác liên ngành.',
          'Hướng tới phát triển bền vững. Dự án nâng cao chất lượng, giá trị xuất khẩu và khuyến khích sản xuất nông nghiệp thân thiện môi trường.',
        ],
      },
      {
        type: 'linkGroup',
        links: [
          {
            label: 'Trang dự án tại Đại học Newcastle',
            href: 'https://research.ncl.ac.uk/bcvietnamproject/',
          },
        ],
      },
    ],
    tags: ['nghiên cứu', 'nông nghiệp chính xác', 'chuỗi giá trị toàn cầu'],
    evidenceStatus: 'verified',
    sourceUrl: 'https://www.gisa.edu.vn/du-an-nghien-cuu',
    sourceLabel: 'Website công khai GISA — mục dự án British Council',
    checkedAt: '2026-08-05',
    metadata: {
      projectType: 'Nghiên cứu',
      topic: 'Nông nghiệp và chuỗi giá trị',
      context:
        'Ngành rau quả tươi Việt Nam trong chuỗi giá trị nông sản toàn cầu',
      method:
        'Công nghệ nông nghiệp chính xác kết hợp phân tích chuỗi giá trị toàn cầu',
    },
  },
] satisfies ContentRecord[];
