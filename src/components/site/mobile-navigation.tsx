'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { NAVIGATION } from '@/content/navigation';

import styles from './site-shell.module.css';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLButtonElement>('button')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.mobileBackdrop} onPointerDown={onClose}>
      <div
        aria-label="Menu chính"
        aria-modal="true"
        className={styles.mobilePanel}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            onClose();
            return;
          }

          if (event.key !== 'Tab') return;
          const focusable = Array.from(
            panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
          );
          const first = focusable[0];
          const last = focusable.at(-1);

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onPointerDown={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
      >
        <div className={styles.mobilePanelHeader}>
          <strong>Điều hướng</strong>
          <button aria-label="Đóng menu" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <nav aria-label="Điều hướng chính trên thiết bị di động">
          <ul className={styles.mobileList}>
            {NAVIGATION.map((group) => {
              const hasChildren = group.children.length > 0;
              const isExpanded = expandedGroups.has(group.href);
              const panelId = `mobile-${group.href.replaceAll('/', '-') || 'home'}`;

              return (
                <li key={group.href}>
                  <div className={styles.mobileLinkRow}>
                    <Link href={group.href} onClick={onClose}>
                      {group.label}
                    </Link>
                    {hasChildren ? (
                      <button
                        aria-controls={panelId}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Thu gọn' : 'Mở rộng'} ${group.label}`}
                        onClick={() => {
                          setExpandedGroups((current) => {
                            const next = new Set(current);
                            if (next.has(group.href)) next.delete(group.href);
                            else next.add(group.href);
                            return next;
                          });
                        }}
                        type="button"
                      >
                        <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
                      </button>
                    ) : null}
                  </div>
                  {hasChildren && isExpanded ? (
                    <ul className={styles.mobileSubmenu} id={panelId}>
                      {group.children.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={onClose}>
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
      </div>
    </div>
  );
}
