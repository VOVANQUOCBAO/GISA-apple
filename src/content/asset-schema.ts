import { z } from 'zod';

export const assetManifestItemSchema = z.object({
  publicPath: z.string().startsWith('/'),
  sourcePath: z.string().min(1),
  sourceType: z.enum(['provided_by_gisa', 'verified_public_source']),
  rightsStatus: z.enum(['temporary_internal_use', 'approved_for_web']),
  alt: z.string(),
  reviewedAt: z.iso.date(),
  notes: z.string().min(1),
  // Kích thước thật của tệp ảnh. Để `next/image` giữ đúng chỗ trước khi ảnh tải
  // xong, tránh nội dung nhảy. Không bắt buộc vì manifest còn dùng cho tài liệu và
  // các tệp không phải ảnh; thiếu kích thước thì khối ảnh dựng khung 16:9.
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional()
});

export const assetManifestSchema = z.array(assetManifestItemSchema);

export type AssetManifestItem = z.infer<typeof assetManifestItemSchema>;
