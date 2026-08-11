'use client';

import Link, { useLinkStatus } from 'next/link';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './templates.module.css';

interface SectionSubnavRailProps {
  label: string;
  links: Array<{ href: string; label: string }>;
  path: string;
}

let previousActiveHref: string | undefined;
let fallbackNavigationTimer: number | undefined;
let fallbackCleanupTimer: number | undefined;
let fallbackReadyHref: string | undefined;

function geometryWithin(
  nav: HTMLElement,
  element: HTMLElement,
): { left: number; width: number } {
  const navRect = nav.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return {
    left: elementRect.left - navRect.left + nav.scrollLeft,
    width: elementRect.width,
  };
}

function SubnavLinkLabel({ label }: { label: string }) {
  const { pending } = useLinkStatus();

  return (
    <span data-navigation-pending={pending ? 'true' : undefined}>
      {bindPhrases(label)}
    </span>
  );
}

export function SectionSubnavRail({ label, links, path }: SectionSubnavRailProps) {
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const activeHref = links
    .filter((item) => path === item.href || path.startsWith(`${item.href}/`))
    .sort((left, right) => right.href.length - left.href.length)[0]?.href;

  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    const current = activeHref ? linkRefs.current.get(activeHref) : undefined;
    if (!nav || !indicator || !current) return;

    const target = geometryWithin(nav, current);
    const activeAnimations = indicator.getAnimations?.() ?? [];
    const liveStart = indicator.dataset.positioned
      ? geometryWithin(nav, indicator)
      : undefined;
    const previous = previousActiveHref
      ? linkRefs.current.get(previousActiveHref)
      : undefined;
    const start = liveStart ?? (previous ? geometryWithin(nav, previous) : target);
    const shouldAnimate = previousActiveHref !== undefined && previousActiveHref !== activeHref;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    activeAnimations.forEach((animation) => animation.cancel());
    indicator.style.width = `${target.width}px`;
    indicator.style.transform = `translate3d(${target.left}px, 0, 0)`;
    indicator.dataset.positioned = 'true';

    if (shouldAnimate && typeof indicator.animate === 'function') {
      if (reduceMotion) {
        indicator.animate([{ opacity: 0.72 }, { opacity: 1 }], {
          duration: 120,
          easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        });
      } else {
        indicator.animate(
          [
            {
              transform: `translate3d(${start.left}px, 0, 0) scaleX(${start.width / target.width})`,
            },
            {
              transform: `translate3d(${target.left}px, 0, 0) scaleX(1)`,
            },
          ],
          {
            duration: 220,
            easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
          },
        );
      }
    }

    previousActiveHref = activeHref;

    if (document.documentElement.dataset.sectionNavigation === 'leaving') {
      window.clearTimeout(fallbackCleanupTimer);
      document.documentElement.dataset.sectionNavigation = 'entering';
      fallbackCleanupTimer = window.setTimeout(() => {
        delete document.documentElement.dataset.sectionNavigation;
      }, 200);
    }
  }, [activeHref]);

  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    const current = activeHref ? linkRefs.current.get(activeHref) : undefined;
    if (!nav || !indicator || !current || typeof ResizeObserver === 'undefined') return;

    const syncIndicator = () => {
      const target = geometryWithin(nav, current);
      indicator.style.width = `${target.width}px`;
      indicator.style.transform = `translate3d(${target.left}px, 0, 0)`;
    };
    const observer = new ResizeObserver(syncIndicator);

    observer.observe(nav);
    observer.observe(current);
    return () => observer.disconnect();
  }, [activeHref]);

  useEffect(() => {
    const nav = navRef.current;
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !current || nav.scrollWidth <= nav.clientWidth) return;

    const left = Math.max(
      0,
      current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2,
    );
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    nav.scrollTo({ behavior: reduceMotion ? 'auto' : 'smooth', left });
  }, [path]);

  return (
    <nav aria-label={label} className={styles.sectionSubnav} ref={navRef}>
      <span aria-hidden="true" className={styles.sectionSubnavIndicator} ref={indicatorRef} />
      {links.map((item) => (
        <Link
          aria-current={activeHref === item.href ? 'page' : undefined}
          href={item.href}
          key={item.href}
          onClick={(event) => {
            if (fallbackReadyHref === item.href) {
              fallbackReadyHref = undefined;
              return;
            }

            const shouldUseNativeNavigation =
              typeof document.startViewTransition === 'function' ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey ||
              event.defaultPrevented;

            if (shouldUseNativeNavigation || activeHref === item.href) return;

            event.preventDefault();
            window.clearTimeout(fallbackNavigationTimer);
            window.clearTimeout(fallbackCleanupTimer);
            document.documentElement.dataset.sectionNavigation = 'leaving';
            fallbackNavigationTimer = window.setTimeout(() => {
              fallbackReadyHref = item.href;
              linkRefs.current.get(item.href)?.click();
            }, 100);
          }}
          scroll={false}
          transitionTypes={['section-tab']}
          ref={(node) => {
            if (node) linkRefs.current.set(item.href, node);
            else linkRefs.current.delete(item.href);
          }}
        >
          <SubnavLinkLabel label={item.label} />
        </Link>
      ))}
    </nav>
  );
}
