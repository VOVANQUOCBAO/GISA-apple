/**
 * Mô hình của "studio" — trang dựng tự do kiểu Canva.
 *
 * Toàn bộ toạ độ tính bằng pixel trong một khung cố định rộng 1200px. Khi hiển
 * thị, cả khung được thu nhỏ bằng `transform: scale()` cho vừa màn hình, nên bố
 * cục không bao giờ lệch giữa máy admin và trang đã đăng.
 */

export const CANVAS_WIDTH = 1200;
export const CANVAS_MIN_HEIGHT = 1600;
export const GRID_SIZE = 8;
export const SNAP_THRESHOLD = 6;
/** Chiều cao tối thiểu của trang đã đăng (không phải khung dựng trong studio). */
export const STATIC_MIN_HEIGHT = 600;
export const STATIC_BOTTOM_PADDING = 80;
/** Dưới bề rộng này, trang công khai chuyển sang bố cục dọc thay vì thu nhỏ 1200px. */
export const MOBILE_REFLOW_WIDTH = 960;

export type TextRole = 'heading' | 'subheading' | 'body' | 'quote' | 'caption' | 'label';
export type TextFont = 'serif' | 'sans';
export type TextAlign = 'left' | 'center' | 'right';
export type ShapeKind = 'rect' | 'ellipse' | 'line';

interface ElementBase {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Độ xoay theo độ, quay quanh tâm. */
  rotation: number;
  /** 0..1 */
  opacity: number;
  locked: boolean;
  hidden: boolean;
}

export interface TextElement extends ElementBase {
  kind: 'text';
  text: string;
  role: TextRole;
  fontSize: number;
  font: TextFont;
  weight: number;
  italic: boolean;
  color: string;
  align: TextAlign;
  lineHeight: number;
  letterSpacing: number;
}

export interface ImageElement extends ElementBase {
  kind: 'image';
  src: string;
  alt: string;
  fit: 'cover' | 'contain';
  radius: number;
}

export interface ShapeElement extends ElementBase {
  kind: 'shape';
  shape: ShapeKind;
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
}

export interface IconElement extends ElementBase {
  kind: 'icon';
  name: string;
  color: string;
}

export interface ButtonElement extends ElementBase {
  kind: 'button';
  label: string;
  href: string;
  fill: string;
  color: string;
  radius: number;
  fontSize: number;
  weight: number;
}

export interface VideoElement extends ElementBase {
  kind: 'video';
  url: string;
}

export type StudioElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | IconElement
  | ButtonElement
  | VideoElement;

export type StudioElementKind = StudioElement['kind'];

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type ElementPatch = Partial<{
  [K in StudioElementKind]: Partial<Extract<StudioElement, { kind: K }>>;
}>[StudioElementKind];

export interface StudioDoc {
  title: string;
  background: string;
  elements: StudioElement[];
}

export type StudioStatus = 'draft' | 'published';

export interface StudioDraft {
  id: string;
  title: string;
  status: StudioStatus;
  updatedAt: string;
  publishedAt?: string;
  /** Trang gốc trên website mà bản dựng này thay thế khi xuất bản. */
  sourcePath?: string;
  doc: StudioDoc;
}

export interface StudioDraftSummary {
  id: string;
  title: string;
  status: StudioStatus;
  updatedAt: string;
  publishedAt?: string;
  sourcePath?: string;
  elementCount: number;
  /** Bản đang thực sự hiển thị cho đường dẫn gốc (khi có nhiều bản cùng đè). */
  live?: boolean;
}

/** Một trang đã có trên website, dùng làm mẫu dựng trong studio. */
export interface PageTemplateSummary {
  id: string;
  title: string;
  kind: string;
  kindLabel: string;
  path: string;
  summary: string;
  image?: string;
  publishedAt?: string;
  /** Số khối nội dung gốc (đoạn văn, tiêu đề, ảnh…). */
  blocks: number;
  /** Bản dựng studio đang có cho trang này (nếu admin đã mở trước đó). */
  studioDraftId?: string;
  studioStatus?: StudioStatus;
}

export interface PageTemplate {
  summary: PageTemplateSummary;
  doc: StudioDoc;
}

export function emptyDoc(title = 'Bài viết mới'): StudioDoc {
  return { title, background: '#ffffff', elements: [] };
}

/** Chiều cao trang tự giãn theo khối thấp nhất, tối thiểu bằng một trang trắng. */
export function canvasHeight(doc: StudioDoc): number {
  const bottom = doc.elements.reduce((max, element) => Math.max(max, element.y + element.h), 0);
  return Math.max(CANVAS_MIN_HEIGHT, Math.ceil((bottom + 240) / 40) * 40);
}

/** Chiều cao thật của trang đã đăng: bám nội dung, không giữ khoảng trắng 1600px. */
export function staticPageHeight(doc: StudioDoc): number {
  const bottom = doc.elements.reduce(
    (max, element) => (element.hidden ? max : Math.max(max, element.y + element.h)),
    0,
  );
  return Math.max(STATIC_MIN_HEIGHT, Math.ceil((bottom + STATIC_BOTTOM_PADDING) / 40) * 40);
}

/** Có ít nhất một khối người đọc nhìn thấy được. */
export function hasVisibleElements(doc: StudioDoc): boolean {
  return doc.elements.some((element) => !element.hidden);
}
