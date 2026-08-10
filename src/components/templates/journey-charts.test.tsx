import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import type { JourneyChartName } from '@/content/journey';

import { JourneyChart } from './journey-charts';

const expectedLinkCounts: Record<JourneyChartName, number> = {
  impact: 8,
  network: 83,
  research: 15,
  strategy: 7,
  training: 55,
  transfer: 5,
};

const visibleJourneyExpectations = [
  ['research', 14],
  ['strategy', 6],
  ['training', 5],
  ['transfer', 4],
  ['impact', 8],
] as const satisfies ReadonlyArray<readonly [JourneyChartName, number]>;

function getMorphRoot(container: HTMLElement) {
  const root = container.querySelector<HTMLElement>('[data-journey-chart][data-open-key]');
  expect(root).not.toBeNull();
  return root!;
}

function getMorphTriggers(container: HTMLElement) {
  return [
    ...container.querySelectorAll<SVGElement>('[data-node-key][aria-expanded][aria-controls]'),
  ];
}

function getMorphPanels(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>('[data-morph-panel][data-morph-key]')];
}

function getControlledPanel(container: HTMLElement, trigger: Element) {
  const panelId = trigger.getAttribute('aria-controls');
  expect(panelId).toBeTruthy();
  const panel = panelId ? container.querySelector<HTMLElement>(`[id="${panelId}"]`) : null;
  expect(panel).not.toBeNull();
  return panel!;
}

describe('JourneyChart entity links', () => {
  Object.entries(expectedLinkCounts).forEach(([name, expected]) => {
    test(`${name} exposes every represented entity as a link`, () => {
      const { container } = render(<JourneyChart name={name as JourneyChartName} />);

      expect(container.querySelectorAll('svg a[href]')).toHaveLength(expected);
    });
  });

  test('network nodes resolve to real expert, organisation, project and funder records', () => {
    const { container } = render(<JourneyChart name="network" />);
    const hrefs = [...container.querySelectorAll('svg a[href]')].map((link) => link.getAttribute('href'));

    expect(hrefs.filter((href) => href?.startsWith('/chuyen-gia/'))).toHaveLength(20);
    expect(hrefs.filter((href) => href?.startsWith('/mang-luoi/doi-tac/'))).toHaveLength(48);
    expect(hrefs.filter((href) => href?.startsWith('/nghien-cuu/du-an/'))).toHaveLength(4);
    expect(hrefs.filter((href) => href?.startsWith('http'))).toHaveLength(11);
  });

  test('training renders the exact 15/8/8/8/10 course distribution', () => {
    const { container } = render(<JourneyChart name="training" />);
    const courseLinks = [...container.querySelectorAll('svg a[href^="/khoa-hoc/"]')];

    expect(courseLinks).toHaveLength(49);
  });

  test('training program nodes expose verified details on hover and keyboard focus', () => {
    const { container } = render(<JourneyChart name="training" />);
    const programLinks = [
      ...container.querySelectorAll('svg a[data-node-key][aria-controls^="training-program-"]'),
    ];

    expect(programLinks).toHaveLength(5);
    expect(programLinks.map((link) => link.getAttribute('aria-label'))).toEqual([
      'GISA Core. Đào tạo chuyên môn. 15 khóa học trong danh mục. Nội dung, lợi ích và danh sách khóa học.',
      'GISA Edge. Trải nghiệm thực chiến. 8 khóa học trong danh mục. Nội dung, lợi ích và danh sách khóa học.',
      'GISA Rise. Bứt phá sự nghiệp. 8 khóa học trong danh mục. Nội dung, lợi ích và danh sách khóa học.',
      'GISA Ascend. Lãnh đạo thành công. 8 khóa học trong danh mục. Nội dung, lợi ích và danh sách khóa học.',
      'GISA Legacy. Sự nghiệp viên mãn. 10 khóa học trong danh mục. Nội dung, lợi ích và danh sách khóa học.',
    ]);

    programLinks.forEach((link) => {
      const panel = getControlledPanel(container, link);
      expect(panel).toHaveAttribute('data-morph-panel');
      expect(panel.getAttribute('aria-labelledby')?.split(/\s+/)).toContain(link.id);
    });
  });

  test('research exposes verified classification details after its entrance beat', () => {
    const { container } = render(<JourneyChart name="research" />);
    const publicationLinks = [
      ...container.querySelectorAll(
        'svg a[href^="/nghien-cuu/bai-bao-khoa-hoc/"], svg a[href^="/nghien-cuu/bai-bao-ung-dung/"]',
      ),
    ];
    const popovers = [...container.querySelectorAll('[id^="research-detail-"][data-morph-panel]')];

    expect(publicationLinks).toHaveLength(14);
    expect(popovers).toHaveLength(14);
    expect(popovers.filter((popover) => popover.textContent?.includes('Liên ngành'))).toHaveLength(7);
    expect(popovers.filter((popover) => popover.textContent?.includes('Đơn ngành'))).toHaveLength(7);
    expect(publicationLinks.every((link) => link.querySelector('image[href]'))).toBe(true);
    publicationLinks.forEach((link) => {
      expect(link.querySelector('g')?.style.getPropertyValue('--phase')).toBe('var(--phase-2, 1)');
    });
  });

  test('research distinguishes the sourced 2015 and 2016 pomelo studies', () => {
    const { container } = render(<JourneyChart name="research" />);
    const study2015 = container.querySelector(
      'a[href$="/chuoi-gia-tri-va-nang-luc-canh-tranh-buoi-da-xanh"]',
    );
    const study2016 = container.querySelector(
      'a[href$="/nghien-cuu-chuoi-gia-tri-buoi-da-xanh-ben-tre"]',
    );

    expect(study2015?.textContent).toContain('2015');
    expect(study2016?.textContent).toContain('2016');
    expect(study2015?.querySelector('image')?.getAttribute('href')).not.toBe(
      study2016?.querySelector('image')?.getAttribute('href'),
    );
  });

  test('research uses two continuous knowledge streams instead of loose record wires', () => {
    const { container } = render(<JourneyChart name="research" />);

    expect(container.querySelectorAll('[data-research-stream]')).toHaveLength(2);
  });

  test('consulting uses six external pictorial assets and one clean center label', () => {
    const { container } = render(<JourneyChart name="strategy" />);
    const icons = container.querySelectorAll('image[href^="/icons/consulting/"]');

    expect(icons).toHaveLength(6);
    expect([...icons].map((icon) => icon.getAttribute('href'))).toEqual([
      '/icons/consulting/sustainable-development.png',
      '/icons/consulting/management-business.png',
      '/icons/consulting/behavioral-psychology.png',
      '/icons/consulting/people-organization.png',
      '/icons/consulting/food-agriculture-rural.png',
      '/icons/consulting/economic-policy.png',
    ]);
    expect(container.textContent).toContain('29HẠNG MỤCTƯ VẤN');
    expect(container.textContent).not.toContain('DANH MỤC');
    expect(container.querySelectorAll('a[aria-label^="Xem hạng mục tư vấn:"]')).toHaveLength(0);
  });

  test('every visible journey category exposes a readable information panel', () => {
    visibleJourneyExpectations.forEach(([name, expected]) => {
      const { container, unmount } = render(<JourneyChart name={name} />);
      const triggers = getMorphTriggers(container);

      expect(triggers).toHaveLength(expected);
      triggers.forEach((trigger) => {
        const panel = getControlledPanel(container, trigger);
        expect(panel).toHaveAttribute('data-morph-panel');
        expect(panel.getAttribute('aria-labelledby')?.split(/\s+/)).toContain(trigger.id);
      });
      unmount();
    });
  });

  test('journey details use compact node-morph surfaces instead of detached wire cards', () => {
    visibleJourneyExpectations.forEach(([name, expected]) => {
      const { container, unmount } = render(<JourneyChart name={name} />);
      const cards = getMorphPanels(container);

      expect(cards).toHaveLength(expected);
      cards.forEach((card) => {
        expect(card.textContent?.trim().length).toBeGreaterThan(30);
        expect(card).not.toHaveAttribute('role', 'tooltip');
        expect(card.querySelector(':scope > svg')).toBeNull();
        expect(card.querySelector('[data-connector-side]')).toBeNull();
      });
      unmount();
    });
  });

  test('all five visible journeys remove the obsolete connector system', () => {
    visibleJourneyExpectations.forEach(([name]) => {
      const { container, unmount } = render(<JourneyChart name={name} />);

      expect(
        container.querySelectorAll(
          '[data-wire-key], [data-info-wire], [data-connector-side], [role="tooltip"]',
        ),
      ).toHaveLength(0);
      unmount();
    });
  });

  test('training, transfer and impact use pictorial medallion assets instead of drawn glyphs', () => {
    const { container: training } = render(<JourneyChart name="training" />);
    const { container: transfer } = render(<JourneyChart name="transfer" />);
    const { container: impact } = render(<JourneyChart name="impact" />);

    expect(training.querySelectorAll('image[href^="/icons/"]')).toHaveLength(5);
    expect(transfer.querySelectorAll('image[href^="/icons/"]')).toHaveLength(4);
    expect(impact.querySelectorAll('image[href^="/icons/"]')).toHaveLength(7);
    expect(impact.querySelectorAll('[data-morph-panel][data-morph-key]')).toHaveLength(8);
    expect(impact.querySelectorAll('foreignObject[role="tooltip"], [data-info-wire]')).toHaveLength(0);
    expect(impact.textContent).toContain('GISAKẾT NỐI');
  });
});

describe('JourneyChart node-morph contract', () => {
  visibleJourneyExpectations.forEach(([name, expected]) => {
    test(`${name} pairs every trigger with one labelled, complete panel and CTA`, () => {
      const { container } = render(<JourneyChart name={name} />);
      const root = getMorphRoot(container);
      const triggers = getMorphTriggers(container);
      const panels = getMorphPanels(container);

      expect(root).toHaveAttribute('data-journey-chart', name);
      expect(root).toHaveAttribute('data-open-key', '');
      expect(triggers).toHaveLength(expected);
      expect(panels).toHaveLength(expected);
      expect(new Set(triggers.map((trigger) => trigger.getAttribute('data-node-key'))).size).toBe(expected);
      expect(new Set(triggers.map((trigger) => trigger.getAttribute('aria-controls'))).size).toBe(expected);

      triggers.forEach((trigger) => {
        const key = trigger.getAttribute('data-node-key');
        const panel = getControlledPanel(container, trigger);
        const labelIds = panel.getAttribute('aria-labelledby')?.split(/\s+/) ?? [];
        const copy = [...panel.querySelectorAll('li')].map((item) => item.textContent?.trim() ?? '');
        const cta = panel.querySelector<HTMLAnchorElement>('a[data-morph-cta][href]');

        expect(key).toBeTruthy();
        expect(trigger.id).toBeTruthy();
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(panel).toHaveAttribute('data-morph-key', key);
        expect(panel).toHaveAttribute('data-open', 'false');
        expect(panel).toHaveAttribute('aria-hidden', 'true');
        expect(labelIds).toContain(trigger.id);
        labelIds.forEach((id) => expect(container.querySelector(`[id="${id}"]`)).not.toBeNull());

        expect(copy.length).toBeGreaterThanOrEqual(2);
        expect(copy.length).toBeLessThanOrEqual(4);
        expect(copy.every((line) => line.length >= 12)).toBe(true);
        copy.forEach((line) => expect(line).not.toMatch(/(?:…|\.{3})/));

        expect(cta).not.toBeNull();
        expect(cta).toHaveAccessibleName(/Xem (?:chi tiết|chương trình)/);
        expect(cta).toHaveAttribute('href', trigger.getAttribute('href'));
        expect(cta).toHaveAttribute('tabindex', '-1');
        expect(cta?.closest('svg')).toBeNull();
      });
    });

    test(`${name} opens on hover or focus, switches once, and Escape restores focus`, async () => {
      const user = userEvent.setup();
      const { container } = render(<JourneyChart name={name} />);
      const root = getMorphRoot(container);
      const [first, second] = getMorphTriggers(container);
      const firstPanel = getControlledPanel(container, first);
      const secondPanel = getControlledPanel(container, second);

      await user.hover(first);
      expect(root).toHaveAttribute('data-open-key', first.getAttribute('data-node-key'));
      expect(first).toHaveAttribute('aria-expanded', 'true');
      expect(firstPanel).toHaveAttribute('data-open', 'true');
      expect(firstPanel).toHaveAttribute('aria-hidden', 'false');

      await user.unhover(first);
      expect(root).toHaveAttribute('data-open-key', '');
      expect(first).toHaveAttribute('aria-expanded', 'false');

      act(() => first.focus());
      expect(first).toHaveFocus();
      expect(first).toHaveAttribute('aria-expanded', 'true');

      act(() => second.focus());
      expect(second).toHaveFocus();
      expect(root).toHaveAttribute('data-open-key', second.getAttribute('data-node-key'));
      expect(first).toHaveAttribute('aria-expanded', 'false');
      expect(second).toHaveAttribute('aria-expanded', 'true');
      expect(firstPanel).toHaveAttribute('data-open', 'false');
      expect(secondPanel).toHaveAttribute('data-open', 'true');
      expect(root.querySelectorAll('[data-morph-panel][data-open="true"]')).toHaveLength(1);
      expect(secondPanel).toHaveAccessibleName(second.getAttribute('aria-label') ?? '');

      const cta = secondPanel.querySelector<HTMLAnchorElement>('a[data-morph-cta][href]');
      expect(cta).toHaveAttribute('tabindex', '0');
      act(() => cta?.focus());
      expect(cta).toHaveFocus();

      await user.keyboard('{Escape}');
      expect(root).toHaveAttribute('data-open-key', '');
      expect(second).toHaveAttribute('aria-expanded', 'false');
      expect(secondPanel).toHaveAttribute('data-open', 'false');
      expect(secondPanel).toHaveAttribute('aria-hidden', 'true');
      expect(second).toHaveFocus();
    });

    test(`${name} touch opens, switches, and closes only after an outside press`, async () => {
      const user = userEvent.setup();
      const { container } = render(<JourneyChart name={name} />);
      const root = getMorphRoot(container);
      const [first, second] = getMorphTriggers(container);
      const firstPanel = getControlledPanel(container, first);
      const secondPanel = getControlledPanel(container, second);

      await user.pointer({ keys: '[TouchA]', target: first });
      expect(root).toHaveAttribute('data-open-key', first.getAttribute('data-node-key'));
      expect(first).toHaveAttribute('aria-expanded', 'true');
      expect(firstPanel).toHaveAttribute('aria-hidden', 'false');

      await user.pointer({ keys: '[TouchA]', target: second });
      expect(root).toHaveAttribute('data-open-key', second.getAttribute('data-node-key'));
      expect(first).toHaveAttribute('aria-expanded', 'false');
      expect(second).toHaveAttribute('aria-expanded', 'true');
      expect(firstPanel).toHaveAttribute('aria-hidden', 'true');
      expect(secondPanel).toHaveAttribute('aria-hidden', 'false');
      expect(root.querySelectorAll('[data-morph-panel][data-open="true"]')).toHaveLength(1);

      await user.pointer({ keys: '[TouchA]', target: document.body });
      expect(root).toHaveAttribute('data-open-key', '');
      expect(second).toHaveAttribute('aria-expanded', 'false');
      expect(secondPanel).toHaveAttribute('aria-hidden', 'true');
      expect(root.querySelectorAll('[data-morph-panel][data-open="true"]')).toHaveLength(0);
    });
  });

  test('opening a node in another journey closes the previous journey', () => {
    const { container } = render(
      <>
        <JourneyChart name="research" />
        <JourneyChart name="strategy" />
      </>,
    );
    const roots = [...container.querySelectorAll<HTMLElement>('[data-journey-chart][data-open-key]')];
    const researchTrigger = roots[0].querySelector<SVGElement>('[data-morph-trigger]')!;
    const strategyTrigger = roots[1].querySelector<SVGElement>('[data-morph-trigger]')!;

    act(() => researchTrigger.focus());
    expect(roots[0].getAttribute('data-open-key')).toBe(researchTrigger.dataset.nodeKey);

    act(() => strategyTrigger.focus());
    expect(roots[0]).toHaveAttribute('data-open-key', '');
    expect(roots[1].getAttribute('data-open-key')).toBe(strategyTrigger.dataset.nodeKey);
    expect(container.querySelectorAll('[data-morph-panel][data-open="true"]')).toHaveLength(1);
  });

  test('hover respects keyboard ownership and Escape closes a hover-only panel', async () => {
    const user = userEvent.setup();
    const { container } = render(<JourneyChart name="research" />);
    const root = getMorphRoot(container);
    const [first, second] = getMorphTriggers(container);

    act(() => first.focus());
    await user.hover(second);
    expect(root.getAttribute('data-open-key')).toBe(first.dataset.nodeKey);
    await user.unhover(second);
    expect(root.getAttribute('data-open-key')).toBe(first.dataset.nodeKey);

    act(() => first.blur());
    await user.hover(second);
    expect(root.getAttribute('data-open-key')).toBe(second.dataset.nodeKey);
    await user.keyboard('{Escape}');
    expect(root).toHaveAttribute('data-open-key', '');
  });

  test('Enter and Space open the panel CTA; outside close restores trigger focus', async () => {
    const user = userEvent.setup();
    const { container } = render(<JourneyChart name="research" />);
    const [first, second] = getMorphTriggers(container);

    act(() => first.focus());
    await user.keyboard('{Enter}');
    const firstCta = getControlledPanel(container, first).querySelector<HTMLAnchorElement>('[data-morph-cta]')!;
    expect(firstCta).toHaveFocus();

    await user.pointer({ keys: '[TouchA]', target: document.body });
    await waitFor(() => expect(first).toHaveFocus());
    expect(first).toHaveAttribute('aria-expanded', 'false');

    act(() => second.focus());
    await user.keyboard('[Space]');
    const secondCta = getControlledPanel(container, second).querySelector<HTMLAnchorElement>('[data-morph-cta]')!;
    expect(secondCta).toHaveFocus();
  });
});
