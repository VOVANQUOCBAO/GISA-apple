import { z } from 'zod';

const isoDateSchema = z.string().date();

export const contentBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), text: z.string().min(1) }),
  z.object({
    type: z.literal('heading'),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('list'),
    ordered: z.boolean(),
    items: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: z.literal('quote'),
    text: z.string().min(1),
    attribution: z.string().min(1).optional(),
  }),
  z.object({
    type: z.literal('image'),
    assetId: z.string().min(1),
    caption: z.string().min(1).optional(),
  }),
  z.object({
    type: z.literal('table'),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  z.object({
    type: z.literal('linkGroup'),
    links: z
      .array(z.object({ label: z.string().min(1), href: z.string().min(1) }))
      .min(1),
  }),
  z.object({
    type: z.literal('video'),
    provider: z.literal('youtube'),
    externalUrl: z.url(),
    title: z.string().min(1),
  }),
]);

const contentKinds = [
  'project',
  'publication',
  'tool',
  'course',
  'expert',
  'initiative',
  'news',
  'notice',
  'partner',
  'application',
  'community',
  'resource',
  'video',
  'gallery',
  'archive',
] as const;

const collections = [
  'projects',
  'publications',
  'tools',
  'courses',
  'experts',
  'initiatives',
  'news',
  'notices',
  'partners',
  'applications',
  'community',
  'resources',
  'videos',
  'galleries',
  'archive',
] as const;

export const contentRecordSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(contentKinds),
  collection: z.enum(collections),
  slug: z.string().min(1),
  path: z.string().startsWith('/'),
  locale: z.enum(['vi', 'en']),
  translationKey: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.array(contentBlockSchema),
  publishedAt: isoDateSchema.optional(),
  image: z
    .object({
      src: z.string().startsWith('/'),
      alt: z.string().min(1),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
  tags: z.array(z.string().min(1)),
  evidenceStatus: z.enum([
    'verified',
    'provided_by_gisa',
    'strategic_proposal',
    'needs_verification',
  ]),
  sourceUrl: z.url(),
  sourceLabel: z.string().min(1),
  checkedAt: isoDateSchema,
  metadata: z.record(
    z.string(),
    z.union([z.string(), z.array(z.string()), z.undefined()]),
  ),
  editorialStatus: z
    .enum(['pending_review', 'approved', 'rejected', 'archived'])
    .optional(),
  legacyUrls: z.array(z.url()).optional(),
  provenance: z
    .object({
      sourceUrl: z.url(),
      snapshotId: isoDateSchema,
      fetchedAt: z.iso.datetime(),
      sourceHash: z.string().min(1),
      extractionMethod: z.enum(['embedded_json', 'dom_fallback', 'manual']),
      extractionConfidence: z.enum(['high', 'medium', 'low']),
    })
    .optional(),
  media: z
    .array(
      z.object({
        id: z.string().min(1),
        kind: z.enum(['image', 'document', 'video_thumbnail']),
        publicPath: z.string().startsWith('/').optional(),
        sourceUrl: z.url(),
        sourceHash: z.string().min(1),
        mimeType: z.string().min(1),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
        alt: z.string(),
        rightsStatus: z.enum([
          'pending_review',
          'approved_for_web',
          'rejected',
        ]),
      }),
    )
    .optional(),
  seo: z
    .object({
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      canonicalUrl: z.url().optional(),
    })
    .optional(),
  publication: z
    .object({
      journal: z.string().min(1).optional(),
      year: z.number().int().min(1900).max(2100).optional(),
      doi: z.url().startsWith('https://doi.org/').optional(),
      externalUrl: z.url().optional(),
    })
    .optional(),
});

const mojibakePattern = /(?:Ã[\u0080-\u00bf\u0192]|Â[\u0080-\u00bf]|â€|Ä[‘’]|Æ[°±])/u;
const unsafeMarkupPattern = /(?:<\/?script\b|\bon[a-z]+\s*=|javascript:|data:text\/html)/iu;

function mojibakePath(value: unknown, path: PropertyKey[] = []): PropertyKey[] | undefined {
  if (typeof value === 'string') return mojibakePattern.test(value) ? path : undefined;
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      const found = mojibakePath(item, [...path, index]);
      if (found) return found;
    }
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      const found = mojibakePath(item, [...path, key]);
      if (found) return found;
    }
  }
  return undefined;
}

export const normalizedContentRecordSchema = contentRecordSchema
  .required({
    editorialStatus: true,
    legacyUrls: true,
    provenance: true,
    media: true,
    seo: true,
  })
  .superRefine((record, context) => {
    const serialized = JSON.stringify(record);
    const corruptedPath = mojibakePath(record);
    if (corruptedPath) {
      context.addIssue({ code: 'custom', message: 'Encoding corruption detected.', path: corruptedPath });
    }
    if (unsafeMarkupPattern.test(serialized)) {
      context.addIssue({ code: 'custom', message: 'Unsafe HTML detected.' });
    }
    if (
      record.sourceUrl !== record.provenance.sourceUrl ||
      !record.legacyUrls.includes(record.sourceUrl)
    ) {
      context.addIssue({ code: 'custom', message: 'Source URL mismatch.' });
    }
  });

export const contentRecordsSchema = z
  .array(normalizedContentRecordSchema)
  .superRefine((records, context) => {
    const paths = new Set<string>();
    for (const [index, record] of records.entries()) {
      if (paths.has(record.path)) {
        context.addIssue({
          code: 'custom',
          message: `Duplicate canonical path: ${record.path}`,
          path: [index, 'path'],
        });
      }
      paths.add(record.path);
    }
  });
