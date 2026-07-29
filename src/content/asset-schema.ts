import { z } from 'zod';

export const assetManifestItemSchema = z.object({
  publicPath: z.string().startsWith('/'),
  sourcePath: z.string().min(1),
  sourceType: z.enum(['provided_by_gisa', 'verified_public_source']),
  rightsStatus: z.enum(['temporary_internal_use', 'approved_for_web']),
  alt: z.string(),
  reviewedAt: z.iso.date(),
  notes: z.string().min(1)
});

export const assetManifestSchema = z.array(assetManifestItemSchema);

export type AssetManifestItem = z.infer<typeof assetManifestItemSchema>;
