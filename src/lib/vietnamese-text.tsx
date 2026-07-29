import type { CSSProperties, ReactNode } from 'react';

/**
 * Vietnamese writes each syllable as a separate token, so a browser is free to
 * break a line in the middle of a word: "phát triển" can wrap as "phát" / "triển".
 * No CSS property fixes this on its own — `text-wrap: pretty` and `balance` only
 * change how the ragged edge is distributed, and `hyphens`/`word-break` operate on
 * the wrong unit.
 *
 * Each known word is wrapped in a `white-space: nowrap` span. The obvious
 * alternative — joining the syllables with U+00A0 — also stops the break, but it
 * changes the text itself: find-in-page stops matching (browsers do not treat a
 * typed space as U+00A0), and every accessible name picks up the invisible
 * character too. Wrapping leaves `textContent` byte-for-byte unchanged.
 *
 * The list below is a keep-together list, not a dictionary: adding a phrase that
 * never wraps costs nothing, but a phrase missing here can still split.
 */
const COMPOUNDS = [
  'ấn phẩm', 'bao trùm', 'bền vững', 'chất lượng', 'chiến lược', 'chính sách',
  'chuyên gia', 'chuyển đổi', 'chuyển giao', 'công nghệ', 'cộng đồng',
  'doanh nghiệp', 'dự án', 'đánh giá', 'đào tạo', 'đo lường', 'đổi mới',
  'giá trị', 'giải pháp', 'giáo dục', 'giới thiệu', 'hệ thống', 'hiệu quả',
  'hiệu suất', 'học thuật', 'hợp tác', 'khách hàng', 'khí hậu', 'khoa học',
  'khóa học', 'kiến tạo', 'kinh doanh', 'kinh tế', 'kết nối', 'lãnh đạo',
  'liên hệ', 'liên ngành', 'mạng lưới', 'minh bạch', 'môi trường', 'năng lực',
  'nguồn nhân lực', 'nhân lực', 'nhân sự', 'nghiên cứu', 'phát triển',
  'phân tích', 'quản lý nâng cao', 'quản lý', 'nâng cao', 'quản trị', 'quốc tế', 'sản xuất', 'sáng tạo', 'thị trường',
  'thực phẩm', 'thực tiễn', 'tin tức', 'toàn cầu', 'tài chính', 'tác động',
  'tìm kiếm', 'trách nhiệm', 'trang chủ', 'trải nghiệm', 'triển khai',
  'tri thức', 'trung tâm', 'tư vấn', 'ứng dụng', 'xây dựng',
];

/**
 * Longest first, so "nguồn nhân lực" is matched before "nhân lực" — otherwise the
 * shorter phrase would match first and leave "nguồn" free to wrap away from it.
 * The lookarounds stop a phrase from matching inside a longer word.
 */
const PATTERN = new RegExp(
  `(?<!\\p{L})(${[...COMPOUNDS]
    .sort((a, b) => b.length - a.length)
    .join('|')})(?!\\p{L})`,
  'giu',
);

/*
 * Phrase wrappers must be typographically transparent. Several sections style
 * structural spans such as numbers, icons, and fixed heading lines. Without
 * these inherited values, those selectors can accidentally turn a phrase in
 * body copy into a large display-font fragment.
 *
 * One outer inline wrapper also keeps the sentence together as a single flex or
 * grid item instead of splitting unmatched text and matched phrases apart.
 */
const inheritedTypography: CSSProperties = {
  color: 'inherit',
  display: 'inline',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontStyle: 'inherit',
  fontWeight: 'inherit',
  letterSpacing: 'inherit',
  lineHeight: 'inherit',
  textTransform: 'inherit',
};

/** Keeps the syllables of known Vietnamese words on the same line. */
export function bindPhrases(text: string): ReactNode {
  const parts = text.split(PATTERN);
  if (parts.length === 1) return text;

  // `split` with one capture group alternates: plain, match, plain, match, …
  return (
    <span data-vietnamese-text style={inheritedTypography}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span
            data-vietnamese-phrase
            key={`${part}-${index}`}
            style={{ ...inheritedTypography, whiteSpace: 'nowrap' }}
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
}
