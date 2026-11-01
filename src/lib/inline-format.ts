/**
 * Định dạng trong dòng, lưu dưới dạng văn bản thuần có dấu hiệu:
 *
 *   **đậm**   *nghiêng*   ==nhấn màu==   [chữ](https://…)
 *
 * Cố ý không lưu HTML: hợp đồng nội dung của website chỉ nhận văn bản, và mọi
 * thứ được dựng lại bằng React nên không có đường nào chèn script.
 */
export interface InlineSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  accent?: boolean;
  href?: string;
}

const PATTERN = /(\*\*[^*]+\*\*|\*[^*\n]+\*|==[^=]+==|\[[^\]\n]+\]\([^)\s]+\))/g;

export function parseInline(value: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let cursor = 0;

  for (const match of value.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) segments.push({ text: value.slice(cursor, index) });

    const token = match[0];

    if (token.startsWith('**')) {
      segments.push({ bold: true, text: token.slice(2, -2) });
    } else if (token.startsWith('==')) {
      segments.push({ accent: true, text: token.slice(2, -2) });
    } else if (token.startsWith('[')) {
      const split = token.indexOf('](');
      segments.push({
        href: safeHref(token.slice(split + 2, -1)),
        text: token.slice(1, split),
      });
    } else {
      segments.push({ italic: true, text: token.slice(1, -1) });
    }

    cursor = index + token.length;
  }

  if (cursor < value.length) segments.push({ text: value.slice(cursor) });

  return segments.filter((segment) => segment.text.length > 0);
}

/** Bỏ dấu hiệu định dạng để đo độ dài, đếm từ, tạo thẻ anchor. */
export function plainText(value: string): string {
  return parseInline(value)
    .map((segment) => segment.text)
    .join('');
}

function safeHref(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return '#';
}

/** HTML do trình duyệt sinh ra (khi gõ trong contentEditable) → dấu hiệu văn bản. */
export function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const element = node as HTMLElement;
  const inner = Array.from(element.childNodes).map(nodeToMarkdown).join('');
  const tag = element.tagName.toLowerCase();

  if (tag === 'br') return ' ';
  if (tag === 'strong' || tag === 'b') return inner.trim() ? `**${inner}**` : inner;
  if (tag === 'em' || tag === 'i') return inner.trim() ? `*${inner}*` : inner;
  if (tag === 'a') {
    const href = element.getAttribute('href') ?? '';
    return inner.trim() ? `[${inner}](${href})` : inner;
  }
  if (element.dataset.accent === 'true') return inner.trim() ? `==${inner}==` : inner;

  return inner;
}

export function htmlToMarkdown(element: HTMLElement): string {
  return Array.from(element.childNodes)
    .map(nodeToMarkdown)
    .join('')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
