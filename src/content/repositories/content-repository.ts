import type {
  Collection,
  ContentQuery,
  ContentRecord,
  ContentSummary,
  PaginatedResult,
} from '../types';

export interface ContentRepository {
  getByPath(path: string): Promise<ContentRecord | null>;
  getBySlug(collection: Collection, slug: string): Promise<ContentRecord | null>;
  list(query: ContentQuery): Promise<PaginatedResult<ContentSummary>>;
  search(query: ContentQuery): Promise<PaginatedResult<ContentSummary>>;
  listIndexablePaths(): Promise<string[]>;
}
