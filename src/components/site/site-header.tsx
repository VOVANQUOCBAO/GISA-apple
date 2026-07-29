'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { Icon } from '@/components/ui/icon';

import { DesktopNavigation } from './desktop-navigation';
import { LanguageControl } from './language-control';
import { MobileNavigation } from './mobile-navigation';
import styles from './site-shell.module.css';

export function SiteHeader() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  function closeMobileMenu() {
    setIsMobileOpen(false);
    mobileTriggerRef.current?.focus();
  }

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <Link aria-label="GISA — Trang chủ" className={styles.headerBrand} href="/">
          <span className={styles.logoLink}>
            <Image
              alt=""
              className={styles.logo}
              height={2048}
              priority
              src="/brand/gisa-logo-temp.png"
              width={2048}
            />
          </span>
          <span className={styles.headerBrandName}>GISA</span>
        </Link>
        <DesktopNavigation />
        <div className={styles.headerActions}>
          <LanguageControl />
          <Link className={styles.searchLink} href="/tim-kiem">
            <Icon name="search" size={18} />
            <span>Tìm kiếm</span>
          </Link>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMobileOpen}
            aria-label={isMobileOpen ? 'Đóng menu' : 'Mở menu'}
            className={styles.mobileTrigger}
            onClick={() =>
              isMobileOpen ? closeMobileMenu() : setIsMobileOpen(true)
            }
            ref={mobileTriggerRef}
            type="button"
          >
            <Icon name={isMobileOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
      <div id="mobile-navigation">
        <MobileNavigation isOpen={isMobileOpen} onClose={closeMobileMenu} />
      </div>
    </header>
  );
}
