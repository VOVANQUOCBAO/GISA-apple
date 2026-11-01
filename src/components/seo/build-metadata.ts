import type { Metadata } from 'next';

export const SITE_NAME = 'GISA';
export const SITE_URL = 'https://gisa.edu.vn';

interface MetadataImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface MetadataInput {
  authors?: string[];
  description: string;
  image?: MetadataImage;
  indexable?: boolean;
  modifiedTime?: string;
  path: string;
  publishedTime?: string;
  title: string;
  type?: 'website' | 'article';
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildMetadata({
  authors,
  description,
  image,
  indexable = true,
  modifiedTime,
  path,
  publishedTime,
  title,
  type = 'website',
}: MetadataInput): Metadata {
  const canonicalUrl = new URL(path, SITE_URL);
  canonicalUrl.search = '';
  canonicalUrl.hash = '';
  const canonical = canonicalUrl.toString();

  const images = image
    ? [
        {
          url: absoluteUrl(image.src),
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ]
    : undefined;

  const openGraph =
    type === 'article'
      ? {
          type: 'article' as const,
          title,
          description,
          locale: 'vi_VN',
          siteName: SITE_NAME,
          url: canonical,
          ...(images ? { images } : {}),
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
          ...(authors && authors.length > 0 ? { authors } : {}),
        }
      : {
          type: 'website' as const,
          title,
          description,
          locale: 'vi_VN',
          siteName: SITE_NAME,
          url: canonical,
          ...(images ? { images } : {}),
        };

  return {
    title,
    description,
    alternates: { canonical },
    openGraph,
    ...(images
      ? {
          twitter: {
            card: 'summary_large_image' as const,
            title,
            description,
            images: images.map((entry) => entry.url),
          },
        }
      : {}),
    robots: indexable
      ? { follow: true, index: true }
      : { follow: true, index: false },
  };
}
