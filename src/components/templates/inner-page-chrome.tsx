import Image from 'next/image';
import type { ReactNode } from 'react';

import { Icon, type IconName } from '@/components/ui/icon';
import { NAVIGATION } from '@/content/navigation';
import type { ContentBlock } from '@/content/types';
import { toAnchorId } from '@/lib/anchor-id';
import { bindPhrases } from '@/lib/vietnamese-text';

import { SectionSubnavRail } from './section-subnav-rail';
import styles from './templates.module.css';

interface SectionProfile {
  accent: string;
  code: string;
  icon: IconName;
  image: string;
  label: string;
  root: string;
  section: string;
  signal: string;
}

const PROFILES: Record<string, SectionProfile> = {
  about: {
    accent: 'teal',
    code: '01',
    icon: 'compass',
    image: '/images/hero-gisa-team.png',
    label: 'Về GISA',
    root: '/gioi-thieu/cau-chuyen-gisa',
    section: 'about',
    signal: 'Tổ chức · Sứ mệnh · Con người',
  },
  research: {
    accent: 'blue',
    code: '02',
    icon: 'microscope',
    image: '/images/gisa-hero-knowledge-horizon-background.png',
    label: 'Nghiên cứu',
    root: '/nghien-cuu/linh-vuc',
    section: 'research',
    signal: 'Dữ liệu · Bằng chứng · Tri thức',
  },
  consulting: {
    accent: 'teal',
    code: '03',
    icon: 'chats',
    image: '/images/gisa-consulting-hero.png',
    label: 'Tư vấn',
    root: '/tu-van/linh-vuc',
    section: 'consulting',
    signal: 'Chẩn đoán · Chiến lược · Chuyển đổi',
  },
  training: {
    accent: 'orange',
    code: '04',
    icon: 'graduation',
    image: '/images/knowledge-journey/training-session-editorial.png',
    label: 'Đào tạo',
    root: '/dao-tao/linh-vuc',
    section: 'training',
    signal: 'Năng lực · Thực hành · Dẫn dắt',
  },
  application: {
    accent: 'blue',
    code: '05',
    icon: 'lightbulb',
    image: '/images/hero-gisa-strategy-table.png',
    label: 'Ứng dụng',
    root: '/ung-dung/linh-vuc',
    section: 'application',
    signal: 'Khoa học · Công nghệ · Chuyển giao',
  },
  network: {
    accent: 'blue',
    code: '06',
    icon: 'network',
    image: '/images/project-trade4sd.png',
    label: 'Mạng lưới',
    root: '/mang-luoi/thuc-day-hop-tac',
    section: 'network',
    signal: 'Đối tác · Chuyên gia · Hợp tác',
  },
  community: {
    accent: 'green',
    code: '07',
    icon: 'users',
    image: '/images/article-green-city.png',
    label: 'Cộng đồng',
    root: '/cong-dong/kinh-te-ben-vung',
    section: 'community',
    signal: 'Con người · Môi trường · Tác động',
  },
  news: {
    accent: 'orange',
    code: '08',
    icon: 'megaphone',
    image: '/images/knowledge-deck/news-research-institute.webp',
    label: 'Tin tức',
    root: '/tin-tuc',
    section: 'news',
    signal: 'Tin mới · Góc nhìn · Lịch hoạt động',
  },
  contact: {
    accent: 'teal',
    code: '09',
    icon: 'send',
    image: '/images/hero-gisa-team.png',
    label: 'Kết nối',
    root: '/lien-he',
    section: 'contact',
    signal: 'Trao đổi · Hợp tác · Đồng hành',
  },
};

const HERO_VISUALS_BY_PATH: Record<string, { alt: string; src: string }> = {
  '/dao-tao/linh-vuc': {
    alt: 'Giảng viên chia sẻ trong chương trình phát triển năng lực của GISA',
    src: '/images/knowledge-journey/training-session-editorial.png',
  },
  '/dao-tao/gisa-core': {
    alt: 'Chương trình xây dựng năng lực chuyên môn và quản trị nhân sự',
    src: '/images/course-strategic-human-resources.png',
  },
  '/dao-tao/gisa-edge': {
    alt: 'Học viên trải nghiệm chương trình chuỗi cung ứng và logistics số',
    src: '/images/course-digital-supply-chain-logistics.png',
  },
  '/dao-tao/gisa-rise': {
    alt: 'Chương trình phát triển năng lực kinh doanh và bán hàng đa kênh',
    src: '/images/course-multichannel-effective-sales.png',
  },
  '/dao-tao/gisa-ascend': {
    alt: 'Chương trình quản trị tài chính dành cho nhà lãnh đạo doanh nghiệp',
    src: '/images/course-sme-financial-management.png',
  },
  '/dao-tao/gisa-legacy': {
    alt: 'Đội ngũ lãnh đạo cùng trao đổi về hành trình phát triển dài hạn',
    src: '/images/hero-gisa-team.png',
  },
  '/ung-dung/linh-vuc': {
    alt: '',
    src: '/images/knowledge-journey/transfer-field-editorial.png',
  },
  '/ung-dung/quan-ly-kinh-doanh': {
    alt: '',
    src: '/images/article-performance-benchmarking.png',
  },
  '/ung-dung/khoa-hoc-cong-nghe': {
    alt: '',
    src: '/images/article-ai-chatbot.png',
  },
  '/ung-dung/kinh-te-ben-vung': {
    alt: '',
    src: '/images/banner-sustainable-development-goals.png',
  },
  '/ung-dung/tam-ly-phat-trien-con-nguoi': {
    alt: '',
    src: '/images/knowledge-journey/community-action-editorial.png',
  },
  '/mang-luoi/thuc-day-hop-tac': {
    alt: '',
    src: '/images/banner-global-network.png',
  },
  '/mang-luoi/doi-tac': {
    alt: '',
    src: '/images/banner-global-network.png',
  },
  '/mang-luoi/quy-nha-tai-tro': {
    alt: 'Đội ngũ trao đổi về nguồn lực đồng hành cho các sáng kiến tạo tác động',
    src: '/images/hero-gisa-strategy-table.png',
  },
  '/cong-dong/kinh-te-ben-vung': {
    alt: '',
    src: '/images/banner-sustainable-development-goals.png',
  },
  '/cong-dong/trach-nhiem-xa-hoi': {
    alt: '',
    src: '/images/knowledge-journey/community-action-editorial.png',
  },
  '/cong-dong/bao-ve-moi-truong': {
    alt: '',
    src: '/images/article-renewables.png',
  },
  '/cong-dong/quan-tri-hieu-qua': {
    alt: '',
    src: '/images/article-esg-report.png',
  },
  '/cong-dong/mo-hinh-phat-trien-kinh-te-tuan-hoan-tai-dia-phuong': {
    alt: '',
    src: '/images/banner-sustainable-development-goals.png',
  },
  '/tin-tuc/tai-chinh-khi-hau-va-phat-trien': {
    alt: '',
    src: '/images/knowledge-deck/news-climate-finance.webp',
  },
  '/tin-tuc/nhua-tan-trong-nuoc-bien': {
    alt: '',
    src: '/images/knowledge-deck/news-ocean-material.webp',
  },
  '/tin-tuc/thong-bao-lich': {
    alt: '',
    src: '/images/hero-gisa-team.png',
  },
  '/tin-tuc/thong-bao-lich/tuyen-dung-vi-tri-tro-ly-nghien-cuu': {
    alt: '',
    src: '/images/hero-gisa-team.png',
  },
};

const INITIATIVE_DETAIL_VISUALS = [
  { alt: 'Mô hình đô thị và cộng đồng phát triển theo hướng bền vững', src: '/images/article-green-city.png' },
  { alt: 'Chuỗi giá trị nông nghiệp gắn với sinh kế địa phương', src: '/images/article-da-xanh-pomelo.png' },
  { alt: 'Cộng đồng cùng tham gia hoạt động tạo tác động', src: '/images/knowledge-journey/community-action-editorial.png' },
  { alt: 'Dữ liệu hỗ trợ theo dõi và đánh giá tác động phát triển', src: '/images/article-performance-benchmarking.png' },
  { alt: 'Năng lượng tái tạo góp phần bảo vệ môi trường địa phương', src: '/images/article-renewables.png' },
  { alt: 'Mục tiêu phát triển bền vững định hướng hành động cộng đồng', src: '/images/banner-sustainable-development-goals.png' },
] as const;

export function profileForPath(path: string): SectionProfile {
  if (path.startsWith('/gioi-thieu') || path.startsWith('/chuyen-gia')) return PROFILES.about;
  if (path.startsWith('/nghien-cuu')) return PROFILES.research;
  if (path.startsWith('/tu-van') || path === '/dang-ky/tu-van') return PROFILES.consulting;
  if (path.startsWith('/dao-tao') || path.startsWith('/khoa-hoc') || path === '/dang-ky/khoa-hoc') return PROFILES.training;
  if (path.startsWith('/ung-dung')) return PROFILES.application;
  if (path.startsWith('/mang-luoi') || path === '/dang-ky/hop-tac') return PROFILES.network;
  if (path.startsWith('/cong-dong')) return PROFILES.community;
  if (path.startsWith('/tin-tuc')) return PROFILES.news;
  return PROFILES.contact;
}

export function heroVisualForPath(path: string) {
  const configured = HERO_VISUALS_BY_PATH[path];
  if (configured) {
    return {
      ...configured,
      alt: configured.alt || `Hình ảnh minh họa cho ${profileForPath(path).label}`,
    };
  }

  if (path.startsWith('/cong-dong/')) {
    const index = [...path].reduce((total, character) => total + character.charCodeAt(0), 0)
      % INITIATIVE_DETAIL_VISUALS.length;
    return INITIATIVE_DETAIL_VISUALS[index] ?? INITIATIVE_DETAIL_VISUALS[0];
  }

  const profile = profileForPath(path);
  return { alt: `Hình ảnh minh họa cho ${profile.label}`, src: profile.image };
}

interface InnerPageHeroProps {
  description: string;
  eyebrow: ReactNode;
  image?: { alt: string; src: string };
  meta?: ReactNode;
  path: string;
  title: string;
}

export function InnerPageHero({
  description,
  eyebrow,
  image,
  meta,
  path,
  title,
}: InnerPageHeroProps) {
  const profile = profileForPath(path);
  const visual = image ?? heroVisualForPath(path);

  return (
    <header
      className={styles.innerHero}
      data-accent={profile.accent}
      data-section={profile.section}
      data-title-length={title.length > 24 ? 'long' : 'standard'}
      data-scroll-motion="reveal"
    >
      <div className={styles.innerHeroCopy}>
        <div className={styles.innerHeroSection}>
          <span className={styles.innerHeroIcon}><Icon name={profile.icon} size={20} /></span>
          <span>{bindPhrases(profile.label)}</span>
          <span aria-hidden="true" className={styles.innerHeroRule} />
          <span className={styles.innerHeroCode}>{profile.code}</span>
        </div>
        <p className={styles.innerHeroEyebrow}>
          {typeof eyebrow === 'string' ? bindPhrases(eyebrow) : eyebrow}
        </p>
        <h1>{bindPhrases(title)}</h1>
        <p className={styles.innerHeroDescription}>{bindPhrases(description)}</p>
        {meta ? <div className={styles.innerHeroMeta}>{meta}</div> : null}
      </div>
      <figure className={styles.innerHeroVisual} data-scroll-motion="media">
        <Image
          alt={visual.alt}
          fill
          priority
          sizes="(max-width: 56rem) 100vw, 46vw"
          src={visual.src}
        />
        <figcaption className={styles.innerHeroGlass}>
          <span>{bindPhrases(profile.signal)}</span>
          <strong>GISA / {profile.code}</strong>
        </figcaption>
      </figure>
    </header>
  );
}

export function SectionSubnav({ path }: { path: string }) {
  const profile = profileForPath(path);
  const groupLabel = profile.label === 'Về GISA' ? 'Giới thiệu' : profile.label;
  const group = NAVIGATION.find((item) => item.label === groupLabel);
  if (!group?.children.length) return null;

  return <SectionSubnavRail
    label={`Khám phá ${profile.label}`}
    links={group.children.map((item) => ({ href: item.href, label: item.label }))}
    path={path}
  />;
}

export function ContentIndex({ blocks }: { blocks: ContentBlock[] }) {
  const headings = blocks.filter(
    (block): block is Extract<ContentBlock, { type: 'heading' }> =>
      block.type === 'heading' && block.level === 2,
  );
  if (headings.length < 2) return null;

  return (
    <nav className={styles.contentIndex} aria-label="Mục lục trang">
      <p>Trong trang này</p>
      <ol>
        {headings.map((heading, index) => (
          <li key={`${heading.text}-${index}`}>
            <a href={`#${toAnchorId(heading.text)}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {bindPhrases(heading.text)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
