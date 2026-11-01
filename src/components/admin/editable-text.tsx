'use client';

import type { ClipboardEvent, KeyboardEvent } from 'react';

import { useEditor } from './editor-provider';

/** Dán luôn về văn bản thuần: không mang style, font hay HTML từ nơi khác sang. */
export function pasteAsPlainText(event: ClipboardEvent<HTMLElement>) {
  event.preventDefault();
  const text = event.clipboardData.getData('text/plain');
  if (text) document.execCommand('insertText', false, text.replace(/\r\n/g, '\n'));
}

export function singleLine(event: KeyboardEvent<HTMLElement>) {
  if (event.key === 'Enter') {
    event.preventDefault();
    event.currentTarget.blur();
  }
}

interface EditableTextProps {
  field: 'title' | 'summary';
  label: string;
  placeholder: string;
}

/** Tiêu đề và mô tả phụ: gõ thẳng vào đúng chỗ chúng xuất hiện trên trang. */
export function EditableText({ field, label, placeholder }: EditableTextProps) {
  const { record, updateRecord } = useEditor();
  const value = field === 'title' ? record.title : record.summary;

  return (
    <span
      aria-label={label}
      contentEditable
      data-editable-field={field}
      data-placeholder={placeholder}
      onBlur={(event) => {
        const text = (event.currentTarget.innerText ?? '').replace(/\s+/g, ' ').trim();
        if (!text) {
          event.currentTarget.innerText = value;
          return;
        }
        if (text !== value) {
          updateRecord(field === 'title' ? { title: text } : { summary: text });
        }
      }}
      onKeyDown={singleLine}
      onPaste={pasteAsPlainText}
      role="textbox"
      spellCheck
      suppressContentEditableWarning
      tabIndex={0}
    >
      {value}
    </span>
  );
}
