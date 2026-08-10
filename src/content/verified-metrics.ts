/**
 * Số liệu đã xác minh cho sáu plate của "TRI THỨC TẠO CHUYỂN BIẾN".
 *
 * Đây là nguồn duy nhất được phép cấp số cho giao diện. Mọi giá trị ở đây đều
 * là **số mục đếm được trên một trang cụ thể tại một ngày cụ thể** — không phải
 * số hoạt động, số kết quả, hay số học viên.
 *
 * Ba câu hỏi mỗi con số phải trả lời được, và đều nằm trong `JourneyMetric`:
 *   - chốt ngày nào        → `period`, `updatedAt`
 *   - đếm/đo thế nào       → `scopeNote`
 *   - mở đâu để đếm lại    → `sourceLabel`, `sourcePath`
 *
 * Thiếu bất kỳ trường nào thì không được render. Dữ liệu chưa tồn tại dùng
 * `null`, không bao giờ dùng `0` — `0` là một phép đo, `null` là sự vắng mặt
 * của phép đo.
 *
 * Nội dung định tính (taxonomy) nằm ở các mảng riêng bên dưới và **không** đi
 * qua `JourneyMetric`: một danh mục sáu lĩnh vực không phải là số sáu.
 *
 * Xem `docs/data-replacement-report.md` và
 * `docs/unsupported-data-findings.md` để biết những gì đã bị gỡ bỏ và vì sao.
 */

/**
 * Hợp đồng bắt buộc cho mọi số xuất bản.
 *
 * `label` là phần hiển thị; `metric` là định danh máy đọc, cố tình khác nhau vì
 * tên hiển thị có thể chỉnh lời còn định danh thì không được đổi khi đối chiếu
 * lại nguồn.
 */
export interface JourneyMetric {
  /** Nhãn ngắn hiển thị cạnh con số. */
  label: string;
  /** Định danh máy đọc của phép đếm. */
  metric: string;
  period: string;
  /** Phạm vi đếm — viết để con số không thể bị đọc rộng hơn thực tế. */
  scopeNote: string;
  sourceLabel: string;
  sourcePath: string;
  unit: string;
  updatedAt: string;
  value: number;
}

/**
 * Sáu con số duy nhất được phép hiển thị hôm nay.
 *
 * Tất cả đều là phép đếm thủ công trên trang công khai của GISA, chốt cùng một
 * ngày. Không có con số nào ở đây mô tả kết quả hoạt động — chúng mô tả nội
 * dung website, và `scopeNote` nói đúng điều đó.
 */
export const verifiedJourneyMetrics: JourneyMetric[] = [
  {
    label: 'Khóa học',
    metric: 'publishedCourses',
    period: 'Nội dung đang đăng, cập nhật 2026-08-06',
    scopeNote:
      'Số khóa học đang đăng trên website này, thuộc năm chương trình Core, Edge, Rise, Ascend và Legacy. Là số khóa được giới thiệu, không phải số lớp đã tổ chức hay số học viên.',
    sourceLabel: 'Danh mục khóa học',
    sourcePath: '/khoa-hoc',
    unit: 'khóa học',
    updatedAt: '2026-08-06',
    value: 49,
  },
  {
    label: 'Tổ chức đối tác',
    metric: 'publishedPartners',
    period: 'Nội dung đang đăng, cập nhật 2026-08-06',
    scopeNote:
      'Số tổ chức trong bộ logo đối tác GISA cung cấp. Loại quan hệ, dự án liên quan và giai đoạn hợp tác chưa được công bố cho từng tổ chức.',
    sourceLabel: 'Danh sách đối tác',
    sourcePath: '/mang-luoi/doi-tac',
    unit: 'tổ chức',
    updatedAt: '2026-08-06',
    value: 48,
  },
  {
    label: 'Chuyên gia & giảng viên',
    metric: 'publishedExpertProfiles',
    period: 'Nội dung đang đăng, cập nhật 2026-08-06',
    scopeNote:
      'Số hồ sơ chuyên gia và giảng viên đang đăng. Không xác nhận tình trạng hợp đồng hay mức độ tham gia của từng người.',
    sourceLabel: 'Đội ngũ chuyên gia',
    sourcePath: '/chuyen-gia',
    unit: 'hồ sơ',
    updatedAt: '2026-08-06',
    value: 20,
  },
  {
    label: 'Ấn phẩm khoa học',
    metric: 'publishedPublications',
    period: 'Nội dung đang đăng, cập nhật 2026-08-06',
    scopeNote:
      'Số ấn phẩm có thông tin tạp chí, năm và trích dẫn đối chiếu được với bản ghi Crossref của nhà xuất bản.',
    sourceLabel: 'Bài báo khoa học',
    sourcePath: '/nghien-cuu/bai-bao-khoa-hoc',
    unit: 'ấn phẩm',
    updatedAt: '2026-08-06',
    value: 14,
  },
  {
    label: 'Sáng kiến cộng đồng',
    metric: 'publishedInitiatives',
    period: 'Nội dung đang đăng, cập nhật 2026-08-06',
    scopeNote:
      'Số sáng kiến thuộc nhánh Kinh tế bền vững, mỗi sáng kiến có trang giới thiệu riêng trên trang nguồn GISA.',
    sourceLabel: 'Sáng kiến cộng đồng',
    sourcePath: '/cong-dong/kinh-te-ben-vung',
    unit: 'sáng kiến',
    updatedAt: '2026-08-06',
    value: 12,
  },
  {
    label: 'Dự án nghiên cứu',
    metric: 'publishedResearchProjects',
    period: 'Nội dung đang đăng, cập nhật 2026-08-06',
    scopeNote:
      'Số dự án nghiên cứu có trang giới thiệu riêng. Không phải tổng số dự án GISA từng tham gia.',
    sourceLabel: 'Dự án nghiên cứu',
    sourcePath: '/nghien-cuu/du-an',
    unit: 'dự án',
    updatedAt: '2026-08-06',
    value: 4,
  },
];

/**
 * Bốn con số được đưa lên bảng bằng chứng.
 *
 * Cả sáu phép đếm đều có giá trị, nhưng đặt cả sáu cạnh nhau trên một hàng thì
 * người xem không đọc được con số nào — chúng thành một khối chữ số. Bốn con số
 * lớn nhất và khác đơn vị nhau được lên bảng; hai con số còn lại (sáng kiến, dự
 * án) đã có mặt ở chính hai plate nói về chúng, nên nhắc lại chỉ tạo trùng lặp.
 */
const displayedMetricIds = [
  'publishedCourses',
  'publishedPartners',
  'publishedExpertProfiles',
  'publishedPublications',
] as const;

export const displayedJourneyMetrics = verifiedJourneyMetrics.filter((metric) =>
  (displayedMetricIds as readonly string[]).includes(metric.metric),
);

// ---------------------------------------------------------------------------
// Taxonomy — danh mục, không phải phép đo
// ---------------------------------------------------------------------------

/**
 * Sáu lĩnh vực tư vấn GISA công bố.
 *
 * Đây là taxonomy, không phải điểm trưởng thành hay thứ hạng. `listedItems`
 * chỉ đếm số hạng mục dịch vụ nằm trong danh sách công khai của từng lĩnh vực
 * tại `src/content/static-blocks/tu-van.ts`; nó không đo quy mô, hiệu quả hay
 * mức độ ưu tiên. Tổng hiện tại là 29 hạng mục.
 *
 * GISA có nhắc ESG, CSV và CSR trong phạm vi tư vấn phát triển bền vững, nhưng
 * không có bằng chứng nào cho thấy sáu nhóm này được dựng hoặc chấm điểm theo
 * GRI, ISO 26000, SASB hay một khung định lượng nội bộ. Không được gắn các tiêu
 * chuẩn đó vào plate.
 *
 * Nguồn: https://gisa.edu.vn/linh-vuc-tu-van
 */
export const consultingPillars = [
  {
    listedItems: 4,
    pillar: 'Phát triển bền vững',
    relationType: 'Lĩnh vực tư vấn do GISA công bố',
  },
  {
    listedItems: 5,
    pillar: 'Quản lý và kinh doanh',
    relationType: 'Lĩnh vực tư vấn do GISA công bố',
  },
  {
    listedItems: 5,
    pillar: 'Tâm lý học hành vi',
    relationType: 'Lĩnh vực tư vấn do GISA công bố',
  },
  {
    listedItems: 5,
    pillar: 'Phát triển nhân lực và tổ chức',
    relationType: 'Lĩnh vực tư vấn do GISA công bố',
  },
  {
    listedItems: 4,
    pillar: 'Kinh tế thực phẩm, nông nghiệp và nông thôn',
    relationType: 'Lĩnh vực tư vấn do GISA công bố',
  },
  {
    listedItems: 6,
    pillar: 'Chính sách phát triển kinh tế',
    relationType: 'Lĩnh vực tư vấn do GISA công bố',
  },
] as const;

/**
 * Bốn hướng ứng dụng và chuyển giao GISA công bố.
 *
 * `basis` ghi thẳng vào dữ liệu rằng không có trọng số, để không ai đọc bề dày
 * dải Sankey như tỷ trọng. Plate vẽ bốn dải dày bằng nhau.
 *
 * Nguồn: https://gisa.edu.vn/linh-vuc-ung-dung
 */
export const applicationStreams = [
  {
    basis: 'Lĩnh vực ứng dụng do GISA công bố; không có trọng số',
    label: 'Mô hình quản lý & kinh doanh tiên tiến',
  },
  {
    basis: 'Lĩnh vực ứng dụng do GISA công bố; không có trọng số',
    label: 'Giải pháp khoa học & công nghệ đổi mới',
  },
  {
    basis: 'Lĩnh vực ứng dụng do GISA công bố; không có trọng số',
    label: 'Sáng kiến phát triển kinh tế bền vững',
  },
  {
    basis: 'Lĩnh vực ứng dụng do GISA công bố; không có trọng số',
    label: 'Khung tâm lý & phát triển con người toàn diện',
  },
] as const;

/**
 * Năm chương trình đào tạo GISA, theo thứ tự trình độ trong tài liệu nội dung.
 *
 * `listedCourses` trước đây chỉ có số cho GISA Core, bốn chương trình còn lại là
 * `null` vì trang nguồn cũ không công bố danh mục. Nay cả năm danh mục đã được
 * biên tập và đăng lên chính website này, nên phép đếm chuyển sang một nguồn chắc
 * hơn hẳn: số khóa đang đăng ở `/khoa-hoc`, lọc theo `metadata.program`.
 *
 * `src/content/verified-metrics.test.ts` đối chiếu từng con số với fixture khóa
 * học, nên nếu ai thêm hoặc bớt khóa mà quên sửa ở đây thì test đỏ.
 *
 * Vẫn không có trục thời gian: website không công bố thời lượng của bất kỳ chương
 * trình nào, nên vẽ trục tháng là bịa.
 */
export const trainingPathway = [
  {
    listedCourses: 15,
    name: 'GISA Core',
    slug: 'dao-tao-chuyen-mon-gisa-core',
    subtitle: 'Đào tạo chuyên môn',
  },
  {
    listedCourses: 8,
    name: 'GISA Edge',
    slug: 'trai-nghiem-thuc-chien-gisa-edge',
    subtitle: 'Trải nghiệm thực chiến',
  },
  {
    listedCourses: 8,
    name: 'GISA Rise',
    slug: 'but-pha-su-nghiep-gisa-rise',
    subtitle: 'Bứt phá sự nghiệp',
  },
  {
    listedCourses: 8,
    name: 'GISA Ascend',
    slug: 'lanh-dao-thanh-cong-gisa-ascend',
    subtitle: 'Lãnh đạo thành công',
  },
  {
    listedCourses: 10,
    name: 'GISA Legacy',
    slug: 'su-nghiep-vien-man-gisa-legacy',
    subtitle: 'Sự nghiệp viên mãn',
  },
] as const;

/**
 * Bốn nhóm trong mạng lưới, mỗi nhóm là một phép đếm riêng trên một trang riêng.
 *
 * Không được cộng thành "44 thành viên mạng lưới": bốn nhóm dùng bốn đơn vị
 * khác nhau (hồ sơ / tổ chức / dự án / thực thể được liệt kê), có khả năng
 * trùng lặp giữa các trang, dự án không phải tổ chức, và "được liệt kê" không
 * đồng nghĩa với quan hệ đang hoạt động.
 */
export const verifiedNetworkClusters = [
  {
    clusterName: 'Chuyên gia & giảng viên',
    memberCount: 20,
    relationType: 'Hồ sơ cá nhân được GISA công bố',
    unit: 'hồ sơ',
  },
  {
    clusterName: 'Tổ chức đối tác',
    memberCount: 48,
    namedMembers: [
      'Đại học Wageningen',
      'Đại học Newcastle',
      'Đại học Corvinus Budapest',
      'Đại học Kent',
      'Đại học Bonn',
      'FAO',
      'INRAE',
      'CREA',
      'Viện Thünen',
    ],
    relationType:
      'Tổ chức trong bộ logo đối tác GISA cung cấp; loại quan hệ cụ thể chưa được công bố',
    unit: 'tổ chức',
  },
  {
    clusterName: 'Dự án nghiên cứu nổi bật',
    memberCount: 4,
    namedMembers: ['TRADE4SD', 'VALUMICS', 'Strength2Food', 'British Council'],
    relationType: 'Dự án có trang giới thiệu trên website GISA',
    unit: 'dự án',
  },
  {
    clusterName: 'Quỹ & nhà tài trợ được liệt kê',
    memberCount: 11,
    relationType: 'Được đặt dưới tiêu đề Quỹ & Nhà Tài Trợ; chưa xác minh loại quan hệ',
    unit: 'thực thể',
  },
] as const;

// ---------------------------------------------------------------------------
// 01 — Danh mục nghiên cứu
// ---------------------------------------------------------------------------

export interface ResearchItem {
  citationCheckedAt: string | null;
  citationCount: number | null;
  citationSource: string | null;
  /** `null` khi mô tả trong danh mục không đủ để phân loại chắc chắn. */
  crossDisciplinary: boolean | null;
  /** Lý do phân loại, bắt buộc khi `crossDisciplinary` không phải `null`. */
  disciplinaryBasis: string | null;
  id: string;
  title: string;
  /** `null` khi danh mục không ghi năm công bố. Không được đoán. */
  year: number | null;
}

/**
 * 14 bài trong bộ tổng hợp nghiên cứu GISA.
 *
 * `citationCount` là `null` cho cả 14 bài: chưa có lần đối chiếu nào với
 * OpenAlex, Crossref hay trang tạp chí, nên plate không có trục trích dẫn. Bốn
 * bài có DOI trong danh mục (STT 1, 4, 5, 6) — đó là điểm bắt đầu khi ai đó
 * chạy lượt đối chiếu thật.
 *
 * `year` là `null` cho 7 bài mà danh mục không ghi năm. Bài STT 12 ghi
 * "1997–2014": đó là kỳ dữ liệu của nghiên cứu, không phải năm công bố, nên nó
 * cũng vào nhóm chưa xác định.
 *
 * `crossDisciplinary` là **phân loại nội bộ** đọc từ cột "Nội dung và kết quả
 * chính" của chính danh mục, đối chiếu với năm lĩnh vực nghiên cứu GISA:
 * phát triển bền vững; quản lý và kinh doanh; kinh tế thực phẩm, nông nghiệp và
 * nông thôn; phát triển nguồn nhân lực; tâm lý học. GISA chưa công bố phân loại
 * nào như vậy — `disciplinaryBasis` là để người khác mở bài ra và bác bỏ được.
 *
 * Nguồn: `content-data/gisa_research_collection/danh_sach_14_bai_nghien_cuu.csv`
 */
export const researchItems: ResearchItem[] = [
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: true,
    disciplinaryBasis:
      'Mô hình chuẩn đối sánh gồm cả cấu phần Quản lý và cấu phần Bền vững cho doanh nghiệp đồ gỗ — quản lý và kinh doanh cùng phát triển bền vững.',
    id: 'benchmarking-pms',
    title:
      'Nghiên cứu phát triển mô hình chuẩn đối sánh (Benchmarking) đo lường hiệu suất hoạt động: Phân tích trường hợp các doanh nghiệp Việt Nam',
    year: 2023,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: false,
    disciplinaryBasis:
      'Chỉ thuộc kinh tế thực phẩm: so sánh chênh giá giữa sản phẩm có và không có chương trình chất lượng.',
    id: 'food-quality-price-premium',
    title: 'Các chương trình chất lượng thực phẩm và phí bảo hiểm giá: rộng có đi cùng nhau không?',
    year: 2020,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: false,
    disciplinaryBasis:
      'Chỉ thuộc kinh tế nông nghiệp: bản đồ chuỗi giá trị và năng lực cạnh tranh của một ngành hàng.',
    id: 'pomelo-value-chain-2015',
    title:
      'Phân tích chuỗi giá trị và đánh giá năng lực cạnh tranh của ngành bưởi da xanh tại Bến Tre, Việt Nam',
    year: 2015,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: true,
    disciplinaryBasis:
      'Đo trí tuệ cảm xúc, niềm tin và cam kết quan hệ của khách hàng trong bối cảnh dịch vụ — tâm lý học cùng quản lý và kinh doanh.',
    id: 'ai-chatbot-experience',
    title:
      'Nâng cao trải nghiệm khách hàng với chatbot vận hành bởi AI: Vai trò của chất lượng dịch vụ, trí tuệ cảm xúc và sự cá nhân hóa của thuật toán',
    year: 2023,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: true,
    disciplinaryBasis:
      'Dùng mô hình hành vi COM-B để giải thích tiêu dùng sữa bền vững — tâm lý học cùng phát triển bền vững.',
    id: 'sustainable-dairy-com-b',
    title:
      'Nghiên cứu khám phá động lực và rào cản đối với hành vi tiêu dùng sữa bền vững tại Việt Nam: Ứng dụng mô hình COM-B',
    year: 2023,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: true,
    disciplinaryBasis:
      'Đo mức sẵn sàng chi trả của người tiêu dùng cho nhãn phúc lợi động vật — kinh tế thực phẩm cùng tâm lý học hành vi.',
    id: 'animal-welfare-wtp',
    title:
      'Nghiên cứu sự sẵn sàng trả tiền đối với nhãn thực phẩm phúc lợi động vật: Ứng dụng phương pháp thí nghiệm lựa chọn',
    year: 2023,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: false,
    disciplinaryBasis:
      'Chỉ thuộc kinh tế nông nghiệp: so sánh lợi thế so sánh của ba loại cây trồng bằng DRC, SCB và PAM.',
    id: 'alternative-crops',
    title:
      'Lợi thế so sánh của các loại cây trồng thay thế: Nghiên cứu so sánh ở Bến Tre, Đồng bằng sông Cửu Long, Việt Nam',
    year: null,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: false,
    disciplinaryBasis:
      'Chỉ thuộc kinh tế nông nghiệp: chỉ số RCA, NRCA, RTA cho năng lực cạnh tranh xuất khẩu.',
    id: 'rca-nrca-competitiveness',
    title:
      'Năng lực cạnh tranh nông nghiệp của Việt Nam theo các chỉ số RCA và NRCA và tính nhất quán của các chỉ số năng lực cạnh tranh',
    year: null,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: true,
    disciplinaryBasis:
      'Đánh giá cùng lúc hiệu quả kinh tế, môi trường, xã hội và quản trị của các hệ thống chất lượng — kinh tế thực phẩm cùng phát triển bền vững.',
    id: 'eu-food-quality-sustainability',
    title:
      'Tính bền vững của các chương trình chất lượng thực phẩm châu Âu: Đa hiệu suất, cơ cấu và quản trị các hệ thống PDO, PGI và nông sản hữu cơ',
    year: null,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: true,
    disciplinaryBasis:
      'Đo đồng thời ba chiều kinh tế, môi trường và xã hội của chuỗi cung ứng — kinh tế thực phẩm cùng phát triển bền vững.',
    id: 'short-food-supply-chains-measurement',
    title: 'Đo lường tính bền vững về kinh tế, môi trường và xã hội của chuỗi cung ứng thực phẩm ngắn hạn',
    year: null,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: false,
    disciplinaryBasis: 'Chỉ thuộc kinh tế nông nghiệp: cơ cấu thương mại nội ngành và liên ngành.',
    id: 'intra-industry-trade',
    title: 'Động lực của thương mại nội ngành nông nghiệp: Một nghiên cứu điển hình toàn diện ở Việt Nam',
    year: null,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: false,
    disciplinaryBasis:
      'Chỉ thuộc kinh tế nông nghiệp: chỉ số Lafay cho chuyên môn hóa thương mại. Danh mục ghi "1997–2014" là kỳ dữ liệu, không phải năm công bố.',
    id: 'trade-specialisation',
    title:
      'Nghiên cứu sự phát triển của chuyên môn hóa thương mại nông nghiệp ở các nền kinh tế chuyển đổi: Nghiên cứu trường hợp từ Việt Nam',
    year: null,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: false,
    disciplinaryBasis:
      'Chỉ thuộc kinh tế nông nghiệp: chi phí, lợi nhuận và giá trị gia tăng dọc một chuỗi giá trị.',
    id: 'pomelo-value-chain-2016',
    title: 'Nghiên cứu chuỗi giá trị bưởi da xanh Bến Tre',
    year: 2016,
  },
  {
    citationCheckedAt: null,
    citationCount: null,
    citationSource: null,
    crossDisciplinary: true,
    disciplinaryBasis:
      'Khung sáu trụ cột và 28 chỉ số phủ thu nhập, việc làm, công bằng, sức khỏe và ô nhiễm — kinh tế thực phẩm cùng phát triển bền vững.',
    id: 'short-food-supply-chains-framework',
    title: 'Chuỗi cung ứng thực phẩm ngắn hạn: Động lực bền vững và bình đẳng cho tương lai',
    year: null,
  },
];

// ---------------------------------------------------------------------------
// 06 — Chưa có dữ liệu
// ---------------------------------------------------------------------------

/*
 * Sáu chỉ số tác động cộng đồng — số hoạt động cộng đồng, số tổ chức được tư vấn,
 * số người tiếp cận, kết quả kinh tế, kết quả xã hội, kết quả môi trường — chưa
 * có nguồn công khai nào nêu ra, nên KHÔNG có dữ liệu ở đây.
 *
 * Trước đây chỗ này là hai hằng số `pendingCommunityMetrics` (toàn `null`) và
 * `pendingCommunityLabels`, không nơi nào import. Chúng chỉ là ghi chú đội lốt dữ
 * liệu, và giữ dạng dữ liệu thì sớm muộn cũng có người render chúng ra số.
 *
 * Khi GISA công bố số thật: thêm vào `verifiedJourneyMetrics` cùng `sourcePath`
 * và `scopeNote` như mọi phép đếm khác. Tuyệt đối không render `null` thành `0`,
 * thanh tiến độ, cung tròn bề dày khác nhau hay chỉ số tổng hợp — website GISA chỉ
 * mô tả định hướng (phúc lợi xã hội, bảo vệ môi trường, phát triển bền vững, đóng
 * góp cộng đồng), không có dữ liệu theo kỳ.
 */
