'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { NAVIGATION, type NavigationGroup } from '@/content/navigation';
import { Icon } from '@/components/ui/icon';

import styles from './site-shell.module.css';

export function isNavigationGroupActive(
  pathname: string | null,
  group: NavigationGroup,
) {
  if (!pathname) return false;

  return (
    pathname === group.href ||
    (group.href !== '/' && pathname.startsWith(`${group.href}/`)) ||
    group.children.some(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
  );
}

export function DesktopNavigation() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const menuIdPrefix = useId();
  const pathname = usePathname();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!navigationRef.current?.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  function closeAndFocus(index: number) {
    setOpenIndex(null);
    navigationRef.current
      ?.querySelector<HTMLButtonElement>(`[data-menu-index="${index}"]`)
      ?.focus();
  }

  return (
    <nav
      aria-label="Điều hướng chính"
      className={styles.desktopNavigation}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpenIndex(null);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && openIndex !== null) {
          event.preventDefault();
          closeAndFocus(openIndex);
        }
      }}
      ref={navigationRef}
    >
      <ul className={styles.desktopList}>
        {NAVIGATION.map((group, index) => {
          const hasChildren = group.children.length > 0;
          const isOpen = openIndex === index;
          const menuId = `${menuIdPrefix}-${index}`;

          return (
            <li
              className={styles.desktopItem}
              key={group.href}
              /* Opens on hover so the menu needs no click. Guarded on
                 `pointerType`, because a tap also fires pointerenter — without
                 the guard the tap would open the menu and the click that follows
                 would immediately toggle it shut again. Touch keeps using the
                 button, which stays for keyboard users too. */
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' && hasChildren) setOpenIndex(index);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse') {
                  setOpenIndex((current) => (current === index ? null : current));
                }
              }}
            >
              <div className={styles.topLevelLinkRow}>
                {/* Marks the section you are in — the head bar shows it as a dot
                    before the label. `/` must match exactly or it would light up
                    on every page. `usePathname()` is null when the component is
                    rendered outside an app-router context, as the unit tests do,
                    so every read of it has to be optional. */}
                <Link
                  aria-current={
                    isNavigationGroupActive(pathname, group)
                      ? 'page'
                      : undefined
                  }
                  href={group.href}
                >
                  {group.label}
                </Link>
                {hasChildren ? (
                  <button
                    aria-controls={menuId}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Đóng' : 'Mở'} menu ${group.label}`}
                    className={styles.submenuTrigger}
                    data-menu-index={index}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    type="button"
                  >
                    <Icon name="caret" size={15} />
                  </button>
                ) : null}
              </div>
              {hasChildren && isOpen ? (
                <ul className={styles.megaMenu} id={menuId}>
                  {group.children.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => setOpenIndex(null)}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
