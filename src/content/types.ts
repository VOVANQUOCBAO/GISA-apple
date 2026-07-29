export type EvidenceStatus =
  | 'verified'
  | 'provided_by_gisa'
  | 'strategic_proposal'
  | 'needs_verification';

export type Collection =
  | 'projects'
  | 'publications'
  | 'tools'
  | 'courses'
  | 'experts'
  | 'initiatives'
  | 'news'
  | 'notices'
  | 'partners'
  | 'applications'
  | 'community'
  | 'resources'
  | 'videos'
  | 'galleries'
  | 'archive';

export type ContentKind =
  | 'project'
  | 'publication'
  | 'tool'
  | 'course'
  | 'expert'
  | 'initiative'
  | 'news'
  | 'notice'
  | 'partner';

export type NormalizedContentKind =
  | ContentKind
  | 'application'
  | 'community'
  | 'resource'
  | 'video'
  | 'gallery'
  | 'archive';

export type EditorialStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'archived';

export interface SourceProvenance {
  sourceUrl: string;
  snapshotId: string;
  fetchedAt: string;
  sourceHash: string;
  extractionMethod: 'embedded_json' | 'dom_fallback' | 'manual';
  extractionConfidence: 'high' | 'medium' | 'low';
}

export interface MediaAsset {
  id: string;
  kind: 'image' | 'document' | 'video_thumbnail';
  publicPath?: string;
  sourceUrl: string;
  sourceHash: string;
  mimeType: string;
  width?: number;
  height?: number;
  alt: string;
  rightsStatus: 'pending_review' | 'approved_for_web' | 'rejected';
}

export interface PublicationMetadata {
  journal?: string;
  year?: number;
  doi?: string;
  externalUrl?: string;
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'image'; assetId: string; caption?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | {
      type: 'linkGroup';
      links: Array<{ label: string; href: string }>;
    }
  | {
      type: 'video';
      provider: 'youtube';
      externalUrl: string;
      title: string;
    };

export interface ContentRecord {
  id: string;
  kind: NormalizedContentKind;
  collection: Collection;
  slug: string;
  path: string;
  locale: 'vi' | 'en';
  translationKey: string;
  title: string;
  summary: string;
  body: ContentBlock[];
  publishedAt?: string;
  image?: { src: string; alt: string; width: number; height: number };
  tags: string[];
  evidenceStatus: EvidenceStatus;
  sourceUrl: string;
  sourceLabel: string;
  checkedAt: string;
  metadata: Record<string, string | string[] | undefined>;
  editorialStatus?: EditorialStatus;
  legacyUrls?: string[];
  provenance?: SourceProvenance;
  media?: MediaAsset[];
  seo?: { title?: string; description?: string; canonicalUrl?: string };
  publication?: PublicationMetadata;
}

export type ContentSummary = Pick<
  ContentRecord,
  | 'id'
  | 'kind'
  | 'collection'
  | 'slug'
  | 'path'
  | 'title'
  | 'summary'
  | 'publishedAt'
  | 'image'
  | 'tags'
  | 'evidenceStatus'
>;

export interface ContentQuery {
  collection?: Collection;
  query?: string;
  page: number;
  pageSize: number;
  filters: Record<string, string>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  availableFilters: Record<string, string[]>;
}
