import { CANVAS_WIDTH, GRID_SIZE, SNAP_THRESHOLD, type Rect } from './types';

export interface SnapResult {
  x: number;
  y: number;
  guides: { x: number[]; y: number[] };
}

const EDGES = ['start', 'center', 'end'] as const;

function round(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function nearestDelta(
  edges: { start: number; center: number; end: number },
  targets: number[],
  threshold: number,
): number | null {
  let best: number | null = null;

  for (const edge of EDGES) {
    const value = edges[edge];
    for (const target of targets) {
      const delta = target - value;
      if (Math.abs(delta) > threshold) continue;
      if (best === null || Math.abs(delta) < Math.abs(best)) best = delta;
    }
  }

  return best;
}

/**
 * Kéo một khối: bám lưới 8px, rồi bám cạnh / tâm của các khối khác và trục giữa
 * trang. Trả về toạ độ đã làm tròn và các đường gióng để vẽ.
 */
export function snapMove(
  rect: Rect,
  others: Rect[],
  options: { grid?: boolean; canvasWidth?: number; threshold?: number } = {},
): SnapResult {
  const grid = options.grid ?? true;
  const canvasWidth = options.canvasWidth ?? CANVAS_WIDTH;
  const threshold = options.threshold ?? SNAP_THRESHOLD;

  let x = grid ? round(rect.x, GRID_SIZE) : rect.x;
  let y = grid ? round(rect.y, GRID_SIZE) : rect.y;

  const targetsX = [canvasWidth / 2];
  const targetsY: number[] = [];

  for (const other of others) {
    targetsX.push(other.x, other.x + other.w / 2, other.x + other.w);
    targetsY.push(other.y, other.y + other.h / 2, other.y + other.h);
  }

  const edgesX = { start: x, center: x + rect.w / 2, end: x + rect.w };
  const deltaX = nearestDelta(edgesX, targetsX, threshold);
  const deltaY = nearestDelta({ start: y, center: y + rect.h / 2, end: y + rect.h }, targetsY, threshold);

  const guides: { x: number[]; y: number[] } = { x: [], y: [] };

  if (deltaX !== null) {
    x += deltaX;
    const snapped = edgesX.start + deltaX;
    const center = edgesX.center + deltaX;
    const end = edgesX.end + deltaX;
    for (const target of targetsX) {
      if (Math.abs(snapped - target) < 0.5 || Math.abs(center - target) < 0.5 || Math.abs(end - target) < 0.5) {
        guides.x.push(target);
      }
    }
  }

  if (deltaY !== null) {
    y += deltaY;
    const snapped = y;
    const center = y + rect.h / 2;
    const end = y + rect.h;
    for (const target of targetsY) {
      if (Math.abs(snapped - target) < 0.5 || Math.abs(center - target) < 0.5 || Math.abs(end - target) < 0.5) {
        guides.y.push(target);
      }
    }
  }

  return { x, y, guides: { x: [...new Set(guides.x)], y: [...new Set(guides.y)] } };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;
export type Handle = (typeof HANDLES)[number];

const MIN_SIZE = 24;

/** Kéo một tay nắm để đổi kích thước; giữ khối nằm trong trang. */
export function resizeRect(
  start: Rect,
  handle: Handle,
  deltaX: number,
  deltaY: number,
  canvasWidth = CANVAS_WIDTH,
): Rect {
  let { x, y, w, h } = start;

  if (handle.includes('w')) {
    const nextWidth = clamp(w - deltaX, MIN_SIZE, x + w);
    x = x + w - nextWidth;
    w = nextWidth;
  }
  if (handle.includes('e')) {
    w = clamp(w + deltaX, MIN_SIZE, canvasWidth - x);
  }
  if (handle.includes('n')) {
    const nextHeight = clamp(h - deltaY, MIN_SIZE, y + h);
    y = y + h - nextHeight;
    h = nextHeight;
  }
  if (handle.includes('s')) {
    h = clamp(h + deltaY, MIN_SIZE, 100000);
  }

  return { x, y, w, h };
}

function rotate(x: number, y: number, radians: number): { x: number; y: number } {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}

/** Điểm đối diện tay nắm — điểm phải đứng yên khi kéo. */
function anchorFor(rect: Rect, handle: Handle): { x: number; y: number } {
  const x = handle.includes('w')
    ? rect.x + rect.w
    : handle.includes('e')
      ? rect.x
      : rect.x + rect.w / 2;
  const y = handle.includes('n')
    ? rect.y + rect.h
    : handle.includes('s')
      ? rect.y
      : rect.y + rect.h / 2;
  return { x, y };
}

/**
 * Resize một khối đã xoay. Delta chuột được đưa về hệ toạ độ của khối, sau đó
 * dịch khối lại để điểm đối diện tay nắm vẫn đứng yên trên màn hình.
 */
export function resizeRectRotated(
  start: Rect,
  handle: Handle,
  deltaX: number,
  deltaY: number,
  rotation: number,
  canvasWidth = CANVAS_WIDTH,
): Rect {
  if (!rotation) return resizeRect(start, handle, deltaX, deltaY, canvasWidth);

  const radians = (rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const localX = deltaX * cos + deltaY * sin;
  const localY = -deltaX * sin + deltaY * cos;
  const next = resizeRect(start, handle, localX, localY, canvasWidth);

  const startCenter = { x: start.x + start.w / 2, y: start.y + start.h / 2 };
  const nextCenter = { x: next.x + next.w / 2, y: next.y + next.h / 2 };
  const startAnchor = anchorFor(start, handle);
  const nextAnchor = anchorFor(next, handle);

  const before = rotate(startAnchor.x - startCenter.x, startAnchor.y - startCenter.y, radians);
  const after = rotate(nextAnchor.x - nextCenter.x, nextAnchor.y - nextCenter.y, radians);
  const shiftX = before.x + startCenter.x - (after.x + nextCenter.x);
  const shiftY = before.y + startCenter.y - (after.y + nextCenter.y);

  return {
    x: next.x + shiftX,
    y: next.y + shiftY,
    w: next.w,
    h: next.h,
  };
}
