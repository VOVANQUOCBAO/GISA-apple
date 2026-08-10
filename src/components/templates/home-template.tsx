'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';

import { Icon, type IconName } from '@/components/ui/icon';
import { Illustration, type IllustrationName } from '@/components/ui/illustration';
import type { HomePageModel } from '@/content/home';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './home-template.module.css';
import { ExpertShowcase } from './expert-showcase';
import { KnowledgeJourney } from './knowledge-journey';
import { RisesFoldPanorama } from './rises-fold-panorama';

const gateways: Array<{ icon: IconName; title: string; href: string }> = [
  { icon: 'microscope', title: 'Nghiên cứu', href: '/nghien-cuu' },
  { icon: 'chats', title: 'Tư vấn', href: '/tu-van' },
  { icon: 'graduation', title: 'Đào tạo', href: '/dao-tao' },
  { icon: 'clipboard', title: 'Ứng dụng', href: '/ung-dung' },
  { icon: 'network', title: 'Mạng lưới', href: '/mang-luoi' },
  { icon: 'users', title: 'Cộng đồng', href: '/cong-dong' },
];

const capabilities: Array<{
  art: IllustrationName;
  href: string;
  text: string;
  title: string;
}> = [
  { art: 'applied-research', href: '/nghien-cuu/linh-vuc', title: 'Nghiên cứu & phân tích', text: 'Nghiên cứu ứng dụng và phân tích chính sách dựa trên bằng chứng khoa học và dữ liệu đáng tin cậy.' },
  { art: 'strategic-consulting', href: '/tu-van/linh-vuc', title: 'Tư vấn chiến lược', text: 'Đồng hành cùng tổ chức xây dựng chiến lược và giải pháp phát triển bền vững, phù hợp với bối cảnh và năng lực nội tại.' },
  { art: 'capacity-building', href: '/dao-tao/linh-vuc', title: 'Chuyển giao tri thức & đào tạo', text: 'Nâng cao năng lực cá nhân và tổ chức thông qua các chương trình đào tạo, workshop và cộng đồng thực hành.' },
  { art: 'impact-measurement', href: '/tu-van/cong-cu/cong-cu-nghien-cuu-va-danh-gia', title: 'Đo lường & đánh giá', text: 'Thiết kế hệ thống đo lường và đánh giá tác động giúp tổ chức hiểu rõ kết quả và tối ưu hiệu quả đầu tư.' },
];

const rises = [
  { code: 'R', label: 'Reliability', color: '#00717b', text: 'Đảm bảo chất lượng, tính trung thực và độ tin cậy trong mọi hoạt động.' },
  { code: 'I', label: 'Innovation', color: '#6aa42a', text: 'Khuyến khích sáng tạo, dám nghĩ mới để tạo ra tri thức đột phá.' },
  { code: 'S', label: 'Science', color: '#4f9be8', text: 'Đặt khoa học làm nền tảng, dựa trên phương pháp nghiêm ngặt và minh bạch.' },
  { code: 'E', label: 'Efficiency', color: '#f28a2c', text: 'Tối ưu nguồn lực, quy trình và thời gian để tạo ra giá trị bền vững.' },
  { code: 'S', label: 'Sustainability', color: '#32a65a', text: 'Hướng tới phát triển lâu dài, trách nhiệm với cộng đồng và môi trường.' },
];

// Values, labels and per-column colours follow the metrics board in /public/assets.
const impactStats = [
  { color: '#0d6a75', value: '2030', label: 'Mốc tầm nhìn chiến lược' },
  { color: '#ef5a24', value: '06', label: 'Trụ cột hoạt động' },
  { color: '#1a4fa0', value: '05', label: 'Giá trị nền tảng RISES' },
  { color: '#5c9c2e', value: '04', label: 'Nhóm năng lực cốt lõi' },
];

type KnowledgeKey = 'research' | 'courses' | 'news';

const knowledgeGroups: Record<KnowledgeKey, {
  eyebrow: string;
  href: string;
  itemNoun: string;
  label: string;
  lead: string;
  items: Array<{ displayTitle?: string | string[]; href?: string; image?: string; meta: string; title: string }>;
}> = {
  research: {
    eyebrow: 'Nghiên cứu nổi bật',
    href: '/nghien-cuu/bai-bao-khoa-hoc',
    itemNoun: 'bài nghiên cứu',
    label: 'Bài nghiên cứu',
    lead: 'Bằng chứng khoa học cho những quyết định tốt hơn.',
    // `href` trỏ thẳng tới trang chi tiết trong `src/content/fixtures/publications.ts`.
    items: [
      { displayTitle: ['Đối sánh', 'hiệu suất'], href: '/nghien-cuu/bai-bao-khoa-hoc/mo-hinh-chuan-doi-sanh-do-luong-hieu-suat', image: '/images/knowledge-deck/research-performance-benchmark.webp', meta: 'Quản trị hiệu suất', title: 'Nghiên cứu phát triển mô hình chuẩn đối sánh đo lường hiệu suất hoạt động' },
      { displayTitle: ['Kinh tế', 'thực phẩm'], href: '/nghien-cuu/bai-bao-khoa-hoc/chuong-trinh-chat-luong-thuc-pham-va-phi-bao-hiem-gia', image: '/images/knowledge-deck/research-food-quality.webp', meta: 'Kinh tế thực phẩm', title: 'Các chương trình chất lượng thực phẩm và phí bảo hiểm giá ròng' },
      { displayTitle: ['Chuỗi giá trị', 'Bưởi Da Xanh'], href: '/nghien-cuu/bai-bao-khoa-hoc/chuoi-gia-tri-va-nang-luc-canh-tranh-buoi-da-xanh', image: '/images/knowledge-deck/research-pomelo-value-chain.webp', meta: 'Chuỗi giá trị', title: 'Phân tích chuỗi giá trị và năng lực cạnh tranh ngành Bưởi Da Xanh' },
      { displayTitle: ['Trải nghiệm AI'], href: '/nghien-cuu/bai-bao-khoa-hoc/trai-nghiem-khach-hang-voi-chatbot-ai', image: '/images/knowledge-deck/research-ai-chatbot.webp', meta: 'Trí tuệ nhân tạo', title: 'Nâng cao trải nghiệm khách hàng với chatbot vận hành bởi AI' },
    ],
  },
  courses: {
    eyebrow: 'Tri thức ứng dụng',
    href: '/khoa-hoc',
    itemNoun: 'khóa học',
    label: 'Khóa học',
    lead: 'Học để tạo năng lực thay đổi.',
    items: [
      { displayTitle: ['Bán hàng', 'đa kênh'], image: '/images/knowledge-deck/course-multichannel-sales.webp', meta: 'Kinh doanh & Bán hàng', title: 'Multi-channel & Effective Sales' },
      { displayTitle: ['Logistics', 'thời đại số'], image: '/images/knowledge-deck/course-digital-logistics.webp', meta: 'Vận hành & Logistics', title: 'Quản lý chuỗi cung ứng và logistics trong thời đại số' },
      { displayTitle: ['Nhân sự', 'chiến lược'], image: '/images/knowledge-deck/course-strategic-hr.webp', meta: 'Quản trị nhân sự', title: 'Quản lý nhân sự chiến lược cho tổ chức nhỏ và vừa' },
      { displayTitle: ['Kế toán', '& Thuế'], image: '/images/knowledge-deck/course-accounting-tax.webp', meta: 'Tài chính & Thuế', title: 'Kế toán thực hành và tối ưu hóa thuế' },
      { image: '/images/course-sme-financial-management.png', meta: 'Quản trị doanh nghiệp', title: 'Quản trị tài chính doanh nghiệp vừa và nhỏ' },
      { image: '/images/course-digital-ai-marketing.png', meta: 'Marketing & AI', title: 'Digital & AI Marketing: Tối ưu hóa chiến lược số' },
    ],
  },
  news: {
    eyebrow: 'Tin tức & Góc nhìn',
    href: '/tin-tuc',
    itemNoun: 'tin',
    label: 'Tin mới',
    lead: 'Góc nhìn mới về những chuyển động đang diễn ra.',
    items: [
      { displayTitle: ['Đổi mới', 'viện nghiên cứu'], image: '/images/knowledge-deck/news-research-institute.webp', meta: 'Giáo dục', title: 'Chuyển đổi mô hình viện nghiên cứu và phát triển đại học đẳng cấp' },
      { displayTitle: ['Tài chính', 'khí hậu'], image: '/images/knowledge-deck/news-climate-finance.webp', meta: 'Phát triển bền vững', title: 'Tài chính khí hậu và tài chính phát triển không thể tách rời' },
      { displayTitle: ['Chatbot AI', 'và độ tin cậy'], image: '/images/knowledge-deck/news-ai-reliability.webp', meta: 'Công nghệ', title: 'Sự phụ thuộc vào chatbot AI nhìn từ những gián đoạn dịch vụ' },
      { displayTitle: ['Vật liệu mới', 'cho đại dương'], image: '/images/knowledge-deck/news-ocean-material.webp', meta: 'Môi trường', title: 'Vật liệu mới và triển vọng giảm ô nhiễm nhựa đại dương' },
    ],
  },
};

const knowledgeOrder: KnowledgeKey[] = ['news', 'research', 'courses'];

// One entry per file in `public/icons/logos`, kept in that folder's numeric order.
// The numbering skips 13 — that slot was GISA's own logo, which does not belong in
// a partner network strip and has since been removed from the folder.
// These replaced a single sprite sheet (`banner-global-network.png`) that was
// positioned by percentage — the sprite only covered 14 of the partners and
// broke alignment whenever a tile changed size.
// Số 30 trở đi lấy từ `0 Nội dung Web_GISA/Logo Partner - Renamed`, thư mục logo
// đã được đặt tên tổ chức; các tổ chức có nhiều biến thể logo chỉ lấy một file.
const partners: Array<{ logo: string; name: string }> = [
  { logo: '/icons/logos/01_valumics.png', name: 'VALUMICS' },
  { logo: '/icons/logos/02_trade4sd.png', name: 'Trade4SD' },
  { logo: '/icons/logos/03_university_of_kent.png', name: 'University of Kent' },
  { logo: '/icons/logos/04_strength2food.png', name: 'Strength2Food' },
  { logo: '/icons/logos/05_british_council.png', name: 'British Council' },
  { logo: '/icons/logos/06_universita_di_parma.png', name: 'Università di Parma' },
  { logo: '/icons/logos/07_crea.png', name: 'CREA' },
  { logo: '/icons/logos/08_inrae.png', name: 'INRAE' },
  { logo: '/icons/logos/09_universita_milano.png', name: 'Università degli Studi di Milano' },
  { logo: '/icons/logos/10_luke.png', name: 'Luke — Natural Resources Institute Finland' },
  { logo: '/icons/logos/11_edinburgh_business_school.png', name: 'Edinburgh Business School' },
  { logo: '/icons/logos/12_lumina_consult.png', name: 'Lumina Consult' },
  { logo: '/icons/logos/14_euta.png', name: 'EUTA' },
  { logo: '/icons/logos/15_newcastle_university.png', name: 'Newcastle University' },
  { logo: '/icons/logos/16_ueh_university.png', name: 'UEH University' },
  { logo: '/icons/logos/17_eufic.png', name: 'EUFIC' },
  { logo: '/icons/logos/18_kasetsart_university.png', name: 'Kasetsart University' },
  { logo: '/icons/logos/19_fao.png', name: 'Food and Agriculture Organization of the United Nations' },
  { logo: '/icons/logos/20_university_of_ghana.png', name: 'University of Ghana' },
  { logo: '/icons/logos/21_university_of_sussex.png', name: 'University of Sussex' },
  { logo: '/icons/logos/22_confagricoltura.png', name: 'Confagricoltura' },
  { logo: '/icons/logos/23_creda.png', name: 'CREDA' },
  { logo: '/icons/logos/24_wageningen_university_research.png', name: 'Wageningen University & Research' },
  { logo: '/icons/logos/25_corvinus_university_budapest.png', name: 'Corvinus University of Budapest' },
  { logo: '/icons/logos/26_case.png', name: 'CASE — Center for Social and Economic Research' },
  { logo: '/icons/logos/27_coldiretti.png', name: 'Coldiretti' },
  { logo: '/icons/logos/28_belgrade_faculty_economics.png', name: 'University of Belgrade — Faculty of Economics' },
  { logo: '/icons/logos/29_barilla.png', name: 'Barilla' },
  { logo: '/icons/logos/30_aristotle_university_thessaloniki.png', name: 'Aristotle University of Thessaloniki' },
  { logo: '/icons/logos/31_university_of_bonn.png', name: 'University of Bonn' },
  { logo: '/icons/logos/32_zagreb_faculty_economics_business.png', name: 'University of Zagreb — Faculty of Economics and Business' },
  { logo: '/icons/logos/33_zagreb_faculty_food_technology.jpg', name: 'University of Zagreb — Faculty of Food Technology and Biotechnology' },
  { logo: '/icons/logos/34_sifo_oslo_akershus.jpg', name: 'SIFO — Oslo and Akershus University College' },
  { logo: '/icons/logos/35_thuenen_institute.jpg', name: 'Thünen Institute' },
  // Thư mục nguồn có cả logo INRA lẫn INRAE, nhưng đó là cùng một viện: INRA sáp
  // nhập IRSTEA năm 2020 thành INRAE. Chỉ giữ INRAE ở số 08 để dải logo không hiện
  // thương hiệu cũ và mới của một đối tác thành hai ô.
  { logo: '/icons/logos/37_fare.png', name: 'FARE — Food, Agricultural and Rural Economics' },
  { logo: '/icons/logos/38_ecozept.jpg', name: 'ECOZEPT' },
  { logo: '/icons/logos/39_ecosensus_nonprofit.png', name: 'EcoSensus Nonprofit' },
  { logo: '/icons/logos/40_impact_research_measurement.png', name: 'Impact Research and Measurement' },
  { logo: '/icons/logos/41_ijhars.webp', name: 'IJHARS' },
  { logo: '/icons/logos/42_parmigiano_reggiano.png', name: 'Parmigiano Reggiano' },
  { logo: '/icons/logos/43_konzum.png', name: 'Konzum' },
  { logo: '/icons/logos/44_food_nation.jpg', name: 'Food Nation' },
  { logo: '/icons/logos/45_city_of_belgrade.png', name: 'City of Belgrade' },
  { logo: '/icons/logos/46_municipality_of_arilje.jpg', name: 'Municipality of Arilje' },
  { logo: '/icons/logos/47_republic_of_serbia.png', name: 'Republic of Serbia' },
  { logo: '/icons/logos/48_golden_land.png', name: 'Golden Land' },
  { logo: '/icons/logos/49_halo_land.png', name: 'HALO Land' },
  { logo: '/icons/logos/50_moc_gia.png', name: 'Mộc Gia' },
];

// Hai hàng chạy ngược chiều nhau. Một hàng 49 logo phải chạy rất lâu mới lặp lại,
// nên chia đôi: hàng trên trôi sang trái, hàng dưới trôi sang phải. Mắt bắt được
// chuyển động ngay mà không cần chờ hết vòng.
const partnerRows = [
  partners.slice(0, Math.ceil(partners.length / 2)),
  partners.slice(Math.ceil(partners.length / 2)),
];

const featuredResearchProjects: Array<{
  alt: string;
  category: string;
  description: string;
  href: string;
  image: string;
  title: string;
}> = [
  { alt: 'Thành phố xanh với năng lượng tái tạo', category: 'Thương mại bền vững', description: 'Nâng cao năng lực thực hành thương mại bền vững cho doanh nghiệp Việt Nam.', href: '/nghien-cuu/du-an', image: '/images/article-green-city.png', title: 'TRADE4SD' },
  { alt: 'Báo cáo phân tích hiệu suất và dữ liệu', category: 'Hệ thống thực phẩm', description: 'Kết nối dữ liệu và tri thức để hiểu rõ hơn động lực của chuỗi giá trị thực phẩm.', href: '/nghien-cuu/du-an', image: '/images/article-performance-benchmarking.png', title: 'VALUMICS' },
  { alt: 'Thực phẩm tươi trong hệ thống phân phối', category: 'Chất lượng thực phẩm', description: 'Hợp tác nghiên cứu hướng tới hệ thống thực phẩm minh bạch, bền vững và có trách nhiệm.', href: '/nghien-cuu/du-an', image: '/images/article-food-quality-programs.png', title: 'STRENGTH2FOOD' },
  { alt: 'Nhóm chuyên gia quốc tế trao đổi trong cuộc họp', category: 'Hợp tác quốc tế', description: 'Mở rộng trao đổi học thuật, nghiên cứu ứng dụng và kết nối chuyên gia toàn cầu.', href: '/nghien-cuu/du-an', image: '/images/gisa-consulting-hero.png', title: 'BRITISH COUNCIL' },
];

export function HomeTemplate({ model }: { model: HomePageModel }) {
  void model;
  const [sent, setSent] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [activeKnowledge, setActiveKnowledge] = useState<KnowledgeKey>('news');
  const knowledge = knowledgeGroups[activeKnowledge];
  const visibleKnowledgeItems = knowledge.items.slice(0, 4);

  useEffect(() => {
    if (!consultationOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConsultationOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.querySelector<HTMLButtonElement>('button[aria-label="Đóng bảng trao đổi"]')?.focus();
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [consultationOpen]);

  function submitConsultation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className={styles.homeMain} id="main-content" tabIndex={-1}>
      <section className={styles.hero} data-scroll-motion-ignore id="trang-chu">
        <div className={styles.heroMedia}>
          <Image
            alt="Nhóm chuyên gia GISA cùng xem mô hình quy hoạch đô thị xanh trên bàn họp"
            className={styles.heroImage}
            fill
            priority
            quality={95}
            sizes="100vw"
            src="/images/gisa-hero-knowledge-horizon-background.png"
          />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.heroKickerPhrase}>{bindPhrases("KẾT NỐI")}</span>{' '}
              <span className={styles.heroKickerPhrase}>{bindPhrases("TRI THỨC")}</span>{' '}
              <span className={styles.heroKickerPhrase}>—</span>{' '}
              <span className={styles.heroKickerPhrase}>{bindPhrases("KIẾN TẠO")}</span>{' '}
              <span className={styles.heroKickerPhrase}>{bindPhrases("GIÁ TRỊ")}</span>
            </p>
            <span aria-hidden="true" className={styles.heroOrnament}><Icon name="leaf" size={14} /></span>
            {/* Each line is its own block so the first-load sequence can bring them
                in one after another; a plain <br> gives nothing to animate. */}
            <h1><span>{bindPhrases("TRI THỨC GIẢI PHÁP")}</span><span>{bindPhrases("TÁC ĐỘNG ")}<em>{bindPhrases("BỀN VỮNG")}</em></span></h1>
            <p className={styles.heroLead}>
              <span>{bindPhrases("GISA đồng hành cùng tổ chức và doanh nghiệp kiến tạo các giải pháp toàn diện dựa trên tư duy liên ngành")}</span>{' '}
              <span>{bindPhrases("bằng chứng khoa học và cam kết vì tác động bền vững.")}</span>
            </p>
            <div className={styles.heroButtons}>
              <Link className={styles.primaryButton} href="#nang-luc">{bindPhrases("Khám phá năng lực ")}<Icon name="arrow" size={20} /></Link>
              <Link className={styles.secondaryButton} href="/dang-ky/tu-van">{bindPhrases("Đăng ký tư vấn ")}<Icon name="arrow" size={20} /></Link>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Lối tắt dịch vụ" className={styles.gatewayStrip}>
        <div className={styles.gatewayInner}>
          {gateways.map((item, index) => (
            <Link
              data-scroll-motion="item"
              href={item.href}
              key={item.title}
              style={{ '--motion-index': index } as React.CSSProperties}
            >
              <Icon name={item.icon} size={40} />
              <strong>{bindPhrases(item.title)}</strong>
              <Icon name="arrow" size={17} />
            </Link>
          ))}
        </div>
      </nav>

      <section className={styles.aboutSection} id="gioi-thieu">
        <div className={styles.contentContainer}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutIntro}>
              <h2>{bindPhrases("TRI THỨC CHO PHÁT TRIỂN BỀN VỮNG")}</h2>
              <p>{bindPhrases("Viện Phát triển Bền vững và Quản lý Nâng cao Toàn cầu (GISA) là tổ chức khoa học và công nghệ hoạt động theo hướng phi lợi nhuận, tiên phong trong nghiên cứu, tư vấn, đào tạo và chuyển giao tri thức.")}</p>
              <p>{bindPhrases("GISA kết nối các nhà khoa học, chuyên gia, nhà lãnh đạo và doanh nghiệp để chuyển hóa bằng chứng khoa học thành giải pháp thực tiễn, hiệu quả và có tác động lâu dài.")}</p>
              <Link className={styles.textLink} href="/gioi-thieu">{bindPhrases("Khám phá câu chuyện GISA ")}<Icon name="arrow" size={19} /></Link>
            </div>
            <div className={styles.visionStack}>
              <div className={styles.visionCard}>
                <article>
                  <span>01</span>
                  <div><h3>{bindPhrases("Tầm nhìn")}</h3><p>{bindPhrases("Đến năm 2030, trở thành đơn vị tiên phong và uy tín về đổi mới sáng tạo, phát triển bền vững và quản lý nâng cao tại Việt Nam và khu vực.")}</p></div>
                </article>
                <article>
                  <span>02</span>
                  <div><h3>{bindPhrases("Sứ mệnh")}</h3><p>{bindPhrases("Thúc đẩy phát triển bền vững thông qua nghiên cứu liên ngành, đổi mới sáng tạo, ứng dụng khoa học – công nghệ và kiến tạo giá trị xã hội.")}</p></div>
                </article>
              </div>
              <Link className={styles.aboutMotto} href="/gioi-thieu">
                <Icon name="leaf" size={46} />
                {/* Two fixed lines, split on the sense break. Letting it flow put
                    "giá trị" alone on line two; forcing one line only fits at some
                    widths. Each half is its own line, so the pair stays balanced
                    at every size. */}
                <span>
                  <span>{bindPhrases('Kiến tạo kiến thức')}</span>
                  <span>{bindPhrases('Lan tỏa giá trị')}</span>
                </span>
                <Icon name="arrow" size={30} />
              </Link>
            </div>
          </div>
          <div className={styles.impactStatsBlock}>
            <dl className={styles.impactStats}>
              {impactStats.map((item) => (
                <div key={item.label} style={{ '--stat-color': item.color } as React.CSSProperties}>
                  <dt>{item.value}</dt>
                  <dd>{bindPhrases(item.label)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className={styles.capabilitiesSection} id="nang-luc">
        <div className={styles.capabilitiesInner}>
          <div className={styles.capabilitiesIntro}>
            <p className={`${styles.eyebrow} ${styles.sectionEyebrow} ${styles.orange}`}>{bindPhrases("Từ tri thức đến tác động")}</p>
            <h2>{bindPhrases("GIẢI PHÁP CHO TÁC ĐỘNG BỀN VỮNG")}</h2>
            <p>{bindPhrases("GISA kết hợp tri thức học thuật, kinh nghiệm thực tiễn và cách tiếp cận hệ thống để hỗ trợ tổ chức giải quyết các thách thức phát triển bền vững một cách hiệu quả và có tác động lâu dài.")}</p>
            <div className={styles.capabilityButtons}>
              <Link className={styles.tealButton} href="/ung-dung/linh-vuc">{bindPhrases("Khám phá giải pháp ")}<Icon name="arrow" size={18} /></Link>
            </div>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map((item) => (
              <Link
                aria-label={`Khám phá ${item.title}`}
                className={styles.capabilityCard}
                href={item.href}
                key={item.title}
              >
                <span className={styles.capabilityIcon}><Illustration name={item.art} size={104} /></span>
                <h3>{bindPhrases(item.title)}</h3>
                <p>{bindPhrases(item.text)}</p>
                <span aria-hidden="true" className={styles.capabilityArrow}><Icon name="arrow" size={25} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.ancientTreeStory}>
      <KnowledgeJourney />

      <ExpertShowcase />

      <section className={styles.architectureSection} id="kien-truc">
        <div className={styles.contentContainer}>
          <div className={styles.risesHeading} data-scroll-motion="reveal">
            <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases("Kiến trúc tri thức")}</p>
            <h2 className={styles.sectionTitle}>{bindPhrases("GIÁ TRỊ NỀN TẢNG — RISES")}</h2>
          </div>
          <RisesFoldPanorama values={rises} />
        </div>
      </section>

      <section className={styles.knowledgeSection} id="dao-tao">
        <div className={styles.contentContainer}>
          <div className={styles.knowledgeShowcase}>
            <div className={styles.knowledgeIntro}>
              <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases(knowledge.eyebrow)}</p>
              <h2>
                <span>{bindPhrases("TRI THỨC")}</span>
                <span>{bindPhrases("DẪN LỐI")}</span>
                <span>{bindPhrases("HÀNH ĐỘNG")}</span>
              </h2>
              <p className={styles.knowledgeLead}>{bindPhrases(knowledge.lead)}</p>
              <div aria-label="Nhóm nội dung" className={styles.knowledgeDeckTabs} role="tablist">
                {knowledgeOrder.map((key) => (
                  <button
                    aria-controls="knowledge-panel"
                    aria-selected={activeKnowledge === key}
                    id={`knowledge-tab-${key}`}
                    key={key}
                    onClick={() => setActiveKnowledge(key)}
                    role="tab"
                    type="button"
                  >
                    {knowledgeGroups[key].label}
                  </button>
                ))}
              </div>
              <Link className={styles.knowledgeDeckAllLink} href={knowledge.href}>
                Xem tất cả {knowledge.label.toLowerCase()} <Icon name="arrow" size={17} />
              </Link>
            </div>

            <div
              aria-labelledby={`knowledge-tab-${activeKnowledge}`}
              className={styles.knowledgeDeck}
              id="knowledge-panel"
              key={activeKnowledge}
              role="tabpanel"
            >
              {visibleKnowledgeItems.map((item, index) => {
                const itemHref = item.href ?? knowledge.href;
                return (
                  <article
                    className={styles.knowledgePoster}
                    key={`${activeKnowledge}-${item.title}`}
                    style={{ '--poster-index': index } as React.CSSProperties}
                  >
                    <Link aria-label={`Xem ${knowledge.itemNoun} ${item.title}`} href={itemHref}>
                      <span className={styles.knowledgePosterImage}>
                        {item.image ? (
                          <Image
                            alt={`Ảnh minh họa ${knowledge.itemNoun} ${item.title}`}
                            fill
                            sizes="(max-width: 768px) 76vw, (max-width: 1120px) 38vw, 24vw"
                            src={item.image}
                          />
                        ) : null}
                      </span>
                      <span className={styles.knowledgePosterCaption}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>
                          {Array.isArray(item.displayTitle)
                            ? item.displayTitle.map((line) => <span key={line}>{bindPhrases(line)}</span>)
                            : bindPhrases(item.displayTitle ?? item.title)}
                        </strong>
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.partnerSection} id="doi-tac">
        <div className={styles.contentContainer}>
          <div className={styles.partnerHeading} data-scroll-motion="reveal">
            <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases("Mạng lưới hợp tác")}</p>
            <h2>{bindPhrases("KẾT NỐI TOÀN CẦU")}</h2>
            <p className={styles.partnerLead}>{bindPhrases("GISA kết nối các trường đại học, viện nghiên cứu và tổ chức phát triển toàn cầu.")}</p>
          </div>
          {partnerRows.map((row, rowIndex) => (
            <div className={styles.partnerMarquee} key={rowIndex}>
              <div
                className={`${styles.partnerTrack} ${rowIndex === 1 ? styles.partnerTrackReverse : ''}`}
              >
                {[0, 1].map((copyIndex) => (
                  <ul
                    aria-hidden={copyIndex === 1 ? 'true' : undefined}
                    aria-label={
                      copyIndex === 0
                        ? `Logo các đối tác trong mạng lưới hợp tác — hàng ${rowIndex + 1}`
                        : undefined
                    }
                    className={styles.partnerList}
                    key={copyIndex}
                  >
                    {row.map((partner) => (
                      <li key={`${copyIndex}-${partner.name}`}>
                        <span aria-hidden="true" className={styles.partnerLogo}>
                          <Image alt="" fill sizes="17rem" src={partner.logo} />
                        </span>
                        <span className={styles.visuallyHidden}>{partner.name}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          ))}
          {/* Nút này là lối vào duy nhất của bảng trao đổi. Trước đây nó nằm trong
              khối quy trình tư vấn; khối đó đã gỡ, và chỗ này vốn chỉ có một link
              `#trang-chu` cuộn ngược lên đầu trang — một ngõ cụt. */}
          <div className={styles.partnerCta} data-scroll-motion="partner-cta">
            <p>{bindPhrases("Bạn đang tìm kiếm một đối tác nghiên cứu, đào tạo hoặc tư vấn tại Việt Nam?")}</p>
            <button
              aria-expanded={consultationOpen}
              aria-haspopup="dialog"
              onClick={() => setConsultationOpen(true)}
              type="button"
            >
              {bindPhrases("Đề nghị hợp tác ")}<Icon name="arrow" size={19} />
            </button>
          </div>
        </div>
      </section>

      <div className={styles.storyContinuum}>
      <section aria-labelledby="featured-research-title" className={styles.researchProjectsSection} id="du-an-nghien-cuu-trong-diem">
        <div className={styles.contentContainer}>
          <div className={styles.researchShowcaseHeading} data-scroll-motion="reveal">
            <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases("Nghiên cứu tạo chuyển biến")}</p>
            <h2 id="featured-research-title">{bindPhrases("NGHIÊN CỨU TRỌNG ĐIỂM")}</h2>
            <p>{bindPhrases("Tri thức quốc tế, tác động tại Việt Nam.")}</p>
          </div>
          <div className={styles.researchGallery}>
            {featuredResearchProjects.map((project, index) => (
              <Link
                aria-label={`Khám phá dự án ${project.title}`}
                className={styles.researchGalleryItem}
                data-scroll-motion="item"
                href={project.href}
                key={project.title}
                style={{
                  '--motion-index': index,
                  '--research-index': index,
                } as React.CSSProperties}
              >
                <Image
                  alt={project.alt}
                  fill
                  sizes="(max-width: 48rem) 82vw, (max-width: 70rem) 50vw, 25vw"
                  src={project.image}
                />
                <span>{bindPhrases(project.title)}</span>
              </Link>
            ))}
          </div>
          <Link className={styles.researchGalleryAllLink} href="/nghien-cuu/du-an">
            {bindPhrases("Xem tất cả nghiên cứu ")}<Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      </div>
      </div>

      {consultationOpen && (
        <div className={styles.consultationOverlay}>
          <div aria-labelledby="consultation-title" aria-modal="true" className={styles.consultationDialog} role="dialog">
            <form className={`${styles.heroForm} ${styles.consultationForm}`} id="tu-van" onSubmit={submitConsultation}>
              <button aria-label="Đóng bảng trao đổi" className={styles.dialogClose} onClick={() => setConsultationOpen(false)} type="button"><Icon name="close" size={22} /></button>
              {sent ? (
                <div className={styles.formSuccess} role="status">
                  <Icon name="check" size={42} />
                  <h2 id="consultation-title">{bindPhrases("Đã nhận yêu cầu")}</h2>
                  <p>{bindPhrases("GISA sẽ liên hệ với bạn trong thời gian sớm nhất.")}</p>
                  <button onClick={() => setSent(false)} type="button">{bindPhrases("Gửi yêu cầu khác")}</button>
                </div>
              ) : (
                <>
                  <h2 id="consultation-title">{bindPhrases("Trao đổi cùng GISA")}</h2>
                  <p>{bindPhrases("Chúng tôi sẵn sàng lắng nghe và đồng hành cùng bạn.")}</p>
                  <label className={styles.visuallyHidden} htmlFor="hero-name">{bindPhrases("Họ và tên")}</label>
                  <input id="hero-name" name="name" placeholder="Họ và tên *" required />
                  <label className={styles.visuallyHidden} htmlFor="hero-email">{bindPhrases("Email công việc")}</label>
                  <input id="hero-email" name="email" placeholder="Email công việc *" required type="email" />
                  <label className={styles.visuallyHidden} htmlFor="hero-phone">{bindPhrases("Số điện thoại")}</label>
                  <input id="hero-phone" name="phone" placeholder="Số điện thoại *" required type="tel" />
                  <label className={styles.visuallyHidden} htmlFor="hero-interest">{bindPhrases("Lĩnh vực quan tâm")}</label>
                  <select defaultValue="" id="hero-interest" name="interest" required>
                    <option disabled value="">{bindPhrases("Lĩnh vực quan tâm")}</option>
                    <option>{bindPhrases("Nghiên cứu & phân tích")}</option>
                    <option>{bindPhrases("Tư vấn chiến lược")}</option>
                    <option>{bindPhrases("Đào tạo & chuyển giao")}</option>
                  </select>
                  <button type="submit">{bindPhrases("Gửi yêu cầu tư vấn")}</button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
