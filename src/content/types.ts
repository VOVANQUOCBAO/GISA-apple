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

/**
 * `metadata` đi kèm bản tóm tắt vì trang danh sách ấn phẩm hiển thị năm công bố,
 * tác giả và nơi công bố ngay trên từng dòng — không có nó thì mọi thẻ chỉ còn
 * tiêu đề và tóm tắt, và danh sách nghiên cứu mất phần thông tin quan trọng nhất.
 */
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
  | 'metadata'
>;

export interface ContentQuery {
  collection?: Collection;
  query?: string;
  page: number;
  pageSize: number;
  /** Bộ lọc người xem chọn. Xuất hiện trên URL và trên FilterBar. */
  filters: Record<string, string>;
  /**
   * Phạm vi cố định của trang, người xem không đổi được. Tách khỏi `filters` vì
   * `availableFilters` phải tính SAU khi áp phạm vi này: nếu tính trước, FilterBar
   * sẽ chào những giá trị không tồn tại trong phạm vi và mọi lựa chọn đều ra rỗng.
   */
  scope?: Record<string, string>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  availableFilters: Record<string, string[]>;
}
