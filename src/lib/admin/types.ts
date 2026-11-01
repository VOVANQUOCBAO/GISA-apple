import type { ContentRecord } from '@/content/types';

/** Một bài viết đã được lưu vào kho của admin, ở trạng thái nháp hoặc đã đăng. */
export interface StoredRecordFile {
  id: string;
  slug: string;
  path: string;
  status: 'draft' | 'published';
  updatedAt: string;
  record: ContentRecord;
}

export interface AdminDocumentSummary {
  id: string;
  kind: ContentRecord['kind'];
  title: string;
  slug: string;
  path: string;
  state: 'draft' | 'published';
  hasDraft: boolean;
  updatedAt: string;
  publishedAt?: string;
  image?: string;
}

export interface AdminDocumentPayload {
  summary: AdminDocumentSummary;
  draft: StoredRecordFile | null;
  published: StoredRecordFile | null;
  record: ContentRecord;
}

export interface AdminVersion {
  version: string;
  at: string;
  title: string;
}

export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface ReadinessCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface EditorMessage {
  type: 'gisa-admin:record' | 'gisa-admin:saved';
  record?: ContentRecord;
  savedAt?: number;
}
