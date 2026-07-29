import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { BREAKPOINTS } from './breakpoints';

describe('GISA design tokens', () => {
  test('contains the exact approved palette', () => {
    const css = readFileSync('src/app/globals.css', 'utf8');

    for (const color of [
      '#005F69',
      '#F26F33',
      '#004424',
      '#007BFF',
      '#19486A',
      '#1A1A1A',
      '#F2F5F6'
    ]) {
      expect(css).toContain(color);
    }
  });

  test('exposes all required verification viewports', () => {
    expect(Object.values(BREAKPOINTS)).toEqual([390, 768, 1024, 1440]);
  });
});
