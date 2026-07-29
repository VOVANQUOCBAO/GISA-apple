import { describe, expect, test } from 'vitest';

import { annotateScrollMotion } from './scroll-motion-director';

describe('annotateScrollMotion', () => {
  test('classifies meaningful content and caps item staggering', () => {
    document.body.innerHTML = `
      <header><h1>Navigation title</h1></header>
      <main>
        <header><h1>Page title</h1></header>
        <section>
          <div><h2>Section title</h2></div>
          <div class="cards">
            ${Array.from({ length: 8 }, (_, index) => `<article>Card ${index}</article>`).join('')}
          </div>
          <article>
            <div style="overflow: hidden"><img alt="Editorial" /></div>
          </article>
          <div role="dialog"><h2>Dialog title</h2><article>Dialog card</article></div>
          <ul aria-hidden="true"><li><article>Marquee copy</article></li></ul>
        </section>
      </main>
    `;

    const cleanup = annotateScrollMotion();
    const pageTitle = document.querySelector('main h1');
    const sectionTitle = document.querySelector('section h2');
    const cards = document.querySelectorAll('.cards article');
    const media = document.querySelector('img')?.parentElement;

    expect(pageTitle).toHaveAttribute('data-scroll-motion', 'reveal');
    expect(document.querySelector('body > header h1')).not.toHaveAttribute(
      'data-scroll-motion',
    );
    expect(sectionTitle).toHaveAttribute('data-scroll-motion', 'reveal');
    expect(cards[0]).toHaveAttribute('data-scroll-motion', 'item');
    expect(cards[7]).toHaveStyle({ '--motion-index': '6' });
    expect(media).toHaveAttribute('data-scroll-motion', 'media');
    expect(document.querySelector('[role="dialog"] h2')).not.toHaveAttribute(
      'data-scroll-motion',
    );
    expect(document.querySelector('[aria-hidden="true"] article')).not.toHaveAttribute(
      'data-scroll-motion',
    );

    cleanup();
    expect(pageTitle).not.toHaveAttribute('data-scroll-motion');
    expect(cards[0]).not.toHaveAttribute('style');
    expect(media).not.toHaveAttribute('data-scroll-motion');
  });

  test('preserves author-owned motion attributes and custom properties', () => {
    document.body.innerHTML = `
      <main><section><div><article data-scroll-motion="reveal" style="--motion-index: 9">Card</article></div></section></main>
    `;

    const cleanup = annotateScrollMotion();
    const card = document.querySelector('article');

    expect(card).toHaveAttribute('data-scroll-motion', 'reveal');
    expect(card).toHaveStyle({ '--motion-index': '9' });
    cleanup();
    expect(card).toHaveAttribute('data-scroll-motion', 'reveal');
    expect(card).toHaveStyle({ '--motion-index': '9' });
  });
});
