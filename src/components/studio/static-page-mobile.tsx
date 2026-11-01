import { ElementView, safeHref } from './element-view';
import styles from './static-page-mobile.module.css';
import type {
  ImageElement,
  ShapeElement,
  StudioDoc,
  StudioElement,
  TextElement,
} from './types';

/**
 * Bản dọc của trang đã đăng cho điện thoại.
 *
 * Không cố giữ toạ độ tuyệt đối (chữ 19px sẽ bị thu còn ~6px). Thay vào đó,
 * các khối được xếp theo thứ tự đọc; những hình chữ nhật lớn đóng vai trò "khung"
 * (hero, thẻ, dải CTA) được dựng lại thành một khối có nền, các khối con nằm
 * trong đó. Hình trang trí nhỏ được bỏ qua.
 */

interface Band {
  shape: ShapeElement;
  items: StudioElement[];
  area: number;
}

const BAND_MIN_WIDTH = 240;
const BAND_MIN_HEIGHT = 120;

function isBand(element: StudioElement): element is ShapeElement {
  return (
    element.kind === 'shape' &&
    element.shape === 'rect' &&
    element.w >= BAND_MIN_WIDTH &&
    element.h >= BAND_MIN_HEIGHT
  );
}

function isInside(element: StudioElement, shape: ShapeElement): boolean {
  const x = element.x + element.w / 2;
  const y = element.y + element.h / 2;
  return x >= shape.x && x <= shape.x + shape.w && y >= shape.y && y <= shape.y + shape.h;
}

function mobileFontSize(element: TextElement): number {
  switch (element.role) {
    case 'heading':
      return Math.max(24, Math.min(36, element.fontSize * 0.58));
    case 'subheading':
      return Math.max(20, Math.min(28, element.fontSize * 0.62));
    case 'body':
      return Math.max(16, Math.min(18, element.fontSize * 0.9));
    case 'quote':
      return Math.max(18, Math.min(24, element.fontSize * 0.7));
    case 'caption':
      return 13;
    case 'label':
      return 11.5;
    default:
      return 16;
  }
}

function textStyle(element: TextElement): React.CSSProperties {
  const style: React.CSSProperties = {
    color: element.color,
    fontFamily: element.font === 'serif' ? 'var(--font-heading)' : 'var(--font-body)',
    fontSize: mobileFontSize(element),
    fontStyle: element.italic ? 'italic' : 'normal',
    fontWeight: element.weight,
    letterSpacing: `${element.letterSpacing}em`,
    lineHeight: element.lineHeight,
    margin: 0,
    overflowWrap: 'anywhere',
    textAlign: element.align,
    whiteSpace: 'pre-wrap',
  };

  if (element.role === 'quote') {
    style.borderLeft = `3px solid #f26f33`;
    style.paddingLeft = 14;
    style.margin = '10px 0 14px';
  }

  return style;
}

function textMargin(element: TextElement): string {
  switch (element.role) {
    case 'heading':
      return '4px 0 10px';
    case 'subheading':
      return '10px 0 8px';
    case 'label':
      return '0 0 6px';
    case 'caption':
      return '2px 0 8px';
    case 'quote':
      return '10px 0 14px';
    default:
      return '0 0 12px';
  }
}

function imageWidth(element: ImageElement): string {
  const width = Math.max(120, Math.min(element.w, 1000));
  return `min(100%, ${width}px)`;
}

function ImageBlock({ element }: { element: ImageElement }) {
  const round = element.radius >= 200;
  return (
    <div
      className={styles.imageWrap}
      style={{
        marginInline: round || element.x > 300 ? 'auto' : 0,
        width: imageWidth(element),
      }}
    >
      <div
        className={styles.imageBox}
        style={{
          aspectRatio: `${element.w} / ${element.h}`,
          borderRadius: Math.min(element.radius, 999),
        }}
      >
        <ElementView element={element} />
      </div>
    </div>
  );
}

function ButtonBlock({ element }: { element: Extract<StudioElement, { kind: 'button' }> }) {
  const href = safeHref(element.href);
  const external = /^https?:\/\//iu.test(href);
  return (
    <a
      className={styles.button}
      href={href}
      rel={external ? 'noreferrer' : undefined}
      style={{
        background: element.fill,
        borderRadius: Math.min(element.radius, 999),
        color: element.color,
        fontSize: Math.max(14, Math.min(17, element.fontSize)),
        fontWeight: element.weight,
      }}
      target={external ? '_blank' : undefined}
    >
      {element.label || 'Bấm vào đây'}
    </a>
  );
}

function FlowItem({ element }: { element: StudioElement }) {
  switch (element.kind) {
    case 'text':
      return (
        <div style={{ margin: textMargin(element) }}>
          <div style={textStyle(element)}>{element.text}</div>
        </div>
      );
    case 'image':
      return <ImageBlock element={element} />;
    case 'button':
      return (
        <div className={styles.buttonRow}>
          <ButtonBlock element={element} />
        </div>
      );
    case 'icon':
      return (
        <div className={styles.iconRow}>
          <div className={styles.iconBox}>
            <ElementView element={element} />
          </div>
        </div>
      );
    case 'video':
      return (
        <div className={styles.videoBox}>
          <ElementView element={element} />
        </div>
      );
    case 'shape':
      if (element.shape === 'line') {
        return (
          <hr
            className={styles.line}
            style={{ background: element.fill, height: Math.max(1, element.strokeWidth || 2) }}
          />
        );
      }
      return null;
    default:
      return null;
  }
}

function sortByPosition(a: StudioElement, b: StudioElement): number {
  return a.y - b.y || a.x - b.x;
}

function buildBands(elements: StudioElement[]): { bands: Band[]; top: StudioElement[] } {
  const shapes = elements.filter(isBand);
  const bands: Band[] = shapes.map((shape) => ({
    shape,
    items: [],
    area: shape.w * shape.h,
  }));
  const shapeIds = new Set(shapes.map((shape) => shape.id));
  const top: StudioElement[] = [];

  for (const element of elements) {
    if (shapeIds.has(element.id)) continue;

    const candidates = bands.filter((band) => isInside(element, band.shape));
    if (!candidates.length) {
      top.push(element);
      continue;
    }

    // Khung nhỏ nhất chứa khối này là khung gần nhất (thẻ nằm trong dải lớn).
    candidates.sort((a, b) => a.area - b.area);
    candidates[0].items.push(element);
  }

  return {
    bands: bands
      .filter((band) => band.items.some((item) => item.kind !== 'shape'))
      .map((band) => {
        const hero = band.items.some(
          (item) => item.kind === 'text' && item.role === 'heading' && item.fontSize >= 48,
        );

        return {
          ...band,
          items: band.items.sort((a, b) => {
            // Nút luôn xuống cuối khối; trên desktop nó thường nằm bên phải,
            // nhưng khi xếp dọc thì đọc chữ trước rồi mới tới hành động.
            if (a.kind === 'button' && b.kind !== 'button') return 1;
            if (b.kind === 'button' && a.kind !== 'button') return -1;

            // Ảnh bìa trong hero đứng sau tiêu đề/tóm tắt; ảnh trong thẻ bài
            // vẫn đứng trước vì đó là thumbnail.
            if (hero) {
              if (a.kind === 'image' && b.kind !== 'image') return 1;
              if (b.kind === 'image' && a.kind !== 'image') return -1;
            }

            return sortByPosition(a, b);
          }),
        };
      }),
    top: top.sort(sortByPosition),
  };
}

export function StaticPageMobile({ doc }: { doc: StudioDoc }) {
  const visible = doc.elements.filter((element) => !element.hidden);
  const { bands, top } = buildBands(visible);

  const nodes: Array<{ y: number; x: number; node: React.ReactNode }> = [];

  for (const band of bands) {
    nodes.push({
      x: band.shape.x,
      y: band.shape.y,
      node: (
        <section
          className={styles.band}
          key={`band-${band.shape.id}`}
          style={{
            background: band.shape.fill,
            border:
              band.shape.strokeWidth > 0 && band.shape.stroke !== 'transparent'
                ? `${band.shape.strokeWidth}px solid ${band.shape.stroke}`
                : undefined,
            borderRadius: Math.min(Math.max(band.shape.radius, 14), 26),
          }}
        >
          {band.items.map((item) => (
            <FlowItem element={item} key={item.id} />
          ))}
        </section>
      ),
    });
  }

  for (const element of top) {
    if (element.kind === 'shape' && element.shape !== 'line') continue;
    nodes.push({
      x: element.x,
      y: element.y,
      node: <FlowItem element={element} key={element.id} />,
    });
  }

  nodes.sort((a, b) => a.y - b.y || a.x - b.x);

  return (
    <div className={styles.page} data-mobile="true" data-studio-page="true" style={{ background: doc.background }}>
      <div className={styles.inner}>{nodes.map((node) => node.node)}</div>
    </div>
  );
}
