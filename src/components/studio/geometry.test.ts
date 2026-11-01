import { describe, expect, it } from 'vitest';

import { resizeRect, resizeRectRotated, snapMove } from './geometry';

describe('snapMove', () => {
  it('bám lưới 8px khi không có khối nào để canh', () => {
    const result = snapMove({ x: 13, y: 17, w: 200, h: 100 }, [], { canvasWidth: 1200 });
    expect(result).toEqual({ x: 16, y: 16, guides: { x: [], y: [] } });
  });

  it('bám cạnh trái của khối khác và trả về đường gióng', () => {
    const result = snapMove({ x: 102, y: 300, w: 200, h: 80 }, [{ x: 100, y: 120, w: 300, h: 60 }]);
    expect(result.x).toBe(100);
    expect(result.guides.x).toContain(100);
  });

  it('bám trục giữa trang', () => {
    const result = snapMove({ x: 499, y: 640, w: 200, h: 100 }, []);
    expect(result.x).toBe(500);
    expect(result.guides.x).toContain(600);
  });

  it('bỏ bám lưới khi tắt grid', () => {
    const result = snapMove({ x: 13, y: 17, w: 40, h: 40 }, [], { grid: false });
    expect(result).toEqual({ x: 13, y: 17, guides: { x: [], y: [] } });
  });
});

describe('resizeRect', () => {
  const start = { x: 100, y: 100, w: 200, h: 100 };

  it('kéo cạnh phải thì chỉ tăng chiều rộng', () => {
    expect(resizeRect(start, 'e', 40, 30)).toEqual({ x: 100, y: 100, w: 240, h: 100 });
  });

  it('kéo cạnh trái thì giữ nguyên mép phải', () => {
    expect(resizeRect(start, 'w', 40, 0)).toEqual({ x: 140, y: 100, w: 160, h: 100 });
  });

  it('kéo góc trên trái thì giữ nguyên mép dưới', () => {
    expect(resizeRect(start, 'nw', 20, 10)).toEqual({ x: 120, y: 110, w: 180, h: 90 });
  });

  it('không cho nhỏ hơn kích thước tối thiểu', () => {
    expect(resizeRect(start, 'e', -500, 0).w).toBe(24);
  });

  it('không cho tràn khỏi bề rộng trang', () => {
    const result = resizeRect({ x: 900, y: 0, w: 200, h: 100 }, 'e', 500, 0, 1200);
    expect(result.w).toBe(300);
  });
});

describe('resizeRectRotated', () => {
  const start = { x: 100, y: 100, w: 200, h: 100 };

  it('không xoay thì giống resizeRect', () => {
    expect(resizeRectRotated(start, 'e', 40, 30, 0)).toEqual(resizeRect(start, 'e', 40, 30));
  });

  it('xoay 90 độ: kéo tay nắm phải xuống dưới thì tăng chiều rộng và giữ điểm đối diện', () => {
    const result = resizeRectRotated(start, 'e', 0, 50, 90);
    expect(result.w).toBe(250);
    expect(result.h).toBe(100);
    expect(result.x).toBe(75);
    expect(result.y).toBe(125);
  });

  it('xoay 90 độ: kéo ngang không làm đổi chiều rộng', () => {
    const result = resizeRectRotated(start, 'e', 50, 0, 90);
    expect(result).toEqual(start);
  });
});
