import type { ReactNode } from 'react';

import { parseInline } from '@/lib/inline-format';

interface InlineTextProps {
  text: string;
  /** Bọc thêm từng đoạn chữ (ví dụ để giữ cụm tiếng Việt không bị ngắt dòng). */
  bind?: (value: string) => ReactNode;
}

/** Dựng lại các đoạn đậm / nghiêng / nhấn / liên kết từ văn bản thuần. */
export function InlineText({ text, bind }: InlineTextProps) {
  return (
    <>
      {parseInline(text).map((segment, index) => {
        const content = bind ? bind(segment.text) : segment.text;

        if (segment.href) {
          const external = /^https?:\/\//i.test(segment.href);
          return (
            <a
              href={segment.href}
              key={index}
              rel={external ? 'noreferrer' : undefined}
              target={external ? '_blank' : undefined}
            >
              {content}
            </a>
          );
        }

        if (segment.bold) return <strong key={index}>{content}</strong>;
        if (segment.italic) return <em key={index}>{content}</em>;
        if (segment.accent) return <span data-accent="true" key={index}>{content}</span>;

        return <span key={index}>{content}</span>;
      })}
    </>
  );
}
