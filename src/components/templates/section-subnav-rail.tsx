'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './templates.module.css';

interface SectionSubnavRailProps {
  label: string;
  links: Array<{ href: string; label: string }>;
  path: string;
}

export function SectionSubnavRail({ label, links, path }: SectionSubnavRailProps) {
  const navRef = useRef<HTMLElement>(null);
  const activeHref = links
    .filter((item) => path === item.href || path.startsWith(`${item.href}/`))
    .sort((left, right) => right.href.length - left.href.length)[0]?.href;

  useEffect(() => {
    const nav = navRef.current;
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !current || nav.scrollWidth <= nav.clientWidth) return;

    nav.scrollLeft = Math.max(
      0,
      current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2,
    );
  }, [path]);

  return (
    <nav aria-label={label} className={styles.sectionSubnav} ref={navRef}>
      {links.map((item) => (
        <Link
          aria-current={activeHref === item.href ? 'page' : undefined}
          href={item.href}
          key={item.href}
        >
          {bindPhrases(item.label)}
        </Link>
      ))}
    </nav>
  );
}
