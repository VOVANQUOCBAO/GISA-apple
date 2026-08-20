import { describe, expect, test } from 'vitest';

import { heroVisualForPath } from './inner-page-chrome';

describe('heroVisualForPath', () => {
  test.each([
    ['/ung-dung/khoa-hoc-cong-nghe', '/images/article-ai-chatbot.png'],
    ['/cong-dong/trach-nhiem-xa-hoi', '/images/knowledge-journey/community-action-editorial.png'],
    ['/cong-dong/quan-tri-hieu-qua', '/images/article-esg-report.png'],
    ['/tin-tuc/tai-chinh-khi-hau-va-phat-trien', '/images/knowledge-deck/news-climate-finance.webp'],
    ['/tin-tuc/thong-bao-lich', '/images/hero-gisa-team.png'],
  ])('uses an existing route-specific visual for %s', (path, src) => {
    expect(heroVisualForPath(path).src).toBe(src);
  });

  test('uses a dedicated visual for the funder network page', () => {
    expect(heroVisualForPath('/mang-luoi/quy-nha-tai-tro').src).toBe(
      '/images/hero-gisa-strategy-table.png',
    );
  });
});
