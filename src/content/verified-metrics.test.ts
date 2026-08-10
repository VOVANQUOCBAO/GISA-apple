import { describe, expect, test } from 'vitest';

import { courseFixtures } from './fixtures/courses';
import { expertFixtures } from './fixtures/experts';
import { initiativeFixtures } from './fixtures/initiatives';
import { partnerFixtures } from './fixtures/partners';
import { projectFixtures } from './fixtures/projects';
import { publicationFixtures } from './fixtures/publications';
import { tuVanBlocks } from './static-blocks/tu-van';
import {
  consultingPillars,
  researchItems,
  trainingPathway,
  verifiedJourneyMetrics,
  verifiedNetworkClusters,
} from './verified-metrics';

/**
 * Số trên các plate của "TRI THỨC TẠO CHUYỂN BIẾN" nay đếm nội dung của chính
 * website này, nên chúng có thể lệch âm thầm mỗi khi ai đó thêm hoặc bớt một bản
 * ghi. Các phép đối chiếu dưới đây là thứ biến sự lệch đó thành test đỏ.
 */
describe('số liệu hành trình khớp nội dung đang đăng', () => {
  test('mỗi chương trình đào tạo khớp số khóa trong fixture', () => {
    for (const stage of trainingPathway) {
      const actual = courseFixtures.filter(
        (course) => course.metadata.program === stage.name,
      ).length;

      expect(actual, `số khóa của ${stage.name}`).toBe(stage.listedCourses);
    }
  });

  test('tổng số khóa của năm chương trình bằng toàn bộ danh mục', () => {
    const declared = trainingPathway.reduce((sum, stage) => sum + stage.listedCourses, 0);

    expect(declared).toBe(courseFixtures.length);
  });

  test('số hạng mục tư vấn khớp sáu danh sách dịch vụ công khai', () => {
    const listedItems = tuVanBlocks['/tu-van/linh-vuc']
      .filter((block) => block.type === 'list')
      .map((block) => block.items.length);

    expect(consultingPillars.map((pillar) => pillar.listedItems)).toEqual(listedItems);
    expect(listedItems.reduce((sum, count) => sum + count, 0)).toBe(29);
  });

  test('14 nghiên cứu là 14 hồ sơ riêng, phân loại nội bộ đủ căn cứ', () => {
    expect(researchItems).toHaveLength(14);
    expect(new Set(researchItems.map((item) => item.id))).toHaveLength(14);
    expect(new Set(researchItems.map((item) => item.title))).toHaveLength(14);
    expect(researchItems.filter((item) => item.crossDisciplinary === true)).toHaveLength(7);
    expect(researchItems.filter((item) => item.crossDisciplinary === false)).toHaveLength(7);
    expect(researchItems.every((item) => item.disciplinaryBasis?.trim())).toBe(true);
  });

  test('hai nghiên cứu bưởi da xanh không bị gộp thành một hồ sơ', () => {
    const pomeloStudies = researchItems.filter((item) => item.id.includes('pomelo'));

    expect(pomeloStudies.map(({ id, year }) => ({ id, year }))).toEqual([
      { id: 'pomelo-value-chain-2015', year: 2015 },
      { id: 'pomelo-value-chain-2016', year: 2016 },
    ]);
    expect(new Set(pomeloStudies.map((item) => item.title))).toHaveLength(2);
  });

  test.each([
    ['publishedCourses', () => courseFixtures.length],
    ['publishedPartners', () => partnerFixtures.length],
    ['publishedExpertProfiles', () => expertFixtures.length],
    ['publishedPublications', () => publicationFixtures.length],
    ['publishedInitiatives', () => initiativeFixtures.length],
    ['publishedResearchProjects', () => projectFixtures.length],
  ])('phép đếm %s khớp fixture', (metricId, count) => {
    const metric = verifiedJourneyMetrics.find((item) => item.metric === metricId);

    expect(metric).toBeDefined();
    expect(metric?.value).toBe(count());
  });

  test('nhóm mạng lưới khớp số đối tác và số dự án đang đăng', () => {
    const clusterCount = (name: string) =>
      verifiedNetworkClusters.find((cluster) => cluster.clusterName === name)?.memberCount;

    expect(clusterCount('Tổ chức đối tác')).toBe(partnerFixtures.length);
    expect(clusterCount('Dự án nghiên cứu nổi bật')).toBe(projectFixtures.length);
    expect(clusterCount('Chuyên gia & giảng viên')).toBe(expertFixtures.length);
  });
});
