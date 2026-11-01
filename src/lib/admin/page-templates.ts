import 'server-only';

import { allContentFixtures } from '@/content/fixtures';
import type { ContentBlock, ContentRecord } from '@/content/types';
import type {
  ButtonElement,
  ImageElement,
  PageTemplate,
  PageTemplateSummary,
  ShapeElement,
  StudioDoc,
  StudioDraftSummary,
  StudioElement,
  TextElement,
  TextRole,
} from '@/components/studio/types';

import { listPublishedRecords } from './store';
import { listStudioDrafts } from './studio-store';

/**
 * Biến các bài viết đang có trên website thành mẫu dựng trong studio.
 *
 * Mỗi mẫu là một trang 1200px đã dàn sẵn: nhãn loại bài, tiêu đề, tóm tắt, ảnh bìa,
 * toàn bộ nội dung và một dải kêu gọi ở cuối. Tất cả đều là khối tự do, nên mở ra
 * là kéo, sửa, đổi màu được ngay bằng thanh công cụ.
 */
const KIND_LABEL: Record<string, string> = {
  news: 'Tin tức',
  notice: 'Thông báo',
  initiative: 'Sáng kiến',
  project: 'Dự án',
  publication: 'Ấn phẩm',
  course: 'Khóa học',
  expert: 'Chuyên gia',
  partner: 'Đối tác',
  tool: 'Công cụ',
};

const KIND_ORDER = [
  'news',
  'notice',
  'initiative',
  'project',
  'publication',
  'course',
  'expert',
  'partner',
  'tool',
];

const KIND_CTA: Record<string, string> = {
  news: 'Liên hệ GISA',
  notice: 'Liên hệ GISA',
  initiative: 'Trao đổi sáng kiến',
  project: 'Trao đổi dự án',
  publication: 'Đọc thêm',
  course: 'Đăng ký tư vấn',
  expert: 'Kết nối chuyên gia',
  partner: 'Hợp tác cùng GISA',
  tool: 'Dùng công cụ',
};

const PAGE_MARGIN = 60;
const HERO_X = PAGE_MARGIN;
const HERO_W = 1200 - PAGE_MARGIN * 2;
const TEXT_X = 120;
const BODY_X = 150;
const BODY_W = 900;

const TEXT_STYLE: Record<
  TextRole,
  Pick<TextElement, 'font' | 'fontSize' | 'weight' | 'italic' | 'color' | 'align' | 'lineHeight' | 'letterSpacing'>
> = {
  heading: {
    font: 'serif',
    fontSize: 56,
    weight: 600,
    italic: false,
    color: '#14211c',
    align: 'left',
    lineHeight: 1.12,
    letterSpacing: -0.02,
  },
  subheading: {
    font: 'serif',
    fontSize: 36,
    weight: 600,
    italic: false,
    color: '#14211c',
    align: 'left',
    lineHeight: 1.22,
    letterSpacing: -0.01,
  },
  body: {
    font: 'sans',
    fontSize: 19,
    weight: 400,
    italic: false,
    color: '#3f4d46',
    align: 'left',
    lineHeight: 1.7,
    letterSpacing: 0,
  },
  quote: {
    font: 'serif',
    fontSize: 28,
    weight: 500,
    italic: true,
    color: '#0d5c4b',
    align: 'left',
    lineHeight: 1.45,
    letterSpacing: -0.01,
  },
  caption: {
    font: 'sans',
    fontSize: 14,
    weight: 400,
    italic: false,
    color: '#7b8880',
    align: 'left',
    lineHeight: 1.5,
    letterSpacing: 0.01,
  },
  label: {
    font: 'sans',
    fontSize: 13,
    weight: 700,
    italic: false,
    color: '#005f69',
    align: 'left',
    lineHeight: 1.4,
    letterSpacing: 0.14,
  },
};

function measureText(text: string, width: number, fontSize: number, lineHeight: number): number {
  const charsPerLine = Math.max(10, Math.floor(width / (fontSize * 0.52)));
  const lines = text
    .split('\n')
    .reduce((total, line) => total + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);

  return Math.ceil(lines * fontSize * lineHeight + 10);
}

function formatDate(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN');
}

function metadataText(record: ContentRecord, key: string): string {
  const value = record.metadata[key];
  return typeof value === 'string' ? value.trim() : '';
}

function summaryOf(record: ContentRecord): PageTemplateSummary {
  return {
    id: record.id,
    title: record.title,
    kind: record.kind,
    kindLabel: KIND_LABEL[record.kind] ?? 'Trang',
    path: record.path,
    summary: record.summary,
    blocks: record.body.length,
    ...(record.image?.src ? { image: record.image.src } : {}),
    ...(record.publishedAt ? { publishedAt: record.publishedAt } : {}),
  };
}

function createText(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  role: TextRole,
  overrides: Partial<TextElement> = {},
): TextElement {
  return {
    id,
    kind: 'text',
    x,
    y,
    w,
    h,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    text,
    role,
    ...TEXT_STYLE[role],
    ...overrides,
  };
}

function createShape(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  overrides: Partial<ShapeElement> = {},
): ShapeElement {
  return {
    id,
    kind: 'shape',
    x,
    y,
    w,
    h,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    shape: 'rect',
    fill: '#005f69',
    stroke: 'transparent',
    strokeWidth: 0,
    radius: 0,
    ...overrides,
  };
}

function createImage(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  src: string,
  alt: string,
  overrides: Partial<ImageElement> = {},
): ImageElement {
  return {
    id,
    kind: 'image',
    x,
    y,
    w,
    h,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    src,
    alt,
    fit: 'cover',
    radius: 18,
    ...overrides,
  };
}

function createButton(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  overrides: Partial<ButtonElement> = {},
): ButtonElement {
  return {
    id,
    kind: 'button',
    x,
    y,
    w,
    h,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    label,
    href: '/lien-he',
    fill: '#005f69',
    color: '#ffffff',
    radius: 999,
    fontSize: 16,
    weight: 600,
    ...overrides,
  };
}

function heroImageBox(kind: string): { w: number; h: number; radius: number; fit: 'cover' | 'contain' } {
  if (kind === 'expert') return { w: 280, h: 280, radius: 999, fit: 'cover' };
  if (kind === 'partner') return { w: 240, h: 120, radius: 14, fit: 'contain' };
  return { w: 340, h: 250, radius: 18, fit: 'cover' };
}

function bodyImageSize(block: Extract<ContentBlock, { type: 'image' }>): { w: number; h: number } {
  const w = BODY_W;
  if (block.width && block.height && block.width > 0) {
    return { w, h: Math.round(Math.min(700, Math.max(240, (w * block.height) / block.width))) };
  }
  return { w, h: 560 };
}

export function buildPageDoc(record: ContentRecord): StudioDoc {
  let sequence = 0;
  // ID khối chỉ cần duy nhất trong một trang. Dùng tiền tố ngắn để không bị
  // giới hạn độ dài ID của kho làm cắt mất hậu tố (và gây trùng ID).
  const idPrefix = record.id.slice(0, 40);
  const nextId = (suffix: string) => `${idPrefix}--${suffix}-${(sequence += 1)}`;
  const elements: StudioElement[] = [];

  const kicker = metadataText(record, 'topic')
    ? `${KIND_LABEL[record.kind] ?? 'Trang'} · ${metadataText(record, 'topic')}`
    : (KIND_LABEL[record.kind] ?? 'Trang');
  const hasImage = Boolean(record.image?.src);
  const titleWidth = hasImage ? 600 : 860;
  const heroTop = 80;
  const imageBox = hasImage ? heroImageBox(record.kind) : null;

  let cursor = 150;
  const label = createText(nextId('kicker'), TEXT_X, 112, 500, 26, kicker.toUpperCase(), 'label');
  cursor += 32;

  const titleHeight = measureText(record.title, titleWidth, 56, 1.12);
  const title = createText(nextId('title'), TEXT_X, cursor, titleWidth, titleHeight, record.title, 'heading');
  cursor += titleHeight + 8;

  const metaParts = [
    formatDate(record.publishedAt),
    metadataText(record, 'authors'),
    metadataText(record, 'year'),
  ].filter(Boolean);
  const meta = metaParts.length
    ? createText(nextId('meta'), TEXT_X, cursor, titleWidth, 24, metaParts.join(' · '), 'caption')
    : null;
  if (meta) cursor += 30;

  const summaryHeight = record.summary
    ? measureText(record.summary, titleWidth, 19, 1.7)
    : 0;
  const summary = record.summary
    ? createText(nextId('summary'), TEXT_X, cursor, titleWidth, summaryHeight, record.summary, 'body', {
        fontSize: 19,
        color: '#3f4d46',
      })
    : null;
  if (summary) cursor += summaryHeight;

  const imageBottom = imageBox ? 150 + imageBox.h : 0;
  const heroHeight = Math.max(cursor, imageBottom) + 70 - heroTop;

  const band = createShape(nextId('hero-band'), HERO_X, heroTop, HERO_W, heroHeight, {
    fill: '#f4f7f4',
    stroke: '#e3eae3',
    strokeWidth: 1,
    radius: 28,
  });
  const accent = createShape(nextId('accent'), 90, 112, 6, 58, { fill: '#f26f33', radius: 3 });

  elements.push(band, accent);
  elements.push(label, title);
  if (meta) elements.push(meta);
  if (summary) elements.push(summary);

  if (imageBox && record.image?.src) {
    elements.push(
      createImage(nextId('cover'), 760, 150, imageBox.w, imageBox.h, record.image.src, record.image.alt, {
        fit: imageBox.fit,
        radius: imageBox.radius,
      }),
    );
  }

  let y = heroTop + heroHeight + 80;
  let summaryRepeated = false;

  const pushParagraph = (text: string) => {
    const height = measureText(text, BODY_W, 19, 1.7);
    elements.push(createText(nextId('paragraph'), BODY_X, y, BODY_W, height, text, 'body'));
    y += height + 26;
  };

  for (const block of record.body) {
    switch (block.type) {
      case 'paragraph': {
        // Nhiều bài mở đầu thân bài bằng đúng câu tóm tắt đã nằm trong hero.
        const normalized = block.text.trim();
        if (!summaryRepeated && normalized && normalized === record.summary.trim()) {
          summaryRepeated = true;
          break;
        }
        pushParagraph(block.text);
        break;
      }

      case 'heading': {
        const size = block.level === 2 ? 36 : 28;
        const height = measureText(block.text, BODY_W, size, 1.24);
        y += 14;
        elements.push(
          createText(nextId('heading'), BODY_X, y, BODY_W, height, block.text, 'subheading', {
            fontSize: size,
            lineHeight: 1.24,
          }),
        );
        y += height + 18;
        break;
      }

      case 'list': {
        const text = block.items.map((item) => `• ${item}`).join('\n');
        const height = measureText(text, BODY_W - 20, 19, 1.8);
        elements.push(
          createText(nextId('list'), BODY_X, y, BODY_W - 20, height, text, 'body', { lineHeight: 1.8 }),
        );
        y += height + 26;
        break;
      }

      case 'quote': {
        const height = measureText(block.text, BODY_W - 80, 28, 1.45);
        elements.push(
          createShape(nextId('quote-bar'), BODY_X, y + 4, 5, height - 8, { fill: '#f26f33', radius: 3 }),
        );
        elements.push(
          createText(nextId('quote'), BODY_X + 38, y, BODY_W - 80, height, `“${block.text}”`, 'quote'),
        );
        y += height + 6;
        if (block.attribution) {
          const attribution = createText(
            nextId('quote-by'),
            BODY_X + 38,
            y,
            500,
            24,
            block.attribution,
            'caption',
          );
          elements.push(attribution);
          y += 30;
        }
        y += 24;
        break;
      }

      case 'image': {
        const size = bodyImageSize(block);
        elements.push(
          createImage(nextId('image'), BODY_X, y, size.w, size.h, block.assetId, block.alt ?? '', {
            fit: 'cover',
            radius: block.shape === 'circle' ? 999 : 18,
          }),
        );
        y += size.h + 10;
        if (block.caption) {
          const height = measureText(block.caption, BODY_W, 14, 1.5);
          elements.push(createText(nextId('caption'), BODY_X, y, BODY_W, height, block.caption, 'caption'));
          y += height + 6;
        }
        y += 30;
        break;
      }

      case 'table': {
        const text = [block.headers.join('   ·   '), ...block.rows.map((row) => row.join('   ·   '))].join('\n');
        const height = measureText(text, BODY_W, 16, 1.9);
        elements.push(
          createText(nextId('table'), BODY_X, y, BODY_W, height, text, 'body', {
            fontSize: 16,
            lineHeight: 1.9,
          }),
        );
        y += height + 30;
        break;
      }

      case 'linkGroup': {
        let rowY = y;
        block.links.forEach((link, index) => {
          if (index > 0 && index % 3 === 0) rowY += 68;
          const column = index % 3;
          elements.push(
            createButton(nextId('link'), BODY_X + column * 256, rowY, 240, 52, link.label, {
              href: link.href,
            }),
          );
        });
        const rows = Math.ceil(block.links.length / 3);
        y = rowY + 52 + 30 * Math.max(0, rows - 1) + 26;
        break;
      }

      case 'video': {
        elements.push({
          id: nextId('video'),
          kind: 'video',
          x: BODY_X,
          y,
          w: BODY_W,
          h: 506,
          rotation: 0,
          opacity: 1,
          locked: false,
          hidden: false,
          url: block.externalUrl,
        });
        y += 506 + 34;
        break;
      }

      case 'canvas': {
        const ratio = block.ratio ?? 0.62;
        const frameHeight = Math.round(BODY_W * ratio);
        for (const item of block.items) {
          const x = BODY_X + (item.x / 100) * BODY_W;
          const itemY = y + (item.y / 100) * frameHeight;
          const width = (item.w / 100) * BODY_W;
          if (item.kind === 'image') {
            elements.push(
              createImage(nextId('canvas-image'), x, itemY, width, Math.round(frameHeight * 0.4), item.assetId, item.alt ?? ''),
            );
          } else {
            elements.push(
              createText(
                nextId('canvas-text'),
                x,
                itemY,
                width,
                Math.max(60, measureText(item.text, width, 18, 1.6)),
                item.text,
                'body',
                { fontSize: 18 },
              ),
            );
          }
        }
        y += frameHeight + 36;
        break;
      }

      default:
        break;
    }
  }

  y += 30;
  const ctaHeight = 250;
  elements.push(
    createShape(nextId('cta-band'), 90, y, 1020, ctaHeight, {
      fill: '#005f69',
      radius: 28,
    }),
    createText(
      nextId('cta-title'),
      150,
      y + 56,
      600,
      measureText('Cần trao đổi thêm?', 600, 42, 1.15),
      'Cần trao đổi thêm?',
      'heading',
      { fontSize: 42, color: '#ffffff', lineHeight: 1.15 },
    ),
    createText(
      nextId('cta-body'),
      150,
      y + 132,
      600,
      56,
      'GISA sẵn sàng trao đổi cụ thể hơn về nội dung bạn đang quan tâm.',
      'body',
      { color: '#d7e8e4', fontSize: 17 },
    ),
    createButton(nextId('cta-button'), 780, y + 96, 240, 56, KIND_CTA[record.kind] ?? 'Liên hệ GISA', {
      fill: '#ffffff',
      color: '#005f69',
    }),
  );

  return {
    title: record.title,
    background: '#ffffff',
    elements,
  };
}

async function loadRecords(): Promise<ContentRecord[]> {
  const byId = new Map<string, ContentRecord>();

  for (const record of allContentFixtures) byId.set(record.id, record);

  try {
    for (const record of await listPublishedRecords()) byId.set(record.id, record);
  } catch {
    /* Kho admin có thể chưa tồn tại — vẫn còn nội dung nạp sẵn. */
  }

  return [...byId.values()].filter(
    (record) => record.locale === 'vi' && KIND_ORDER.includes(record.kind),
  );
}

function orderOf(kind: string): number {
  const index = KIND_ORDER.indexOf(kind);
  return index === -1 ? KIND_ORDER.length : index;
}

export async function listPageTemplates(): Promise<PageTemplateSummary[]> {
  const [records, drafts] = await Promise.all([loadRecords(), listStudioDraftsSafe()]);
  const bySource = new Map<string, StudioDraftSummary>();

  for (const draft of drafts) {
    if (!draft.sourcePath || bySource.has(draft.sourcePath)) continue;
    bySource.set(draft.sourcePath, draft);
  }

  return records
    .map((record) => {
      const draft = bySource.get(record.path);
      return {
        ...summaryOf(record),
        ...(draft ? { studioDraftId: draft.id, studioStatus: draft.status } : {}),
      };
    })
    .sort(
      (left, right) =>
        orderOf(left.kind) - orderOf(right.kind) ||
        (right.publishedAt ?? '').localeCompare(left.publishedAt ?? '') ||
        left.title.localeCompare(right.title, 'vi'),
    );
}

async function listStudioDraftsSafe(): Promise<StudioDraftSummary[]> {
  try {
    return await listStudioDrafts();
  } catch {
    /* Thiếu thư mục studio không được làm hỏng thư viện bài viết. */
    return [];
  }
}

export async function getPageTemplate(id: string): Promise<PageTemplate | null> {
  const records = await loadRecords();
  const record = records.find((item) => item.id === id);
  if (!record) return null;

  return { summary: summaryOf(record), doc: buildPageDoc(record) };
}
