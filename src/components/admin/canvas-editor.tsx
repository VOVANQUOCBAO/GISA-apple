'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { CanvasBlock, CanvasItem } from '@/content/types';

import { useEditor } from './editor-provider';
import { uploadImage } from './upload';

interface Props {
  block: CanvasBlock;
  index: number;
}

interface DragState {
  id: string;
  mode: 'move' | 'resize';
  pointerX: number;
  pointerY: number;
  startX: number;
  startY: number;
  startW: number;
  width: number;
  height: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Vùng dựng tự do: kéo để dời, kéo góc phải dưới để phóng to / thu nhỏ.
 * Toạ độ lưu theo phần trăm nên khi khung hẹp lại (điện thoại) mọi thứ co theo,
 * không bị tràn ra ngoài như khi đặt bằng pixel.
 */
export function EditableCanvas({ block, index }: Props) {
  const { updateBlock, selected, setSelected } = useEditor();
  const container = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const commit = useCallback(
    (items: CanvasItem[]) => updateBlock(index, { ...block, items }),
    [block, index, updateBlock],
  );

  const patchItem = useCallback(
    (id: string, patch: Partial<CanvasItem>) => {
      commit(block.items.map((item) => (item.id === id ? ({ ...item, ...patch } as CanvasItem) : item)));
    },
    [block.items, commit],
  );

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const state = drag.current;
      if (!state) return;

      const dx = ((event.clientX - state.pointerX) / state.width) * 100;
      const dy = ((event.clientY - state.pointerY) / state.height) * 100;

      if (state.mode === 'resize') {
        patchItem(state.id, { w: clamp(state.startW + dx, 8, 100 - state.startX) });
      } else {
        patchItem(state.id, {
          x: clamp(state.startX + dx, 0, 100 - state.startW),
          y: clamp(state.startY + dy, 0, 96),
        });
      }
    };

    const up = () => {
      drag.current = null;
      setDragging(false);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [patchItem]);

  const startDrag = (event: React.PointerEvent, item: CanvasItem, mode: 'move' | 'resize') => {
    event.stopPropagation();
    event.preventDefault();
    const rect = container.current?.getBoundingClientRect();
    if (!rect) return;

    setSelected(index);
    drag.current = {
      id: item.id,
      mode,
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: item.x,
      startY: item.y,
      startW: item.w,
      width: rect.width,
      height: rect.height,
    };
    setDragging(true);
  };

  const addText = () => {
    commit([
      ...block.items,
      {
        id: `t-${Date.now().toString(36)}`,
        kind: 'text',
        text: 'Văn bản mới',
        w: 34,
        x: clamp(8 + block.items.length * 4, 0, 60),
        y: clamp(10 + block.items.length * 6, 0, 80),
      },
    ]);
  };

  const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    try {
      const uploaded = await uploadImage(file);
      commit([
        ...block.items,
        {
          alt: file.name.replace(/\.[^.]+$/u, ''),
          assetId: uploaded.src,
          id: `i-${Date.now().toString(36)}`,
          kind: 'image',
          w: 30,
          x: clamp(10 + block.items.length * 4, 0, 60),
          y: clamp(12 + block.items.length * 5, 0, 70),
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const isSelected = selected === index;

  return (
    <div
      className="gisa-canvas"
      data-active={isSelected}
      data-dragging={dragging}
      onClick={(event) => {
        event.stopPropagation();
        setSelected(index);
      }}
      ref={container}
      style={{ aspectRatio: `1 / ${block.ratio ?? 0.62}` }}
    >
      <input
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={addImage}
        ref={fileInput}
        type="file"
      />

      {isSelected ? (
        <div className="gisa-canvas-tools">
          <button onClick={addText} type="button">
            + Chữ
          </button>
          <button disabled={busy} onClick={() => fileInput.current?.click()} type="button">
            {busy ? 'Đang tải…' : '+ Ảnh'}
          </button>
        </div>
      ) : null}

      {block.items.map((item) => (
        <div
          className="gisa-canvas-item"
          key={item.id}
          onPointerDown={(event) => startDrag(event, item, 'move')}
          style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%` }}
        >
          {item.kind === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={item.alt ?? ''} draggable={false} src={item.assetId} />
          ) : (
            <p
              contentEditable
              data-placeholder="Văn bản"
              onBlur={(event) => {
                const next = (event.currentTarget.innerText ?? '').trim();
                if (next && next !== item.text) patchItem(item.id, { text: next });
                setEditingId(null);
              }}
              onDoubleClick={(event) => {
                event.stopPropagation();
                setEditingId(item.id);
                (event.currentTarget as HTMLElement).focus();
              }}
              onPointerDown={(event) => {
                // Chỉ khi đang gõ chữ mới giữ con trỏ; còn lại để chuột kéo khối.
                if (editingId === item.id) event.stopPropagation();
              }}
              role="textbox"
              suppressContentEditableWarning
            >
              {item.text}
            </p>
          )}

          {isSelected ? (
            <>
              <span
                className="gisa-canvas-handle"
                onPointerDown={(event) => startDrag(event, item, 'resize')}
                title="Kéo để phóng to / thu nhỏ"
              />
              <button
                className="gisa-canvas-remove"
                onClick={(event) => {
                  event.stopPropagation();
                  commit(block.items.filter((current) => current.id !== item.id));
                }}
                onPointerDown={(event) => event.stopPropagation()}
                title="Xoá"
                type="button"
              >
                ×
              </button>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}
