import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import { Icon } from '@/components/ui/icon';
import { FooterAffiliation } from '@/components/site/footer-affiliation';

import styles from './site-shell.module.css';
import { bindPhrases } from '@/lib/vietnamese-text';

const footerGroups = [
  {
    heading: 'Nghiên cứu',
    href: '/nghien-cuu',
    links: ['Khoa học lý thuyết', 'Khoa học thực nghiệm', 'Nghiên cứu doanh nghiệp', 'Nghiên cứu chính sách công', 'Nghiên cứu thị trường'],
    columns: 1,
  },
  {
    heading: 'Tư vấn',
    href: '/tu-van',
    links: ['Quản trị hiệu suất', 'Quản trị nhân sự', 'Nâng cao năng suất', 'Tái cấu trúc', 'Chiến lược kinh doanh', 'Tài chính và Thuế', 'Sản xuất sạch hơn', 'Quản trị bền vững', 'Chính sách'],
    // Nine links — split into two sub-columns so this group stays the same height
    // as the others instead of running twice as long.
    columns: 2,
  },
  {
    heading: 'Đào tạo',
    href: '/dao-tao',
    links: ['Quản trị nguồn nhân lực', 'Lãnh đạo toàn diện', 'Lãnh đạo bền vững', 'Quản trị chiến lược kinh doanh', 'Quản trị doanh nghiệp bền vững'],
    columns: 1,
  },
  {
    heading: 'Tìm hiểu thêm',
    href: '/dao-tao',
    links: ['Tâm lý học ứng dụng', 'Kinh tế học cho lãnh đạo', 'Phân tích kinh doanh', 'Ứng dụng trí tuệ nhân tạo'],
    columns: 1,
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerInner}>
        <div className={styles.footerLead}>
          <div
            className={styles.footerBrand}
            data-scroll-motion="item"
            style={{ '--motion-index': 0 } as CSSProperties}
          >
            <Image alt="GISA" height={72} src="/brand/gisa-logo-temp.png" width={72} />
            <div><strong>GISA</strong><span>{bindPhrases("Cùng kiến tạo tác động")}</span></div>
          </div>
          <div
            className={styles.footerConclusion}
            data-scroll-motion="item"
            style={{ '--motion-index': 1 } as CSSProperties}
          >
            <p>{bindPhrases("Kết nối tri thức liên ngành, kiến tạo tác động bền vững.")}</p>
          </div>
          <Link
            className={styles.footerCta}
            data-scroll-motion="item"
            href="/lien-he"
            style={{ '--motion-index': 2 } as CSSProperties}
          >
            {bindPhrases("Bắt đầu trao đổi ")}<Icon name="arrow" size={18} />
          </Link>
        </div>

        <div className={styles.footerGrid}>
          <div className={styles.footerDirectory}>
            {footerGroups.map((group, index) => (
              <nav
                aria-label={group.heading}
                className={styles.footerGroup}
                data-scroll-motion="item"
                key={group.heading}
                style={{ '--motion-index': index } as CSSProperties}
              >
                <Link className={styles.footerGroupHeading} href={group.href}>{group.heading}</Link>
                <ul className={group.columns === 2 ? styles.footerGroupColumns : undefined}>
                  {group.links.map((label) => <li key={label}><Link href={group.href}>{bindPhrases(label)}</Link></li>)}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className={styles.footerBottom} data-scroll-motion="reveal">
          <span>{bindPhrases("© 2026 GISA. Kiến tạo kiến thức, lan tỏa giá trị.")}</span>
          <FooterAffiliation />
        </div>
      </div>
    </footer>
  );
}
