'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { ContentBlock, ContentRecord } from '@/content/types';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export interface BlockEntry {
  id: string;
  block: ContentBlock;
}

interface FocusRequest {
  id: string;
  token: number;
}

export interface EditorValue {
  docId: string;
  record: ContentRecord;
  entries: BlockEntry[];
  saveState: SaveState;
  selected: number | null;
  focusRequest: FocusRequest | null;
  setSelected: (index: number | null) => void;
  updateRecord: (patch: Partial<ContentRecord>) => void;
  updateBlock: (index: number, block: ContentBlock) => void;
  insertBlock: (index: number, block: ContentBlock) => void;
  removeBlock: (index: number) => void;
  moveBlock: (index: number, delta: number) => void;
  requestFocus: (id: string) => void;
}

interface DocState {
  record: ContentRecord;
  entries: BlockEntry[];
}

const EditorContext = createContext<EditorValue | null>(null);

export function useEditor(): EditorValue {
  const value = useContext(EditorContext);
  if (!value) throw new Error('useEditor phải nằm trong <EditorProvider>.');
  return value;
}

interface EditorProviderProps {
  docId: string;
  record: ContentRecord;
  children: ReactNode;
}

export function EditorProvider({ docId, record: initialRecord, children }: EditorProviderProps) {
  const [doc, setDoc] = useState<DocState>(() => ({
    record: initialRecord,
    entries: initialRecord.body.map((block, index) => ({ id: `b-${index}`, block })),
  }));
  const [selected, setSelected] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);

  const idCounter = useRef(initialRecord.body.length);
  const firstRun = useRef(true);

  const updateRecord = useCallback((patch: Partial<ContentRecord>) => {
    setDoc((previous) => ({ ...previous, record: { ...previous.record, ...patch } }));
  }, []);

  const updateBlock = useCallback((index: number, block: ContentBlock) => {
    setDoc((previous) => {
      const entries = previous.entries.map((entry, position) =>
        position === index ? { ...entry, block } : entry,
      );
      return {
        entries,
        record: { ...previous.record, body: entries.map((entry) => entry.block) },
      };
    });
  }, []);

  const insertBlock = useCallback((index: number, block: ContentBlock) => {
    idCounter.current += 1;
    const id = `b-${idCounter.current}`;
    const at = Math.max(0, index);

    setDoc((previous) => {
      const entries = [...previous.entries];
      entries.splice(Math.min(at, entries.length), 0, { id, block });
      return {
        entries,
        record: { ...previous.record, body: entries.map((entry) => entry.block) },
      };
    });

    setFocusRequest({ id, token: Date.now() });
    setSelected(at);
  }, []);

  const removeBlock = useCallback((index: number) => {
    setDoc((previous) => {
      const entries = previous.entries.filter((_, position) => position !== index);
      return {
        entries,
        record: { ...previous.record, body: entries.map((entry) => entry.block) },
      };
    });
    setSelected(null);
  }, []);

  const moveBlock = useCallback((index: number, delta: number) => {
    setDoc((previous) => {
      const target = index + delta;
      if (target < 0 || target >= previous.entries.length) return previous;

      const entries = [...previous.entries];
      const [moved] = entries.splice(index, 1);
      if (!moved) return previous;
      entries.splice(target, 0, moved);

      return {
        entries,
        record: { ...previous.record, body: entries.map((entry) => entry.block) },
      };
    });
    setSelected((current) => (current === null ? null : Math.max(0, current + delta)));
  }, []);

  const requestFocus = useCallback((id: string) => {
    setFocusRequest({ id, token: Date.now() });
  }, []);

  /* Mỗi thay đổi được đẩy sang trang quản trị để panel phải luôn khớp. */
  useEffect(() => {
    if (window.parent === window) return;
    window.parent.postMessage(
      { type: 'gisa-admin:record', record: doc.record },
      window.location.origin,
    );
  }, [doc.record]);

  /* Tự động lưu: người viết không bao giờ phải nhớ bấm "Lưu". */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    setSaveState('saving');
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/admin/documents/${encodeURIComponent(docId)}`,
          {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ record: doc.record }),
          },
        );

        if (!response.ok) throw new Error('save-failed');
        setSaveState('saved');
        if (window.parent !== window) {
          window.parent.postMessage(
            { type: 'gisa-admin:saved', savedAt: Date.now() },
            window.location.origin,
          );
        }
      } catch {
        setSaveState('error');
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [docId, doc.record]);

  const value = useMemo<EditorValue>(
    () => ({
      docId,
      record: doc.record,
      entries: doc.entries,
      saveState,
      selected,
      focusRequest,
      setSelected,
      updateRecord,
      updateBlock,
      insertBlock,
      removeBlock,
      moveBlock,
      requestFocus,
    }),
    [
      docId,
      doc.record,
      doc.entries,
      saveState,
      selected,
      focusRequest,
      updateRecord,
      updateBlock,
      insertBlock,
      removeBlock,
      moveBlock,
      requestFocus,
    ],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}
