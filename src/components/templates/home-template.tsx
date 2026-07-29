'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';

import { SiteIntro } from '@/components/motion/site-intro';
import { Icon } from '@/components/ui/icon';
import { Illustration, type IllustrationName } from '@/components/ui/illustration';
import type { HomePageModel } from '@/content/home';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './home-template.module.css';

const gateways: Array<{ art: IllustrationName; title: string; href: string }> = [
  { art: 'applied-research', title: 'Nghiên cứu', href: '#kien-truc' },
  { art: 'strategic-consulting', title: 'Tư vấn', href: '#nang-luc' },
  { art: 'capacity-building', title: 'Đào tạo', href: '#dao-tao' },
  { art: 'application-transfer', title: 'Ứng dụng', href: '#kien-truc' },
  { art: 'network-collaboration', title: 'Mạng lưới', href: '#doi-tac' },
  { art: 'community-impact', title: 'Cộng đồng', href: '#kien-truc' },
];

const capabilities: Array<{ art: IllustrationName; title: string; text: string }> = [
  { art: 'applied-research', title: 'Nghiên cứu & phân tích', text: 'Nghiên cứu ứng dụng và phân tích chính sách dựa trên bằng chứng khoa học và dữ liệu đáng tin cậy.' },
  { art: 'strategic-consulting', title: 'Tư vấn chiến lược', text: 'Đồng hành cùng tổ chức xây dựng chiến lược và giải pháp phát triển bền vững, phù hợp với bối cảnh và năng lực nội tại.' },
  { art: 'capacity-building', title: 'Chuyển giao tri thức & đào tạo', text: 'Nâng cao năng lực cá nhân và tổ chức thông qua các chương trình đào tạo, workshop và cộng đồng thực hành.' },
  { art: 'impact-measurement', title: 'Đo lường & đánh giá', text: 'Thiết kế hệ thống đo lường và đánh giá tác động giúp tổ chức hiểu rõ kết quả và tối ưu hiệu quả đầu tư.' },
];

const rises = [
  { code: 'R', label: 'Reliability', color: '#00717b', text: 'Đảm bảo chất lượng, tính trung thực và độ tin cậy trong mọi hoạt động.' },
  { code: 'I', label: 'Innovation', color: '#6aa42a', text: 'Khuyến khích sáng tạo, dám nghĩ mới để tạo ra tri thức đột phá.' },
  { code: 'S', label: 'Science', color: '#4f9be8', text: 'Đặt khoa học làm nền tảng, dựa trên phương pháp nghiêm ngặt và minh bạch.' },
  { code: 'E', label: 'Efficiency', color: '#f28a2c', text: 'Tối ưu nguồn lực, quy trình và thời gian để tạo ra giá trị bền vững.' },
  { code: 'S', label: 'Sustainability', color: '#32a65a', text: 'Hướng tới phát triển lâu dài, trách nhiệm với cộng đồng và môi trường.' },
];

// Shares its six illustrations with the gateway strip above — same six concepts,
// so the site teaches one picture per idea rather than two.
const pillars: Array<{ art: IllustrationName; title: string; text: string; color: string }> = [
  { art: 'applied-research', title: 'Nghiên cứu ứng dụng', text: 'Nghiên cứu chuyên sâu và ứng dụng liên ngành, tạo tri thức đáng tin cậy để giải quyết các vấn đề phát triển bền vững.', color: '#00717b' },
  { art: 'strategic-consulting', title: 'Tư vấn chiến lược', text: 'Hoạch định chiến lược, triển khai ESG, tối ưu mô hình quản trị và nâng cao hiệu quả dài hạn cho tổ chức.', color: '#639c25' },
  { art: 'capacity-building', title: 'Đào tạo năng lực', text: 'Phát triển năng lực lãnh đạo, quản trị và chuyên môn, giúp tổ chức thích ứng với chuyển đổi số và kinh tế xanh.', color: '#1765aa' },
  { art: 'application-transfer', title: 'Ứng dụng & Chuyển giao', text: 'Kết nối khoa học – công nghệ với các giải pháp sáng tạo và mô hình quản trị tiên tiến trong thực tiễn.', color: '#ee5b1b' },
  { art: 'network-collaboration', title: 'Mạng lưới & Hợp tác', text: 'Kết nối nhà khoa học, chuyên gia, lãnh đạo và doanh nghiệp để chia sẻ tri thức và thúc đẩy hợp tác chiến lược.', color: '#6b3192' },
  { art: 'community-impact', title: 'Cộng đồng & Tác động', text: 'Thực thi sáng kiến cộng đồng, góp phần nâng cao phúc lợi xã hội, bảo vệ môi trường và phát triển bền vững.', color: '#00717b' },
];

const process: Array<{ art: IllustrationName; title: string; text: string }> = [
  { art: 'network-collaboration', title: 'Tiếp nhận yêu cầu', text: 'Lắng nghe nhu cầu và hiểu rõ bối cảnh doanh nghiệp.' },
  { art: 'applied-research', title: 'Phân tích & Đánh giá', text: 'Đánh giá hiện trạng và xác định cơ hội tạo giá trị bền vững.' },
  { art: 'responsible-innovation', title: 'Đề xuất giải pháp', text: 'Xây dựng giải pháp phù hợp, khả thi và đo lường được.' },
  { art: 'application-transfer', title: 'Triển khai & Đồng hành', text: 'Phối hợp triển khai và đồng hành trong suốt quá trình thực hiện.' },
  { art: 'impact-measurement', title: 'Đánh giá & Tối ưu', text: 'Đo lường kết quả và tối ưu để gia tăng giá trị dài hạn.' },
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
  label: string;
  items: Array<{ image?: string; meta: string; title: string }>;
}> = {
  research: {
    eyebrow: 'Nghiên cứu nổi bật',
    href: '/nghien-cuu/bai-bao-khoa-hoc',
    label: 'Bài nghiên cứu',
    items: [
      { image: '/images/article-performance-benchmarking.png', meta: 'Quản trị hiệu suất', title: 'Nghiên cứu phát triển mô hình chuẩn đối sánh đo lường hiệu suất hoạt động' },
      { image: '/images/article-food-quality-programs.png', meta: 'Kinh tế thực phẩm', title: 'Các chương trình chất lượng thực phẩm và phí bảo hiểm giá ròng' },
      { image: '/images/article-da-xanh-pomelo.png', meta: 'Chuỗi giá trị', title: 'Phân tích chuỗi giá trị và năng lực cạnh tranh ngành Bưởi Da Xanh' },
      { image: '/images/article-ai-chatbot.png', meta: 'Trí tuệ nhân tạo', title: 'Nâng cao trải nghiệm khách hàng với chatbot vận hành bởi AI' },
    ],
  },
  courses: {
    eyebrow: 'Đào tạo ứng dụng',
    href: '/khoa-hoc',
    label: 'Khóa học',
    items: [
      { image: '/images/course-multichannel-effective-sales.png', meta: 'Kinh doanh & Bán hàng', title: 'Multi-channel & Effective Sales' },
      { image: '/images/course-digital-supply-chain-logistics.png', meta: 'Vận hành & Logistics', title: 'Quản lý chuỗi cung ứng và logistics trong thời đại số' },
      { image: '/images/course-strategic-human-resources.png', meta: 'Quản trị nhân sự', title: 'Quản lý nhân sự chiến lược cho tổ chức nhỏ và vừa' },
      { image: '/images/course-practical-accounting-tax.png', meta: 'Tài chính & Thuế', title: 'Kế toán thực hành và tối ưu hóa thuế' },
      { image: '/images/course-sme-financial-management.png', meta: 'Quản trị doanh nghiệp', title: 'Quản trị tài chính doanh nghiệp vừa và nhỏ' },
      { image: '/images/course-digital-ai-marketing.png', meta: 'Marketing & AI', title: 'Digital & AI Marketing: Tối ưu hóa chiến lược số' },
    ],
  },
  news: {
    eyebrow: 'Tin tức & Góc nhìn',
    href: '/tin-tuc',
    label: 'Tin mới',
    items: [
      { meta: 'Giáo dục', title: 'Chuyển đổi mô hình viện nghiên cứu và phát triển đại học đẳng cấp' },
      { meta: 'Phát triển bền vững', title: 'Tài chính khí hậu và tài chính phát triển không thể tách rời' },
      { meta: 'Công nghệ', title: 'Sự phụ thuộc vào chatbot AI nhìn từ những gián đoạn dịch vụ' },
      { meta: 'Môi trường', title: 'Vật liệu mới và triển vọng giảm ô nhiễm nhựa đại dương' },
    ],
  },
};

const knowledgeOrder: KnowledgeKey[] = ['courses', 'research', 'news'];

// One entry per file in `public/icons/logos`, kept in that folder's numeric order.
// The numbering skips 13 — that slot was GISA's own logo, which does not belong in
// a partner network strip and has since been removed from the folder.
// These replaced a single sprite sheet (`banner-global-network.png`) that was
// positioned by percentage — the sprite only covered 14 of the 29 partners and
// broke alignment whenever a tile changed size.
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
];

// Order mirrors the sustainability grid in the approved mockup (04-tac-dong).
const sustainabilityCommitments: Array<{
  color: string;
  art: IllustrationName;
  label: string;
  text: string;
}> = [
  { color: '#fd6925', art: 'responsible-innovation', label: 'Đổi mới có trách nhiệm', text: 'Biến bằng chứng khoa học thành hành động.' },
  { color: '#c5192d', art: 'inclusive-community', label: 'Cộng đồng bao trùm', text: 'Đặt con người và chất lượng sống ở trung tâm.' },
  { color: '#c99700', art: 'quality-education', label: 'Giáo dục chất lượng', text: 'Chuyển giao tri thức có khả năng ứng dụng.' },
  { color: '#4c9f38', art: 'climate-action', label: 'Hành động vì khí hậu', text: 'Lồng ghép tăng trưởng xanh trong mọi giải pháp.' },
  { color: '#26bde2', art: 'network-collaboration', label: 'Hợp tác toàn cầu', text: 'Kết nối chuyên gia và tổ chức cùng tạo tác động.' },
  { color: '#a21942', art: 'impact-measurement', label: 'Đo lường tác động', text: 'Theo dõi tiến độ và lan tỏa giá trị số rõ ràng.' },
];

const featuredResearchProjects: Array<{
  accent: string;
  category: string;
  description: string;
  href: string;
  art: IllustrationName;
  title: string;
}> = [
  { accent: '#f15b2a', category: 'Thương mại bền vững', description: 'Nâng cao năng lực thực hành thương mại bền vững cho doanh nghiệp Việt Nam.', href: '/nghien-cuu/du-an', art: 'gisa-trade4sd-icon', title: 'TRADE4SD' },
  { accent: '#69a52b', category: 'Hệ thống thực phẩm', description: 'Kết nối dữ liệu và tri thức để hiểu rõ hơn động lực của chuỗi giá trị thực phẩm.', href: '/nghien-cuu/du-an', art: 'gisa-valumics-icon', title: 'VALUMICS' },
  { accent: '#c5192d', category: 'Chất lượng thực phẩm', description: 'Hợp tác nghiên cứu hướng tới hệ thống thực phẩm minh bạch, bền vững và có trách nhiệm.', href: '/nghien-cuu/du-an', art: 'gisa-strength2food-icon', title: 'STRENGTH2FOOD' },
  { accent: '#1765aa', category: 'Hợp tác quốc tế', description: 'Mở rộng trao đổi học thuật, nghiên cứu ứng dụng và kết nối chuyên gia toàn cầu.', href: '/nghien-cuu/du-an', art: 'global-collaboration', title: 'BRITISH COUNCIL' },
];

const sideArticles = [
  {
    alt: 'Kính lúp trên báo cáo quản trị bền vững',
    date: '20/05/2024',
    image: '/images/article-esg-report.png',
    meta: 'Quản trị bền vững',
    title: '5 bước xây dựng báo cáo phát triển bền vững hiệu quả cho doanh nghiệp',
  },
  {
    alt: 'Điện mặt trời và tua-bin gió trên đồi xanh',
    date: '15/05/2024',
    image: '/images/article-renewables.png',
    meta: 'Chuyển đổi xanh',
    title: 'Năng lượng tái tạo: Động lực mới cho tăng trưởng bền vững',
  },
];

export function HomeTemplate({ model }: { model: HomePageModel }) {
  void model;
  const [sent, setSent] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [activeKnowledge, setActiveKnowledge] = useState<KnowledgeKey>('courses');
  const knowledge = knowledgeGroups[activeKnowledge];

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
    <main id="main-content" tabIndex={-1}>
      <SiteIntro />
      <section className={styles.hero} id="trang-chu">
        <div className={styles.heroMedia}>
          <Image
            alt="Nhóm chuyên gia GISA cùng xem mô hình quy hoạch đô thị xanh trên bàn họp"
            className={styles.heroImage}
            fill
            priority
            quality={95}
            sizes="100vw"
            src="/new image/gisa-hero-background-4k.png"
          />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{bindPhrases("KẾT NỐI TRI THỨC — KIẾN TẠO GIÁ TRỊ")}</p>
            {/* Each line is its own block so the first-load sequence can bring them
                in one after another; a plain <br> gives nothing to animate. */}
            <h1><span>{bindPhrases("TRI THỨC")}</span><span>{bindPhrases("GIẢI PHÁP")}</span><span>{bindPhrases("TÁC ĐỘNG ")}<em>{bindPhrases("BỀN VỮNG")}</em></span></h1>
            <p className={styles.heroLead}>{bindPhrases("GISA đồng hành cùng tổ chức và doanh nghiệp kiến tạo các giải pháp toàn diện dựa trên tư duy liên ngành, bằng chứng khoa học và cam kết vì tác động bền vững.")}</p>
            <div className={styles.heroButtons}>
              <Link className={styles.primaryButton} href="#nang-luc">{bindPhrases("Khám phá năng lực ")}<Icon name="arrow" size={20} /></Link>
              <Link className={styles.secondaryButton} href="#gioi-thieu">{bindPhrases("Tìm hiểu về GISA ")}<Icon name="arrow" size={20} /></Link>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Lối tắt dịch vụ" className={styles.gatewayStrip}>
        <div className={styles.gatewayInner}>
          {gateways.map((item) => (
            <Link href={item.href} key={item.title}>
              <Illustration name={item.art} size={64} />
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
            <p className={styles.impactStatsEyebrow}>{bindPhrases("GISA qua những con số")}</p>
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
              <Link className={styles.tealButton} href="#kien-truc">{bindPhrases("Khám phá giải pháp ")}<Icon name="arrow" size={18} /></Link>
              <a className={styles.downloadButton} download href="/assets/asset-manifest.json"><Icon name="download" size={18} />{bindPhrases("Tải hồ sơ năng lực")}</a>
            </div>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map((item) => (
              <article className={styles.capabilityCard} key={item.title}>
                <span className={styles.capabilityIcon}><Illustration name={item.art} size={104} /></span>
                <h3>{bindPhrases(item.title)}</h3>
                <p>{bindPhrases(item.text)}</p>
                <Link aria-label={`Xem ${item.title}`} href="#kien-truc"><Icon name="arrow" size={25} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="sustainability-banner-title" className={styles.mediaBannerSection} id="phat-trien-ben-vung">
        <div className={styles.contentContainer}>
          <div className={styles.mediaBannerHeading}>
            <div data-scroll-motion="section-copy" data-scroll-motion-ignore>
              <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases("Tác động bền vững")}</p>
              <h2 id="sustainability-banner-title">{bindPhrases("TRI THỨC TẠO CHUYỂN BIẾN")}</h2>
            </div>
            <p className={`${styles.featureStatement} ${styles.statementRed}`} data-scroll-motion="statement">{bindPhrases("Tri thức kết nối, hành động liền mạch, tác động dài lâu.")}</p>
          </div>
          <ul aria-label="Các hướng hành động phát triển bền vững của GISA" className={styles.commitmentGrid}>
            {sustainabilityCommitments.map((item, index) => (
              <li
                data-scroll-motion="commitment-card"
                key={item.label}
                style={{
                  '--commitment-color': item.color,
                  '--motion-index': index,
                  '--motion-delay': `${index * 85}ms`,
                  '--motion-step': `${(index % 3) * 1.8}%`,
                } as React.CSSProperties}
              >
                <span className={styles.commitmentIcon}><Illustration name={item.art} size={80} /></span>
                <span><strong>{bindPhrases(item.label)}</strong><small>{bindPhrases(item.text)}</small></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.architectureSection} id="kien-truc">
        <div className={styles.contentContainer}>
          <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases("Kiến trúc tri thức")}</p>
          <h2 className={styles.sectionTitle} data-scroll-motion="section-copy">{bindPhrases("GIÁ TRỊ NỀN TẢNG — RISES")}</h2>
          <div className={styles.risesGrid}>
            {rises.map((item, index) => (
              <article
                data-scroll-motion="rises-card"
                key={`${item.code}-${index}`}
                style={{
                  '--accent': item.color,
                  '--motion-delay': `${index * 95}ms`,
                  '--motion-index': index,
                  '--motion-step': `${index * 2}%`,
                } as React.CSSProperties}
              >
                <span>{item.code}</span>
                <h3>{bindPhrases(item.label)}</h3>
                <i aria-hidden="true" />
                <p>{bindPhrases(item.text)}</p>
              </article>
            ))}
          </div>
          <h2 className={`${styles.sectionTitle} ${styles.pillarHeading}`}>{bindPhrases("TRỤ CỘT HÀNH ĐỘNG")}</h2>
          <div className={styles.pillarGrid}>
            {pillars.map((item) => (
              <article key={item.title} style={{ '--accent': item.color } as React.CSSProperties}>
                <span className={styles.pillarIcon}><Illustration name={item.art} size={108} /></span>
                <div><h3>{bindPhrases(item.title)}</h3><i aria-hidden="true" /><p>{bindPhrases(item.text)}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.editorialSection}>
        <div className={styles.insights} id="bai-viet">
          <div className={styles.insightsHeading}>
            <h2>{bindPhrases("GÓC NHÌN & NGHIÊN CỨU MỚI")}</h2>
            <Link href="#bai-viet">{bindPhrases("Xem tất cả bài viết ")}<span className={styles.circleArrow}><Icon name="arrow" size={18} /></span></Link>
          </div>
          <div className={styles.insightsGrid}>
            <article className={styles.leadArticle}>
              <div className={styles.articleImage}><Image alt="Thành phố xanh ven sông với các tua-bin gió" fill sizes="(max-width: 70rem) 100vw, 46vw" src="/images/article-green-city.png" /></div>
              <div className={styles.articleBody}>
                <p className={styles.articleMeta}><span className={styles.metaBadge}>{bindPhrases("Nghiên cứu & Phân tích")}</span><span className={styles.metaDate}>28/05/2024</span></p>
                <h3>{bindPhrases("Doanh nghiệp Việt Nam trước cơ hội")}<br />{bindPhrases("từ tăng trưởng xanh và kinh tế tuần hoàn")}</h3>
                <p className={styles.articleFoot}>
                  <span>{bindPhrases("Phân tích xu hướng và khuyến nghị giúp doanh nghiệp đón đầu cơ hội, giảm thiểu rủi ro và tạo lợi thế cạnh tranh.")}</span>
                  <Link aria-label="Đọc bài Doanh nghiệp Việt Nam trước cơ hội từ tăng trưởng xanh và kinh tế tuần hoàn" className={styles.circleArrow} href="#bai-viet"><Icon name="arrow" size={20} /></Link>
                </p>
              </div>
            </article>
            {sideArticles.map((article) => (
              <article className={styles.sideArticle} key={article.title}>
                <div className={styles.articleImage}><Image alt={article.alt} fill sizes="(max-width: 70rem) 100vw, 40vw" src={article.image} /></div>
                <div className={styles.articleBody}>
                  <p className={styles.articleMeta}><span>{bindPhrases(article.meta)}</span><span className={styles.metaDate}>{article.date}</span></p>
                  <h3>{bindPhrases(article.title)}</h3>
                  <Link aria-label={`Đọc bài ${article.title}`} className={styles.circleArrow} href="#bai-viet"><Icon name="arrow" size={20} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.knowledgeSection} id="dao-tao">
        <div className={styles.contentContainer}>
          <div className={styles.knowledgeHeading}>
            <h2>{bindPhrases("TRI THỨC DẪN LỐI HÀNH ĐỘNG")}</h2>
          </div>
          <div className={styles.knowledgeToolbar}>
            <div aria-label="Nhóm nội dung" className={styles.knowledgeTabs} role="tablist">
              {knowledgeOrder.map((key) => (
                <button aria-controls="knowledge-panel" aria-selected={activeKnowledge === key} id={`knowledge-tab-${key}`} key={key} onClick={() => setActiveKnowledge(key)} role="tab" type="button">{knowledgeGroups[key].label}</button>
              ))}
            </div>
            <Link className={styles.knowledgeAllLink} href={knowledge.href}>Xem tất cả {knowledge.label.toLowerCase()} <Icon name="arrow" size={17} /></Link>
          </div>
          <div aria-labelledby={`knowledge-tab-${activeKnowledge}`} className={`${styles.knowledgeGrid} ${activeKnowledge === 'courses' ? styles.courseGrid : ''}`} id="knowledge-panel" role="tabpanel">
            {knowledge.items.map((item, index) => (
              <article className={item.image ? styles.courseCard : undefined} key={item.title}>
                {item.image ? (
                  <Link aria-label={`Xem khóa học ${item.title}`} className={styles.courseImage} href={knowledge.href}>
                    <Image alt={`Banner khóa học ${item.title}`} height={1152} sizes="(max-width: 768px) 94vw, (max-width: 1120px) 46vw, 30vw" src={item.image} width={2048} />
                  </Link>
                ) : (
                  <div className={styles.knowledgeCardTop}><span>{String(index + 1).padStart(2, '0')}</span><Icon name="arrowUp" size={22} /></div>
                )}
                <div className={styles.knowledgeCardBody}>
                  <p>{knowledge.eyebrow} - {bindPhrases(item.meta)}</p>
                  <h3>{bindPhrases(item.title)}</h3>
                  <Link href={knowledge.href}>{bindPhrases("Xem chi tiết ")}<Icon name="arrow" size={17} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.partnerSection} id="doi-tac">
        <div className={styles.contentContainer}>
          <div className={styles.partnerHeading}>
            <div data-scroll-motion="section-copy" data-scroll-motion-ignore><p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases("Mạng lưới hợp tác")}</p><h2>{bindPhrases("KẾT NỐI TOÀN CẦU")}</h2></div>
            <p className={`${styles.featureStatement} ${styles.statementBlue}`} data-scroll-motion="statement">{bindPhrases("GISA thúc đẩy hợp tác học thuật, nghiên cứu và chuyển giao cùng các trường đại học, viện nghiên cứu và tổ chức phát triển.")}</p>
          </div>
          <div className={styles.partnerMarquee}>
            <div className={styles.partnerTrack}>
              {[0, 1].map((copyIndex) => (
                <ul
                  aria-hidden={copyIndex === 1 ? 'true' : undefined}
                  aria-label={copyIndex === 0 ? 'Logo các đối tác trong mạng lưới hợp tác' : undefined}
                  className={styles.partnerList}
                  key={copyIndex}
                >
                  {partners.map((partner, index) => (
                    <li
                      data-scroll-motion="partner-card"
                      key={`${copyIndex}-${partner.name}`}
                      style={{
                        '--motion-index': index % 7,
                        '--motion-delay': `${(index % 7) * 60}ms`,
                        '--motion-step': `${(index % 7) * 0.95}%`,
                      } as React.CSSProperties}
                    >
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
          <div className={styles.partnerCta} data-scroll-motion="partner-cta"><p>{bindPhrases("Bạn đang tìm kiếm một đối tác nghiên cứu, đào tạo hoặc tư vấn tại Việt Nam?")}</p><Link href="#trang-chu">{bindPhrases("Đề nghị hợp tác ")}<Icon name="arrow" size={19} /></Link></div>
        </div>
      </section>

      <section className={styles.processSection} id="quy-trinh">
        <div className={styles.contentContainer}>
          <div className={styles.processHeading}><h2>{bindPhrases("QUY TRÌNH TƯ VẤN 5 BƯỚC")}</h2><p className={`${styles.featureStatement} ${styles.statementGreen}`}>{bindPhrases("Đồng hành cùng doanh nghiệp từ phân tích đến triển khai và tối ưu giá trị bền vững.")}</p></div>
          <ol className={styles.processGrid}>
            {process.map((item, index) => (
              <li key={item.title}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <span className={styles.processIcon}><Illustration name={item.art} size={104} /></span>
                <h3>{bindPhrases(item.title)}</h3><p>{bindPhrases(item.text)}</p>
              </li>
            ))}
          </ol>
          <div className={styles.processCta}>
            <button
              aria-expanded={consultationOpen}
              aria-haspopup="dialog"
              className={styles.consultationTrigger}
              onClick={() => setConsultationOpen(true)}
              type="button"
            >
              <Illustration name="chat-bubbles" size={30} />
              Trao đổi cùng chuyên gia
              <Icon name="arrow" size={20} />
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-research-title" className={styles.researchProjectsSection} id="du-an-nghien-cuu-trong-diem">
        <div className={styles.contentContainer}>
          <div className={styles.researchProjectsHeading}>
            <div data-scroll-motion="section-copy" data-scroll-motion-ignore>
              <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases("Nghiên cứu tạo chuyển biến")}</p>
              <h2 id="featured-research-title">{bindPhrases("NGHIÊN CỨU TRỌNG ĐIỂM")}</h2>
            </div>
            <p className={styles.researchLead} data-scroll-motion="statement">
              <Illustration name="research-doc" size={46} />
              <span>{bindPhrases("Những hợp tác nghiên cứu tiêu biểu kết nối tri thức quốc tế với nhu cầu phát triển tại Việt Nam.")}</span>
            </p>
          </div>
          <div className={styles.researchProjectsGrid}>
            {featuredResearchProjects.map((project, index) => (
              <article
                data-scroll-motion="research-card"
                key={project.title}
                style={{
                  '--motion-index': index,
                  '--motion-delay': `${index * 100}ms`,
                  '--motion-step': `${index * 2.4}%`,
                  '--project-accent': project.accent,
                } as React.CSSProperties}
              >
                <div className={styles.researchProjectTop}>
                  <span className={styles.researchProjectIcon}><Illustration name={project.art} size={340} /></span>
                  <span className={styles.researchProjectNumber}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <p>{bindPhrases(project.category)}</p>
                <h3>{bindPhrases(project.title)}</h3>
                <span>{bindPhrases(project.description)}</span>
                <Link href={project.href}>{bindPhrases("Khám phá dự án ")}<Icon name="arrowUp" size={18} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

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
