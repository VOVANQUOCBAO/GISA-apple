'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { GisaForm } from '@/components/forms/gisa-form';
import { Icon, type IconName } from '@/components/ui/icon';
import { Illustration, type IllustrationName } from '@/components/ui/illustration';
import type { HomePageModel } from '@/content/home';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './home-template.module.css';
import { ExpertShowcase } from './expert-showcase';
import { KnowledgeJourney } from './knowledge-journey';
import { RisesFoldPanorama } from './rises-fold-panorama';

/* `accent` tô biểu tượng và vạch gạch chân, `tint` là nền tròn sau biểu tượng —
   sáu lối vào nhờ đó phân biệt được bằng màu chứ không chỉ bằng chữ. */
const gateways: Array<{ accent: string; icon: IconName; title: string; href: string; tint: string }> = [
  { accent: '#3f5bd4', tint: '#eceffc', icon: 'microscope', title: 'Nghiên cứu', href: '/nghien-cuu' },
  { accent: '#0f9d9d', tint: '#e2f5f5', icon: 'chats', title: 'Tư vấn', href: '/tu-van' },
  { accent: '#7b3fd4', tint: '#f0e9fc', icon: 'graduation', title: 'Đào tạo', href: '/dao-tao' },
  { accent: '#48a349', tint: '#e9f5e9', icon: 'clipboard', title: 'Ứng dụng', href: '/ung-dung' },
  { accent: '#ef7d18', tint: '#fdf0e2', icon: 'network', title: 'Mạng lưới', href: '/mang-luoi' },
  { accent: '#e02f6b', tint: '#fce9f0', icon: 'users', title: 'Cộng đồng', href: '/cong-dong' },
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

/* Mỗi cam kết mang một màu trong bảng màu GISA (teal, cam, lam, lam nhạt, lục,
   ô-liu) thay vì lặp lại ba màu theo vị trí. Biểu tượng cũng đổi sang glyph
   riêng cho từng ý: nguyên tử cho liên ngành, tên lửa cho đột phá, chia sẻ cho
   chuyển giao, địa cầu cho toàn cầu, vi xử lý cho ứng dụng công nghệ, trái tim
   trên tay cho tác động xã hội. */
const missions: Array<{ color: string; icon: IconName; text: string; title: string }> = [
  {
    color: '#006b75',
    icon: 'atom',
    title: 'Nghiên cứu và phát triển tri thức liên ngành',
    text: 'GISA thực hiện các nghiên cứu khoa học chuyên sâu và nghiên cứu ứng dụng đa ngành nhằm tạo ra tri thức có giá trị thực tiễn, phục vụ chiến lược phát triển bền vững và quản trị hiện đại.',
  },
  {
    color: '#f15b2a',
    icon: 'rocket',
    title: 'Thúc đẩy đổi mới sáng tạo và tư duy đột phá',
    text: 'GISA khuyến khích, hỗ trợ và lan tỏa các sáng kiến đổi mới trong quản trị, công nghệ, giáo dục và mô hình kinh doanh.',
  },
  {
    color: '#1765aa',
    icon: 'shareNetwork',
    title: 'Chuyển giao tri thức và công nghệ ứng dụng',
    text: 'GISA biến các công trình nghiên cứu và tri thức học thuật thành giải pháp thực tiễn thông qua tư vấn, đào tạo và chuyển giao công nghệ.',
  },
  {
    color: '#4f9be8',
    icon: 'globe',
    title: 'Kết nối và hợp tác toàn cầu',
    text: 'GISA xây dựng mạng lưới tri thức toàn cầu, kết nối các nhà khoa học, chuyên gia, lãnh đạo và doanh nhân để chia sẻ, cộng tác và tạo ra các giải pháp liên kết quốc tế vì lợi ích chung.',
  },
  {
    color: '#32a65a',
    icon: 'cpu',
    title: 'Ứng dụng khoa học – công nghệ vào thực tiễn',
    text: 'GISA phát triển và triển khai các mô hình, công nghệ, công cụ và giải pháp hiện đại nhằm nâng cao hiệu quả hoạt động, năng lực cạnh tranh và khả năng thích ứng trong kỷ nguyên số.',
  },
  {
    color: '#6aa42a',
    icon: 'handHeart',
    title: 'Kiến tạo giá trị và lan tỏa tác động xã hội',
    text: 'GISA thực hiện các sáng kiến, chương trình và dự án vì cộng đồng, hướng tới nâng cao phúc lợi xã hội, bảo vệ môi trường và thúc đẩy sự phát triển nhân văn, bền vững.',
  },
];

const HERO_SLIDE_HOLD_MS = 3000;

const heroSlides = [
  {
    alt: 'Nhóm chuyên gia GISA cùng xem mô hình quy hoạch đô thị xanh trên bàn họp',
    headline: ['KIẾN TẠO TRI THỨC', 'LAN TỎA GIÁ TRỊ'],
    image: '/images/gisa-hero-knowledge-horizon-background.png',
    kicker: 'GISA — TRI THỨC CHO PHÁT TRIỂN BỀN VỮNG',
    lead: 'GISA kết nối nghiên cứu liên ngành, tư vấn chiến lược và đào tạo ứng dụng để biến tri thức thành giá trị thực tiễn.',
  },
  {
    alt: 'Nhóm nghiên cứu GISA phân tích mô hình trong khuôn viên xanh',
    headline: ['NGHIÊN CỨU LIÊN NGÀNH', 'TẠO CHUYỂN BIẾN'],
    image: '/images/gisa-hero-interdisciplinary-research-background.png',
    kicker: 'NGHIÊN CỨU & ĐỔI MỚI SÁNG TẠO',
    lead: 'Bằng chứng khoa học, dữ liệu đáng tin cậy và tư duy đột phá cho những quyết định có tác động lâu dài.',
  },
  {
    alt: 'Nhóm chuyên gia GISA đồng hành hoạch định chiến lược phát triển bền vững',
    headline: ['ĐỒNG HÀNH TỔ CHỨC', 'PHÁT TRIỂN BỀN VỮNG'],
    image: '/images/gisa-hero-organizational-partnership-background.png',
    kicker: 'TƯ VẤN, ĐÀO TẠO & CHUYỂN GIAO',
    lead: 'Cùng doanh nghiệp và tổ chức thiết kế giải pháp phù hợp bối cảnh, nâng cao năng lực và đo lường kết quả.',
  },
] as const;

const rises = [
  { code: 'R', label: 'Reliability', color: '#00717b', text: 'Đảm bảo chất lượng, tính trung thực và độ tin cậy trong mọi hoạt động.' },
  { code: 'I', label: 'Innovation', color: '#6aa42a', text: 'Khuyến khích sáng tạo, dám nghĩ mới để tạo ra tri thức đột phá.' },
  { code: 'S', label: 'Science', color: '#4f9be8', text: 'Đặt khoa học làm nền tảng, dựa trên phương pháp nghiêm ngặt và minh bạch.' },
  { code: 'E', label: 'Efficiency', color: '#f28a2c', text: 'Tối ưu nguồn lực, quy trình và thời gian để tạo ra giá trị bền vững.' },
  { code: 'S', label: 'Sustainability', color: '#32a65a', text: 'Hướng tới phát triển lâu dài, trách nhiệm với cộng đồng và môi trường.' },
];

// Values, labels and per-column colours follow the metrics board in /public/assets.
const impactStats = [
  { color: '#0d6a75', value: '5.000+', label: 'Học viên' },
  { color: '#ef5a24', value: '400+', label: 'Doanh nghiệp' },
  { color: '#1a4fa0', value: '200+', label: 'Đối tác trong nước và quốc tế' },
  { color: '#5c9c2e', value: '30+', label: 'Dự án triển khai' },
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
    eyebrow: 'Tin tức và hoạt động nổi bật',
    href: '/tin-tuc',
    itemNoun: 'tin',
    label: 'Tin mới',
      lead: '',
    items: [
      { displayTitle: ['Đổi mới', 'viện nghiên cứu'], image: '/images/knowledge-deck/news-research-institute.webp', meta: 'Giáo dục', title: 'Chuyển đổi mô hình viện nghiên cứu và phát triển đại học đẳng cấp' },
      { displayTitle: ['Tài chính', 'khí hậu'], image: '/images/knowledge-deck/news-climate-finance.webp', meta: 'Phát triển bền vững', title: 'Tài chính khí hậu và tài chính phát triển không thể tách rời' },
      { displayTitle: ['Chatbot AI', 'và độ tin cậy'], image: '/images/knowledge-deck/news-ai-reliability.webp', meta: 'Công nghệ', title: 'Sự phụ thuộc vào chatbot AI nhìn từ những gián đoạn dịch vụ' },
      { displayTitle: ['Vật liệu mới', 'cho đại dương'], image: '/images/knowledge-deck/news-ocean-material.webp', meta: 'Môi trường', title: 'Vật liệu mới và triển vọng giảm ô nhiễm nhựa đại dương' },
    ],
  },
};

const knowledgeOrder: KnowledgeKey[] = ['news', 'research', 'courses'];

const featuredNews = [
  { date: '06.08.2026', image: '/images/knowledge-deck/news-research-institute.webp', kicker: 'Diễn đàn học thuật', title: 'Chuyển đổi mô hình viện nghiên cứu và phát triển đại học đẳng cấp' },
  { date: '24.07.2026', image: '/images/knowledge-deck/news-climate-finance.webp', kicker: 'Phát triển bền vững', title: 'Tài chính khí hậu và tài chính phát triển không thể tách rời' },
  { date: '12.07.2026', image: '/images/knowledge-deck/news-ai-reliability.webp', kicker: 'Công nghệ & quản trị', title: 'Sự phụ thuộc vào chatbot AI nhìn từ những gián đoạn dịch vụ' },
] as const;

// `logo` lấy từ bộ logo GISA gửi kèm (`public/icons/logos`, nguồn là thư mục
// "0 Nội dung Web_GISA/Logo Partner - Renamed"). Logo thay cho dòng chữ tên dự
// án — tên vẫn nằm trong `aria-label` của liên kết cho trình đọc màn hình.
const featuredResearchProjects: Array<{
  alt: string;
  category: string;
  description: string;
  href: string;
  image: string;
  logo: string;
  title: string;
}> = [
  { alt: 'Thành phố xanh với năng lượng tái tạo', category: 'Thương mại bền vững', description: 'Nâng cao năng lực thực hành thương mại bền vững cho doanh nghiệp Việt Nam.', href: '/nghien-cuu/du-an', image: '/images/article-green-city.png', logo: '/icons/logos/02_trade4sd.png', title: 'TRADE4SD' },
  { alt: 'Báo cáo phân tích hiệu suất và dữ liệu', category: 'Hệ thống thực phẩm', description: 'Kết nối dữ liệu và tri thức để hiểu rõ hơn động lực của chuỗi giá trị thực phẩm.', href: '/nghien-cuu/du-an', image: '/images/article-performance-benchmarking.png', logo: '/icons/logos/01_valumics.png', title: 'VALUMICS' },
  { alt: 'Thực phẩm tươi trong hệ thống phân phối', category: 'Chất lượng thực phẩm', description: 'Hợp tác nghiên cứu hướng tới hệ thống thực phẩm minh bạch, bền vững và có trách nhiệm.', href: '/nghien-cuu/du-an', image: '/images/article-food-quality-programs.png', logo: '/icons/logos/04_strength2food.png', title: 'STRENGTH2FOOD' },
  { alt: 'Nhóm chuyên gia quốc tế trao đổi trong cuộc họp', category: 'Hợp tác quốc tế', description: 'Mở rộng trao đổi học thuật, nghiên cứu ứng dụng và kết nối chuyên gia toàn cầu.', href: '/nghien-cuu/du-an', image: '/images/gisa-consulting-hero.png', logo: '/icons/logos/05_british_council.png', title: 'BRITISH COUNCIL' },
];

const COUNT_UP_MS = 1600;

/** Tách "5.000+" thành số 5000 và hậu tố "+" để đếm được phần số. */
function parseStatValue(value: string) {
  const match = value.match(/^([\d.,]+)(.*)$/);
  if (!match) return null;
  const amount = Number(match[1].replace(/[.,]/g, ''));
  if (!Number.isFinite(amount)) return null;
  return { amount, suffix: match[2] };
}

/* Con số chạy từ 0 lên giá trị thật khi dải số liệu cuộn vào khung nhìn. Giá trị
   cuối được render ngay từ máy chủ, nên khi không có JavaScript, khi người dùng
   tắt hiệu ứng chuyển động, hoặc trong môi trường không có IntersectionObserver
   thì con số vẫn hiện đủ chứ không kẹt ở 0. */
function CountUpValue({ value }: { value: string }) {
  const parsed = parseStatValue(value);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const amount = parsed?.amount;
  const suffix = parsed?.suffix;

  useEffect(() => {
    const node = nodeRef.current;
    if (amount === undefined || suffix === undefined || !node) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* Ghi thẳng vào nút DOM thay vì qua state: mỗi khung hình là một con số mới,
       cho React vẽ lại cả cây chỉ để đổi một chuỗi thì phí, mà nút này cũng
       không có gì khác để vẽ. Dọn dẹp thì trả lại đúng giá trị React đang giữ. */
    const write = (current: number) => {
      node.textContent = `${current.toLocaleString('vi-VN')}${suffix}`;
    };
    let frame = 0;
    write(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / COUNT_UP_MS);
          // easeOutCubic: bốc nhanh lúc đầu rồi hãm mềm đúng ở con số cuối.
          const eased = 1 - (1 - progress) ** 3;
          write(Math.round(amount * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = value;
    };
  }, [amount, suffix, value]);

  return <span ref={nodeRef}>{value}</span>;
}

export function HomeTemplate({ model }: { model: HomePageModel }) {
  void model;
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [activeKnowledge, setActiveKnowledge] = useState<KnowledgeKey>('news');
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [heroReady, setHeroReady] = useState(false);
  const [heroFocusWithin, setHeroFocusWithin] = useState(false);
  const [heroHovered, setHeroHovered] = useState(false);
  const heroPaused = heroFocusWithin || heroHovered;
  const knowledge = knowledgeGroups[activeKnowledge];
  const visibleKnowledgeItems = knowledge.items.slice(0, 4);
  const heroSlide = heroSlides[activeHeroSlide];

  useEffect(() => {
    const root = document.documentElement;
    const syncReadyState = () => setHeroReady(root.dataset.siteIntro === 'complete');
    const observer = new MutationObserver(syncReadyState);

    syncReadyState();
    observer.observe(root, { attributeFilter: ['data-site-intro'], attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!heroReady || heroPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, HERO_SLIDE_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [activeHeroSlide, heroPaused, heroReady]);

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

  return (
    <main className={styles.homeMain} id="main-content" tabIndex={-1}>
      <section
        aria-roledescription="carousel"
        className={styles.hero}
        data-scroll-motion-ignore
        id="trang-chu"
        onFocusCapture={() => setHeroFocusWithin(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHeroFocusWithin(false);
        }}
        onPointerEnter={() => setHeroHovered(true)}
        onPointerLeave={() => setHeroHovered(false)}
      >
        <div className={styles.heroMedia}>
          {heroSlides.map((slide, index) => (
            <Image
              alt={index === activeHeroSlide ? slide.alt : ''}
              aria-hidden={index !== activeHeroSlide}
              className={`${styles.heroImage} ${index === activeHeroSlide ? styles.heroImageActive : ''}`}
              fill
              key={slide.image}
              loading={index === 0 ? undefined : 'eager'}
              preload={index === 0}
              sizes="100vw"
              src={slide.image}
            />
          ))}
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.heroKickerPhrase}>{bindPhrases(heroSlide.kicker)}</span>
            </p>
            <span aria-hidden="true" className={styles.heroOrnament}><Icon name="leaf" size={14} /></span>
            {/* Each line is its own block so the first-load sequence can bring them
                in one after another; a plain <br> gives nothing to animate. */}
            <h1 data-hero-slide={activeHeroSlide}><span>{bindPhrases(heroSlide.headline[0])}</span><span><em>{bindPhrases(heroSlide.headline[1])}</em></span></h1>
            <p className={styles.heroLead}>
              <span>{bindPhrases(heroSlide.lead)}</span>
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
              style={{
                '--gateway-accent': item.accent,
                '--gateway-tint': item.tint,
                '--motion-index': index,
              } as React.CSSProperties}
            >
              <span className={styles.gatewayIcon}><Icon name={item.icon} size={30} /></span>
              <strong>{bindPhrases(item.title)}</strong>
              <i aria-hidden="true" className={styles.gatewayRule} />
            </Link>
          ))}
        </div>
      </nav>

      <section aria-labelledby="featured-news-title" className={styles.featuredNewsSection}>
        <div className={styles.contentContainer}>
          <header className={styles.featuredNewsHeading}>
            <div>
              <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases('Nhịp sống GISA')}</p>
              <h2 id="featured-news-title">{bindPhrases('TIN TỨC & HOẠT ĐỘNG NỔI BẬT')}</h2>
            </div>
            <Link className={styles.featuredNewsAllLink} href="/tin-tuc">
              {bindPhrases('Xem tất cả tin tức ')}<Icon name="arrow" size={18} />
            </Link>
          </header>
          <div className={styles.featuredNewsGrid}>
            {featuredNews.map((item, index) => (
              <article className={styles.featuredNewsItem} key={item.title}>
                <Link aria-label={`Đọc tin ${item.title}`} href="/tin-tuc">
                  <span className={styles.featuredNewsImage}>
                    <Image alt={`Ảnh minh họa: ${item.title}`} fill priority={index === 0} sizes="(max-width: 48rem) 100vw, (max-width: 70rem) 50vw, 42vw" src={item.image} />
                  </span>
                  <span className={styles.featuredNewsContent}>
                    <span className={styles.featuredNewsIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <small>{bindPhrases(item.kicker)}</small>
                      <strong>{bindPhrases(item.title)}</strong>
                      <time dateTime={item.date.split('.').reverse().join('-')}>{item.date}</time>
                    </span>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.aboutSection} id="gioi-thieu">
        <div className={styles.contentContainer}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutIntro}>
              {/* Dải này là dải nội dung duy nhất còn thiếu chip nhãn, trong khi
                  Cam kết tác động, Năng lực, Tri thức và RISES đều có. */}
              <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases('Giới thiệu GISA')}</p>
              <h2>{bindPhrases("TRI THỨC CHO PHÁT TRIỂN BỀN VỮNG")}</h2>
              {/* Liên kết đi cùng tiêu đề chứ không nằm cuối đoạn văn: cột trái
                  nhờ đó có điểm mở và điểm đóng, đọc ra là một khối hoàn chỉnh
                  (nhãn, tiêu đề, lối đi tiếp). */}
              <Link className={styles.textLink} href="/gioi-thieu">{bindPhrases("Khám phá câu chuyện GISA ")}<Icon name="arrow" size={19} /></Link>
            </div>
            <div className={styles.aboutBody}>
              {/* Nguyên văn mục "GIỚI THIỆU CHUNG" trong `0 Nội dung Web_GISA/2a Web home.docx`. */}
              <p>{bindPhrases("Viện Phát triển Bền vững và Quản lý Nâng cao Toàn cầu (GISA - Global Institute for Sustainable Development and Advanced Management) được xây dựng và phát triển nhằm giải quyết những thách thức cấp bách và thích ứng với những thay đổi nhanh chóng của thế giới hiện đại. Từ biến đổi khí hậu, cạn kiệt tài nguyên đến bất ổn kinh tế - xã hội, tất cả đều đòi hỏi những giải pháp tích hợp, liên ngành và toàn diện. Đồng thời, sự bùng nổ của khoa học công nghệ, trí tuệ nhân tạo và chuyển đổi số đang tạo ra động lực và mở ra cơ hội để định hình lại các mô hình kinh tế và quản trị tiên tiến, hướng đến sự phát triển bền vững và đổi mới sáng tạo.")}</p>
              <p>{bindPhrases("Là tổ chức khoa học và công nghệ hoạt động theo hướng phi lợi nhuận, GISA tiên phong trong nghiên cứu, tư vấn, đào tạo và chuyển giao tri thức, tập trung vào ứng dụng công nghệ hiện đại và các mô hình quản trị tiên tiến nhằm mang đến những giải pháp đột phá, giúp doanh nghiệp và tổ chức phát triển bền vững, hiệu quả và thích ứng trong kỷ nguyên số. GISA mang trong mình sứ mệnh phát triển tri thức và kết nối các nhà khoa học, nhà lãnh đạo, doanh nhân và cộng đồng toàn cầu.")}</p>
            </div>
          </div>
          {/* Tầm nhìn và Sứ mệnh chạy hết bề ngang ngay dưới phần dẫn, thay vì
              nằm trong cột phải: hai thẻ ngắn không bao giờ cao bằng hai đoạn
              văn bên trái, nên cột phải luôn hụt một mảng trống lớn ở dưới. */}
          <div className={styles.visionStack}>
              <div className={styles.visionCard}>
                <Link className={styles.visionCardLink} href="/gioi-thieu/cau-chuyen-gisa#tam-nhin">
                  <article>
                    <span aria-hidden="true" className={styles.visionIcon}><Icon name="mountains" size={30} weight="bold" /></span>
                    <div><h3>{bindPhrases("Tầm nhìn")}</h3><p>{bindPhrases("Tới năm 2030, GISA trở thành đơn vị tiên phong, uy tín cao và được biết đến rộng rãi về tri thức và thực hành trong lĩnh vực đổi mới sáng tạo, phát triển bền vững và quản lý nâng cao tại Việt Nam và khu vực thông qua các trụ cột hoạt động gồm nghiên cứu, tư vấn, đào tạo, chuyển giao ứng dụng, thúc đẩy mạng lưới hợp tác toàn cầu và đóng góp cộng đồng.")}</p></div>
                    <span aria-hidden="true" className={styles.visionArrow}><Icon name="arrow" size={19} /></span>
                  </article>
                </Link>
                <Link className={styles.visionCardLink} href="/gioi-thieu/cau-chuyen-gisa#su-menh">
                  <article>
                    <span aria-hidden="true" className={styles.visionIcon}><Icon name="target" size={30} weight="bold" /></span>
                    <div><h3>{bindPhrases("Sứ mệnh")}</h3><p>{bindPhrases("GISA thúc đẩy phát triển bền vững và thịnh vượng toàn cầu thông qua nghiên cứu liên ngành, đổi mới sáng tạo, chuyển giao tri thức, ứng dụng khoa học - công nghệ và kiến tạo các giá trị xã hội, kết nối các nhà khoa học, chuyên gia, nhà lãnh đạo, doanh nghiệp và tổ chức trên toàn thế giới.")}</p></div>
                    <span aria-hidden="true" className={styles.visionArrow}><Icon name="arrow" size={19} /></span>
                  </article>
                </Link>
            </div>
          </div>
          <Link className={styles.aboutMotto} href="/gioi-thieu/cau-chuyen-gisa#khau-hieu">
            <span className={styles.aboutMottoIcon} aria-hidden="true"><Icon name="leaf" size={40} /></span>
            <span className={styles.aboutMottoText}>
              {/* Một dòng duy nhất: nhãn "Khẩu hiệu GISA" đã bỏ vì dải này chỉ
                  còn chở đúng câu khẩu hiệu, không cần ai giới thiệu nó nữa. */}
              <span className={styles.aboutMottoLines}>
                {bindPhrases('Kiến tạo tri thức – Lan tỏa giá trị')}
              </span>
            </span>
            <Icon name="arrow" size={30} />
          </Link>
          <div className={styles.impactStatsBlock}>
            <dl className={styles.impactStats}>
              {impactStats.map((item) => (
                <div key={item.label} style={{ '--stat-color': item.color } as React.CSSProperties}>
                  <dt><CountUpValue value={item.value} /></dt>
                  <dd>{bindPhrases(item.label)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="mission-title" className={styles.missionSection} id="su-menh-gisa">
        <div className={styles.contentContainer}>
          <header className={styles.missionHeading} data-scroll-motion="reveal">
            <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{bindPhrases('Sứ mệnh GISA')}</p>
            <h2 id="mission-title">{bindPhrases('CAM KẾT TÁC ĐỘNG')}</h2>
          </header>
          <ol className={styles.missionGrid}>
            {missions.map((mission, index) => (
              <li
                data-scroll-motion="item"
                key={mission.title}
                style={{ '--mission-accent': mission.color, '--motion-index': index } as React.CSSProperties}
              >
                <span aria-hidden="true" className={styles.missionPictogram}>
                  <Icon name={mission.icon} size={32} weight="fill" />
                </span>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <h3>{bindPhrases(mission.title)}</h3>
                <p>{bindPhrases(mission.text)}</p>
              </li>
            ))}
          </ol>
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

      <div className={styles.journeyCta} data-scroll-motion="section">
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
            {knowledge.lead ? (
              <p className={styles.knowledgeLead}>{bindPhrases(knowledge.lead)}</p>
            ) : null}
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
                <span className={styles.researchGalleryLogo}>
                  <Image
                    alt={`Logo ${project.title}`}
                    height={64}
                    src={project.logo}
                    width={180}
                  />
                </span>
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
            <div className={`${styles.heroForm} ${styles.consultationForm}`} id="tu-van">
              <button aria-label="Đóng bảng trao đổi" className={styles.dialogClose} onClick={() => setConsultationOpen(false)} type="button"><Icon name="close" size={22} /></button>
              <h2 id="consultation-title">{bindPhrases("Trao đổi cùng GISA")}</h2>
              <p>{bindPhrases("Chúng tôi sẵn sàng lắng nghe và đồng hành cùng bạn.")}</p>
              <GisaForm kind="hop-tac" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
