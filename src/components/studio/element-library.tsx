import type { Icon } from '@phosphor-icons/react';
import {
  ArrowRight,
  BookOpen,
  CalendarBlank,
  Cards,
  ChartLineUp,
  CheckCircle,
  Circle,
  CursorClick,
  EnvelopeSimple,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Image,
  ImageSquare,
  Lightbulb,
  ListBullets,
  MagnifyingGlass,
  MapPin,
  Megaphone,
  Minus,
  Note,
  Phone,
  Quotes,
  Rows,
  ShieldCheck,
  Sparkle,
  Square,
  Star,
  Tag,
  Target,
  TextHOne,
  TextHTwo,
  TextT,
  Users,
  VideoCamera,
} from '@phosphor-icons/react';

import type {
  ButtonElement,
  IconElement,
  ImageElement,
  ShapeElement,
  StudioElement,
  TextElement,
  TextRole,
  VideoElement,
} from './types';

export type CatalogCategory = 'text' | 'media' | 'shape' | 'template';

export interface CatalogItem {
  key: string;
  label: string;
  hint: string;
  category: CatalogCategory;
  icon: Icon;
  /** Kích thước mặc định khi thả vào trang. */
  w: number;
  h: number;
  anchor: 'center' | 'topleft';
  build: (x: number, y: number) => StudioElement[];
}

let counter = 0;

export function elementId(prefix = 'el'): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

function base(x: number, y: number, w: number, h: number) {
  return { id: elementId(), x, y, w, h, rotation: 0, opacity: 1, locked: false, hidden: false };
}

const TEXT_PRESETS: Record<
  TextRole,
  Pick<TextElement, 'font' | 'fontSize' | 'weight' | 'italic' | 'color' | 'align' | 'lineHeight' | 'letterSpacing'>
> = {
  heading: {
    font: 'serif',
    fontSize: 68,
    weight: 600,
    italic: false,
    color: '#14211c',
    align: 'left',
    lineHeight: 1.08,
    letterSpacing: -0.02,
  },
  subheading: {
    font: 'serif',
    fontSize: 36,
    weight: 600,
    italic: false,
    color: '#14211c',
    align: 'left',
    lineHeight: 1.25,
    letterSpacing: -0.01,
  },
  body: {
    font: 'sans',
    fontSize: 19,
    weight: 400,
    italic: false,
    color: '#3f4d46',
    align: 'left',
    lineHeight: 1.65,
    letterSpacing: 0,
  },
  quote: {
    font: 'serif',
    fontSize: 34,
    weight: 500,
    italic: true,
    color: '#0d5c4b',
    align: 'left',
    lineHeight: 1.4,
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

export function createText(
  x: number,
  y: number,
  role: TextRole,
  text: string,
  size: { w: number; h: number } & Partial<TextElement>,
  overrides: Partial<TextElement> = {},
): TextElement {
  const { w, h, ...rest } = size;

  return {
    ...base(x, y, w, h),
    kind: 'text',
    role,
    text,
    ...TEXT_PRESETS[role],
    ...rest,
    ...overrides,
  };
}

export function createShape(
  x: number,
  y: number,
  w: number,
  h: number,
  overrides: Partial<ShapeElement> = {},
): ShapeElement {
  return {
    ...base(x, y, w, h),
    kind: 'shape',
    shape: 'rect',
    fill: '#005f69',
    stroke: 'transparent',
    strokeWidth: 0,
    radius: 16,
    ...overrides,
  };
}

export function createImage(
  x: number,
  y: number,
  w: number,
  h: number,
  overrides: Partial<ImageElement> = {},
): ImageElement {
  return {
    ...base(x, y, w, h),
    kind: 'image',
    src: '',
    alt: '',
    fit: 'cover',
    radius: 18,
    ...overrides,
  };
}

export function createButton(
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  overrides: Partial<ButtonElement> = {},
): ButtonElement {
  return {
    ...base(x, y, w, h),
    kind: 'button',
    label,
    href: '#',
    fill: '#005f69',
    color: '#ffffff',
    radius: 999,
    fontSize: 16,
    weight: 600,
    ...overrides,
  };
}

export function createIcon(
  x: number,
  y: number,
  name: string,
  overrides: Partial<IconElement> = {},
): IconElement {
  return {
    ...base(x, y, 72, 72),
    kind: 'icon',
    name,
    color: '#005f69',
    ...overrides,
  };
}

export function createVideo(
  x: number,
  y: number,
  w: number,
  h: number,
  url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
): VideoElement {
  return { ...base(x, y, w, h), kind: 'video', url };
}

export const ICON_NAMES = {
  sparkle: 'Sparkle',
  star: 'Star',
  check: 'CheckCircle',
  arrow: 'ArrowRight',
  book: 'BookOpen',
  grad: 'GraduationCap',
  network: 'Users',
  handshake: 'Handshake',
  shield: 'ShieldCheck',
  globe: 'Globe',
  bulb: 'Lightbulb',
  target: 'Target',
  chart: 'ChartLineUp',
  heart: 'Heart',
  calendar: 'CalendarBlank',
  pin: 'MapPin',
  mail: 'EnvelopeSimple',
  phone: 'Phone',
  search: 'MagnifyingGlass',
  megaphone: 'Megaphone',
} as const;

export type IconName = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];

export const ICON_LIST: Array<{ name: IconName; label: string; icon: Icon }> = [
  { name: 'Sparkle', label: 'Toả sáng', icon: Sparkle },
  { name: 'Star', label: 'Ngôi sao', icon: Star },
  { name: 'CheckCircle', label: 'Đã duyệt', icon: CheckCircle },
  { name: 'ArrowRight', label: 'Mũi tên', icon: ArrowRight },
  { name: 'BookOpen', label: 'Tri thức', icon: BookOpen },
  { name: 'GraduationCap', label: 'Đào tạo', icon: GraduationCap },
  { name: 'Users', label: 'Cộng đồng', icon: Users },
  { name: 'Handshake', label: 'Đồng hành', icon: Handshake },
  { name: 'ShieldCheck', label: 'Tin cậy', icon: ShieldCheck },
  { name: 'Globe', label: 'Toàn cầu', icon: Globe },
  { name: 'Lightbulb', label: 'Ý tưởng', icon: Lightbulb },
  { name: 'Target', label: 'Mục tiêu', icon: Target },
  { name: 'ChartLineUp', label: 'Tăng trưởng', icon: ChartLineUp },
  { name: 'Heart', label: 'Tâm huyết', icon: Heart },
  { name: 'CalendarBlank', label: 'Lịch', icon: CalendarBlank },
  { name: 'MapPin', label: 'Địa điểm', icon: MapPin },
  { name: 'EnvelopeSimple', label: 'Email', icon: EnvelopeSimple },
  { name: 'Phone', label: 'Điện thoại', icon: Phone },
  { name: 'MagnifyingGlass', label: 'Tìm kiếm', icon: MagnifyingGlass },
  { name: 'Megaphone', label: 'Thông báo', icon: Megaphone },
];

/* ------------------------------------------------------------------ */
/* Mẫu bố cục: mỗi mẫu là một cụm khối đặt sẵn, thả vào là dùng được.  */
/* ------------------------------------------------------------------ */

function hero(x: number, y: number): StudioElement[] {
  return [
    createShape(x, y, 1020, 560, { fill: '#f4f7f4', radius: 28, stroke: '#e3eae3', strokeWidth: 1 }),
    createText(x + 72, y + 92, 'label', 'GISA · TRI THỨC VIỆT', { w: 520, h: 24 }, { color: '#005f69' }),
    createText(x + 72, y + 140, 'heading', 'Tiêu đề bài viết của bạn', { w: 720, h: 190 }),
    createText(x + 72, y + 350, 'body', 'Một đoạn mở đầu ngắn gọn, nói rõ người đọc sẽ nhận được gì khi đọc tiếp.', {
      w: 620,
      h: 80,
    }),
    createButton(x + 72, y + 456, 196, 56, 'Khám phá ngay'),
  ];
}

function threeColumns(x: number, y: number): StudioElement[] {
  const cards = [
    { title: 'Nghiên cứu', body: 'Dữ liệu và báo cáo mở về các lĩnh vực đang quan tâm.', icon: 'BookOpen' },
    { title: 'Đào tạo', body: 'Chương trình học ngắn, thực hành được ngay.', icon: 'GraduationCap' },
    { title: 'Kết nối', body: 'Mạng lưới chuyên gia và tổ chức cùng đồng hành.', icon: 'Handshake' },
  ];

  return cards.flatMap((card, index) => {
    const left = x + index * 360;
    return [
      createShape(left, y, 320, 320, { fill: '#ffffff', radius: 22, stroke: '#e2e8e2', strokeWidth: 1 }),
      createIcon(left + 32, y + 32, card.icon, { color: '#005f69', w: 52, h: 52 }),
      createText(left + 32, y + 108, 'subheading', card.title, { w: 256, h: 44 }, { fontSize: 27 }),
      createText(left + 32, y + 164, 'body', card.body, { w: 256, h: 110 }, { fontSize: 16 }),
      createText(left + 32, y + 268, 'label', 'XEM THÊM', { w: 160, h: 20 }, { color: '#f26f33' }),
    ];
  });
}

function articleCard(x: number, y: number): StudioElement[] {
  return [
    createShape(x, y, 560, 620, { fill: '#ffffff', radius: 24, stroke: '#e2e8e2', strokeWidth: 1 }),
    createImage(x + 24, y + 24, 512, 300, { radius: 16 }),
    createText(x + 40, y + 356, 'label', 'TIN TỨC', { w: 200, h: 20 }),
    createText(x + 40, y + 392, 'subheading', 'Tiêu đề của bài viết nằm ở đây', { w: 480, h: 96 }),
    createText(x + 40, y + 496, 'body', 'Hai dòng mô tả ngắn giúp người đọc biết bài này nói về điều gì.', {
      w: 470,
      h: 60,
      fontSize: 16,
    }),
    createText(x + 40, y + 566, 'label', 'ĐỌC BÀI →', { w: 180, h: 20 }, { color: '#f26f33' }),
  ];
}

function quoteBlock(x: number, y: number): StudioElement[] {
  return [
    createShape(x, y, 12, 260, { fill: '#f26f33', radius: 6 }),
    createText(x + 56, y + 8, 'quote', '“Một câu trích dẫn đủ mạnh để người đọc dừng lại và nghĩ tiếp.”', {
      w: 800,
      h: 180,
      fontSize: 40,
    }),
    createText(x + 56, y + 200, 'caption', 'Tên người nói · Chức danh', { w: 420, h: 24 }),
  ];
}

function ctaBand(x: number, y: number): StudioElement[] {
  return [
    createShape(x, y, 1020, 280, { fill: '#005f69', radius: 28 }),
    createText(x + 64, y + 64, 'heading', 'Sẵn sàng bắt đầu?', { w: 560, h: 80 }, { color: '#ffffff', fontSize: 46 }),
    createText(x + 64, y + 148, 'body', 'Một dòng nói rõ bước tiếp theo, không lan man.', {
      w: 560,
      h: 40,
      color: '#d7e8e4',
      fontSize: 17,
    }),
    createButton(x + 764, y + 108, 192, 56, 'Liên hệ ngay', { fill: '#ffffff', color: '#005f69' }),
  ];
}

function imageWithText(x: number, y: number): StudioElement[] {
  return [
    createImage(x, y, 520, 400, { radius: 22 }),
    createText(x + 584, y + 42, 'label', 'CÂU CHUYỆN', { w: 300, h: 20 }),
    createText(x + 584, y + 80, 'subheading', 'Ảnh bên trái, chữ bên phải', { w: 420, h: 120 }),
    createText(x + 584, y + 214, 'body', 'Giữ mỗi đoạn thật ngắn. Ảnh lớn, chữ ít thì bố cục luôn sạch.', {
      w: 420,
      h: 90,
      fontSize: 17,
    }),
    createText(x + 584, y + 330, 'label', 'TÌM HIỂU THÊM →', { w: 240, h: 20 }, { color: '#f26f33' }),
  ];
}

function statsRow(x: number, y: number): StudioElement[] {
  const stats = [
    { value: '12', label: 'năm đồng hành' },
    { value: '340+', label: 'chuyên gia' },
    { value: '68', label: 'tổ chức' },
  ];

  return stats.flatMap((stat, index) => {
    const left = x + index * 320;
    return [
      createText(left, y, 'heading', stat.value, { w: 260, h: 92 }, { fontSize: 64, color: '#005f69' }),
      createText(left, y + 96, 'body', stat.label, { w: 260, h: 30 }, { fontSize: 16, color: '#5d6b64' }),
      createShape(left, y + 146, 240, 2, { fill: '#dde5dd', radius: 0 }),
    ];
  });
}

export const CATALOG: CatalogItem[] = [
  {
    key: 'heading',
    label: 'Tiêu đề lớn',
    hint: 'Chữ tiêu đề chính',
    category: 'text',
    icon: TextHOne,
    w: 720,
    h: 160,
    anchor: 'center',
    build: (x, y) => [createText(x, y, 'heading', 'Tiêu đề lớn của bạn', { w: 720, h: 160 })],
  },
  {
    key: 'subheading',
    label: 'Tiêu đề phụ',
    hint: 'Chữ đệm cho một mục',
    category: 'text',
    icon: TextHTwo,
    w: 560,
    h: 96,
    anchor: 'center',
    build: (x, y) => [createText(x, y, 'subheading', 'Tiêu đề phụ', { w: 560, h: 96 })],
  },
  {
    key: 'body',
    label: 'Đoạn văn',
    hint: 'Một đoạn nội dung',
    category: 'text',
    icon: TextT,
    w: 560,
    h: 120,
    anchor: 'center',
    build: (x, y) => [
      createText(x, y, 'body', 'Bấm đúp để viết. Mỗi đoạn nên ngắn, tập trung vào một ý.', { w: 560, h: 120 }),
    ],
  },
  {
    key: 'quote',
    label: 'Trích dẫn',
    hint: 'Câu nói nổi bật',
    category: 'text',
    icon: Quotes,
    w: 720,
    h: 160,
    anchor: 'center',
    build: (x, y) => [createText(x, y, 'quote', '“Một câu trích dẫn đáng nhớ.”', { w: 720, h: 160 })],
  },
  {
    key: 'caption',
    label: 'Chú thích',
    hint: 'Ghi chú nhỏ dưới ảnh',
    category: 'text',
    icon: Note,
    w: 420,
    h: 48,
    anchor: 'center',
    build: (x, y) => [createText(x, y, 'caption', 'Chú thích ảnh hoặc nguồn dẫn', { w: 420, h: 48 })],
  },
  {
    key: 'label',
    label: 'Nhãn',
    hint: 'Chữ in hoa đánh dấu mục',
    category: 'text',
    icon: Tag,
    w: 280,
    h: 28,
    anchor: 'center',
    build: (x, y) => [createText(x, y, 'label', 'NHÃN MỤC', { w: 280, h: 28 })],
  },
  {
    key: 'list',
    label: 'Danh sách',
    hint: 'Ba gạch đầu dòng',
    category: 'text',
    icon: ListBullets,
    w: 480,
    h: 132,
    anchor: 'center',
    build: (x, y) => [
      createText(x, y, 'body', '• Ý thứ nhất\n• Ý thứ hai\n• Ý thứ ba', { w: 480, h: 132 }, { lineHeight: 1.8 }),
    ],
  },
  {
    key: 'button',
    label: 'Nút bấm',
    hint: 'Nút dẫn tới liên kết',
    category: 'text',
    icon: CursorClick,
    w: 200,
    h: 56,
    anchor: 'center',
    build: (x, y) => [createButton(x, y, 200, 56, 'Bấm vào đây')],
  },
  {
    key: 'image',
    label: 'Ảnh',
    hint: 'Tải ảnh từ máy',
    category: 'media',
    icon: Image,
    w: 520,
    h: 360,
    anchor: 'center',
    build: (x, y) => [createImage(x, y, 520, 360)],
  },
  {
    key: 'gallery',
    label: 'Cụm ảnh',
    hint: 'Ba ảnh cạnh nhau',
    category: 'media',
    icon: ImageSquare,
    w: 1020,
    h: 280,
    anchor: 'center',
    build: (x, y) => [
      createImage(x, y, 320, 280, { radius: 14 }),
      createImage(x + 350, y, 320, 280, { radius: 14 }),
      createImage(x + 700, y, 320, 280, { radius: 14 }),
    ],
  },
  {
    key: 'video',
    label: 'Video',
    hint: 'Nhúng YouTube',
    category: 'media',
    icon: VideoCamera,
    w: 720,
    h: 405,
    anchor: 'center',
    build: (x, y) => [createVideo(x, y, 720, 405)],
  },
  {
    key: 'icon',
    label: 'Biểu tượng',
    hint: 'Một icon đơn sắc',
    category: 'media',
    icon: Sparkle,
    w: 72,
    h: 72,
    anchor: 'center',
    build: (x, y) => [createIcon(x, y, 'Sparkle')],
  },
  {
    key: 'rect',
    label: 'Khối màu',
    hint: 'Nền, dải màu, thẻ',
    category: 'shape',
    icon: Square,
    w: 420,
    h: 280,
    anchor: 'center',
    build: (x, y) => [createShape(x, y, 420, 280)],
  },
  {
    key: 'ellipse',
    label: 'Hình tròn',
    hint: 'Chấm, vòng tròn',
    category: 'shape',
    icon: Circle,
    w: 220,
    h: 220,
    anchor: 'center',
    build: (x, y) => [createShape(x, y, 220, 220, { shape: 'ellipse', radius: 999 })],
  },
  {
    key: 'line',
    label: 'Đường kẻ',
    hint: 'Đường mảnh phân cách',
    category: 'shape',
    icon: Minus,
    w: 1020,
    h: 2,
    anchor: 'center',
    build: (x, y) => [createShape(x, y, 1020, 2, { shape: 'line', fill: '#d5ded5', radius: 0 })],
  },
  {
    key: 'hero',
    label: 'Khối mở đầu',
    hint: 'Nền nhạt, tiêu đề, nút',
    category: 'template',
    icon: Rows,
    w: 1020,
    h: 560,
    anchor: 'center',
    build: hero,
  },
  {
    key: 'columns',
    label: 'Ba cột',
    hint: 'Ba thẻ dịch vụ',
    category: 'template',
    icon: Cards,
    w: 1040,
    h: 320,
    anchor: 'center',
    build: threeColumns,
  },
  {
    key: 'article',
    label: 'Thẻ bài viết',
    hint: 'Ảnh, tiêu đề, mô tả',
    category: 'template',
    icon: ImageSquare,
    w: 560,
    h: 620,
    anchor: 'center',
    build: articleCard,
  },
  {
    key: 'quote-block',
    label: 'Trích dẫn lớn',
    hint: 'Vạch màu và câu nói',
    category: 'template',
    icon: Quotes,
    w: 900,
    h: 260,
    anchor: 'center',
    build: quoteBlock,
  },
  {
    key: 'cta',
    label: 'Dải kêu gọi',
    hint: 'Nền đậm, nút trắng',
    category: 'template',
    icon: Megaphone,
    w: 1020,
    h: 280,
    anchor: 'center',
    build: ctaBand,
  },
  {
    key: 'image-text',
    label: 'Ảnh và chữ',
    hint: 'Ảnh trái, nội dung phải',
    category: 'template',
    icon: Image,
    w: 1020,
    h: 400,
    anchor: 'center',
    build: imageWithText,
  },
  {
    key: 'stats',
    label: 'Con số biết nói',
    hint: 'Ba chỉ số nổi bật',
    category: 'template',
    icon: ChartLineUp,
    w: 960,
    h: 160,
    anchor: 'center',
    build: statsRow,
  },
];

export const CATEGORY_LABEL: Record<CatalogCategory, string> = {
  text: 'Văn bản',
  media: 'Ảnh & video',
  shape: 'Hình khối',
  template: 'Mẫu bố cục',
};

export function catalogByKey(key: string): CatalogItem | undefined {
  return CATALOG.find((item) => item.key === key);
}
