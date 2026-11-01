'use client';

import {
  ArrowLeft,
  ArrowUUpLeft,
  ArrowUUpRight,
  Check,
  CloudCheck,
  Eye,
  Minus,
  Plus,
  SlidersHorizontal,
  SquaresFour,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { uploadImage } from '@/components/admin/upload';

import { catalogByKey, elementId } from './element-library';
import { clamp } from './geometry';
import { StaticPage } from './static-page';
import styles from './studio.module.css';
import { StudioCanvas } from './studio-canvas';
import { StudioInspector } from './studio-inspector';
import { StudioPalette } from './studio-palette';
import {
  CANVAS_WIDTH,
  canvasHeight,
  hasVisibleElements,
  type Rect,
  type StudioDoc,
  type StudioDraft,
  type StudioElement,
  type StudioStatus,
} from './types';

interface Props {
  draftId?: string;
  initialDoc: StudioDoc;
  initialStatus?: StudioStatus;
  initialSavedAt?: string;
  /** Trang gốc trên website nếu bản dựng này bắt đầu từ một bài có sẵn. */
  initialSourcePath?: string;
}

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

interface CatalogDrag {
  key: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  over: boolean;
}

const SAVE_DELAY = 900;

export function Studio({
  draftId: initialId,
  initialDoc,
  initialStatus = 'draft',
  initialSavedAt,
  initialSourcePath,
}: Props) {
  const [doc, setDoc] = useState<StudioDoc>(initialDoc);
  const [status, setStatus] = useState<StudioStatus>(initialStatus);
  const [sourcePath] = useState<string | null>(initialSourcePath ?? null);
  const [saveState, setSaveState] = useState<SaveState>(initialSavedAt ? 'saved' : 'idle');
  const [savedAt, setSavedAt] = useState<Date | null>(initialSavedAt ? new Date(initialSavedAt) : null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [past, setPast] = useState<StudioDoc[]>([]);
  const [future, setFuture] = useState<StudioDoc[]>([]);
  const [zoom, setZoom] = useState<'fit' | number>('fit');
  const [viewportWidth, setViewportWidth] = useState(0);
  const [drag, setDrag] = useState<CatalogDrag | null>(null);
  const [dropPreview, setDropPreview] = useState<Rect | null>(null);
  const [preview, setPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toast, setToast] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [mobileView, setMobileView] = useState<'palette' | 'inspector' | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [showInspector, setShowInspector] = useState(true);

  const pageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const docRef = useRef(doc);
  const idRef = useRef<string | null>(initialId ?? null);
  const savedJson = useRef(JSON.stringify(initialDoc));
  const lastPush = useRef(0);
  const batchBefore = useRef<StudioDoc | null>(null);
  const dragRef = useRef<CatalogDrag | null>(null);
  const inFlight = useRef<Promise<string | null> | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const imageTarget = useRef<string | null>(null);
  const leavingRef = useRef(false);
  const statusRef = useRef(status);

  useEffect(() => {
    docRef.current = doc;
    dragRef.current = drag;
    statusRef.current = status;
  });

  const height = canvasHeight(doc);
  const fitPadding = viewportWidth > 0 && viewportWidth <= 1100 ? 40 : 88;
  const fitScale = viewportWidth > 0 ? clamp((viewportWidth - fitPadding) / CANVAS_WIDTH, 0.18, 1) : 0.7;
  const scale = zoom === 'fit' ? fitScale : zoom;
  const selected = doc.elements.find((element) => element.id === selectedId) ?? null;

  const zoomBy = useCallback(
    (delta: number) => {
      setZoom((value) => clamp((value === 'fit' ? scale : value) + delta, 0.2, 2));
    },
    [scale],
  );

  /* ----------------------------- lịch sử ----------------------------- */

  const pushHistory = useCallback((snapshot?: StudioDoc, force = false) => {
    const now = Date.now();
    if (!force && now - lastPush.current < 700) return;
    lastPush.current = now;
    setPast((previous) => [...previous.slice(-59), snapshot ?? docRef.current]);
    setFuture([]);
  }, []);

  const patchElement = useCallback(
    (id: string, patch: Partial<StudioElement>, options: { history?: boolean } = {}) => {
      if (options.history) pushHistory();
      setDoc((previous) => ({
        ...previous,
        elements: previous.elements.map((element) =>
          element.id === id ? ({ ...element, ...patch } as StudioElement) : element,
        ),
      }));
    },
    [pushHistory],
  );

  const beginBatch = useCallback(() => {
    batchBefore.current = docRef.current;
  }, []);

  const endBatch = useCallback(() => {
    const before = batchBefore.current;
    batchBefore.current = null;
    if (!before || before === docRef.current) return;
    if (JSON.stringify(before) === JSON.stringify(docRef.current)) return;
    setPast((previous) => [...previous.slice(-59), before]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    if (!past.length) return;
    const target = past[past.length - 1];
    setFuture((next) => [docRef.current, ...next].slice(0, 60));
    setPast((previous) => previous.slice(0, -1));
    setDoc(target);
  }, [past]);

  const redo = useCallback(() => {
    if (!future.length) return;
    const [target, ...rest] = future;
    setPast((previous) => [...previous.slice(-59), docRef.current]);
    setFuture(rest);
    setDoc(target);
  }, [future]);

  /* ------------------------------ lưu ------------------------------- */

  const persist = useCallback(
    async (
      nextDoc: StudioDoc,
      nextStatus: StudioStatus = statusRef.current,
      publish = false,
    ): Promise<string | null> => {
      // Một lần lưu tại một thời điểm: lần sau chờ lần trước xong rồi mới ghi,
      // tránh hai lệnh POST cùng tạo hai bản nháp.
      if (inFlight.current) {
        try {
          await inFlight.current;
        } catch {
          /* lần lưu trước lỗi thì vẫn thử lại */
        }
      }

      const run = async (): Promise<string | null> => {
        setSaveState('saving');
        try {
          const path = idRef.current ? `/api/admin/studio/${idRef.current}` : '/api/admin/studio';
          const response = await fetch(path, {
            body: JSON.stringify({
              doc: nextDoc,
              status: nextStatus,
              sourcePath,
              ...(publish ? { publish: true } : {}),
            }),
            headers: { 'content-type': 'application/json' },
            method: idRef.current ? 'PUT' : 'POST',
          });

          if (!response.ok) throw new Error('save-failed');

          const payload = (await response.json()) as { draft: StudioDraft };
          if (!idRef.current) {
            idRef.current = payload.draft.id;
            window.history.replaceState(null, '', `/admin/studio/${payload.draft.id}`);
          }

          savedJson.current = JSON.stringify(nextDoc);
          setSavedAt(new Date(payload.draft.updatedAt));
          setSaveState(JSON.stringify(docRef.current) === savedJson.current ? 'saved' : 'dirty');
          return payload.draft.id;
        } catch {
          setSaveState('error');
          return null;
        }
      };

      const promise = run();
      inFlight.current = promise;
      try {
        return await promise;
      } finally {
        inFlight.current = null;
      }
    },
    [sourcePath],
  );

  useEffect(() => {
    setViewportWidth(viewportRef.current?.clientWidth ?? 0);
    const node = viewportRef.current;
    if (!node) return;

    const observer = new ResizeObserver(() => setViewportWidth(node.clientWidth));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (JSON.stringify(doc) === savedJson.current) {
      if (idRef.current) setSaveState((state) => (state === 'saving' ? state : 'saved'));
      return;
    }

    setSaveState('dirty');
    const timer = setTimeout(() => {
      void persist(doc);
    }, SAVE_DELAY);

    return () => clearTimeout(timer);
  }, [doc, persist]);

  useEffect(() => {
    if (saveState !== 'dirty' && saveState !== 'error') return;
    const warn = (event: BeforeUnloadEvent) => {
      if (leavingRef.current) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [saveState]);

  // Gõ chữ cập nhật doc ngay, nhưng bộ hẹn giờ autosave có thể chưa kịp chạy
  // khi admin đóng tab / back / reload. Gửi nốt bản mới nhất bằng keepalive.
  const flushSave = useCallback(() => {
    if (JSON.stringify(docRef.current) === savedJson.current) return;
    // Nếu lần tạo bản nháp đầu tiên còn đang bay, đừng POST thêm một bản nữa.
    if (!idRef.current && inFlight.current) return;

    try {
      void fetch(idRef.current ? `/api/admin/studio/${idRef.current}` : '/api/admin/studio', {
        body: JSON.stringify({
          doc: docRef.current,
          status: statusRef.current,
          sourcePath,
        }),
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        method: idRef.current ? 'PUT' : 'POST',
      });
    } catch {
      /* trình duyệt đang đóng — không còn cách nào khác */
    }
  }, [sourcePath]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushSave();
    };

    window.addEventListener('pagehide', flushSave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flushSave);
      document.removeEventListener('visibilitychange', onVisibility);
      flushSave();
    };
  }, [flushSave]);

  /* --------------------------- chèn khối ---------------------------- */

  const insertCatalog = useCallback(
    (key: string, anchorX: number, anchorY: number) => {
      const item = catalogByKey(key);
      if (!item) return;

      const originX = item.anchor === 'center' ? anchorX - item.w / 2 : anchorX;
      const originY = item.anchor === 'center' ? anchorY - item.h / 2 : anchorY;
      const built = item.build(originX, originY);
      const elements = built.map((element) => ({
        ...element,
        x: Math.round(clamp(element.x, 0, CANVAS_WIDTH - element.w)),
        y: Math.round(Math.max(0, element.y)),
      }));

      pushHistory();
      setDoc((previous) => ({ ...previous, elements: [...previous.elements, ...elements] }));
      setSelectedId(elements[elements.length - 1]?.id ?? null);
      setEditingId(null);
      setMobileView(null);
    },
    [pushHistory],
  );

  const centerOfViewport = useCallback(() => {
    const page = pageRef.current?.getBoundingClientRect();
    const viewport = viewportRef.current?.getBoundingClientRect();
    if (!page) return { x: CANVAS_WIDTH / 2, y: 420 };
    const view = viewport ?? page;
    return {
      x: clamp((view.left + view.width / 2 - page.left) / scale, 60, CANVAS_WIDTH - 60),
      y: Math.max(60, (view.top + view.height / 2 - page.top) / scale),
    };
  }, [scale]);

  const insertAtCenter = useCallback(
    (key: string) => {
      const point = centerOfViewport();
      insertCatalog(key, point.x, point.y);
    },
    [centerOfViewport, insertCatalog],
  );

  const insertIcon = useCallback(
    (name: string) => {
      const point = centerOfViewport();
      const element: StudioElement = {
        id: elementId(),
        kind: 'icon',
        name,
        color: '#005f69',
        w: 72,
        h: 72,
        x: clamp(Math.round(point.x - 36), 0, CANVAS_WIDTH - 72),
        y: Math.max(0, Math.round(point.y - 36)),
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
      };
      pushHistory();
      setDoc((previous) => ({ ...previous, elements: [...previous.elements, element] }));
      setSelectedId(element.id);
      setMobileView(null);
    },
    [centerOfViewport, pushHistory],
  );

  /* ------------------------- kéo từ palette -------------------------- */

  const startCatalogDrag = useCallback((key: string, event: React.PointerEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    setDrag({ key, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, over: false });
  }, []);

  const dragging = drag !== null;

  useEffect(() => {
    if (!dragging) return;

    const rectFor = (event: PointerEvent) => {
      const page = pageRef.current?.getBoundingClientRect();
      if (!page) return null;
      const inside =
        event.clientX >= page.left &&
        event.clientX <= page.right &&
        event.clientY >= page.top &&
        event.clientY <= page.bottom;
      return { page, inside };
    };

    const move = (event: PointerEvent) => {
      const current = dragRef.current;
      if (!current) return;
      const info = rectFor(event);
      let preview: Rect | null = null;

      if (info?.inside) {
        const item = catalogByKey(current.key);
        if (item) {
          const x = (event.clientX - info.page.left) / scale;
          const y = (event.clientY - info.page.top) / scale;
          preview = {
            x: Math.round(clamp(item.anchor === 'center' ? x - item.w / 2 : x, 0, CANVAS_WIDTH - item.w)),
            y: Math.max(0, Math.round(item.anchor === 'center' ? y - item.h / 2 : y)),
            w: item.w,
            h: item.h,
          };
        }
      }

      setDropPreview(preview);
      setDrag((previous) =>
        previous ? { ...previous, x: event.clientX, y: event.clientY, over: Boolean(info?.inside) } : previous,
      );
    };

    const up = (event: PointerEvent) => {
      const current = dragRef.current;
      setDropPreview(null);
      setDrag(null);
      if (!current) return;

      const info = rectFor(event);
      if (info?.inside) {
        insertCatalog(
          current.key,
          (event.clientX - info.page.left) / scale,
          (event.clientY - info.page.top) / scale,
        );
        return;
      }

      const distance = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);
      if (distance < 6) insertAtCenter(current.key);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [dragging, insertAtCenter, insertCatalog, scale]);

  /* -------------------------- thao tác khối -------------------------- */

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
    setEditingId((current) => (current && current !== id ? null : current));
  }, []);

  const startEditing = useCallback(
    (id: string | null) => {
      if (!id) {
        setEditingId(null);
        return;
      }
      // Một mốc hoàn tác cho cả phiên sửa chữ, không phải mỗi lần gõ.
      pushHistory(undefined, true);
      setSelectedId(id);
      setEditingId(id);
    },
    [pushHistory],
  );

  const draftText = useCallback(
    (id: string, text: string, measuredHeight?: number) => {
      const element = docRef.current.elements.find((item) => item.id === id);
      if (!element || element.kind !== 'text') return;

      const patch: Partial<StudioElement> = {};
      if (element.text !== text) (patch as { text?: string }).text = text;
      if (measuredHeight && measuredHeight > element.h + 1) {
        (patch as { h?: number }).h = Math.ceil(measuredHeight);
      }
      if (Object.keys(patch).length) patchElement(id, patch);
    },
    [patchElement],
  );

  const commitText = useCallback(
    (id: string, text: string, measuredHeight?: number) => {
      const element = docRef.current.elements.find((item) => item.id === id);
      if (element && element.kind === 'text') {
        const patch: Partial<StudioElement> = {};
        if (text !== element.text) (patch as { text?: string }).text = text;
        if (measuredHeight && measuredHeight > element.h + 1) {
          (patch as { h?: number }).h = Math.ceil(measuredHeight);
        }
        if (Object.keys(patch).length) patchElement(id, patch);
      }
      setEditingId(null);
    },
    [patchElement],
  );

  const fitTextToContent = useCallback(
    (id: string) => {
      const wrapper = pageRef.current?.querySelector(`[data-element-id="${CSS.escape(id)}"]`);
      const node = wrapper?.firstElementChild as HTMLElement | null;
      if (!node) return;

      const element = docRef.current.elements.find((item) => item.id === id);
      if (!element || element.kind !== 'text') return;

      let measured = 0;
      if (element.rotation) {
        measured = node.scrollHeight;
      } else {
        const range = document.createRange();
        range.selectNodeContents(node);
        const box = range.getBoundingClientRect();
        measured = box.height / scale;
      }

      const nextHeight = Math.max(24, Math.ceil(measured + 6));
      if (Math.abs(nextHeight - element.h) < 2) return;

      pushHistory();
      patchElement(id, { h: nextHeight } as Partial<StudioElement>);
    },
    [patchElement, pushHistory, scale],
  );

  const requestImage = useCallback((id: string) => {
    imageTarget.current = id;
    imageInput.current?.click();
  }, []);

  const onImageFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    const id = imageTarget.current;
    imageTarget.current = null;
    if (!file || !id) return;

    try {
      const uploaded = await uploadImage(file);
      patchElement(id, { src: uploaded.src }, { history: true });
    } catch {
      setToast('Không tải được ảnh. Chỉ nhận JPG, PNG, WebP, AVIF hoặc GIF dưới 8MB.');
    }
  };

  const deleteElement = useCallback(
    (id: string) => {
      const element = docRef.current.elements.find((item) => item.id === id);
      if (element?.locked) {
        setToast('Khối đang khoá. Mở khoá trước khi xoá.');
        return;
      }

      pushHistory();
      setDoc((previous) => ({ ...previous, elements: previous.elements.filter((item) => item.id !== id) }));
      setSelectedId(null);
      setEditingId(null);
    },
    [pushHistory],
  );

  const duplicateElement = useCallback(
    (id: string) => {
      const source = docRef.current.elements.find((element) => element.id === id);
      if (!source) return;
      if (source.locked) {
        setToast('Khối đang khoá. Mở khoá trước khi nhân bản.');
        return;
      }

      const copy = {
        ...source,
        id: elementId(source.kind),
        x: clamp(source.x + 32, 0, CANVAS_WIDTH - source.w),
        y: source.y + 32,
      } as StudioElement;

      pushHistory();
      setDoc((previous) => ({ ...previous, elements: [...previous.elements, copy] }));
      setSelectedId(copy.id);
    },
    [pushHistory],
  );

  const moveLayer = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const current = docRef.current;
      const index = current.elements.findIndex((element) => element.id === id);
      const target = direction === 'up' ? index + 1 : index - 1;
      if (index < 0 || target < 0 || target >= current.elements.length) return;

      const elements = [...current.elements];
      const [element] = elements.splice(index, 1);
      elements.splice(target, 0, element);
      pushHistory();
      setDoc({ ...current, elements });
    },
    [pushHistory],
  );

  const toggleElement = useCallback(
    (id: string, key: 'hidden' | 'locked') => {
      const element = docRef.current.elements.find((item) => item.id === id);
      if (!element) return;
      patchElement(id, { [key]: !element[key] } as Partial<StudioElement>, { history: true });
    },
    [patchElement],
  );

  const nudge = useCallback(
    (deltaX: number, deltaY: number) => {
      if (!selectedId) return;
      const element = docRef.current.elements.find((item) => item.id === selectedId);
      if (!element || element.locked) return;
      patchElement(
        element.id,
        { x: clamp(element.x + deltaX, 0, CANVAS_WIDTH - element.w), y: Math.max(0, element.y + deltaY) },
        { history: true },
      );
    },
    [patchElement, selectedId],
  );

  /* ---------------------------- bàn phím ----------------------------- */

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

      if (event.key === 'Escape') {
        if (preview) {
          setPreview(false);
          return;
        }
        if (editingId) {
          setEditingId(null);
          return;
        }
        setSelectedId(null);
        return;
      }

      const command = event.ctrlKey || event.metaKey;

      // Ctrl+S phải lưu được cả khi đang gõ trong contentEditable / ô nhập.
      if (command && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void persist(docRef.current);
        return;
      }

      if (preview) return;
      if (typing) return;

      if (command && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if (command && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        if (selectedId) duplicateElement(selectedId);
        return;
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (!selectedId) return;
        event.preventDefault();
        deleteElement(selectedId);
        return;
      }
      if (!selectedId) return;

      const step = event.shiftKey ? 10 : 1;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nudge(-step, 0);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nudge(step, 0);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        nudge(0, -step);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        nudge(0, step);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteElement, duplicateElement, editingId, nudge, persist, preview, redo, selectedId, undo]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const publish = useCallback(async () => {
    if (!hasVisibleElements(docRef.current)) {
      setToast('Trang đang trống. Thêm ít nhất một khối trước khi xuất bản.');
      return;
    }

    if (
      sourcePath &&
      statusRef.current !== 'published' &&
      !window.confirm(
        `Xuất bản bản dựng này lên ${sourcePath}?\n\nTrang gốc sẽ được thay bằng bản dựng cho tới khi bạn bấm “Bỏ đăng”.`,
      )
    ) {
      return;
    }

    // Mở tab trước khi chờ máy chủ để trình duyệt không chặn popup.
    const tab = window.open('', '_blank');
    setPublishing(true);
    const id = await persist(docRef.current, 'published', true);
    setPublishing(false);

    if (!id) {
      tab?.close();
      setToast('Không xuất bản được. Kiểm tra lại máy chủ.');
      return;
    }

    setStatus('published');
    statusRef.current = 'published';
    const target = sourcePath ?? `/xem-bai/${id}`;
    setToast(sourcePath ? `Đã xuất bản lên ${sourcePath}.` : 'Đã xuất bản bài viết.');
    if (tab) tab.location.href = target;
    else window.open(target, '_blank', 'noopener,noreferrer');
  }, [persist, sourcePath]);

  const openPageTemplate = useCallback(
    async (templateId: string, existingDraftId?: string) => {
      leavingRef.current = true;
      if (JSON.stringify(docRef.current) !== savedJson.current) {
        const saved = await persist(docRef.current);
        if (!saved) {
          leavingRef.current = false;
          setToast('Chưa lưu được bản hiện tại nên chưa mở trang khác.');
          return;
        }
      }
      window.location.href = existingDraftId
        ? `/admin/studio/${encodeURIComponent(existingDraftId)}`
        : `/admin/studio?bai=${encodeURIComponent(templateId)}`;
    },
    [persist],
  );

  const unpublish = useCallback(async () => {
    if (!idRef.current) return;
    if (
      !window.confirm(
        sourcePath
          ? `Bỏ đăng bản dựng khỏi ${sourcePath}?\n\nTrang gốc sẽ trở lại giao diện cũ.`
          : 'Chuyển bài này về bản nháp?',
      )
    ) {
      return;
    }
    setUnpublishing(true);

    try {
      // Đi qua persist để xếp hàng sau lần autosave đang bay, tránh việc lần
      // lưu cũ ghi đè trạng thái draft vừa đặt.
      statusRef.current = 'draft';
      const saved = await persist(docRef.current, 'draft');
      if (!saved) throw new Error('unpublish-failed');

      setStatus('draft');
      setToast(
        sourcePath
          ? `Đã bỏ đăng. ${sourcePath} trở lại giao diện cũ.`
          : 'Đã chuyển bài về bản nháp.',
      );
    } catch {
      setToast('Không bỏ đăng được. Kiểm tra lại máy chủ.');
    } finally {
      setUnpublishing(false);
    }
  }, [persist, sourcePath]);

  const saveLabel: Record<SaveState, string> = {
    idle: 'Chưa lưu',
    dirty: 'Chưa lưu',
    saving: 'Đang lưu…',
    saved: savedAt ? `Đã lưu ${savedAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Đã lưu',
    error: 'Lỗi lưu',
  };

  const dragItem = drag ? catalogByKey(drag.key) : null;

  return (
    <div className={styles.studio}>
      <input
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        hidden
        onChange={(event) => void onImageFile(event)}
        ref={imageInput}
        type="file"
      />

      <header className={styles.topbar}>
        <Link
          aria-label="Về danh sách bài"
          className={styles.backButton}
          href="/admin"
          onClick={() => {
            // Điều hướng phía client không chờ bộ hẹn giờ tự lưu: gửi nốt bản mới nhất.
            if (JSON.stringify(docRef.current) !== savedJson.current) void persist(docRef.current);
          }}
        >
          <ArrowLeft aria-hidden size={18} />
        </Link>

        <div className={styles.docMeta}>
          <input
            aria-label="Tiêu đề bài"
            className={styles.titleInput}
            onChange={(event) => setDoc((previous) => ({ ...previous, title: event.target.value }))}
            placeholder="Bài viết mới"
            title="Tên bài dùng trong quản lý; muốn đổi tiêu đề trên trang thì sửa khối chữ."
            value={doc.title}
          />
          <span aria-live="polite" className={styles.saveState} data-state={saveState}>
            {saveState === 'saving' ? (
              <CloudCheck aria-hidden size={13} />
            ) : saveState === 'error' ? (
              <WarningCircle aria-hidden size={13} />
            ) : saveState === 'saved' ? (
              <Check aria-hidden size={13} />
            ) : null}
            <span className={styles.saveText}>{saveLabel[saveState]}</span>
            {saveState === 'error' ? (
              <button
                className={styles.retrySave}
                onClick={() => void persist(docRef.current)}
                type="button"
              >
                Thử lại
              </button>
            ) : null}
            {status === 'published' ? (
              <span
                className={styles.publishedTag}
                title="Mọi thay đổi sau khi đăng được cập nhật trực tiếp lên trang."
              >
                Đã đăng
              </span>
            ) : null}
            {sourcePath ? (
              <a
                className={styles.sourceLink}
                href={sourcePath}
                rel="noreferrer"
                target="_blank"
                title={`Mở trang gốc ${sourcePath}`}
              >
                Trang gốc
              </a>
            ) : null}
          </span>
        </div>

        <div className={styles.topActions}>
          <div className={styles.buttonGroup}>
            <button disabled={!past.length} onClick={undo} title="Hoàn tác (Ctrl+Z)" type="button">
              <ArrowUUpLeft aria-hidden size={17} />
            </button>
            <button disabled={!future.length} onClick={redo} title="Làm lại (Ctrl+Shift+Z)" type="button">
              <ArrowUUpRight aria-hidden size={17} />
            </button>
          </div>

          <div className={`${styles.buttonGroup} ${styles.zoomGroup}`}>
            <button onClick={() => zoomBy(-0.1)} title="Thu nhỏ" type="button">
              <Minus aria-hidden size={16} />
            </button>
            <button className={styles.zoomValue} onClick={() => setZoom('fit')} title="Vừa khung" type="button">
              {Math.round(scale * 100)}%
            </button>
            <button onClick={() => zoomBy(0.1)} title="Phóng to" type="button">
              <Plus aria-hidden size={16} />
            </button>
          </div>

          <button className={styles.toggleButton} onClick={() => setShowPalette((value) => !value)} type="button">
            <SquaresFour aria-hidden size={16} />
            <span>Khối</span>
          </button>
          <button className={styles.toggleButton} onClick={() => setShowInspector((value) => !value)} type="button">
            <SlidersHorizontal aria-hidden size={16} />
            <span>Thuộc tính</span>
          </button>

          {status === 'published' ? (
            <button
              className={styles.unpublishButton}
              disabled={unpublishing}
              onClick={() => void unpublish()}
              title={sourcePath ? `Bỏ bản dựng khỏi ${sourcePath}` : 'Chuyển bài về bản nháp'}
              type="button"
            >
              {unpublishing ? 'Đang bỏ…' : 'Bỏ đăng'}
            </button>
          ) : null}

          <button className={styles.previewButton} onClick={() => setPreview(true)} type="button">
            <Eye aria-hidden size={16} />
            <span>Xem trước</span>
          </button>
          <button className={styles.publishButton} disabled={publishing} onClick={() => void publish()} type="button">
            {publishing ? 'Đang đăng…' : 'Xuất bản'}
          </button>
        </div>
      </header>

      <div
        className={styles.body}
        data-palette={showPalette}
        data-inspector={showInspector}
        data-mobile={mobileView}
      >
        <div className={styles.paletteWrap} data-open={mobileView === 'palette'} onClick={(event) => {
          if (event.target === event.currentTarget) setMobileView(null);
        }}>
          <StudioPalette
            onClose={() => setMobileView(null)}
            onDragStart={startCatalogDrag}
            onInsert={insertAtCenter}
            onInsertIcon={insertIcon}
            onOpenTemplate={openPageTemplate}
          />
        </div>

        <div className={styles.canvasWrap}>
          <StudioCanvas
            doc={doc}
            dropPreview={dropPreview}
            editingId={editingId}
            height={height}
            onBeginBatch={beginBatch}
            onCommitText={commitText}
            onDraftText={draftText}
            onEdit={startEditing}
            onEndBatch={endBatch}
            onPatch={(id, patch) => patchElement(id, patch)}
            onRequestImage={requestImage}
            onSelect={selectElement}
            pageRef={pageRef}
            scale={scale}
            selectedId={selectedId}
            viewportRef={viewportRef}
          />

          {!doc.elements.length ? (
            <div className={styles.emptyOverlay}>
              <div className={styles.emptyHint}>
                <span className={styles.emptyDot} />
                <strong>Trang trống</strong>
                <span>Kéo khối từ thanh công cụ vào đây, hoặc bấm một khối để thêm.</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.inspectorWrap} data-open={mobileView === 'inspector'} onClick={(event) => {
          if (event.target === event.currentTarget) setMobileView(null);
        }}>
          <StudioInspector
            doc={doc}
            element={selected}
            onBackground={(background) => setDoc((previous) => ({ ...previous, background }))}
            onClose={() => setMobileView(null)}
            onDelete={deleteElement}
            onDuplicate={duplicateElement}
            onFitText={fitTextToContent}
            onOrder={moveLayer}
            onPatch={(patch) => {
              if (selected) patchElement(selected.id, patch, { history: true });
            }}
            onReplaceImage={requestImage}
            onSelect={selectElement}
            onToggle={(key) => {
              if (selectedId) toggleElement(selectedId, key);
            }}
            sourcePath={sourcePath}
          />
        </div>
      </div>

      <div className={styles.mobileZoom}>
        <button onClick={() => zoomBy(-0.1)} title="Thu nhỏ" type="button">
          <Minus aria-hidden size={15} />
        </button>
        <button className={styles.mobileZoomValue} onClick={() => setZoom('fit')} title="Vừa khung" type="button">
          {Math.round(scale * 100)}%
        </button>
        <button onClick={() => zoomBy(0.1)} title="Phóng to" type="button">
          <Plus aria-hidden size={15} />
        </button>
      </div>

      <div className={styles.mobileBar}>
        <button onClick={() => setMobileView(mobileView === 'palette' ? null : 'palette')} type="button">
          <SquaresFour aria-hidden size={18} /> Khối
        </button>
        <button onClick={() => setMobileView(mobileView === 'inspector' ? null : 'inspector')} type="button">
          <SlidersHorizontal aria-hidden size={18} /> Thuộc tính
        </button>
        <button onClick={() => setPreview(true)} type="button">
          <Eye aria-hidden size={18} /> Xem
        </button>
      </div>

      {drag && dragItem ? (
        <div
          className={styles.dragGhost}
          data-drag-ghost="true"
          data-over={drag.over}
          style={{ left: drag.x, top: drag.y }}
        >
          <dragItem.icon aria-hidden size={18} />
          <span>{dragItem.label}</span>
        </div>
      ) : null}

      {preview ? (
        <div aria-label="Xem trước bài viết" aria-modal="true" className={styles.previewOverlay} role="dialog">
          <div className={styles.previewBar}>
            <span>
              Xem trước · <strong>{doc.title || 'Bài viết mới'}</strong>
            </span>
            <div className={styles.previewActions}>
              <div className={styles.previewDevice}>
                <button
                  data-active={previewDevice === 'desktop'}
                  onClick={() => setPreviewDevice('desktop')}
                  type="button"
                >
                  Máy tính
                </button>
                <button
                  data-active={previewDevice === 'mobile'}
                  onClick={() => setPreviewDevice('mobile')}
                  type="button"
                >
                  Điện thoại
                </button>
              </div>
              <button onClick={() => setPreview(false)} type="button">
                <X aria-hidden size={16} /> Đóng
              </button>
            </div>
          </div>
          <div className={styles.previewBody} data-device={previewDevice}>
            <div className={styles.previewStage}>
              <StaticPage doc={doc} />
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </div>
  );
}
