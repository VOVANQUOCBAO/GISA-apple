import { afterEach, describe, expect, test, vi } from 'vitest';

import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

import { buildMetadata } from './build-metadata';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('SEO metadata and indexing policy', () => {
  test('builds an absolute canonical and Open Graph metadata without an image', () => {
    const metadata = buildMetadata({
      description: 'Mô tả trang.',
      path: '/nghien-cuu/du-an?page=1&topic=test',
      title: 'Dự án',
    });

    expect(metadata.alternates?.canonical).toBe(
      'https://gisa.edu.vn/nghien-cuu/du-an',
    );
    expect(metadata.openGraph).toMatchObject({
      description: 'Mô tả trang.',
      title: 'Dự án',
      url: 'https://gisa.edu.vn/nghien-cuu/du-an',
    });
    expect(metadata.openGraph).not.toHaveProperty('images');
  });

  test('adds an absolute social image and article metadata when provided', () => {
    const metadata = buildMetadata({
      authors: ['Ban Truyền thông GISA'],
      description: 'Mô tả bài viết.',
      image: {
        alt: 'Ảnh hội thảo',
        height: 630,
        src: '/media/cover/a.png',
        width: 1200,
      },
      modifiedTime: '2026-10-28',
      path: '/tin-tuc/bai-viet',
      publishedTime: '2026-10-27',
      title: 'Bài viết',
      type: 'article',
    });

    expect(metadata.openGraph).toMatchObject({
      authors: ['Ban Truyền thông GISA'],
      images: [
        {
          alt: 'Ảnh hội thảo',
          height: 630,
          url: 'https://gisa.edu.vn/media/cover/a.png',
          width: 1200,
        },
      ],
      modifiedTime: '2026-10-28',
      publishedTime: '2026-10-27',
      type: 'article',
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: ['https://gisa.edu.vn/media/cover/a.png'],
    });
  });

  test('blocks crawling outside production and allows it in production', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(robots().rules).toMatchObject({ disallow: '/', userAgent: '*' });

    vi.stubEnv('VERCEL_ENV', 'production');
    expect(robots().rules).toMatchObject({ allow: '/', userAgent: '*' });
  });

  test('sitemap includes public canonical content and excludes search and forms', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toContain('https://gisa.edu.vn/');
    expect(urls).toContain(
      'https://gisa.edu.vn/nghien-cuu/du-an/trade4sd',
    );
    expect(urls).not.toContain('https://gisa.edu.vn/tim-kiem');
    expect(urls).not.toContain('https://gisa.edu.vn/lien-he');
    expect(urls.some((url) => url.includes('/dang-ky/'))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
