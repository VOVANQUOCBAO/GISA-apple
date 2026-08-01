'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';

type MotionKind = 'item' | 'media' | 'reveal' | 'section';

interface MotionRecord {
  element: HTMLElement;
  hadIndex: boolean;
  hadStyleAttribute: boolean;
  indexPriority: string;
  indexValue: string;
}

const EXCLUDED_SELECTOR =
  "body > header, form, [role='dialog'], [aria-hidden='true'], [data-scroll-motion-ignore]";
const MAX_MOTION_INDEX = 6;
const MOTION_SELECTOR = '[data-scroll-motion]';

function isExcluded(element: Element) {
  return element.closest(EXCLUDED_SELECTOR) !== null;
}

function getElements(root: ParentNode, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function isClipped(element: HTMLElement) {
  const styles = window.getComputedStyle(element);
  return [styles.overflow, styles.overflowX, styles.overflowY].some(
    (value) => value === 'hidden' || value === 'clip',
  );
}

function findMediaContainer(image: HTMLImageElement) {
  let candidate = image.parentElement;

  while (candidate && candidate.tagName !== 'ARTICLE') {
    if (isClipped(candidate)) return candidate;
    candidate = candidate.parentElement;
  }

  return null;
}

export function annotateScrollMotion(root: ParentNode = document) {
  const records: MotionRecord[] = [];
  const annotated = new Set<HTMLElement>();

  function annotate(element: HTMLElement, kind: MotionKind, index?: number) {
    if (annotated.has(element) || element.hasAttribute('data-scroll-motion')) return;

    const indexValue = element.style.getPropertyValue('--motion-index');
    const indexPriority = element.style.getPropertyPriority('--motion-index');
    const hadIndex = indexValue !== '';
    const hadStyleAttribute = element.hasAttribute('style');

    element.dataset.scrollMotion = kind;
    if (index !== undefined) {
      element.style.setProperty(
        '--motion-index',
        String(Math.min(index, MAX_MOTION_INDEX)),
      );
    }

    annotated.add(element);
    records.push({
      element,
      hadIndex,
      hadStyleAttribute,
      indexPriority,
      indexValue,
    });
  }

  getElements(root, 'main section')
    .filter((element) => !isExcluded(element))
    .forEach((element) => annotate(element, 'section'));

  getElements(root, 'main h1, main section h2')
    .filter(
      (element) =>
        !isExcluded(element) &&
        !element.closest('article, li, dl, nav'),
    )
    .forEach((element) => annotate(element, 'reveal'));

  const itemGroups = new Map<HTMLElement, HTMLElement[]>();
  getElements(
    root,
    'main section article, main section dl > div, main section ol > li, main section [role="list"] > *',
  )
    .filter((element) => !isExcluded(element))
    .forEach((element) => {
      const parent = element.parentElement;
      if (!parent) return;
      const group = itemGroups.get(parent) ?? [];
      group.push(element);
      itemGroups.set(parent, group);
    });

  itemGroups.forEach((items) => {
    items.forEach((element, index) => annotate(element, 'item', index));
  });

  getElements(root, 'main article img')
    .filter((image) => !isExcluded(image))
    .forEach((image) => {
      const container = findMediaContainer(image as HTMLImageElement);
      if (container && !isExcluded(container)) annotate(container, 'media');
    });

  return () => {
    records.forEach(
      ({ element, hadIndex, hadStyleAttribute, indexPriority, indexValue }) => {
        element.removeAttribute('data-scroll-motion');
        if (hadIndex) {
          element.style.setProperty('--motion-index', indexValue, indexPriority);
        } else {
          element.style.removeProperty('--motion-index');
          if (!hadStyleAttribute && element.getAttribute('style') === '') {
            element.removeAttribute('style');
          }
        }
      },
    );
  };
}

function observeScrollMotion(root: ParentNode = document) {
  if (typeof IntersectionObserver === 'undefined') {
    return () => undefined;
  }

  const elements = getElements(root, MOTION_SELECTOR);
  const documentElement = document.documentElement;
  const previousMotionReady = documentElement.dataset.scrollMotionReady;

  const updateSide = (element: HTMLElement, rect: DOMRectReadOnly) => {
    const elementCenter = rect.top + rect.height / 2;
    element.dataset.scrollSide =
      elementCenter < window.innerHeight / 2 ? 'top' : 'bottom';
  };

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    updateSide(element, rect);
  });

  documentElement.dataset.scrollMotionReady = 'true';

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        updateSide(element, entry.boundingClientRect);
        if (entry.isIntersecting) {
          element.dataset.scrollVisible = 'true';
        } else {
          delete element.dataset.scrollVisible;
        }
      });
    },
    { rootMargin: '-10% 0px -10% 0px', threshold: 0.04 },
  );

  const revealFrame = window.requestAnimationFrame(() => {
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      updateSide(element, rect);
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        element.dataset.scrollVisible = 'true';
      }
      observer.observe(element);
    });
  });

  return () => {
    window.cancelAnimationFrame(revealFrame);
    observer.disconnect();
    elements.forEach((element) => {
      delete element.dataset.scrollSide;
      delete element.dataset.scrollVisible;
    });
    if (previousMotionReady === undefined) {
      delete documentElement.dataset.scrollMotionReady;
    } else {
      documentElement.dataset.scrollMotionReady = previousMotionReady;
    }
  };
}

export function ScrollMotionDirector() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const cleanupAnnotations = annotateScrollMotion();
    const cleanupMotion = observeScrollMotion();

    return () => {
      cleanupMotion();
      cleanupAnnotations();
    };
  }, [pathname]);

  return null;
}
