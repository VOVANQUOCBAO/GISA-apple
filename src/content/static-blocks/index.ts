import type { ContentBlock } from '../types';

import { congDongBlocks } from './cong-dong';
import { daoTaoBlocks } from './dao-tao';
import { gioiThieuBlocks } from './gioi-thieu';
import { mangLuoiBlocks } from './mang-luoi';
import { nghienCuuBlocks } from './nghien-cuu';
import { tuVanBlocks } from './tu-van';
import { ungDungBlocks } from './ung-dung';

/**
 * Nội dung thân trang cho các trang tĩnh trong menu, tách khỏi `pages.ts` để tệp
 * đăng ký route chỉ còn cấu trúc điều hướng. Trang nào không có khóa ở đây thì
 * hiển thị đúng tiêu đề và mô tả — dùng cho các trang chức năng như tìm kiếm,
 * liên hệ và biểu mẫu đăng ký.
 */
export const STATIC_PAGE_BLOCKS: Record<string, ContentBlock[]> = {
  ...gioiThieuBlocks,
  ...nghienCuuBlocks,
  ...tuVanBlocks,
  ...daoTaoBlocks,
  ...ungDungBlocks,
  ...mangLuoiBlocks,
  ...congDongBlocks,
};

export function blocksForPath(path: string): ContentBlock[] {
  return STATIC_PAGE_BLOCKS[path] ?? [];
}
