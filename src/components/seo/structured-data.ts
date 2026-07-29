import { isPublishableEvidence } from '@/content/evidence';
import type { ContentRecord } from '@/content/types';

import { absoluteUrl, SITE_NAME, SITE_URL } from './build-metadata';

export type StructuredDataEntry = Record<string, unknown>;

function breadcrumbName(segment: string): string {
  return decodeURIComponent(segment)
    .replaceAll('-', ' ')
    .replace(/^./, (character) => character.toLocaleUpperCase('vi'));
}

function buildBreadcrumbs(record: ContentRecord): StructuredDataEntry {
  const segments = record.path.split('/').filter(Boolean);
  const items: StructuredDataEntry[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Trang chủ',
      item: `${SITE_URL}/`,
    },
  ];

  for (let index = 0; index < segments.length; index += 1) {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name:
        index === segments.length - 1
          ? record.title
          : breadcrumbName(segments[index]),
      item: absoluteUrl(path),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

function buildArticle(record: ContentRecord): StructuredDataEntry | null {
  if (
    !['news', 'publication'].includes(record.kind) ||
    !record.publishedAt
  ) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    datePublished: record.publishedAt,
    description: record.summary,
    headline: record.title,
    inLanguage: record.locale,
    mainEntityOfPage: absoluteUrl(record.path),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
  };
}

function buildCourse(record: ContentRecord): StructuredDataEntry | null {
  const providerName = record.metadata.providerName;
  if (record.kind !== 'course' || typeof providerName !== 'string') {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    description: record.summary,
    name: record.title,
    provider: {
      '@type': 'Organization',
      name: providerName,
    },
    url: absoluteUrl(record.path),
  };
}

function buildEvent(record: ContentRecord): StructuredDataEntry | null {
  const startDate = record.metadata.startDate;
  const locationName = record.metadata.locationName;
  if (
    record.kind !== 'notice' ||
    typeof startDate !== 'string' ||
    typeof locationName !== 'string'
  ) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    description: record.summary,
    location: { '@type': 'Place', name: locationName },
    name: record.title,
    startDate,
    url: absoluteUrl(record.path),
  };
}

function buildOrganization(record: ContentRecord): StructuredDataEntry | null {
  const legalName = record.metadata.legalName;
  const website = record.metadata.website;
  if (
    record.kind !== 'partner' ||
    typeof legalName !== 'string' ||
    typeof website !== 'string'
  ) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: legalName,
    url: website,
  };
}

export function buildStructuredData(
  record: ContentRecord,
): StructuredDataEntry[] {
  const entries = [buildBreadcrumbs(record)];
  if (!isPublishableEvidence(record.evidenceStatus)) return entries;

  for (const entry of [
    buildArticle(record),
    buildCourse(record),
    buildEvent(record),
    buildOrganization(record),
  ]) {
    if (entry) entries.push(entry);
  }

  return entries;
}

export function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
