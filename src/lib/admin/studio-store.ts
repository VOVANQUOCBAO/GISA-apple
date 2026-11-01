import 'server-only';

import type {
  StudioDoc,
  StudioDraft,
  StudioDraftSummary,
  StudioElement,
  StudioStatus,
} from '@/components/studio/types';

import { readDoc, readDocsIn, removeDoc, writeDoc } from './kv';

/**
 * Kho bài dựng tự do (studio).
 *
 * Cùng kho với admin (`kv.ts`), dưới khoá `studio/`. Khác ở chỗ bài studio là
 * một trang tự do (toạ độ tuyệt đối) chứ không phải `ContentRecord`, nên có
 * khoá riêng.
 */
const STUDIO_DIR = 'studio';
const ID_PATTERN = /^[a-z0-9][a-z0-9-]{5,63}$/u;
const ELEMENT_KINDS = new Set(['text', 'image', 'shape', 'icon', 'button', 'video']);
const MAX_ELEMENTS = 400;

export class StudioValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StudioValidationError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, fallback: string, max = 5000): string {
  return typeof value === 'string' ? value.slice(0, max) : fallback;
}

function numeric(value: unknown, fallback: number, min = -10000, max = 100000): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(Math.max(value, min), max)
    : fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function sanitizeElement(input: unknown): StudioElement | null {
  if (!isRecord(input)) return null;

  const kind = input.kind;
  if (typeof kind !== 'string' || !ELEMENT_KINDS.has(kind)) return null;
  if (typeof input.id !== 'string' || !input.id) return null;

  const base = {
    id: input.id.slice(0, 120),
    x: numeric(input.x, 0, -20000, 20000),
    y: numeric(input.y, 0, -20000, 20000),
    w: numeric(input.w, 200, 2, 20000),
    h: numeric(input.h, 80, 2, 20000),
    rotation: numeric(input.rotation, 0, -360, 360),
    opacity: numeric(input.opacity, 1, 0, 1),
    locked: bool(input.locked),
    hidden: bool(input.hidden),
  };

  switch (kind) {
    case 'text': {
      const role =
        input.role === 'heading' || input.role === 'subheading' || input.role === 'quote' || input.role === 'caption' || input.role === 'label'
          ? input.role
          : 'body';

      return {
        ...base,
        kind,
        text: text(input.text, ''),
        role,
        fontSize: numeric(input.fontSize, 20, 6, 400),
        font: input.font === 'serif' ? 'serif' : 'sans',
        weight: numeric(input.weight, 400, 100, 900),
        italic: bool(input.italic),
        color: text(input.color, '#14211c', 40),
        align: input.align === 'center' ? 'center' : input.align === 'right' ? 'right' : 'left',
        lineHeight: numeric(input.lineHeight, 1.5, 0.6, 4),
        letterSpacing: numeric(input.letterSpacing, 0, -0.2, 1),
      } as StudioElement;
    }
    case 'image':
      return {
        ...base,
        kind,
        src: text(input.src, '', 2000),
        alt: text(input.alt, '', 300),
        fit: input.fit === 'contain' ? 'contain' : 'cover',
        radius: numeric(input.radius, 0, 0, 500),
      } as StudioElement;
    case 'shape':
      return {
        ...base,
        kind,
        shape: input.shape === 'ellipse' ? 'ellipse' : input.shape === 'line' ? 'line' : 'rect',
        fill: text(input.fill, '#005f69', 40),
        stroke: text(input.stroke, 'transparent', 40),
        strokeWidth: numeric(input.strokeWidth, 0, 0, 40),
        radius: numeric(input.radius, 0, 0, 500),
      } as StudioElement;
    case 'icon':
      return { ...base, kind, name: text(input.name, 'Sparkle', 60), color: text(input.color, '#005f69', 40) } as StudioElement;
    case 'button':
      return {
        ...base,
        kind,
        label: text(input.label, 'Bấm vào đây', 200),
        href: text(input.href, '#', 2000),
        fill: text(input.fill, '#005f69', 40),
        color: text(input.color, '#ffffff', 40),
        radius: numeric(input.radius, 999, 0, 1000),
        fontSize: numeric(input.fontSize, 16, 6, 200),
        weight: numeric(input.weight, 600, 100, 900),
      } as StudioElement;
    case 'video':
      return { ...base, kind, url: text(input.url, '', 2000) } as StudioElement;
    default:
      return null;
  }
}

export function sanitizeStudioDoc(input: unknown): StudioDoc {
  if (!isRecord(input)) throw new StudioValidationError('Thiếu dữ liệu trang.');

  const elements = Array.isArray(input.elements)
    ? input.elements
        .slice(0, MAX_ELEMENTS)
        .map(sanitizeElement)
        .filter((element): element is StudioElement => element !== null)
    : [];

  // Dữ liệu cũ có thể đã bị cắt ID và trùng nhau. Giữ cho mọi ID duy nhất để
  // React không gộp nhầm hai khối khi chọn / kéo / xoá.
  const seen = new Set<string>();
  for (const element of elements) {
    if (!seen.has(element.id)) {
      seen.add(element.id);
      continue;
    }

    const base = element.id.slice(0, 110);
    let suffix = 2;
    let next = `${base}-${suffix}`;
    while (seen.has(next)) {
      suffix += 1;
      next = `${base}-${suffix}`;
    }
    element.id = next;
    seen.add(next);
  }

  const background = text(input.background, '#ffffff', 40);

  return {
    title: text(input.title, 'Bài viết mới', 200) || 'Bài viết mới',
    background: /^(#[0-9a-f]{3,8}|[a-z]+)$/iu.test(background) ? background : '#ffffff',
    elements,
  };
}

function isStatus(value: unknown): value is StudioStatus {
  return value === 'draft' || value === 'published';
}

/** Đường dẫn trang gốc: chỉ nhận đường dẫn nội bộ, không nhận URL ngoài. */
export function sanitizeSourcePath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed.length > 300 || !/^\/[a-z0-9\-_/]*$/iu.test(trimmed)) return undefined;
  return trimmed === '/' ? undefined : trimmed;
}

function keyFor(id: string): string {
  return `${STUDIO_DIR}/${id}`;
}

function summaryOf(draft: StudioDraft): StudioDraftSummary {
  return {
    id: draft.id,
    title: draft.title,
    status: draft.status,
    updatedAt: draft.updatedAt,
    ...(draft.publishedAt ? { publishedAt: draft.publishedAt } : {}),
    ...(draft.sourcePath ? { sourcePath: draft.sourcePath } : {}),
    elementCount: draft.doc.elements.length,
  };
}

function parseDraft(raw: unknown, id: string): StudioDraft | null {
  if (!isRecord(raw) || typeof raw.id !== 'string' || raw.id !== id) return null;

  try {
    const doc = sanitizeStudioDoc(raw.doc);
    const sourcePath = sanitizeSourcePath(raw.sourcePath);

    return {
      id,
      title: doc.title,
      status: isStatus(raw.status) ? raw.status : 'draft',
      updatedAt: text(raw.updatedAt, new Date().toISOString(), 40),
      ...(typeof raw.publishedAt === 'string' ? { publishedAt: raw.publishedAt } : {}),
      ...(sourcePath ? { sourcePath } : {}),
      doc,
    };
  } catch {
    return null;
  }
}

export async function getStudioDraft(id: string): Promise<StudioDraft | null> {
  if (!ID_PATTERN.test(id)) return null;

  try {
    return parseDraft(await readDoc<unknown>(keyFor(id)), id);
  } catch {
    return null;
  }
}

async function readAllDrafts(): Promise<StudioDraft[]> {
  let stored: Map<string, unknown>;

  try {
    stored = await readDocsIn<unknown>(STUDIO_DIR);
  } catch {
    return [];
  }

  return [...stored]
    .filter(([id]) => ID_PATTERN.test(id))
    .map(([id, raw]) => parseDraft(raw, id))
    .filter((draft): draft is StudioDraft => draft !== null);
}

export async function listStudioDrafts(): Promise<StudioDraftSummary[]> {
  const drafts = await readAllDrafts();
  const latestBySource = new Map<string, StudioDraft>();

  for (const draft of drafts) {
    if (draft.status !== 'published' || !draft.sourcePath) continue;
    const current = latestBySource.get(draft.sourcePath);
    const stamp = (item: StudioDraft) => item.publishedAt ?? item.updatedAt;
    if (!current || stamp(draft) > stamp(current)) latestBySource.set(draft.sourcePath, draft);
  }

  const liveIds = new Set([...latestBySource.values()].map((draft) => draft.id));

  return drafts
    .map((draft) => ({
      ...summaryOf(draft),
      ...(liveIds.has(draft.id) ? { live: true } : {}),
    }))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

/**
 * Bản dựng đang thay thế một trang có sẵn. Nếu có nhiều bản đã đăng cho cùng
 * đường dẫn, bản mới nhất thắng.
 */
export async function findPublishedStudioPage(sourcePath: string): Promise<StudioDraft | null> {
  const path = sanitizeSourcePath(sourcePath);
  if (!path) return null;

  const published = (await readAllDrafts())
    .filter((draft) => draft.status === 'published' && draft.sourcePath === path)
    .sort((left, right) =>
      (right.publishedAt ?? right.updatedAt).localeCompare(left.publishedAt ?? left.updatedAt),
    );

  return published[0] ?? null;
}

export async function createStudioDraft(input: {
  doc: StudioDoc;
  status?: StudioStatus;
  sourcePath?: string;
}): Promise<StudioDraft> {
  const now = new Date();
  const id = `studio-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const status = input.status === 'published' ? 'published' : 'draft';
  const sourcePath = sanitizeSourcePath(input.sourcePath);

  const draft: StudioDraft = {
    id,
    title: input.doc.title,
    status,
    updatedAt: now.toISOString(),
    ...(status === 'published' ? { publishedAt: now.toISOString() } : {}),
    ...(sourcePath ? { sourcePath } : {}),
    doc: input.doc,
  };

  await writeDoc(keyFor(id), draft);
  return draft;
}

export async function updateStudioDraft(
  id: string,
  input: { doc?: StudioDoc; status?: StudioStatus; sourcePath?: string; publish?: boolean },
): Promise<StudioDraft | null> {
  const existing = await getStudioDraft(id);
  if (!existing) return null;

  const now = new Date();
  const doc = input.doc ?? existing.doc;
  const status = input.status ?? existing.status;
  const sourcePath = sanitizeSourcePath(input.sourcePath) ?? existing.sourcePath;
  // Chỉ thao tác "Xuất bản" mới làm bản này non nhất. Autosave của một bài đã
  // đăng không được đẩy publishedAt lên, tránh tranh chấp với bản mới hơn.
  const publishing = status === 'published' && (input.publish === true || existing.status !== 'published');

  const draft: StudioDraft = {
    id,
    title: doc.title,
    status,
    updatedAt: now.toISOString(),
    ...(status === 'published'
      ? {
          publishedAt: publishing
            ? now.toISOString()
            : (existing.publishedAt ?? now.toISOString()),
        }
      : existing.publishedAt
        ? { publishedAt: existing.publishedAt }
        : {}),
    ...(sourcePath ? { sourcePath } : {}),
    doc,
  };

  await writeDoc(keyFor(id), draft);
  return draft;
}

export async function deleteStudioDraft(id: string): Promise<boolean> {
  if (!ID_PATTERN.test(id)) return false;

  return removeDoc(keyFor(id));
}
