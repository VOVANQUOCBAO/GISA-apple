import type { Metadata } from 'next';

export const SITE_NAME = 'GISA';
export const SITE_URL = 'https://gisa.edu.vn';

interface MetadataInput {
  description: string;
  indexable?: boolean;
  path: string;
  title: string;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildMetadata({
  description,
  indexable = true,
  path,
  title,
}: MetadataInput): Metadata {
  const canonicalUrl = new URL(path, SITE_URL);
  canonicalUrl.search = '';
  canonicalUrl.hash = '';
  const canonical = canonicalUrl.toString();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      locale: 'vi_VN',
      siteName: SITE_NAME,
      type: 'website',
      url: canonical,
    },
    robots: indexable
      ? { follow: true, index: true }
      : { follow: true, index: false },
  };
}
