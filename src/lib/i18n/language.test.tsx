import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { bindPhrases } from '@/lib/vietnamese-text';
import { LanguageControl } from '@/components/site/language-control';
import { LanguageProvider } from './language-provider';
import { hasEnglishContent, translate } from './language';

const route = vi.hoisted(() => ({ path: '/nghien-cuu/linh-vuc' }));
vi.mock('next/navigation', () => ({ usePathname: () => route.path }));

describe('English copy from the four supplied documents', () => {
  test('renders English content and the active language with the existing templates', () => {
    route.path = '/nghien-cuu/linh-vuc';
    render(<LanguageProvider language="en"><LanguageControl /><h1>{bindPhrases('Lĩnh vực nghiên cứu')}</h1></LanguageProvider>);
    expect(screen.getByRole('heading', { name: 'Fields of Research' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Tiếng Việt' })).toBeEnabled();
    expect(document.documentElement.lang).toBe('en');
  });

  test('leaves sections without supplied English content in Vietnamese', () => {
    route.path = '/dao-tao/linh-vuc';
    render(<LanguageProvider language="en"><h1>{bindPhrases('Đào tạo')}</h1></LanguageProvider>);
    expect(screen.getByRole('heading', { name: 'Đào tạo' })).toBeVisible();
    expect(document.documentElement.lang).toBe('vi');
    expect(hasEnglishContent('/tin-tuc/example')).toBe(false);
  });

  test('keeps original Vietnamese and unknown content intact', () => {
    expect(translate('Lĩnh vực nghiên cứu', 'vi')).toBe('Lĩnh vực nghiên cứu');
    expect(translate('A title without an English source', 'en')).toBe('A title without an English source');
    expect(translate(' Xem tất cả nghiên cứu ', 'en')).toBe(' View All Research ');
  });
});
