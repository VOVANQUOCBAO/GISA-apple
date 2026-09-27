import { contentRecordSchema } from '../schema';
import type {
  Collection,
  ContentBlock,
  ContentQuery,
  ContentRecord,
  ContentSummary,
  PaginatedResult,
} from '../types';
import type { ContentRepository } from './content-repository';

const PROJECT_ID = 'j7fuzzrp';
const DATASET = 'production';
const API_VERSION = '2025-02-19';
const IMAGE_HOST = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/`;
const POST_FIELDS = `{
  _id, _createdAt, title, "slug": slug.current, summary, category,
  "coverUrl": cover.asset->url,
  "coverWidth": cover.asset->metadata.dimensions.width,
  "coverHeight": cover.asset->metadata.dimensions.height,
  "coverAlt": cover.alt,
  body[]{... , "imageUrl": asset->url}
}`;
const PUBLISHED_POSTS = `_type == "post" && !(_id in path("drafts.**")) && defined(title) && defined(slug.current) && defined(body)`;

interface SanitySpan { text?: string }
interface SanityBlock {
  _type?: string;
  style?: string;
  listItem?: string;
  children?: SanitySpan[];
  imageUrl?: string;
  alt?: string;
}
interface SanityPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: string;
  summary?: string;
  category?: string;
  coverUrl?: string;
  coverWidth?: number;
  coverHeight?: number;
  coverAlt?: string;
  body?: SanityBlock[];
}

function trustedImage(url: unknown): url is string {
  return typeof url === 'string' && url.startsWith(IMAGE_HOST);
}

function blocksFromSanity(blocks: SanityBlock[] = []): ContentBlock[] {
  const result: ContentBlock[] = [];
  for (const block of blocks) {
    if (block._type === 'image' && trustedImage(block.imageUrl)) {
      result.push({ type: 'image', assetId: block.imageUrl, caption: block.alt });
      continue;
    }
    if (block._type !== 'block') continue;
    const text = (block.children ?? []).map((child) => child.text ?? '').join('').trim();
    if (!text) continue;
    if (block.listItem) {
      const ordered = block.listItem === 'number';
      const previous = result.at(-1);
      if (previous?.type === 'list' && previous.ordered === ordered) previous.items.push(text);
      else result.push({ type: 'list', ordered, items: [text] });
    } else if (block.style === 'h2' || block.style === 'h3') {
      result.push({ type: 'heading', level: block.style === 'h2' ? 2 : 3, text });
    } else if (block.style === 'blockquote') {
      result.push({ type: 'quote', text });
    } else {
      result.push({ type: 'paragraph', text });
    }
  }
  return result;
}

function toRecord(post: SanityPost): ContentRecord | null {
  if (!post._id || !post.title?.trim() || !/^[a-z0-9-]+$/.test(post.slug ?? '')) return null;
  const body = blocksFromSanity(post.body);
  if (body.length === 0) return null;
  const summary = post.summary?.trim() || body.find((block) => block.type === 'paragraph')?.text || post.title;
  const date = post._createdAt?.slice(0, 10);
  const topic = ({ news: 'Tin tức GISA', activities: 'Hoạt động học sinh', announcements: 'Thông báo' } as Record<string, string>)[post.category ?? ''] ?? 'Tin tức GISA';
  const image = trustedImage(post.coverUrl) ? {
    src: post.coverUrl,
    alt: post.coverAlt?.trim() || post.title,
    width: Math.max(1, Math.round(post.coverWidth || 1200)),
    height: Math.max(1, Math.round(post.coverHeight || 800)),
  } : undefined;
  const record: ContentRecord = {
    id: `sanity-${post._id}`,
    kind: 'news', collection: 'news', slug: post.slug,
    path: `/tin-tuc/${post.slug}`,
    locale: 'vi', translationKey: `sanity-${post._id}`,
    title: post.title.trim(), summary, body,
    ...(date ? { publishedAt: date } : {}),
    ...(image ? { image } : {}),
    tags: ['tin tức'], evidenceStatus: 'provided_by_gisa',
    sourceUrl: 'https://gisa-editor.sanity.studio/',
    sourceLabel: 'Bài viết do GISA đăng trên Sanity',
    checkedAt: new Date().toISOString().slice(0, 10),
    metadata: { topic },
  };
  const parsed = contentRecordSchema.safeParse(record);
  return parsed.success ? parsed.data : null;
}

async function querySanity<T>(query: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`);
  url.searchParams.set('query', query);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error(`Sanity query failed: ${response.status}`);
  const data = await response.json() as { result: T };
  return data.result;
}

function summaryOf(record: ContentRecord): ContentSummary {
  const { id, kind, collection, slug, path, title, summary, publishedAt, image, tags, evidenceStatus, metadata } = record;
  return { id, kind, collection, slug, path, title, summary, publishedAt, image, tags, evidenceStatus, metadata };
}

function matches(record: ContentSummary, filters: Record<string, string>): boolean {
  return Object.entries(filters).every(([key, value]) => {
    const field = record.metadata[key];
    return Array.isArray(field) ? field.includes(value) : field === value;
  });
}

export class SanityNewsRepository implements ContentRepository {
  constructor(private readonly base: ContentRepository) {}

  private async posts(): Promise<ContentRecord[]> {
    try {
      const posts = await querySanity<SanityPost[]>(`*[${PUBLISHED_POSTS}] | order(_createdAt desc) [0...500] ${POST_FIELDS}`);
      return posts.flatMap((post) => toRecord(post) ?? []);
    } catch (error) {
      console.error('Could not load published Sanity posts', error);
      return [];
    }
  }

  async getByPath(path: string): Promise<ContentRecord | null> {
    const existing = await this.base.getByPath(path);
    if (existing) return existing;
    const slug = /^\/tin-tuc\/([^/]+)$/.exec(path)?.[1];
    if (!slug) return null;
    try {
      const post = await querySanity<SanityPost | null>(`*[${PUBLISHED_POSTS} && slug.current == $slug][0] ${POST_FIELDS}`, { slug });
      return post ? toRecord(post) : null;
    } catch (error) {
      console.error('Could not load Sanity post', error);
      return null;
    }
  }

  async getBySlug(collection: Collection, slug: string): Promise<ContentRecord | null> {
    if (collection !== 'news') return this.base.getBySlug(collection, slug);
    return this.getByPath(`/tin-tuc/${slug}`);
  }

  async list(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    if (query.collection && query.collection !== 'news') return this.base.list(query);
    return this.combine(query, false);
  }

  async search(query: ContentQuery): Promise<PaginatedResult<ContentSummary>> {
    if (query.collection && query.collection !== 'news') return this.base.search(query);
    return this.combine(query, true);
  }

  private async combine(query: ContentQuery, search: boolean): Promise<PaginatedResult<ContentSummary>> {
    const existing = await (search ? this.base.search : this.base.list).call(this.base, { ...query, page: 1, pageSize: 10000 });
    const posts = (await this.posts()).map(summaryOf);
    const all = [...posts, ...existing.items].filter((item) =>
      (!query.collection || item.collection === query.collection) &&
      matches(item, query.scope ?? {}) && matches(item, query.filters) &&
      (!search || !query.query || `${item.title} ${item.summary}`.toLocaleLowerCase('vi').includes(query.query.toLocaleLowerCase('vi'))),
    ).sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '') || a.title.localeCompare(b.title, 'vi'));
    const pageSize = Math.max(1, Math.floor(query.pageSize));
    const pageCount = Math.max(1, Math.ceil(all.length / pageSize));
    const page = Math.min(Math.max(1, Math.floor(query.page)), pageCount);
    const availableFilters = { ...existing.availableFilters };
    for (const post of posts) {
      for (const [key, value] of Object.entries(post.metadata)) {
        const values = Array.isArray(value) ? value : value ? [value] : [];
        availableFilters[key] = [...new Set([...(availableFilters[key] ?? []), ...values])];
      }
    }
    return { items: all.slice((page - 1) * pageSize, page * pageSize), total: all.length, page, pageSize, pageCount, availableFilters };
  }

  listIndexablePaths(): Promise<string[]> { return this.base.listIndexablePaths(); }
}
