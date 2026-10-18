import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

// jsdom ships no `matchMedia`. Components that branch on viewport width or on
// `prefers-reduced-motion` would throw on mount without it, so provide a stub
// that always reports "no match" — the layout under test is then the narrow,
// full-motion default.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      addEventListener: () => {},
      addListener: () => {},
      dispatchEvent: () => false,
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: () => {},
      removeListener: () => {},
    }) as MediaQueryList;
}

afterEach(() => {
  document.documentElement.lang = '';
});
