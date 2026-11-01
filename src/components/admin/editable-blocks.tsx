'use client';

import { Fragment, useEffect, type KeyboardEvent, type MouseEvent } from 'react';

import { ContentBlocks } from '@/components/templates/content-blocks';
import { InlineText } from '@/components/templates/inline-text';
import styles from '@/components/templates/templates.module.css';
import type { ContentBlock } from '@/content/types';
import { htmlToMarkdown } from '@/lib/inline-format';

import { pasteAsPlainText } from './editable-text';
import { EditableCanvas } from './canvas-editor';
import { useEditor, type BlockEntry } from './editor-provider';

const EDITABLE_TYPES = new Set(['paragraph', 'heading', 'list', 'quote', 'image', 'canvas']);

type TextBlock = Extract<ContentBlock, { text: string }>;
type ListBlock = Extract<ContentBlock, { type: 'list' }>;
type ImageBlock = Extract<ContentBlock, { type: 'image' }>;

function clean(text: string): string {
  return text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Phần thân bài viết, dựng bằng đúng các lớp CSS của trang thật và cho phép gõ
 * trực tiếp. Không bọc thêm `div` quanh từng khối vì `.prose > * + *` quy định
 * khoảng cách giữa các khối — bọc vào là bố cục lệch ngay.
 */
export function EditableBlocks() {
  const editor = useEditor();
  const { entries, selected, setSelected, focusRequest, insertBlock, updateBlock } = editor;

  useEffect(() => {
    if (!focusRequest) return;

    const element = document.querySelector<HTMLElement>(
      `[data-focus-id="${focusRequest.id}"]`,
    );
    if (!element) return;

    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [focusRequest]);

  const supported = entries.every((entry) => EDITABLE_TYPES.has(entry.block.type));

  if (!supported) {
    return (
      <div className={styles.prose}>
        <ContentBlocks blocks={entries.map((entry) => entry.block)} />
        <p className="gisa-readonly-note">
          Bài này có khối đặc biệt (bảng, liên kết, video) nên chỉ hiển thị để xem.
        </p>
      </div>
    );
  }

  const commitText = (index: number, block: TextBlock, value: string) => {
    const next = clean(value);
    if (next !== block.text) updateBlock(index, { ...block, text: next } as ContentBlock);
  };

  const commitList = (index: number, block: ListBlock, items: string[]) => {
    updateBlock(index, { ...block, items });
  };

  const commitCaption = (index: number, block: ImageBlock, caption: string) => {
    const next = clean(caption);
    updateBlock(index, { ...block, caption: next } as ContentBlock);
  };

  const chrome = (entry: BlockEntry, index: number) => ({
    'data-bid': entry.id,
    'data-selected': selected === index ? ('true' as const) : undefined,
    onClick: (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setSelected(index);
    },
  });

  const renderEntry = (entry: BlockEntry, index: number) => {
    const block = entry.block;

    if (block.type === 'paragraph') {
      return (
        <p
          {...chrome(entry, index)}
          aria-label={`Đoạn văn ${index + 1}`}
          className={styles.proseParagraph}
          contentEditable
          data-focus-id={entry.id}
          data-placeholder="Viết đoạn văn…"
          key={entry.id}
          onBlur={(event) => commitText(index, block, htmlToMarkdown(event.currentTarget))}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              commitText(index, block, htmlToMarkdown(event.currentTarget));
              insertBlock(index + 1, { type: 'paragraph', text: '' });
            }
          }}
          onPaste={pasteAsPlainText}
          role="textbox"
          spellCheck
          suppressContentEditableWarning
          tabIndex={0}
        >
          <InlineText text={block.text} />
        </p>
      );
    }

    if (block.type === 'heading') {
      const Heading = block.level === 2 ? 'h2' : 'h3';
      return (
        <Heading
          {...chrome(entry, index)}
          aria-label={`Tiêu đề mục ${index + 1}`}
          className={styles.proseHeading}
          contentEditable
          data-focus-id={entry.id}
          data-placeholder="Tiêu đề mục"
          key={entry.id}
          onBlur={(event) => commitText(index, block, htmlToMarkdown(event.currentTarget))}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              commitText(index, block, htmlToMarkdown(event.currentTarget));
              insertBlock(index + 1, { type: 'paragraph', text: '' });
            }
          }}
          onPaste={pasteAsPlainText}
          role="textbox"
          spellCheck
          suppressContentEditableWarning
          tabIndex={0}
        >
          <InlineText text={block.text} />
        </Heading>
      );
    }

    if (block.type === 'list') {
      const List = block.ordered ? 'ol' : 'ul';

      return (
        <List {...chrome(entry, index)} className={styles.proseList} key={entry.id}>
          {block.items.map((item, itemIndex) => (
            <li
              aria-label={`Mục ${itemIndex + 1}`}
              contentEditable
              data-focus-id={`${entry.id}#${itemIndex}`}
              data-placeholder="Thêm mục…"
              key={`${entry.id}-${itemIndex}`}
              onBlur={(event) => {
                const next = clean(htmlToMarkdown(event.currentTarget));
                if (next !== item) {
                  commitList(
                    index,
                    block,
                    block.items.map((current, position) =>
                      position === itemIndex ? next : current,
                    ),
                  );
                }
              }}
              onKeyDown={(event: KeyboardEvent<HTMLLIElement>) => {
                if (event.key !== 'Enter' || event.shiftKey) return;
                event.preventDefault();
                const next = clean(htmlToMarkdown(event.currentTarget));
                const items = [...block.items];
                items[itemIndex] = next;
                items.splice(itemIndex + 1, 0, '');
                commitList(index, block, items);
                window.setTimeout(() => {
                  editor.requestFocus(`${entry.id}#${itemIndex + 1}`);
                }, 0);
              }}
              onPaste={pasteAsPlainText}
              role="textbox"
              spellCheck
              suppressContentEditableWarning
              tabIndex={0}
            >
              <InlineText text={item} />
            </li>
          ))}
        </List>
      );
    }

    if (block.type === 'quote') {
      return (
        <blockquote {...chrome(entry, index)} className={styles.proseQuote} key={entry.id}>
          <p
            aria-label="Nội dung trích dẫn"
            contentEditable
            data-focus-id={entry.id}
            data-placeholder="Nội dung trích dẫn"
            onBlur={(event) => {
              const next = clean(htmlToMarkdown(event.currentTarget));
              if (next !== block.text) updateBlock(index, { ...block, text: next });
            }}
            onPaste={pasteAsPlainText}
            role="textbox"
            suppressContentEditableWarning
            tabIndex={0}
          >
            <InlineText text={block.text} />
          </p>
          {block.attribution ? (
            <cite
              aria-label="Nguồn trích dẫn"
              contentEditable
              data-placeholder="Nguồn trích dẫn"
              onBlur={(event) => {
                const next = clean(event.currentTarget.innerText);
                if (next !== block.attribution) {
                  updateBlock(index, { ...block, attribution: next });
                }
              }}
              onPaste={pasteAsPlainText}
              role="textbox"
              suppressContentEditableWarning
              tabIndex={0}
            >
              {block.attribution}
            </cite>
          ) : null}
        </blockquote>
      );
    }

    if (block.type === 'canvas') {
      return <EditableCanvas block={block} index={index} key={entry.id} />;
    }

    if (block.type !== 'image') return null;

    const shapeClass =
      block.shape === 'square'
        ? ` ${styles.blockFigureSquare}`
        : block.shape === 'circle'
          ? ` ${styles.blockFigureCircle}`
          : '';

    const openPanel = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const below = rect.bottom + 8;
      const top = below + 120 > window.innerHeight ? Math.max(12, rect.top - 96) : below;

      window.dispatchEvent(
        new CustomEvent('gisa-admin:edit-image', {
          detail: { index, left: rect.left, top },
        }),
      );
    };

    return (
      <figure
        {...chrome(entry, index)}
        aria-label={block.caption ?? 'Ảnh trong bài'}
        className={`${styles.blockFigure}${shapeClass}`}
        key={entry.id}
        role="group"
        tabIndex={0}
      >
        {/* Ảnh thuần thay cho `next/image`: lúc soạn thảo không cần sinh srcset. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={block.alt ?? block.caption ?? 'Ảnh trong bài viết'}
          key="image"
          onClick={(event) => {
            event.stopPropagation();
            setSelected(index);
            openPanel(event.currentTarget.parentElement ?? event.currentTarget);
          }}
          src={block.assetId}
          title="Bấm để đổi ảnh"
        />
        <figcaption
          contentEditable
          data-placeholder="Thêm chú thích ảnh (không bắt buộc)"
          key="caption"
          onBlur={(event) => commitCaption(index, block, event.currentTarget.innerText)}
          onPaste={pasteAsPlainText}
          role="textbox"
          suppressContentEditableWarning
          tabIndex={0}
        >
          {block.caption ?? ''}
        </figcaption>
      </figure>
    );
  };

  return (
    <div className={styles.prose}>
      {entries.map((entry, index) => (
        <Fragment key={entry.id}>{renderEntry(entry, index)}</Fragment>
      ))}
    </div>
  );
}
