import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './ui.module.css';

interface ButtonLinkProps {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'secondary';
}

export function ButtonLink({
  children,
  href,
  variant = 'primary',
}: ButtonLinkProps) {
  return (
    <Link className={`${styles.buttonLink} ${styles[variant]}`} href={href}>
      {children}
    </Link>
  );
}
