import { courseFixtures } from './courses';
import { expertFixtures } from './experts';
import { initiativeFixtures } from './initiatives';
import { newsFixtures } from './news';
import { noticeFixtures } from './notices';
import { partnerFixtures } from './partners';
import { projectFixtures } from './projects';
import { publicationFixtures } from './publications';
import { toolFixtures } from './tools';

export const allContentFixtures = [
  ...projectFixtures,
  ...publicationFixtures,
  ...toolFixtures,
  ...courseFixtures,
  ...expertFixtures,
  ...newsFixtures,
  ...noticeFixtures,
  ...initiativeFixtures,
  ...partnerFixtures,
];
