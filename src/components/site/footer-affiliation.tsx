import Image from 'next/image';

import styles from './site-shell.module.css';

export function FooterAffiliation() {
  return (
    <nav
      aria-label="Thiết kế bởi ENGONOW"
      className={styles.affiliationLockup}
    >
      <a
        aria-label="Truy cập nền tảng học tập ENGONOW"
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
