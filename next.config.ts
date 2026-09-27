import type { NextConfig } from 'next';

import { OLD_ROUTE_REDIRECTS } from './src/content/redirects';

const securityHeaders = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' }
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  experimental: {
    viewTransition: true,
  },
  images: {
    qualities: [75, 95],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/j7fuzzrp/production/**' }]
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async redirects() {
    return OLD_ROUTE_REDIRECTS.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true
    }));
  }
};

export default nextConfig;
