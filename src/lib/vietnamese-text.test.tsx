import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { bindPhrases } from './vietnamese-text';

describe('bindPhrases', () => {
  test('keeps the original text while exposing one transparent layout wrapper', () => {
    const text = 'GISA thúc đẩy hợp tác học thuật, nghiên cứu và chuyển giao.';
    const { container } = render(<p style={{ display: 'flex' }}>{bindPhrases(text)}</p>);

    const paragraph = container.querySelector('p');
    const wrapper = container.querySelector('[data-vietnamese-text]');

    expect(paragraph).toHaveTextContent(text);
    expect(paragraph?.children).toHaveLength(1);
    const inlineStyle = wrapper?.getAttribute('style');
    expect(inlineStyle).toContain('color: inherit');
    expect(inlineStyle).toContain('display: inline');
    expect(inlineStyle).toContain('font-family: inherit');
    expect(inlineStyle).toContain('font-size: inherit');
    expect(inlineStyle).toContain('line-height: inherit');
  });

  test('only prevents wrapping inside known Vietnamese phrases', () => {
    const { container } = render(<h2>{bindPhrases('GIẢI PHÁP CHO TÁC ĐỘNG BỀN VỮNG')}</h2>);
    const phrases = [...container.querySelectorAll('[data-vietnamese-phrase]')];

    expect(phrases.map((phrase) => phrase.textContent)).toEqual([
      'GIẢI PHÁP',
      'TÁC ĐỘNG',
      'BỀN VỮNG',
    ]);
    expect(phrases.every((phrase) => phrase.getAttribute('style')?.includes('white-space: nowrap'))).toBe(true);
  });
});
