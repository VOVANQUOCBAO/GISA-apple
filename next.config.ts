import type { NextConfig } from 'next';

import { OLD_ROUTE_REDIRECTS } from './src/content/redirects';

const securityHeaders = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://gisa-editor.sanity.studio https://www.sanity.io" }
];

const mediaOrigin = process.env.CONTENT_MEDIA_ORIGIN?.trim().replace(/\/$/, '');

const nextConfig: NextConfig = {
  // Cho phép chạy song song một dev server riêng cho bản thử nghiệm admin mà
  // không ghi đè `.next` của server đang chạy.
  distDir: process.env.GISA_DIST_DIR?.trim() || '.next',
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
  async rewrites() {
    // Ảnh do admin PHP upload lên InfinityFree được proxy qua cùng origin để
    // schema ảnh của frontend vẫn nhận đường dẫn bắt đầu bằng "/".
    return mediaOrigin
      ? [{ source: '/media/:path*', destination: `${mediaOrigin}/media/:path*` }]
      : [];
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
