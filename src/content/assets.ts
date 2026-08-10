import manifest from '../../public/assets/asset-manifest.json';

import { assetManifestSchema, type AssetManifestItem } from './asset-schema';

/**
 * Tra ảnh cho khối `image` trong thân bài.
 *
 * `assetId` của khối chính là `publicPath` trong `public/assets/asset-manifest.json`
 * — không đặt thêm một hệ định danh riêng, vì như vậy sẽ có hai chỗ phải khớp nhau
 * mỗi lần thêm ảnh, và `scripts/audit-content.ts` vốn đã đối chiếu theo đường dẫn.
 *
 * Chỉ ảnh có `rightsStatus: 'approved_for_web'` mới được trả về. Ảnh còn ở trạng
 * thái `temporary_internal_use` nghĩa là chưa xác nhận quyền đăng công khai, nên
 * khối ảnh chỉ hiển thị chú thích — giống hệt hành vi trước khi có phần dựng ảnh.
 */
const assetsByPath = new Map<string, AssetManifestItem>(
  assetManifestSchema.parse(manifest).map((item) => [item.publicPath, item]),
);

export function resolvePublishableAsset(
  assetId: string,
): AssetManifestItem | null {
  const asset = assetsByPath.get(assetId);
  if (!asset) return null;
  return asset.rightsStatus === 'approved_for_web' ? asset : null;
}
