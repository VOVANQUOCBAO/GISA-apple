export const DISCOVERY_SOURCES = [
  'sitemap',
  'navigation',
  'listing',
  'embedded_link',
] as const;

export type DiscoverySource = (typeof DISCOVERY_SOURCES)[number];

export type ExtractionStatus =
  | 'fetched'
  | 'redirect_review'
  | 'failed'
  | 'excluded';

export interface SnapshotFetchRecord {
  contentType: string | null;
  exclusionReason: string | null;
  extractionStatus: ExtractionStatus;
  failureReason: string | null;
  fetchedAt: string | null;
  rawPath: string | null;
  redirectLocation: string | null;
  responseStatus: number | null;
  sha256: string | null;
  url: string;
}

export interface SnapshotManifestEntry extends SnapshotFetchRecord {
  provenance: DiscoverySource[];
}

export interface SnapshotManifest {
  baseUrl: string;
  discoveryScope: {
    fingerprint: string;
    listingUrls: string[];
    navigationUrls: string[];
    paginationUrls: string[];
  };
  entries: SnapshotManifestEntry[];
  generatedAt: string;
  listingSeeds: string[];
  schemaVersion: 1;
  sitemapFetches: SnapshotFetchRecord[];
  sitemapUrl: string;
  snapshotId: string;
}

export interface DiscoveredLink {
  provenance: DiscoverySource[];
  url: string;
}

export function sortDiscoverySources(
  sources: Iterable<DiscoverySource>,
): DiscoverySource[] {
  const order = new Map(
    DISCOVERY_SOURCES.map((source, index) => [source, index] as const),
  );
  return [...new Set(sources)].sort(
    (left, right) => (order.get(left) ?? 99) - (order.get(right) ?? 99),
  );
}
