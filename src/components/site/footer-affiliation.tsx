'use client';

import Image from '@/components/ui/content-image';
import { useTranslation } from '@/lib/i18n/language-provider';

import styles from './site-shell.module.css';

export function FooterAffiliation() {
  const t = useTranslation();
  return (
    <nav
      aria-label={t('Thiết kế bởi ENGONOW')}
      className={styles.affiliationLockup}
    >
      <a
        aria-label={t('Truy cập nền tảng học tập ENGONOW')}
        className={styles.affiliationCredit}
        href="https://study.engonow.com/vi"
        rel="noreferrer"
        target="_blank"
      >
        <span className={styles.affiliationCreditLabel}>Designed by</span>
        <span className={styles.engonowWordmark}>
          <Image
            alt="ENGONOW"
            height={500}
            src="/brand/engonow-wordmark-white.webp"
            width={500}
          />
        </span>
      </a>
    </nav>
  );
}
