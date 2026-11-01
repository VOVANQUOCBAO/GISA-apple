'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { ContentBlock } from '@/content/types';

import { useEditor } from './editor-provider';
import { analyzeSeo, keywordOf, scoreTone } from './seo-panel';
import { uploadImage } from './upload';

type Shape = 'wide' | 'square' | 'circle';

const SHAPES: Array<{ value: Shape; label: string }> = [
  { value: 'wide', label: 'Ngang' },
  { value: 'square', label: 'Vuông' },
  { value: 'circle', label: 'Tròn' },
];

const ADD_OPTIONS: Array<{ label: string; hint: string; build: () => ContentBlock }> = [
  { label: 'Đoạn văn', hint: 'Một đoạn chữ thường', build: () => ({ type: 'paragraph', text: '' }) },
  { label: 'Tiêu đề mục', hint: 'Chia phần cho bài', build: () => ({ type: 'heading', level: 2, text: '' }) },
  { label: 'Danh sách', hint: 'Các ý gạch đầu dòng', build: () => ({ type: 'list', ordered: false, items: [''] }) },
  { label: 'Trích dẫn', hint: 'Câu nói, nhận định', build: () => ({ type: 'quote', text: '' }) },
  {
    label: 'Vùng tự do',
    hint: 'Đặt chữ và ảnh bằng chuột, kéo để dời',
    build: () => ({
      type: 'canvas',
      items: [{ id: 't0', kind: 'text', text: 'Kéo tôi để dời, kéo góc để phóng to', w: 40, x: 8, y: 12 }],
    }),
  },
];

const MARK: Record<string, string> = { pass: '✓', warn: '!', fail: '×' };
const KIND_LABEL: Record<string, string> = {
  paragraph: 'đoạn văn',
  heading: 'tiêu đề mục',
  list: 'danh sách',
  quote: 'trích dẫn',
  image: 'ảnh',
};
const SAVE_LABEL: Record<string, string> = {
  idle: 'Sẵn sàng',
  saving: 'Đang lưu…',
  saved: 'Đã lưu',
  error: 'Lưu thất bại',
};

function editableFocus(): HTMLElement | null {
  const active = document.activeElement;
  return active instanceof HTMLElement && active.isContentEditable ? active : null;
}

/**
 * Toàn bộ công cụ soạn thảo nằm trên chính trang thật: thanh dưới, hộp công cụ
 * bên phải và hộp thoại SEO. Không còn màn hình quản trị thứ hai.
 */
export function EditorChrome() {
  const editor = useEditor();
  const { docId, record, entries, selected, saveState } = editor;

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone?: 'error'; href?: string } | null>(
    null,
  );

  const drawerRef = useRef<HTMLElement>(null);

  /* Bấm vào ảnh thì công cụ của ảnh phải ở ngay trên cùng, không nằm dưới đáy. */
  useEffect(() => {
    drawerRef.current?.scrollTo({ top: 0 });
  }, [selected]);

  /* Hộp công cụ chiếm chỗ bên phải để chữ không bị che. */
  useEffect(() => {
    const previous = document.body.style.paddingRight;
    document.body.style.paddingRight = drawerOpen ? '336px' : previous;
    return () => {
      document.body.style.paddingRight = previous;
    };
  }, [drawerOpen]);

  const imageInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const imageTarget = useRef<{ mode: 'replace' | 'insert'; index: number; shape: Shape } | null>(
    null,
  );

  const block = selected !== null ? entries[selected]?.block : undefined;
  const report = analyzeSeo(record);
  const tone = scoreTone(report.score);
  const insertAt = selected === null ? entries.length : selected + 1;

  const notify = useCallback((message: string, extra: { tone?: 'error'; href?: string } = {}) => {
    setToast({ message, ...extra });
    window.setTimeout(() => setToast(null), 5000);
  }, []);

  /* ---- lệnh định dạng chữ ---- */

  const keepSelection = (event: React.MouseEvent) => event.preventDefault();

  const command = (name: 'bold' | 'italic') => {
    if (!editableFocus()) return;
    document.execCommand(name);
  };

  const accent = () => {
    if (!editableFocus()) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const text = selection.toString();
    if (!text) return;

    const span = document.createElement('span');
    span.dataset.accent = 'true';
    span.textContent = text;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);

    selection.removeAllRanges();
    const after = document.createRange();
    after.setStartAfter(span);
    after.collapse(true);
    selection.addRange(after);
  };

  const addLink = () => {
    if (!editableFocus()) return;
    const url = window.prompt('Dán đường dẫn cho đoạn đang chọn', 'https://');
    if (!url) return;
    document.execCommand('createLink', false, url);
  };

  /* ---- đổi loại khối ---- */

  const toType = (type: 'paragraph' | 'heading2' | 'heading3' | 'list' | 'quote') => {
    if (selected === null || !block) return;
    const text = 'text' in block ? block.text : '';

    const next: ContentBlock =
      type === 'paragraph'
        ? { type: 'paragraph', text }
        : type === 'heading2'
          ? { type: 'heading', level: 2, text }
          : type === 'heading3'
            ? { type: 'heading', level: 3, text }
            : type === 'list'
              ? { type: 'list', ordered: false, items: text ? [text] : [''] }
              : { type: 'quote', text };

    editor.updateBlock(selected, next);
  };

  /* ---- ảnh ---- */

  const pickImage = (mode: 'replace' | 'insert', index: number, shape: Shape) => {
    imageTarget.current = { mode, index, shape };
    imageInput.current?.click();
  };

  const onImageChosen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    const target = imageTarget.current;
    imageTarget.current = null;
    if (!file || !target) return;

    setBusy(true);
    try {
      const uploaded = await uploadImage(file);
      const next: ContentBlock = {
        alt: file.name.replace(/\.[^.]+$/u, ''),
        assetId: uploaded.src,
        caption: '',
        height: uploaded.height || 800,
        shape: target.shape,
        type: 'image',
        width: uploaded.width || 1200,
      };

      if (target.mode === 'replace') editor.updateBlock(target.index, next);
      else editor.insertBlock(target.index + 1, next);
    } catch {
      notify('Không tải được ảnh. Thử ảnh nhỏ hơn 8MB.', { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const onCoverChosen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    try {
      const uploaded = await uploadImage(file);
      editor.updateRecord({
        image: {
          alt: record.image?.alt?.trim() || record.title || 'Ảnh minh hoạ',
          height: uploaded.height || 800,
          src: uploaded.src,
          width: uploaded.width || 1200,
        },
      });
      notify('Đã đổi ảnh đại diện.');
    } catch {
      notify('Không tải được ảnh.', { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  /* ---- đăng bài ---- */

  const publish = async () => {
    setBusy(true);
    try {
      const response = await fetch(
        `/api/admin/documents/${encodeURIComponent(docId)}/publish`,
        {
          body: JSON.stringify({ record }),
          headers: { 'content-type': 'application/json' },
          method: 'POST',
        },
      );
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? 'Không đăng được bài.');

      setSeoOpen(false);
      notify('Đã đăng bài. Website cập nhật trong khoảng 1 phút.', {
        href: record.path,
      });
    } catch (error) {
      notify((error as Error).message, { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <input
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        hidden
        onChange={onImageChosen}
        ref={imageInput}
        type="file"
      />
      <input
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={onCoverChosen}
        ref={coverInput}
        type="file"
      />

      {addOpen ? (
        <div className="gisa-menu" role="menu">
          {ADD_OPTIONS.map((option) => (
            <button
              key={option.label}
              onClick={() => {
                editor.insertBlock(insertAt, option.build());
                setAddOpen(false);
              }}
              role="menuitem"
              type="button"
            >
              {option.label}
              <small>{option.hint}</small>
            </button>
          ))}
          {SHAPES.map((shape) => (
            <button
              key={shape.value}
              onClick={() => {
                setAddOpen(false);
                pickImage('insert', insertAt - 1, shape.value);
              }}
              role="menuitem"
              type="button"
            >
              Ảnh {shape.label.toLowerCase()}
              <small>Khung {shape.label.toLowerCase()}, chọn từ máy</small>
            </button>
          ))}
        </div>
      ) : null}

      {drawerOpen ? null : (
        <button
          className="gisa-drawer-toggle"
          onClick={() => setDrawerOpen(true)}
          type="button"
        >
          ← Mở công cụ
        </button>
      )}

      {drawerOpen ? (
        <aside className="gisa-drawer" aria-label="Công cụ soạn thảo" ref={drawerRef}>
          <div className="gisa-drawer-head">
            <strong>Công cụ</strong>
            <button onClick={() => setDrawerOpen(false)} type="button">
              Đóng
            </button>
          </div>

          {block?.type === 'image' ? (
            <section className="gisa-section">
              <h3>Ảnh đang chọn</h3>
              <div className="gisa-row">
                <button className="gisa-btn" disabled={busy} onClick={() => pickImage('replace', selected ?? 0, block.shape ?? 'wide')} type="button">
                  Chọn ảnh khác
                </button>
                <button className="gisa-btn" disabled={busy} onClick={() => pickImage('insert', insertAt - 1, 'wide')} type="button">
                  + Chèn ảnh
                </button>
              </div>

              <div className="gisa-row">
                {SHAPES.map((shape) => (
                  <button
                    className="gisa-btn"
                    data-active={(block.shape ?? 'wide') === shape.value}
                    key={shape.value}
                    onClick={() => editor.updateBlock(selected ?? 0, { ...block, shape: shape.value })}
                    type="button"
                  >
                    {shape.label}
                  </button>
                ))}
              </div>

              <label className="gisa-field" style={{ marginTop: 8, marginBottom: 0 }}>
                <span>Mô tả ảnh (alt)</span>
                <input
                  defaultValue={block.alt ?? ''}
                  key={`alt-${docId}-${selected}`}
                  onBlur={(event) => {
                    const alt = event.target.value.trim();
                    if (alt && alt !== (block.alt ?? '')) {
                      editor.updateBlock(selected ?? 0, { ...block, alt });
                    }
                  }}
                  placeholder="Ảnh này cho người khiếm thị biết điều gì?"
                />
              </label>

              <p className="gisa-hint" style={{ marginTop: 8 }}>
                Khung tròn/vuông tự cắt ảnh cho cân. Bấm vào ảnh khác trên trang để chuyển.
              </p>
            </section>
          ) : (
            <section className="gisa-section">
              <h3>Chữ {block && 'text' in block ? `· ${KIND_LABEL[block.type] ?? ''}` : ''}</h3>

              <div className="gisa-row">
                <button className="gisa-btn" data-strong="true" onMouseDown={keepSelection} onClick={() => command('bold')} type="button">
                  Đậm
                </button>
                <button className="gisa-btn" data-italic="true" onMouseDown={keepSelection} onClick={() => command('italic')} type="button">
                  Nghiêng
                </button>
                <button className="gisa-btn" data-strong="true" onMouseDown={keepSelection} onClick={accent} type="button">
                  <span data-accent="true">Nhấn màu</span>
                </button>
                <button className="gisa-btn" onMouseDown={keepSelection} onClick={addLink} type="button">
                  Liên kết
                </button>
              </div>

              <p className="gisa-hint">Bôi đen đoạn chữ trên trang rồi bấm nút. Cách này áp dụng cho đoạn đang chọn.</p>

              <div className="gisa-row" style={{ marginTop: 10 }}>
                <button className="gisa-btn" data-active={block?.type === 'paragraph'} onClick={() => toType('paragraph')} type="button">
                  Đoạn văn
                </button>
                <button className="gisa-btn" data-active={block?.type === 'heading' && block.level === 2} onClick={() => toType('heading2')} type="button">
                  Tiêu đề lớn
                </button>
                <button className="gisa-btn" data-active={block?.type === 'heading' && block.level === 3} onClick={() => toType('heading3')} type="button">
                  Tiêu đề nhỏ
                </button>
                <button className="gisa-btn" data-active={block?.type === 'list'} onClick={() => toType('list')} type="button">
                  Danh sách
                </button>
                <button className="gisa-btn" data-active={block?.type === 'quote'} onClick={() => toType('quote')} type="button">
                  Trích dẫn
                </button>
              </div>

              <div className="gisa-row" style={{ marginTop: 10 }}>
                <button className="gisa-btn" disabled={busy} onClick={() => pickImage('insert', insertAt - 1, 'wide')} type="button">
                  + Chèn ảnh
                </button>
              </div>
            </section>
          )}

          <section className="gisa-section">
            <h3>Bài viết</h3>
            <label className="gisa-field">
              <span>Tiêu đề</span>
              <input
                defaultValue={record.title}
                key={`title-${docId}-${record.title}`}
                onBlur={(event) => {
                  const title = event.target.value.trim();
                  if (title && title !== record.title) editor.updateRecord({ title });
                }}
              />
            </label>
            <label className="gisa-field">
              <span>Mô tả hiện trên Google</span>
              <textarea
                defaultValue={record.summary}
                key={`summary-${docId}-${record.summary}`}
                onBlur={(event) => {
                  const summary = event.target.value.trim();
                  if (summary && summary !== record.summary) editor.updateRecord({ summary });
                }}
                rows={3}
              />
              <small>{record.summary.length}/158 ký tự</small>
            </label>
            <label className="gisa-field">
              <span>Ảnh đại diện</span>
              <button className="gisa-btn" disabled={busy} onClick={() => coverInput.current?.click()} type="button">
                {record.image ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}
              </button>
              {record.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" src={record.image.src} style={{ borderRadius: 8, marginTop: 8, width: '100%' }} />
              ) : null}
            </label>
            <label className="gisa-field">
              <span>Đường dẫn nguồn</span>
              <input
                defaultValue={record.sourceUrl}
                key={`source-${docId}-${record.sourceUrl}`}
                onBlur={(event) => {
                  const sourceUrl = event.target.value.trim();
                  if (sourceUrl && sourceUrl !== record.sourceUrl) editor.updateRecord({ sourceUrl });
                }}
              />
            </label>
          </section>

          <section className="gisa-section">
            <h3>Khối đang chọn</h3>
            <div className="gisa-row">
              <button className="gisa-btn" disabled={selected === null || selected <= 0} onClick={() => selected !== null && editor.moveBlock(selected, -1)} type="button">
                ↑ Lên
              </button>
              <button className="gisa-btn" disabled={selected === null || selected >= entries.length - 1} onClick={() => selected !== null && editor.moveBlock(selected, 1)} type="button">
                ↓ Xuống
              </button>
              <button className="gisa-btn gisa-danger" disabled={selected === null} onClick={() => selected !== null && editor.removeBlock(selected)} type="button">
                Xoá khối
              </button>
            </div>
            <p className="gisa-hint">Bấm vào một đoạn trên trang để chọn khối, rồi dùng các nút này.</p>
          </section>
        </aside>
      ) : null}

      <div className="gisa-toolbar">
        <span className="gisa-toolbar-label">
          <span className="gisa-toolbar-dot" data-state={saveState} />
          {SAVE_LABEL[saveState]}
        </span>

        <button data-variant="primary" onClick={() => setAddOpen((open) => !open)} type="button">
          + Thêm khối
        </button>

        <button onClick={() => setSeoOpen(true)} type="button">
          Kiểm tra SEO · {report.score}/100
        </button>

        <button
          data-variant="primary"
          disabled={busy}
          onClick={() => void publish()}
          title={
            report.blockers.length > 0
              ? 'Còn mục cần sửa, bấm Kiểm tra SEO để xem'
              : 'Đăng bài lên website'
          }
          type="button"
        >
          Đăng bài
        </button>
      </div>

      {seoOpen ? (
        <div className="gisa-modal-backdrop" role="presentation">
          <div aria-modal="true" className="gisa-modal" role="dialog">
            <div className="gisa-modal-head">
              <h2>Kiểm tra trước khi đăng</h2>
              <button className="gisa-btn" onClick={() => setSeoOpen(false)} type="button">
                Đóng
              </button>
            </div>

            <div className="gisa-score" data-tone={tone}>
              <strong>{report.score}</strong>
              <span>
                {report.blockers.length > 0
                  ? `${report.blockers.length} mục cần sửa (đánh dấu ×) rồi mới đăng được.`
                  : 'Đủ điều kiện để đăng lên website.'}
              </span>
            </div>

            <label className="gisa-field">
              <span>Từ khoá chính của bài</span>
              <input
                defaultValue={keywordOf(record)}
                key={`keyword-${docId}`}
                onChange={(event) => {
                  const keyword = event.target.value.trim();
                  if (keyword === keywordOf(record)) return;
                  editor.updateRecord({ metadata: { ...record.metadata, keyword } });
                }}
                placeholder="Ví dụ: kinh tế tuần hoàn"
              />
              <small>Điểm và các mục liên quan tới từ khoá được chấm lại ngay khi gõ.</small>
            </label>

            <ul className="gisa-check-list">
              {report.checks.map((check) => (
                <li key={check.id}>
                  <span className="gisa-mark" data-status={check.status}>
                    {MARK[check.status]}
                  </span>
                  <span>
                    {check.label}
                    <small>{check.detail}</small>
                  </span>
                </li>
              ))}
            </ul>

            <div className="gisa-modal-actions">
              <button className="gisa-btn" onClick={() => setSeoOpen(false)} type="button">
                Sửa tiếp
              </button>
              <button
                className="gisa-btn"
                data-active={report.blockers.length === 0}
                disabled={busy || report.blockers.length > 0}
                onClick={() => void publish()}
                type="button"
              >
                Đăng bài
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="gisa-toast" data-tone={toast.tone} role="status">
          {toast.message}
          {toast.href ? (
            <a href={toast.href} rel="noreferrer" target="_blank">
              Xem trên web ↗
            </a>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
