import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: 'j7fuzzrp',
  dataset: 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  stega: { studioUrl: 'https://gisa-editor.sanity.studio/' },
});
