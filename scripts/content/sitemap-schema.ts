import { XMLParser, XMLValidator } from 'fast-xml-parser';

interface ParseSitemapOptions {
  baseUrl: string;
  sitemapUrl: string;
}

export interface ParsedSitemapDocument {
  pageUrls: string[];
  sitemapUrls: string[];
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function readLocation(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'loc' in value) {
    const location = (value as { loc?: unknown }).loc;
    return typeof location === 'string' ? location : undefined;
  }
  return undefined;
}

export function normalizeSameOriginUrl(
  value: string,
  baseUrl: string,
  relativeTo = baseUrl,
): string | undefined {
  try {
    const origin = new URL(baseUrl).origin;
    const url = new URL(value.trim(), relativeTo);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
      return undefined;
    }
    url.hash = '';
    return url.href;
  } catch {
    return undefined;
  }
}

export function parseSitemapDocument(
  xml: string,
  options: ParseSitemapOptions,
): ParsedSitemapDocument {
  const validation = XMLValidator.validate(xml);
  if (validation !== true) {
    throw new Error(`Malformed XML: ${validation.err.msg}`);
  }
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    processEntities: false,
    trimValues: true,
  });
  const parsed = parser.parse(xml) as {
    sitemapindex?: { sitemap?: unknown | unknown[] };
    urlset?: { url?: unknown | unknown[] };
  };
  const hasUrlSet = parsed.urlset !== undefined;
  const hasSitemapIndex = parsed.sitemapindex !== undefined;
  if (hasUrlSet === hasSitemapIndex) {
    throw new Error('Expected exactly one urlset or sitemapindex root.');
  }
  const normalizeRows = (rows: unknown[]): string[] =>
    rows
    .map(readLocation)
    .filter((value): value is string => value !== undefined)
    .map((value) =>
      normalizeSameOriginUrl(value, options.baseUrl, options.sitemapUrl),
    )
      .filter((value): value is string => value !== undefined);

  const result = {
    pageUrls: [...new Set(normalizeRows(asArray(parsed.urlset?.url)))].sort(),
    sitemapUrls: [
      ...new Set(normalizeRows(asArray(parsed.sitemapindex?.sitemap))),
    ].sort(),
  };
  if (result.pageUrls.length === 0 && result.sitemapUrls.length === 0) {
    throw new Error('Sitemap contains no same-origin URL rows.');
  }
  return result;
}

export function parseSitemap(
  xml: string,
  options: ParseSitemapOptions,
): string[] {
  return parseSitemapDocument(xml, options).pageUrls;
}
