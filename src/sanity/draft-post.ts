import 'server-only';

import { POST_FIELDS, toRecord, type SanityPost } from '@/content/repositories/sanity-news-repository';

import { sanityClient } from './client';

const DRAFT_POST_QUERY = `*[_type == "post" && slug.current == $slug][0] ${POST_FIELDS}`;

export async function getDraftPost(slug: string) {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) throw new Error('SANITY_API_READ_TOKEN is required for draft previews.');

  const post = await sanityClient.withConfig({
    token,
    perspective: 'drafts',
    useCdn: false,
    stega: false,
  }).fetch<SanityPost | null>(DRAFT_POST_QUERY, { slug });

  return post ? { record: toRecord(post, true), documentId: post._id } : null;
}
