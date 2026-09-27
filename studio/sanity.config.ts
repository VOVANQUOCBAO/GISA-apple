import { defineConfig } from 'sanity';
import { defineLocations, presentationTool, type PresentationPluginOptions } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { post } from './schemaTypes/post';

const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    post: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (document) => ({
        locations: [
          {
            title: document?.title || 'Bài viết',
            href: document?.slug ? `/tin-tuc/${document.slug}` : '/tin-tuc',
          },
          { title: 'Tất cả tin tức', href: '/tin-tuc' },
        ],
      }),
    }),
  },
};

export default defineConfig({
  name: 'gisa',
  title: 'GISA — Quản lý bài viết',
  projectId: 'j7fuzzrp',
  dataset: 'production',
  plugins: [
    structureTool({
      title: 'Bài viết',
      structure: (S) => S.list().title('Nội dung GISA').items([
        S.documentTypeListItem('post').title('Bài viết'),
      ]),
    }),
    presentationTool({
      resolve,
      previewUrl: {
        initial: 'https://gisa.edu.vn/tin-tuc',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins: ['https://gisa.edu.vn', 'https://www.gisa.edu.vn'],
    }),
  ],
  schema: { types: [post] },
});
