import { courseFixtures } from './courses';
import { expertFixtures } from './experts';
import { initiativeFixtures } from './initiatives';
import { newsFixtures } from './news';
import { noticeFixtures } from './notices';
import { partnerFixtures } from './partners';
import { projectFixtures } from './projects';
import { publicationFixtures } from './publications';
import { toolFixtures } from './tools';
import { gisaDocumentFixtures } from './gisa-document';

export const allContentFixtures = [
  ...projectFixtures,
  ...publicationFixtures,
  ...toolFixtures,
  ...courseFixtures.filter((record) => !gisaDocumentFixtures.some((updated) => updated.path === record.path)),
  ...gisaDocumentFixtures,
  ...expertFixtures,
  ...newsFixtures,
  ...noticeFixtures,
  ...initiativeFixtures,
  ...partnerFixtures,
];
