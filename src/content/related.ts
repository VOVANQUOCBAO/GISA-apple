import type { ContentSummary } from './types';

/**
 * Xếp hạng "bài gợi ý" cho một trang chi tiết.
 *
 * Điểm số chỉ dựa trên `tags` vì đó là trường duy nhất có trong `ContentSummary`
 * — danh sách trả về từ repository không mang theo `metadata`. Các fixture đưa
 * chủ đề (`metadata.topic`) vào phần tử đầu của `tags`, nên tag đầu tiên trùng
 * nhau được cộng thêm điểm và bài cùng chủ đề luôn nổi lên trước.
 *
 * Khi số bài cùng chủ đề ít hơn `limit`, phần còn lại được lấp bằng các bài mới
 * nhất trong cùng collection để khối gợi ý không bao giờ trống một nửa.
 */

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('vi');
}

function relevanceScore(current: ContentSummary, candidate: ContentSummary): number {
  const currentTags = new Set(current.tags.map(normalize));
  const shared = candidate.tags.filter((tag) => currentTags.has(normalize(tag)));
  const sameTopic =
    current.tags.length > 0 &&
    candidate.tags.length > 0 &&
    normalize(current.tags[0]) === normalize(candidate.tags[0]);

  return shared.length + (sameTopic ? 3 : 0);
}

export function selectRelatedContent(
  current: Pick<ContentSummary, 'id' | 'tags'>,
  candidates: ContentSummary[],
  limit = 3,
): ContentSummary[] {
  const total = candidates.length;
  const currentIndex = candidates.findIndex(
    (candidate) => candidate.id === current.id,
  );
  const reference = current as ContentSummary;

  return candidates
    .map((candidate, index) => ({
      candidate,
      // Tiêu chí phụ là khoảng cách vòng tính từ chính bài đang đọc. Nhờ vậy các
      // bài không có bài cùng chủ đề vẫn nhận được gợi ý khác nhau — nếu chỉ
      // dùng thứ tự gốc của repository thì mọi bài "lẻ chủ đề" sẽ cùng rơi vào
      // đúng ba bài đứng đầu danh sách.
      distance: currentIndex < 0 ? index : (index - currentIndex + total) % total,
      score: relevanceScore(reference, candidate),
    }))
    .filter((entry) => entry.candidate.id !== current.id)
    .sort(
      (left, right) => right.score - left.score || left.distance - right.distance,
    )
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
