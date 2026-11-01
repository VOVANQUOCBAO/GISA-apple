'use client';

import type { ContentBlock, ContentRecord } from '@/content/types';

export type SeoStatus = 'pass' | 'warn' | 'fail';

export interface SeoCheck {
  id: string;
  label: string;
  status: SeoStatus;
  detail: string;
  points: number;
  max: number;
}

export interface SeoReport {
  score: number;
  checks: SeoCheck[];
  blockers: SeoCheck[];
}

const KEYWORD_FIELD = 'keyword';

export function keywordOf(record: ContentRecord): string {
  const value = record.metadata[KEYWORD_FIELD];
  return typeof value === 'string' ? value.trim() : '';
}

function plainText(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === 'list') return block.items.join(' ');
      if (block.type === 'table') return block.rows.flat().join(' ');
      if (block.type === 'linkGroup') return block.links.map((link) => link.label).join(' ');
      if (block.type === 'video') return block.title;
      if (block.type === 'image') return [block.alt, block.caption].join(' ');
      if (block.type === 'canvas') {
        return block.items
          .map((item) => (item.kind === 'text' ? item.text : (item.alt ?? '')))
          .join(' ');
      }
      return block.text;
    })
    .join(' ')
    .trim();
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Chấm theo tiêu chí on-page mà người viết tự kiểm được, không phải thứ Google
 * chấm. Điểm chỉ để biết còn thiếu gì trước khi đăng.
 */
export function analyzeSeo(record: ContentRecord): SeoReport {
  const keyword = keywordOf(record).toLocaleLowerCase('vi');
  const title = record.title.trim();
  const summary = record.summary.trim();
  const body = record.body;
  const text = plainText(body);
  const words = wordCount(text);
  const headings = body.filter((block) => block.type === 'heading');
  const h2s = headings.filter((block) => block.type === 'heading' && block.level === 2);
  const images = body.filter((block) => block.type === 'image');
  const imagesMissingAlt = images.filter(
    (block) =>
      block.type === 'image' &&
      !(block.alt ?? '').trim() &&
      !(block.caption ?? '').trim(),
  ).length;
  const links = body.filter((block) => block.type === 'linkGroup');
  const firstParagraph = body.find((block) => block.type === 'paragraph');
  const firstHundred = firstParagraph?.type === 'paragraph'
    ? firstParagraph.text.toLocaleLowerCase('vi')
    : text.slice(0, 600).toLocaleLowerCase('vi');
  const longParagraph = body.some(
    (block) => block.type === 'paragraph' && wordCount(block.text) > 90,
  );

  const titleOk = title.length >= 30 && title.length <= 60;
  const titleHasKeyword = keyword ? title.toLocaleLowerCase('vi').includes(keyword) : false;
  const summaryOk = summary.length >= 120 && summary.length <= 158;
  const summaryHasKeyword = keyword ? summary.toLocaleLowerCase('vi').includes(keyword) : false;
  const headingHasKeyword = keyword
    ? headings.some((block) => block.text.toLocaleLowerCase('vi').includes(keyword)) ||
      firstHundred.includes(keyword)
    : false;

  const checks: SeoCheck[] = [
    {
      id: 'title',
      label: 'Tiêu đề dài 30–60 ký tự',
      status: titleOk ? 'pass' : title.length > 60 ? 'warn' : 'fail',
      detail: !title
        ? 'Chưa có tiêu đề.'
        : titleOk
          ? `${title.length} ký tự — vừa đủ để Google hiện trọn.`
          : title.length > 60
            ? `${title.length} ký tự, Google thường cắt ở khoảng 60.`
            : `${title.length} ký tự — hơi ngắn, nên thêm thông tin cụ thể.`,
      points: titleOk ? 10 : title.length > 60 ? 5 : 0,
      max: 10,
    },
    {
      id: 'title-keyword',
      label: 'Từ khoá chính có trong tiêu đề',
      status: !keyword ? 'warn' : titleHasKeyword ? 'pass' : 'fail',
      detail: !keyword
        ? 'Chưa nhập từ khoá chính ở ô phía trên.'
        : titleHasKeyword
          ? `Có “${keyword}” trong tiêu đề.`
          : `Tiêu đề chưa có “${keyword}”.`,
      points: keyword && titleHasKeyword ? 10 : 0,
      max: 10,
    },
    {
      id: 'summary',
      label: 'Mô tả hiện trên Google dài 120–158 ký tự',
      status: summaryOk ? 'pass' : summary.length >= 90 ? 'warn' : 'fail',
      detail: !summary
        ? 'Chưa có mô tả, dòng dưới tiêu đề trên Google sẽ trống.'
        : summaryOk
          ? `${summary.length} ký tự — hiện trọn trên Google.`
          : `${summary.length} ký tự, nên nằm trong 120–158.`,
      points: summaryOk ? 10 : summary.length >= 90 ? 5 : 0,
      max: 10,
    },
    {
      id: 'summary-keyword',
      label: 'Từ khoá chính có trong mô tả',
      status: !keyword ? 'warn' : summaryHasKeyword ? 'pass' : 'fail',
      detail: !keyword
        ? 'Chưa nhập từ khoá chính.'
        : summaryHasKeyword
          ? `Có “${keyword}” trong mô tả.`
          : `Mô tả chưa có “${keyword}”.`,
      points: keyword && summaryHasKeyword ? 5 : 0,
      max: 5,
    },
    {
      id: 'slug',
      label: 'Đường dẫn ngắn, không dấu',
      status: record.slug.length > 0 && record.slug.length <= 75 ? 'pass' : 'warn',
      detail: `/${record.slug} — ${record.slug.length} ký tự.`,
      points: record.slug.length > 0 && record.slug.length <= 75 ? 5 : 0,
      max: 5,
    },
    {
      id: 'h2',
      label: 'Bài có tiêu đề mục (H2)',
      status: h2s.length >= 2 ? 'pass' : h2s.length === 1 ? 'warn' : 'fail',
      detail:
        h2s.length >= 2
          ? `${h2s.length} tiêu đề mục, đủ để chia bài.`
          : h2s.length === 1
            ? 'Mới có 1 tiêu đề mục, nên chia thành 2–3 phần.'
            : 'Chưa có tiêu đề mục nào.',
      points: h2s.length >= 2 ? 10 : h2s.length === 1 ? 5 : 0,
      max: 10,
    },
    {
      id: 'keyword-body',
      label: 'Từ khoá chính xuất hiện sớm trong bài',
      status: !keyword ? 'warn' : headingHasKeyword ? 'pass' : 'fail',
      detail: !keyword
        ? 'Chưa nhập từ khoá chính.'
        : headingHasKeyword
          ? `Có “${keyword}” trong phần mở đầu hoặc tiêu đề mục.`
          : `Chưa thấy “${keyword}” ở phần mở đầu hay tiêu đề mục.`,
      points: keyword && headingHasKeyword ? 10 : 0,
      max: 10,
    },
    {
      id: 'length',
      label: 'Độ dài bài từ 300 từ',
      status: words >= 300 ? 'pass' : words >= 150 ? 'warn' : 'fail',
      detail:
        words >= 300
          ? `${words} từ — đủ để bài có nội dung.`
          : `${words} từ, còn thiếu ${Math.max(0, 300 - words)} từ so với mức nên có.`,
      points: words >= 300 ? 10 : words >= 150 ? 5 : 0,
      max: 10,
    },
    {
      id: 'images',
      label: 'Ảnh trong bài có mô tả',
      status: images.length === 0 ? 'warn' : imagesMissingAlt === 0 ? 'pass' : 'fail',
      detail:
        images.length === 0
          ? 'Bài chưa có ảnh minh hoạ.'
          : imagesMissingAlt === 0
            ? `${images.length} ảnh, tất cả đều có mô tả.`
            : `${imagesMissingAlt}/${images.length} ảnh chưa có mô tả hay chú thích.`,
      points: images.length > 0 && imagesMissingAlt === 0 ? 10 : 0,
      max: 10,
    },
    {
      id: 'links',
      label: 'Bài có liên kết',
      status: links.length > 0 ? 'pass' : 'warn',
      detail: links.length > 0 ? `${links.length} nhóm liên kết.` : 'Chưa có liên kết nào.',
      points: links.length > 0 ? 5 : 0,
      max: 5,
    },
    {
      id: 'source',
      label: 'Có nguồn kiểm chứng',
      status: isValidUrl(record.sourceUrl) ? 'pass' : 'fail',
      detail: isValidUrl(record.sourceUrl)
        ? record.sourceLabel || record.sourceUrl
        : 'Chưa có đường dẫn nguồn hợp lệ.',
      points: isValidUrl(record.sourceUrl) ? 10 : 0,
      max: 10,
    },
    {
      id: 'paragraph',
      label: 'Đoạn văn không quá dài',
      status: longParagraph ? 'warn' : 'pass',
      detail: longParagraph
        ? 'Có đoạn dài trên 90 từ — nên tách đôi cho dễ đọc trên điện thoại.'
        : 'Các đoạn đều trong mức dễ đọc.',
      points: longParagraph ? 0 : 5,
      max: 5,
    },
  ];

  const earned = checks.reduce((sum, check) => sum + check.points, 0);
  const total = checks.reduce((sum, check) => sum + check.max, 0);

  return {
    score: Math.round((earned / total) * 100),
    checks,
    blockers: checks.filter((check) => check.status === 'fail'),
  };
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function scoreTone(score: number): 'good' | 'ok' | 'weak' {
  if (score >= 80) return 'good';
  if (score >= 55) return 'ok';
  return 'weak';
}
