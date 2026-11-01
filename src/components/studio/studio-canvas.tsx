'use client';

import { useEffect, useRef, useState } from 'react';

import { ElementView } from './element-view';
import { clamp, resizeRectRotated, snapMove, type Handle } from './geometry';
import styles from './studio.module.css';
import { CANVAS_WIDTH, type Rect, type StudioDoc, type StudioElement } from './types';

type Interaction =
  | {
      type: 'move';
      id: string;
      pointerX: number;
      pointerY: number;
      startX: number;
      startY: number;
      w: number;
      h: number;
      moved: boolean;
    }
  | {
      type: 'resize';
      id: string;
      handle: Handle;
      pointerX: number;
      pointerY: number;
      start: Rect;
    };

interface Props {
  doc: StudioDoc;
  scale: number;
  height: number;
  selectedId: string | null;
  editingId: string | null;
  readOnly?: boolean;
  pageRef?: React.RefObject<HTMLDivElement | null>;
  viewportRef?: React.RefObject<HTMLDivElement | null>;
  dropPreview?: Rect | null;
  onSelect: (id: string | null) => void;
  onEdit: (id: string | null) => void;
  onPatch: (id: string, patch: Partial<StudioElement>) => void;
  onBeginBatch: () => void;
  onEndBatch: () => void;
  onCommitText: (id: string, text: string, height?: number) => void;
  onDraftText: (id: string, text: string, height?: number) => void;
  onRequestImage: (id: string) => void;
}

const HANDLE_POSITIONS: Array<{ handle: Handle; style: React.CSSProperties }> = [
  { handle: 'nw', style: { left: 0, top: 0, cursor: 'nwse-resize' } },
  { handle: 'n', style: { left: '50%', top: 0, cursor: 'ns-resize' } },
  { handle: 'ne', style: { left: '100%', top: 0, cursor: 'nesw-resize' } },
  { handle: 'e', style: { left: '100%', top: '50%', cursor: 'ew-resize' } },
  { handle: 'se', style: { left: '100%', top: '100%', cursor: 'nwse-resize' } },
  { handle: 's', style: { left: '50%', top: '100%', cursor: 'ns-resize' } },
  { handle: 'sw', style: { left: 0, top: '100%', cursor: 'nesw-resize' } },
  { handle: 'w', style: { left: 0, top: '50%', cursor: 'ew-resize' } },
];

export function StudioCanvas({
  doc,
  scale,
  height,
  selectedId,
  editingId,
  readOnly = false,
  pageRef,
  viewportRef,
  dropPreview,
  onSelect,
  onEdit,
  onPatch,
  onBeginBatch,
  onEndBatch,
  onCommitText,
  onDraftText,
  onRequestImage,
}: Props) {
  const [interaction, setInteraction] = useState<Interaction | null>(null);
  const [guides, setGuides] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const selectedElement = doc.elements.find((element) => element.id === selectedId && !element.hidden) ?? null;

  const latest = useRef({ doc, scale, onPatch, onEndBatch });

  useEffect(() => {
    latest.current = { doc, scale, onPatch, onEndBatch };
  });

  useEffect(() => {
    if (!interaction) return;

    const move = (event: PointerEvent) => {
      const { doc: current, scale: currentScale, onPatch: patch } = latest.current;
      const dx = (event.clientX - interaction.pointerX) / currentScale;
      const dy = (event.clientY - interaction.pointerY) / currentScale;

      if (interaction.type === 'move') {
        const element = current.elements.find((item) => item.id === interaction.id);
        if (!element) return;

        const others = current.elements
          .filter((item) => item.id !== element.id && !item.hidden)
          .map((item) => ({ x: item.x, y: item.y, w: item.w, h: item.h }));

        const snapped = snapMove(
          { x: interaction.startX + dx, y: interaction.startY + dy, w: interaction.w, h: interaction.h },
          others,
          { grid: !event.altKey, canvasWidth: CANVAS_WIDTH },
        );

        setGuides(snapped.guides);
        patch(element.id, {
          x: clamp(snapped.x, 0, CANVAS_WIDTH - element.w),
          y: Math.max(0, snapped.y),
        });
        return;
      }

      const element = current.elements.find((item) => item.id === interaction.id);
      const next = resizeRectRotated(
        interaction.start,
        interaction.handle,
        dx,
        dy,
        element?.rotation ?? 0,
        CANVAS_WIDTH,
      );
      patch(interaction.id, {
        x: next.x,
        y: element?.rotation ? next.y : Math.max(0, next.y),
        w: next.w,
        h: next.h,
      });
    };

    const up = () => {
      setInteraction(null);
      setGuides({ x: [], y: [] });
      latest.current.onEndBatch();
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [interaction]);

  const startMove = (event: React.PointerEvent, element: StudioElement) => {
    if (readOnly || editingId === element.id) return;
    event.stopPropagation();
    onSelect(element.id);
    if (element.locked || event.button !== 0) return;

    onBeginBatch();
    setInteraction({
      type: 'move',
      id: element.id,
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: element.x,
      startY: element.y,
      w: element.w,
      h: element.h,
      moved: false,
    });
  };

  const startResize = (event: React.PointerEvent, element: StudioElement, handle: Handle) => {
    event.stopPropagation();
    event.preventDefault();
    onBeginBatch();
    setInteraction({
      type: 'resize',
      id: element.id,
      handle,
      pointerX: event.clientX,
      pointerY: event.clientY,
      start: { x: element.x, y: element.y, w: element.w, h: element.h },
    });
  };

  return (
    <div
      className={styles.viewport}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onSelect(null);
      }}
      ref={viewportRef}
    >
      <div className={styles.stageWrap}>
        <div
          className={styles.stage}
          style={{ height: height * scale, width: CANVAS_WIDTH * scale }}
        >
          <div
            className={styles.page}
            data-editing={Boolean(editingId)}
            data-studio-page="true"
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) onSelect(null);
            }}
            ref={pageRef}
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
            {doc.elements.map((element, index) => {
              if (element.hidden) return null;

              const selected = selectedId === element.id;
              const editing = editingId === element.id;

              return (
                <div
                  className={styles.element}
                  data-element-id={element.id}
                  data-selected={selected}
                  data-locked={element.locked}
                  data-kind={element.kind}
                  key={element.id}
                  onDoubleClick={(event) => {
                    if (readOnly || element.locked) return;
                    event.stopPropagation();
                    if (element.kind === 'image') {
                      onRequestImage(element.id);
                      return;
                    }
                    if (element.kind === 'text') onEdit(element.id);
                  }}
                  onPointerDown={(event) => startMove(event, element)}
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
                  <ElementView
                    editable={!readOnly}
                    editing={editing}
                    element={element}
                    onTextCommit={(text, height) => onCommitText(element.id, text, height)}
                    onTextDraft={(text, height) => onDraftText(element.id, text, height)}
                  />
                </div>
              );
            })}

            {selectedElement && !readOnly ? (
              <div
                className={styles.selectionLayer}
                style={{
                  height: selectedElement.h,
                  left: selectedElement.x,
                  top: selectedElement.y,
                  transform: selectedElement.rotation ? `rotate(${selectedElement.rotation}deg)` : undefined,
                  width: selectedElement.w,
                }}
              >
                <div className={styles.selectionFrame} />
                {!selectedElement.locked
                  ? HANDLE_POSITIONS.map(({ handle, style }) => (
                      <span
                        className={styles.handle}
                        data-handle={handle}
                        key={handle}
                        onPointerDown={(event) => startResize(event, selectedElement, handle)}
                        style={style}
                      />
                    ))
                  : null}
                <span className={styles.selectionTag}>
                  {selectedElement.locked ? 'Đã khoá' : ELEMENT_LABEL[selectedElement.kind]}
                </span>
              </div>
            ) : null}

            {guides.x.map((x) => (
              <div className={styles.guideVertical} key={`gx-${x}`} style={{ left: x }} />
            ))}
            {guides.y.map((y) => (
              <div className={styles.guideHorizontal} key={`gy-${y}`} style={{ top: y }} />
            ))}

            {dropPreview ? (
              <div
                className={styles.dropPreview}
                data-drop-preview="true"
                style={{
                  height: dropPreview.h,
                  left: dropPreview.x,
                  top: dropPreview.y,
                  width: dropPreview.w,
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const ELEMENT_LABEL: Record<StudioElement['kind'], string> = {
  text: 'Chữ',
  image: 'Ảnh',
  shape: 'Hình khối',
  icon: 'Biểu tượng',
  button: 'Nút',
  video: 'Video',
};
