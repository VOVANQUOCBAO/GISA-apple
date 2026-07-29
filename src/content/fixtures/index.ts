import { courseFixtures } from './courses';
import { expertFixtures } from './experts';
import { initiativeFixtures } from './initiatives';
import { newsFixtures } from './news';
import { noticeFixtures } from './notices';
import { projectFixtures } from './projects';
import { publicationFixtures } from './publications';

export const allContentFixtures = [
  ...projectFixtures,
  ...publicationFixtures,
  ...courseFixtures,
  ...expertFixtures,
  ...newsFixtures,
  ...noticeFixtures,
  ...initiativeFixtures,
];
