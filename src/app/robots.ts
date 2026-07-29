import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/components/seo/build-metadata';

function isProductionIndexingEnabled(): boolean {
  return (
    process.env.VERCEL_ENV === 'production' ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production')
  );
}

export default function robots(): MetadataRoute.Robots {
  const production = isProductionIndexingEnabled();

  return {
    rules: {
      userAgent: '*',
      ...(production ? { allow: '/' } : { disallow: '/' }),
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
