import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    window.sessionStorage.setItem('gisa-site-intro-seen', 'true');
  });
});

test('about story uses the requested editorial hierarchy', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto('/gioi-thieu/cau-chuyen-gisa');

  const leadNumbers = page.locator('blockquote').first().locator('small');
  await expect(leadNumbers).toHaveCount(3);
  for (const number of await leadNumbers.all()) {
    expect(Number.parseFloat(await number.evaluate((node) => getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(14);
  }

  const firstChapter = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Bối cảnh và vấn đề đặt ra' }) });
  const chapterNumber = firstChapter.locator('small').first();
  expect(Number.parseFloat(await chapterNumber.evaluate((node) => getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(14);

  const chapterParagraph = firstChapter.locator('p').first();
  expect(await chapterParagraph.evaluate((node) => getComputedStyle(node).textAlign)).toBe('start');

  const philosophyHeading = page.getByRole('heading', { level: 2, name: 'Triết lý cốt lõi' });
  await expect(philosophyHeading).toBeVisible();
  const philosophyPoints = philosophyHeading.locator('xpath=..').locator('em');
  await expect(philosophyPoints).toHaveCount(3);

  const philosophyMetrics = await philosophyHeading.locator('xpath=..').evaluate((band) => {
    const quote = band.querySelector('blockquote p');
    const lines = Array.from(band.querySelectorAll('em'));
    if (!quote || lines.length !== 3) return null;

    return {
      fontStyles: lines.map((line) => getComputedStyle(line).fontStyle),
      fontSize: getComputedStyle(lines[0]).fontSize,
      lineHeight: getComputedStyle(lines[0]).lineHeight,
      lineRects: lines.map((line) => {
        const range = document.createRange();
        range.selectNodeContents(line);
        const box = range.getBoundingClientRect();
        return { height: box.height, left: box.left, top: box.top };
      }),
      quoteHeight: quote.getBoundingClientRect().height,
    };
  });

  expect(philosophyMetrics).not.toBeNull();
  expect(philosophyMetrics!.fontStyles.every((fontStyle) => fontStyle === 'italic')).toBe(true);
  const [firstLine, secondLine, thirdLine] = philosophyMetrics!.lineRects;
  const verticalGaps = [
    secondLine.top - firstLine.top - firstLine.height,
    thirdLine.top - secondLine.top - secondLine.height,
  ];
  expect(Math.max(firstLine.left, secondLine.left, thirdLine.left) - Math.min(firstLine.left, secondLine.left, thirdLine.left)).toBeLessThanOrEqual(1);
  expect(verticalGaps.every((gap) => gap >= 0 && gap <= 12)).toBe(true);
  expect(Math.abs(verticalGaps[0] - verticalGaps[1])).toBeLessThanOrEqual(2);

  const visionCopy = page.getByRole('heading', { level: 2, name: 'Tầm nhìn' }).locator('xpath=..').locator('blockquote');
  const visionMetrics = await visionCopy.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      fontSize: style.fontSize,
      height: node.getBoundingClientRect().height,
      left: node.getBoundingClientRect().left,
      lineHeight: style.lineHeight,
    };
  });
  expect(Math.abs(philosophyMetrics!.quoteHeight - visionMetrics.height)).toBeLessThanOrEqual(2);
  expect(Math.abs(firstLine.left - visionMetrics.left)).toBeLessThanOrEqual(2);
  expect(philosophyMetrics!.fontSize).toBe(visionMetrics.fontSize);
  expect(philosophyMetrics!.lineHeight).toBe(visionMetrics.lineHeight);
});

test('mobile service shortcuts keep all six items in an even two-column grid', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto('/');

  const shortcuts = page.getByRole('navigation', { name: 'Lối tắt dịch vụ' }).locator('a');
  await expect(shortcuts).toHaveCount(6);
  const boxes = await shortcuts.evaluateAll((items) => items.map((item) => {
    const box = item.getBoundingClientRect();
    return { height: box.height, top: box.top, width: box.width };
  }));

  expect(new Set(boxes.map((box) => Math.round(box.top))).size).toBe(3);
  expect(Math.abs(boxes[0].width - boxes[5].width)).toBeLessThan(1);
  expect(Math.abs(boxes[0].height - boxes[5].height)).toBeLessThan(1);
});

test('RISES copy is fully visible before interaction', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto('/');

  const panels = page.getByRole('button', { name: /^\d{2}\. (Reliability|Innovation|Science|Efficiency|Sustainability)\./ });
  await expect(panels).toHaveCount(5);
  for (const panel of await panels.all()) {
    const visibility = await panel.evaluate((button) => {
      const label = button.querySelector<HTMLElement>('span:nth-child(4)');
      const description = button.querySelector<HTMLElement>('span:nth-child(6)');
      if (!label || !description) return null;
      const descriptionStyle = getComputedStyle(description);
      return {
        descriptionOpacity: Number.parseFloat(descriptionStyle.opacity),
        labelFits: label.scrollWidth <= label.clientWidth,
      };
    });
    expect(visibility).not.toBeNull();
    expect(visibility?.descriptionOpacity).toBe(1);
    expect(visibility?.labelFits).toBe(true);
  }
});

test('RISES cards share one editorial grid without stretched word spacing', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto('/');

  const panels = page.getByRole('button', { name: /^\d{2}\. (Reliability|Innovation|Science|Efficiency|Sustainability)\./ });
  await expect(panels).toHaveCount(5);

  const metrics = await panels.evaluateAll((items) => items.map((button) => {
    const label = button.querySelector<HTMLElement>('span:nth-child(4)');
    const description = button.querySelector<HTMLElement>('span:nth-child(6)');
    if (!label || !description) return null;
    return {
      descriptionTop: description.getBoundingClientRect().top,
      labelTop: label.getBoundingClientRect().top,
      textAlign: getComputedStyle(description).textAlign,
    };
  }));

  expect(metrics.every(Boolean)).toBe(true);
  const cards = metrics.filter((metric): metric is NonNullable<typeof metric> => metric !== null);
  expect(new Set(cards.map((card) => Math.round(card.labelTop))).size).toBe(1);
  expect(new Set(cards.map((card) => Math.round(card.descriptionTop))).size).toBe(1);
  expect(cards.every((card) => card.textAlign === 'center')).toBe(true);
});

test('mobile featured-news images and indices stay aligned', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto('/');

  const cards = page.locator('section').filter({ has: page.getByRole('heading', { name: 'TIN TỨC & HOẠT ĐỘNG NỔI BẬT' }) }).locator('article');
  await expect(cards).toHaveCount(3);
  const metrics = await cards.evaluateAll((items) => items.map((item) => {
    const image = item.querySelector<HTMLElement>('a > span:first-child');
    const index = item.querySelector<HTMLElement>('a > span:nth-child(2) > span:first-child');
    if (!image || !index) return null;
    const imageBox = image.getBoundingClientRect();
    const indexBox = index.getBoundingClientRect();
    return {
      imageHeight: imageBox.height,
      imageWidth: imageBox.width,
      indexVisible: indexBox.width > 0 && indexBox.height > 0,
      overlapsImage: indexBox.left < imageBox.right && indexBox.right > imageBox.left && indexBox.top < imageBox.bottom && indexBox.bottom > imageBox.top,
    };
  }));

  expect(metrics.every(Boolean)).toBe(true);
  const images = metrics.filter((metric): metric is NonNullable<typeof metric> => metric !== null);
  expect(Math.max(...images.map((metric) => metric.imageWidth)) - Math.min(...images.map((metric) => metric.imageWidth))).toBeLessThan(1);
  expect(Math.max(...images.map((metric) => metric.imageHeight)) - Math.min(...images.map((metric) => metric.imageHeight))).toBeLessThan(1);
  expect(images.every((metric) => metric.indexVisible && !metric.overlapsImage)).toBe(true);
});

test('mobile editorial copy keeps natural spacing without locking Vietnamese phrases', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });

  const checks = [
    { path: '/', selector: '[class*="aboutBody"] > p, [class*="missionGrid"] li > p' },
    { path: '/gioi-thieu/cau-chuyen-gisa', selector: '[class*="storyChapterBody"] > p, [class*="missionList"] li > p' },
    { path: '/nghien-cuu/bai-bao-khoa-hoc/dong-luc-va-rao-can-tieu-dung-sua-ben-vung', selector: '[class*="articleBody"] p' },
    { path: '/tin-tuc/san-pham-khoa-hoc-cong-nghe-tai-trien-lam-tang-truong-xanh', selector: '[class*="articleBody"] > div > p' },
  ] as const;

  for (const check of checks) {
    await page.goto(check.path);
    const paragraphMetrics = await page.locator(check.selector).evaluateAll((paragraphs) =>
      paragraphs
        .filter((paragraph) => (paragraph.textContent?.trim().length ?? 0) >= 90)
        .map((paragraph) => {
          const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
          const words: DOMRect[] = [];
          let textNode = walker.nextNode();
          while (textNode) {
            const text = textNode.textContent ?? '';
            for (const match of text.matchAll(/\S+/gu)) {
              const range = document.createRange();
              const start = match.index ?? 0;
              range.setStart(textNode, start);
              range.setEnd(textNode, start + match[0].length);
              words.push(range.getBoundingClientRect());
            }
            textNode = walker.nextNode();
          }
          const ordered = words.filter((word) => word.width > 0).sort((left, right) => (
            Math.abs(left.top - right.top) <= 2 ? left.left - right.left : left.top - right.top
          ));
          let maxWordGap = 0;
          for (let index = 1; index < ordered.length; index += 1) {
            if (Math.abs(ordered[index].top - ordered[index - 1].top) <= 2) {
              maxWordGap = Math.max(maxWordGap, ordered[index].left - ordered[index - 1].right);
            }
          }
          return {
            maxWordGap,
            phraseWrapping: [...paragraph.querySelectorAll<HTMLElement>('[data-vietnamese-phrase]:not([data-dash-bridge])')]
              .map((phrase) => getComputedStyle(phrase).whiteSpace),
            textAlign: getComputedStyle(paragraph).textAlign,
          };
        }),
    );
    expect(paragraphMetrics.length, `${check.path} exposes long-form copy`).toBeGreaterThan(0);
    expect(paragraphMetrics.every((metric) => metric.textAlign !== 'justify'), `${check.path} keeps natural character spacing`).toBe(true);
    expect(
      paragraphMetrics.every((metric) => metric.phraseWrapping.every((whiteSpace) => whiteSpace === 'normal')),
      `${check.path} must not create spacing rivers with no-wrap phrases`,
    ).toBe(true);
    expect(Math.max(...paragraphMetrics.map((metric) => metric.maxWordGap)), `${check.path} maximum word gap`).toBeLessThanOrEqual(13);
  }
});

test('every mobile homepage hero slide stays inside its frame', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto('/');

  const slides = [
    [['KIẾN TẠO', 'TRI THỨC'], ['LAN TỎA', 'GIÁ TRỊ']],
    [['NGHIÊN CỨU', 'LIÊN NGÀNH'], ['TẠO', 'CHUYỂN BIẾN']],
    [['ĐỒNG HÀNH', 'TỔ CHỨC'], ['PHÁT TRIỂN', 'BỀN VỮNG']],
  ] as const;

  for (const lines of slides) {
    const metric = await page.locator('main section').first().evaluate((hero, slide) => {
      const heading = hero.querySelector<HTMLElement>('h1');
      if (!heading) return null;
      heading.innerHTML = slide.map((line, lineIndex) => {
        const copy = line.map((phrase) => `<span style="white-space:nowrap">${phrase}</span>`).join(' ');
        return `<span>${lineIndex === 1 ? `<em>${copy}</em>` : copy}</span>`;
      }).join('');
      const heroBox = hero.getBoundingClientRect();
      const headingBox = heading.getBoundingClientRect();
      const phraseBoxes = [...heading.querySelectorAll<HTMLElement>('[style*="nowrap"]')]
        .map((phrase) => phrase.getBoundingClientRect());
      return {
        fits: headingBox.left >= heroBox.left - 1
          && headingBox.right <= heroBox.right + 1
          && heading.scrollWidth <= heading.clientWidth + 1
          && phraseBoxes.every((box) => box.left >= heroBox.left - 1 && box.right <= heroBox.right + 1),
        lineWidths: [...heading.children].map((line) => (line as HTMLElement).scrollWidth),
        width: heading.clientWidth,
      };
    }, lines);
    expect(metric).not.toBeNull();
    expect(metric?.fits, lines.flat().join(' ')).toBe(true);
    expect(metric?.lineWidths.every((width) => width <= metric.width + 1)).toBe(true);
  }
});

test('the live third mobile homepage hero slide stays inside its frame', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.dataset.siteIntro = 'complete';
  });

  const heading = page.getByRole('heading', { name: 'ĐỒNG HÀNH TỔ CHỨC PHÁT TRIỂN BỀN VỮNG' });
  await expect(heading).toBeVisible({ timeout: 12_000 });
  const metric = await heading.evaluate((node) => {
    const hero = node.closest('section');
    if (!hero) return null;
    const heroBox = hero.getBoundingClientRect();
    const headingBox = node.getBoundingClientRect();
    return {
      clientWidth: node.clientWidth,
      fits: headingBox.left >= heroBox.left - 1
        && headingBox.right <= heroBox.right + 1
        && node.scrollWidth <= node.clientWidth + 1,
      scrollWidth: node.scrollWidth,
    };
  });

  expect(metric).not.toBeNull();
  expect(metric?.fits, `heading ${metric?.scrollWidth}px inside ${metric?.clientWidth}px`).toBe(true);
});

test('desktop expert cards do not stretch their copy into empty panels', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto('/chuyen-gia');

  const emptyBottomSpace = await page.locator('[class*="cardCopy"]').evaluateAll((panels) => panels.map((panel) => {
    const panelBox = panel.getBoundingClientRect();
    const children = [...panel.children] as HTMLElement[];
    const lastBottom = Math.max(...children.map((child) => child.getBoundingClientRect().bottom));
    return panelBox.bottom - lastBottom;
  }));

  expect(emptyBottomSpace.length).toBeGreaterThan(0);
  expect(Math.max(...emptyBottomSpace)).toBeLessThanOrEqual(64);
});

test('mobile mission story is divided into readable cards instead of one giant panel', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto('/gioi-thieu/cau-chuyen-gisa');

  const metric = await page.locator('[class*="missionPanel"]').evaluate((panel) => {
    const list = panel.querySelector<HTMLElement>('ol, ul');
    const items = list ? [...list.children] as HTMLElement[] : [];
    const style = getComputedStyle(panel);
    const listStyle = list ? getComputedStyle(list) : null;
    return {
      borderStyle: style.borderTopStyle,
      panelBackground: style.backgroundColor,
      panelShadow: style.boxShadow,
      listGap: listStyle ? Number.parseFloat(listStyle.rowGap) : 0,
      itemRadii: items.map((item) => Number.parseFloat(getComputedStyle(item).borderTopLeftRadius)),
    };
  });

  expect(metric.borderStyle).toBe('none');
  expect(metric.panelBackground).toBe('rgba(0, 0, 0, 0)');
  expect(metric.panelShadow).toBe('none');
  expect(metric.listGap).toBeGreaterThanOrEqual(16);
  expect(metric.itemRadii.every((radius) => radius >= 12)).toBe(true);
});

test('mobile mission dash stays attached to the following word', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto('/');

  const heading = page.getByRole('heading', { name: 'Ứng dụng khoa học – công nghệ vào thực tiễn' });
  const bridge = heading.locator('[data-dash-bridge]');
  await expect(bridge).toHaveText('– công nghệ');
  expect(await bridge.evaluate((node) => getComputedStyle(node).whiteSpace)).toBe('nowrap');
});

test('mobile atlas images stay inside their chapter cards', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  for (const path of ['/nghien-cuu/linh-vuc', '/tu-van/linh-vuc']) {
    await page.goto(path);

    const visuals = page.locator('[class*="chapterVisual"]');
    const metrics = await visuals.evaluateAll((items) => items.map((visual) => {
      const image = visual.querySelector<HTMLElement>('img');
      const card = visual.closest<HTMLElement>('article, li, section');
      if (!image || !card) return null;
      const cardBox = card.getBoundingClientRect();
      const visualBox = visual.getBoundingClientRect();
      const imageBox = image.getBoundingClientRect();
      return {
        cardRight: cardBox.right,
        imageRight: imageBox.right,
        visualRight: visualBox.right,
        visualWidth: visualBox.width,
      };
    }));

    const measured = metrics.filter((metric): metric is NonNullable<typeof metric> => metric !== null);
    expect(measured.length, `${path} has chapter visuals`).toBeGreaterThan(0);
    expect(measured.every((metric) => metric.visualWidth <= 390 + 1), `${path} visual width`).toBe(true);
    expect(measured.every((metric) => metric.visualRight <= metric.cardRight + 1), `${path} visual right edge`).toBe(true);
    expect(measured.every((metric) => metric.imageRight <= metric.cardRight + 1), `${path} image right edge`).toBe(true);
  }
});

test('mobile section headings keep an editorial rather than poster scale', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });

  await page.goto('/');
  const capabilitySize = await page
    .locator('section#nang-luc h2')
    .evaluate((heading) => Number.parseFloat(getComputedStyle(heading).fontSize));
  expect(capabilitySize).toBeLessThanOrEqual(46);

  await page.goto('/nghien-cuu/du-an');
  const projectLeadSize = await page
    .getByRole('heading', { name: 'Từ câu hỏi nghiên cứu đến bằng chứng ứng dụng' })
    .evaluate((heading) => Number.parseFloat(getComputedStyle(heading).fontSize));
  expect(projectLeadSize).toBeLessThanOrEqual(38);
});

test('mobile section navigation shows every destination without clipped labels', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ height: 844, width: 390 });

  for (const path of [
    '/nghien-cuu/linh-vuc',
    '/tu-van/linh-vuc',
    '/dao-tao/linh-vuc',
    '/ung-dung/linh-vuc',
    '/mang-luoi/thuc-day-hop-tac',
    '/cong-dong/kinh-te-ben-vung',
  ]) {
    await page.goto(path);
    const rail = page.locator('nav[aria-label^="Khám phá"]').filter({ has: page.locator('a[aria-current="page"]') });
    const metrics = await rail.evaluate((nav) => {
      const navBox = nav.getBoundingClientRect();
      const links = [...nav.querySelectorAll('a')].map((link) => {
        const box = link.getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          textFits: link.scrollWidth <= link.clientWidth && link.scrollHeight <= link.clientHeight,
        };
      });
      return {
        links,
        navLeft: navBox.left,
        navRight: navBox.right,
        overflows: nav.scrollWidth > nav.clientWidth,
      };
    });

    expect(metrics.overflows, `${path} subnav must not require hidden horizontal scrolling`).toBe(false);
    expect(metrics.links.every((link) => link.left >= metrics.navLeft - 1)).toBe(true);
    expect(metrics.links.every((link) => link.right <= metrics.navRight + 1)).toBe(true);
    expect(metrics.links.every((link) => link.textFits)).toBe(true);
  }
});

test('desktop cards avoid spacing rivers and oversized listing titles', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });

  await page.goto('/');
  const missionAlignment = await page.locator('section#su-menh-gisa li p').evaluateAll((items) =>
    items.map((item) => getComputedStyle(item).textAlign),
  );
  expect(missionAlignment.every((alignment) => alignment !== 'justify')).toBe(true);

  await page.goto('/cong-dong/kinh-te-ben-vung');
  const communityCards = page.locator('li:not([class*="initiativeLead"]) > [class*="initiativeCard"]');
  const communityMetrics = await communityCards.evaluateAll((cards) => cards.map((card) => {
    const title = card.querySelector<HTMLElement>('h3');
    const summary = card.querySelector<HTMLElement>('p[class*="itemSummary"]');
    return {
      alignment: summary ? getComputedStyle(summary).textAlign : null,
      titleSize: title ? Number.parseFloat(getComputedStyle(title).fontSize) : null,
    };
  }));
  expect(communityMetrics.every((metric) => metric.alignment !== 'justify')).toBe(true);
  expect(communityMetrics.every((metric) => metric.titleSize === null || metric.titleSize <= 33)).toBe(true);

  await page.goto('/tin-tuc');
  const newsTitleSizes = await page.locator('[class*="newsCopy"] h3').evaluateAll((headings) =>
    headings.map((heading) => Number.parseFloat(getComputedStyle(heading).fontSize)),
  );
  expect(newsTitleSizes.length).toBeGreaterThan(0);
  expect(newsTitleSizes.every((size) => size <= 42)).toBe(true);
});

test('ecosystem detail display paragraphs avoid oversized or stretched text', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });

  for (const path of [
    '/tin-tuc/tai-chinh-khi-hau-va-phat-trien',
    '/cong-dong/mo-hinh-phat-trien-kinh-te-tuan-hoan-tai-dia-phuong',
  ]) {
    await page.goto(path);
    const metric = await page.locator('[class*="articleBody"] > div > p:first-child, [class*="body"] > div:first-child > p:first-child').first().evaluate((paragraph) => ({
      fontSize: Number.parseFloat(getComputedStyle(paragraph).fontSize),
      textAlign: getComputedStyle(paragraph).textAlign,
    }));
    expect(metric.fontSize, `${path} display paragraph size`).toBeLessThanOrEqual(30);
    expect(['left', 'start'], `${path} display paragraph alignment`).toContain(metric.textAlign);
  }
});

test('tool detail titles stay at an editorial scale on desktop and mobile', async ({ page }) => {
  const path = '/tu-van/cong-cu/cong-cu-phan-tich-chien-luoc-va-hoach-dinh-chinh-sach';

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto(path);
  const desktopSize = await page.locator('main h1').evaluate((heading) => Number.parseFloat(getComputedStyle(heading).fontSize));
  expect(desktopSize).toBeLessThanOrEqual(64);

  await page.setViewportSize({ height: 844, width: 390 });
  await page.reload();
  const mobileSize = await page.locator('main h1').evaluate((heading) => Number.parseFloat(getComputedStyle(heading).fontSize));
  expect(mobileSize).toBeLessThanOrEqual(44);
});

test('desktop publication prose keeps even edges without wide word gaps', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  const routes = [
    '/nghien-cuu/bai-bao-khoa-hoc/chuoi-cung-ung-thuc-pham-ngan-ben-vung-va-binh-dang',
    '/nghien-cuu/bai-bao-khoa-hoc/dong-luc-cua-thuong-mai-noi-nganh-nong-nghiep',
    '/nghien-cuu/bai-bao-khoa-hoc/san-sang-tra-tien-cho-nhan-phuc-loi-dong-vat',
  ];

  for (const path of routes) {
    await page.goto(path);
    const gaps = await page.locator('[class*="articleBody"] p').evaluateAll((paragraphs) => paragraphs
      .filter((paragraph) => (paragraph.textContent?.trim().length ?? 0) >= 90)
      .map((paragraph) => {
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        const words: DOMRect[] = [];
        let textNode = walker.nextNode();
        while (textNode) {
          const text = textNode.textContent ?? '';
          for (const match of text.matchAll(/\S+/gu)) {
            const range = document.createRange();
            const start = match.index ?? 0;
            range.setStart(textNode, start);
            range.setEnd(textNode, start + match[0].length);
            words.push(range.getBoundingClientRect());
          }
          textNode = walker.nextNode();
        }
        const ordered = words.filter((word) => word.width > 0).sort((left, right) => (
          Math.abs(left.top - right.top) <= 2 ? left.left - right.left : left.top - right.top
        ));
        let maxGap = 0;
        for (let index = 1; index < ordered.length; index += 1) {
          if (Math.abs(ordered[index].top - ordered[index - 1].top) <= 2) {
            maxGap = Math.max(maxGap, ordered[index].left - ordered[index - 1].right);
          }
        }
        return { maxGap, textAlign: getComputedStyle(paragraph).textAlign };
      }));
    expect(gaps.length, `${path} contains publication prose`).toBeGreaterThan(0);
    expect(gaps.every((metric) => metric.textAlign !== 'justify')).toBe(true);
    expect(Math.max(...gaps.map((metric) => metric.maxGap)), `${path} maximum word gap`).toBeLessThanOrEqual(13);
  }
});

test('research index headings fit their own editorial column', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });

  await page.goto('/nghien-cuu/linh-vuc');
  const chapterLines = await page.locator('[class*="chapterTitleLine"]').evaluateAll((lines) => lines.map((line) => {
    const box = line.getBoundingClientRect();
    const headingBox = line.closest('h2')?.getBoundingClientRect();
    return {
      fits: Boolean(headingBox) && box.left >= headingBox!.left - 1 && box.right <= headingBox!.right + 1,
      scrollFits: line.scrollWidth <= line.clientWidth + 1,
    };
  }));
  expect(chapterLines.length).toBeGreaterThan(0);
  expect(chapterLines.every((line) => line.fits && line.scrollFits)).toBe(true);

  await page.goto('/nghien-cuu/du-an');
  const projectHeading = page.locator('#practice-listing-title');
  const projectFits = await projectHeading.evaluate((heading) => heading.scrollWidth <= heading.clientWidth + 1);
  expect(projectFits).toBe(true);
});

test('mobile applied-publication title avoids a one-word final line', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto('/nghien-cuu/bai-bao-ung-dung');

  const lastLineWords = await page.locator('main h1').first().evaluate((heading) => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const words: Array<{ text: string; top: number }> = [];
    let textNode = walker.nextNode();
    while (textNode) {
      const text = textNode.textContent ?? '';
      for (const match of text.matchAll(/\S+/gu)) {
        const range = document.createRange();
        const start = match.index ?? 0;
        range.setStart(textNode, start);
        range.setEnd(textNode, start + match[0].length);
        words.push({ text: match[0], top: range.getBoundingClientRect().top });
      }
      textNode = walker.nextNode();
    }
    const lastTop = Math.max(...words.map((word) => word.top));
    return words.filter((word) => Math.abs(word.top - lastTop) <= 2).length;
  });
  expect(lastLineWords).toBeGreaterThanOrEqual(2);
});

test('project prose keeps explanatory dashes with the following term', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto('/nghien-cuu/du-an/strength2food');

  const bridge = page.locator('[data-dash-bridge]').filter({ hasText: '– GIs' }).first();
  await expect(bridge).toHaveText('– GIs');
  expect(await bridge.evaluate((node) => getComputedStyle(node).whiteSpace)).toBe('nowrap');
});
