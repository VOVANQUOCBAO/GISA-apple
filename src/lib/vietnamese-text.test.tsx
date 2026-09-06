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

  test('keeps agricultural field names intact', () => {
    const { container } = render(
      <h2>{bindPhrases('Kinh tế thực phẩm nông nghiệp và nông thôn')}</h2>,
    );
    const phrases = [...container.querySelectorAll('[data-vietnamese-phrase]')];

    expect(phrases.map((phrase) => phrase.textContent)).toEqual([
      'Kinh tế thực phẩm',
      'nông nghiệp',
      'nông thôn',
    ]);
  });

  test('keeps environmental research terms intact', () => {
    const { container } = render(
      <h2>{bindPhrases('Kinh tế môi trường, tài nguyên thiên nhiên và năng lực cạnh tranh')}</h2>,
    );
    const phrases = [...container.querySelectorAll('[data-vietnamese-phrase]')];

    expect(phrases.map((phrase) => phrase.textContent)).toEqual([
      'Kinh tế',
      'môi trường',
      'tài nguyên',
      'thiên nhiên',
      'năng lực',
      'cạnh tranh',
    ]);
  });

  test('keeps common section headings as complete semantic compounds', () => {
    const { container } = render(
      <h2>
        {bindPhrases(
          'Phát triển bền vững, trách nhiệm xã hội và khoa học công nghệ',
        )}
      </h2>,
    );
    const phrases = [...container.querySelectorAll('[data-vietnamese-phrase]')];

    expect(phrases.map((phrase) => phrase.textContent)).toEqual([
      'Phát triển bền vững',
      'trách nhiệm xã hội',
      'khoa học công nghệ',
    ]);
  });

  test('keeps common prose terms together without changing text content', () => {
    const text = 'Dữ liệu giúp tổ chức và địa phương ra quyết định.';
    const { container } = render(<p>{bindPhrases(text)}</p>);
    const phrases = [...container.querySelectorAll('[data-vietnamese-phrase]')];

    expect(container.querySelector('p')).toHaveTextContent(text);
    expect(phrases.map((phrase) => phrase.textContent)).toEqual([
      'Dữ liệu',
      'tổ chức',
      'địa phương',
      'ra quyết định',
    ]);
  });

  test('keeps dấu ấn khác biệt together as one semantic phrase', () => {
    const text = 'Mỗi chương trình giúp người học tạo dấu ấn khác biệt trong sự nghiệp.';
    const { container } = render(<p>{bindPhrases(text)}</p>);
    const phrases = [...container.querySelectorAll('[data-vietnamese-phrase]')];

    expect(container.querySelector('p')).toHaveTextContent(text);
    expect(phrases.map((phrase) => phrase.textContent)).toContain('dấu ấn khác biệt');
  });

  test('keeps a dash with the word that follows it', () => {
    const text = 'Ứng dụng khoa học – công nghệ vào thực tiễn';
    const { container } = render(<h3>{bindPhrases(text)}</h3>);
    const bridges = [...container.querySelectorAll('[data-dash-bridge]')];

    expect(container.querySelector('h3')).toHaveTextContent(text);
    expect(bridges.map((bridge) => bridge.textContent)).toEqual(['– công nghệ']);
    expect(bridges[0]?.getAttribute('style')).toContain('white-space: nowrap');
  });
});
