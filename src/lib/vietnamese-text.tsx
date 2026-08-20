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
  'ấn phẩm', 'bao trùm', 'bằng chứng', 'bảo vệ', 'bảo vệ môi trường', 'bền vững',
  'cá nhân', 'cảm xúc', 'cạnh tranh', 'chất lượng', 'chiến lược', 'chính sách', 'chương trình',
  'chuyên gia', 'chuyên môn', 'chuyển đổi', 'chuyển đổi số', 'chuyển giao', 'con người',
  'công cụ', 'công dân', 'công nghệ', 'cộng đồng', 'dữ liệu', 'địa phương',
  'doanh nghiệp', 'dự án', 'dấu ấn', 'dấu ấn khác biệt', 'đánh giá', 'đào tạo', 'đo lường', 'đối tác', 'đồng hành',
  'đổi mới', 'đổi mới sáng tạo', 'giá trị', 'giải pháp', 'giáo dục', 'giới thiệu',
  'hành động', 'hạnh phúc', 'hệ sinh thái', 'hệ thống', 'hiệu quả', 'hoạt động',
  'hiệu suất', 'học thuật', 'hợp tác', 'khách hàng', 'khí hậu', 'khoa học',
  'khoa học công nghệ', 'khóa học', 'khởi nghiệp', 'kỹ năng', 'kiến tạo', 'kinh doanh',
  'kinh tế bền vững', 'kinh tế thực phẩm', 'kinh tế', 'kết nối', 'lãnh đạo', 'liên hệ',
  'liên ngành', 'mạng lưới', 'minh bạch', 'mô hình', 'môi trường', 'mục tiêu', 'năng lực',
  'lựa chọn', 'lộ trình',
  'nguồn nhân lực', 'nhân lực', 'nhân sự', 'nghiên cứu', 'nông nghiệp', 'nông thôn', 'phát triển',
  'phát triển bền vững', 'phát triển con người', 'phân tích', 'phương pháp', 'quản lý',
  'quản lý kinh doanh', 'quản lý nâng cao', 'nâng cao', 'quản trị', 'quản trị hiệu quả',
  'quy trình', 'quyết định', 'quốc tế', 'ra quyết định', 'sản xuất', 'sáng kiến', 'sáng tạo',
  'sức khỏe', 'sức khỏe tinh thần', 'tài nguyên', 'tâm lý', 'thành quả', 'thay đổi', 'thị trường',
  'thiên nhiên', 'thông tin', 'thực phẩm', 'thực tiễn', 'tiếp cận', 'tin tức', 'toàn cầu', 'tài chính', 'tác động',
  'tìm kiếm', 'trách nhiệm', 'trang chủ', 'trải nghiệm', 'triển khai',
  'trách nhiệm xã hội', 'tri thức', 'trung tâm', 'tổ chức', 'tư vấn', 'ứng dụng',
  'vai trò', 'vấn đề', 'xã hội', 'xây dựng',
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
