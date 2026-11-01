'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ElementView } from './element-view';
import { StaticPageMobile } from './static-page-mobile';
import styles from './studio.module.css';
import {
  CANVAS_WIDTH,
  MOBILE_REFLOW_WIDTH,
  staticPageHeight,
  type StudioDoc,
} from './types';

/**
 * Trang đã dựng ở dạng chỉ đọc: dùng cho hộp xem trước và trang đã đăng.
 * Cùng một renderer với lúc soạn nên không thể lệch bố cục.
 *
 * Dưới 960px, trang chuyển sang bố cục dọc thay vì thu nhỏ 1200px — nếu không,
 * chữ 19px trên điện thoại chỉ còn khoảng 6px.
 */
/**
 * Đo khung trước khi vẽ để trang không nháy từ bản desktop sang bản mobile.
 */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function StaticPage({ doc }: { doc: StudioDoc }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const height = staticPageHeight(doc);
  const mobile = width > 0 && width < MOBILE_REFLOW_WIDTH;
  const scale = width > 0 ? Math.min(width / CANVAS_WIDTH, 1) : 0.5;

  useIsomorphicLayoutEffect(() => {
    const node = wrap.current;
    if (!node) return;

    const update = () => setWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (mobile) {
    return (
      <div className={styles.staticWrap} ref={wrap}>
        <StaticPageMobile doc={doc} />
      </div>
    );
  }

  return (
    <div className={styles.staticWrap} ref={wrap}>
      <div className={styles.staticStage} style={{ height: height * scale, width: CANVAS_WIDTH * scale }}>
        <div
          className={styles.page}
          data-studio-page="true"
          style={
            {
              '--studio-scale': scale,
              background: doc.background,
              height,
              transform: `scale(${scale})`,
              width: CANVAS_WIDTH,
            } as React.CSSProperties
          }
        >
          {doc.elements
            .filter((element) => !element.hidden)
            .map((element, index) => (
              <div
                className={styles.element}
                data-kind={element.kind}
                data-static="true"
                key={element.id}
                style={{
                  height: element.h,
                  left: element.x,
                  opacity: element.opacity,
                  top: element.y,
                  transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                  width: element.w,
                  zIndex: index + 1,
                }}
              >
                <ElementView element={element} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
