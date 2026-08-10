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
    root: '/gioi-thieu',
    section: 'about',
    signal: 'Tổ chức · Sứ mệnh · Con người',
  },
  research: {
    accent: 'blue',
    code: '02',
    icon: 'microscope',
    image: '/images/gisa-hero-knowledge-horizon-background.png',
    label: 'Nghiên cứu',
    root: '/nghien-cuu',
    section: 'research',
    signal: 'Dữ liệu · Bằng chứng · Tri thức',
  },
  consulting: {
    accent: 'teal',
    code: '03',
    icon: 'chats',
    image: '/images/gisa-consulting-hero.png',
    label: 'Tư vấn',
    root: '/tu-van',
    section: 'consulting',
    signal: 'Chẩn đoán · Chiến lược · Chuyển đổi',
  },
  training: {
    accent: 'orange',
    code: '04',
    icon: 'graduation',
    image: '/images/knowledge-journey/training-session-editorial.png',
    label: 'Đào tạo',
    root: '/dao-tao',
    section: 'training',
    signal: 'Năng lực · Thực hành · Dẫn dắt',
  },
  application: {
    accent: 'blue',
    code: '05',
    icon: 'lightbulb',
    image: '/images/hero-gisa-strategy-table.png',
    label: 'Ứng dụng',
    root: '/ung-dung',
    section: 'application',
    signal: 'Khoa học · Công nghệ · Chuyển giao',
  },
  network: {
    accent: 'blue',
    code: '06',
    icon: 'network',
    image: '/images/project-trade4sd.png',
    label: 'Mạng lưới',
    root: '/mang-luoi',
    section: 'network',
    signal: 'Đối tác · Chuyên gia · Hợp tác',
  },
  community: {
    accent: 'green',
    code: '07',
    icon: 'users',
    image: '/images/article-green-city.png',
    label: 'Cộng đồng',
    root: '/cong-dong',
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
  return HERO_VISUALS_BY_PATH[path] ?? { alt: '', src: profileForPath(path).image };
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
      data-title-length={title.length > 32 ? 'long' : 'standard'}
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
  const group = NAVIGATION.find((item) => item.href === profile.root);
  if (!group?.children.length) return null;

  return <SectionSubnavRail
    label={`Khám phá ${profile.label}`}
    links={[
      { href: group.href, label: 'Tổng quan' },
      ...group.children.map((item) => ({ href: item.href, label: item.label })),
    ]}
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
