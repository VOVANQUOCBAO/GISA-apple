'use client';

import { ImageBroken, Sparkle, VideoCamera } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

import { ICON_LIST } from './element-library';
import styles from './studio.module.css';
import type { StudioElement } from './types';

/** Icon dựng sẵn ở phạm vi module để không tạo component mới trong lúc render. */
const ICON_ELEMENTS = new Map<string, React.ReactElement>(
  ICON_LIST.map(({ name, icon: IconComponent }) => [
    name,
    <IconComponent aria-hidden key={name} size="100%" weight="regular" />,
  ]),
);

const FALLBACK_ICON = <Sparkle aria-hidden size="100%" weight="regular" />;

export function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{6,})/u,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function textStyle(element: Extract<StudioElement, { kind: 'text' }>): React.CSSProperties {
  return {
    fontFamily: element.font === 'serif' ? 'var(--font-heading)' : 'var(--font-body)',
    fontSize: element.fontSize,
    fontWeight: element.weight,
    fontStyle: element.italic ? 'italic' : 'normal',
    color: element.color,
    textAlign: element.align,
    lineHeight: element.lineHeight,
    letterSpacing: `${element.letterSpacing}em`,
    margin: 0,
  };
}

export function safeHref(href: string): string {
  const value = href.trim();
  return /^(https?:\/\/|\/|#|mailto:|tel:)/iu.test(value) ? value : '#';
}

interface Props {
  element: StudioElement;
  /** false khi xem trước / trang đã đăng: không có contentEditable, iframe bấm được. */
  editable?: boolean;
  editing?: boolean;
  onTextCommit?: (text: string, height?: number) => void;
  /** Cập nhật ngay khi gõ, để autosave không đợi blur. */
  onTextDraft?: (text: string, height?: number) => void;
}

function normalizeText(value: string): string {
  return value.replace(/\u00a0/g, ' ');
}

/**
 * Một khối trên trang. Dùng chung cho lúc dựng và lúc đã đăng nên bố cục không
 * thể lệch giữa hai nơi.
 */
export function ElementView({
  element,
  editable = false,
  editing = false,
  onTextCommit,
  onTextDraft,
}: Props) {
  switch (element.kind) {
    case 'text': {
      if (editable && editing) {
        return (
          <TextEditor
            element={element}
            onTextCommit={onTextCommit}
            onTextDraft={onTextDraft}
          />
        );
      }

      const Tag =
        element.role === 'heading'
          ? 'h2'
          : element.role === 'subheading'
            ? 'h3'
            : element.role === 'quote'
              ? 'blockquote'
              : 'p';

      return (
        <Tag className={styles.textBox} style={textStyle(element)}>
          {element.text}
        </Tag>
      );
    }

    case 'image': {
      if (!element.src) {
        return (
          <div className={styles.imagePlaceholder} style={{ borderRadius: element.radius }}>
            <ImageBroken aria-hidden size={28} />
            <span>Bấm đúp để thêm ảnh</span>
          </div>
        );
      }

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={element.alt}
          className={styles.image}
          draggable={false}
          src={element.src}
          style={{ borderRadius: element.radius, objectFit: element.fit }}
        />
      );
    }

    case 'shape':
      if (element.shape === 'line') {
        return <div className={styles.line} style={{ background: element.fill }} />;
      }

      return (
        <div
          style={{
            background: element.fill,
            border: element.strokeWidth > 0 ? `${element.strokeWidth}px solid ${element.stroke}` : 'none',
            borderRadius: element.shape === 'ellipse' ? '50%' : element.radius,
            height: '100%',
            width: '100%',
          }}
        />
      );

    case 'icon': {
      return (
        <div className={styles.iconBox} style={{ color: element.color }}>
          {ICON_ELEMENTS.get(element.name) ?? FALLBACK_ICON}
        </div>
      );
    }

    case 'button': {
      const style: React.CSSProperties = {
        background: element.fill,
        borderRadius: element.radius,
        color: element.color,
        fontFamily: 'var(--font-body)',
        fontSize: element.fontSize,
        fontWeight: element.weight,
      };

      if (editable) {
        return (
          <div className={styles.buttonBox} style={style}>
            {element.label}
          </div>
        );
      }

      return (
        <a className={styles.buttonBox} href={safeHref(element.href)} style={style}>
          {element.label}
        </a>
      );
    }

    case 'video': {
      const src = youtubeEmbedUrl(element.url);
      if (!src) {
        return (
          <div className={styles.videoFallback}>
            <VideoCamera aria-hidden size={28} />
            <span>Dán liên kết YouTube ở bảng bên phải</span>
          </div>
        );
      }

      return (
        <iframe
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.video}
          src={src}
          style={{ pointerEvents: editable ? 'none' : 'auto' }}
          title="Video"
        />
      );
    }

    default:
      return null;
  }
}

function TextEditor({
  element,
  onTextCommit,
  onTextDraft,
}: {
  element: Extract<StudioElement, { kind: 'text' }>;
  onTextCommit?: (text: string, height?: number) => void;
  onTextDraft?: (text: string, height?: number) => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  // Chỉ lấy nội dung lúc bắt đầu sửa. Không render lại text từ prop trong lúc
  // gõ, nếu không React sẽ ghi đè DOM và làm nhảy con trỏ.
  const [initialText] = useState(element.text);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    node.focus();
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  return (
    <div
      aria-label="Nội dung khối chữ"
      aria-multiline="true"
      className={styles.textBox}
      contentEditable
      onBlur={(event) => {
        const next = normalizeText(event.currentTarget.innerText);
        onTextCommit?.(next.trim(), event.currentTarget.scrollHeight + 2);
      }}
      onInput={(event) =>
        onTextDraft?.(
          normalizeText(event.currentTarget.innerText),
          event.currentTarget.scrollHeight + 2,
        )
      }
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      ref={nodeRef}
      role="textbox"
      spellCheck={false}
      style={textStyle(element)}
      suppressContentEditableWarning
    >
      {initialText}
    </div>
  );
}
