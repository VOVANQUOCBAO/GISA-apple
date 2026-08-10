/**
 * Six code-native SVG plates for the "TRI THỨC TẠO CHUYỂN BIẾN" story.
 *
 * `KnowledgeJourney` pins one 100vh viewport for a 600vh run and writes seven
 * scrubbed phases (`--phase-0` … `--phase-6`) onto whichever layer is on stage.
 * Every plate consumes those phases through CSS, so drawing stays reversible,
 * frame-accurate and free of React re-renders while the page scrolls.
 *
 * Geometry is traced from the reference plates at 1600 × 900. Coordinates are
 * therefore deliberate, not decorative — moving one without re-checking the
 * reference will drift the composition. Numbers never live here; they come from
 * `@/content/verified-metrics`.
 */

'use client';

import Image from 'next/image';
import {
  createContext,
  type CSSProperties,
  type PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { JourneyChartName } from '@/content/journey';
import { courseFixtures } from '@/content/fixtures/courses';
import { expertFixtures } from '@/content/fixtures/experts';
import { partnerFixtures } from '@/content/fixtures/partners';
import { projectFixtures } from '@/content/fixtures/projects';
import { publicationFixtures } from '@/content/fixtures/publications';
import { mangLuoiBlocks } from '@/content/static-blocks/mang-luoi';
import {
  applicationStreams,
  consultingPillars,
  researchItems,
  trainingPathway,
  verifiedNetworkClusters,
} from '@/content/verified-metrics';
import { toAnchorId } from '@/lib/anchor-id';

import styles from './journey-charts.module.css';
import { JourneyGlyph } from './journey-icons';

/** A 16:9 field matches the reference plates and the pinned stage. */
const VIEW_BOX = '0 0 1600 900';
const IMPACT_VIEW_BOX = '0 80 1600 720';
const COMMUNITY_INDEX_PATH = '/cong-dong';
const CONSULTING_INDEX_PATH = '/tu-van/linh-vuc';
const COURSE_INDEX_PATH = '/khoa-hoc';
const RESEARCH_INDEX_PATH = '/nghien-cuu/bai-bao-khoa-hoc';
const TRANSFER_INDEX_PATH = '/ung-dung/linh-vuc';

type MotionStyle = CSSProperties & {
  '--anchor-x'?: string;
  '--i'?: number;
  '--morph-left'?: string;
  '--morph-origin'?: string;
  '--morph-top'?: string;
  '--n'?: number;
  '--phase'?: string;
  '--tone'?: string;
};

interface EntityLink {
  href: string;
  label: string;
}

const researchLinks = new Map(
  researchItems.map((item, index) => [
    item.id,
    { href: publicationFixtures[index]?.path ?? RESEARCH_INDEX_PATH, label: item.title },
  ]),
);

const researchRecords = new Map(
  researchItems.map((item, index) => [item.id, publicationFixtures[index]]),
);

const trainingCourseLinks = trainingPathway.map((stage) =>
  courseFixtures
    .filter((course) => course.metadata?.program === stage.name)
    .map((course) => ({ href: course.path, label: course.title })),
);

const trainingProgramLinks = [
  '/dao-tao/gisa-core',
  '/dao-tao/gisa-edge',
  '/dao-tao/gisa-rise',
  '/dao-tao/gisa-ascend',
  '/dao-tao/gisa-legacy',
] as const;

const applicationLinkRoutes = [
  '/ung-dung/quan-ly-kinh-doanh',
  '/ung-dung/khoa-hoc-cong-nghe',
  '/ung-dung/kinh-te-ben-vung',
  '/ung-dung/tam-ly-phat-trien-con-nguoi',
] as const;

const transferStreamOrder = [2, 1, 3, 0] as const;

const fundLinkBlock = (mangLuoiBlocks['/mang-luoi/quy-nha-tai-tro'] ?? []).find(
  (block) => block.type === 'linkGroup',
);
const fundLinks: EntityLink[] = fundLinkBlock?.type === 'linkGroup'
  ? fundLinkBlock.links.map((link) => ({ href: link.href, label: link.label }))
  : [];

/** Bind an element to one scroll phase, optionally staggered inside it. */
function motion(phase: number, index = 0, total = 1): MotionStyle {
  return {
    '--i': index,
    '--n': Math.max(1, total),
    '--phase': `var(--phase-${phase}, 1)`,
  };
}

function tone(color: string, style?: MotionStyle): MotionStyle {
  return { ...style, '--tone': color };
}

function polar(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: Math.round((cx + Math.cos(radians) * radius) * 100) / 100,
    y: Math.round((cy + Math.sin(radians) * radius) * 100) / 100,
  };
}

interface JourneyMorphContextValue {
  openKey: string | null;
}

const JourneyMorphContext = createContext<JourneyMorphContextValue>({ openKey: null });
const JOURNEY_MORPH_OPEN_EVENT = 'journey-morph-open';

function findMorphTrigger(target: EventTarget | null) {
  return target instanceof Element
    ? target.closest<SVGElement>('[data-morph-trigger][data-node-key]')
    : null;
}

function findTriggerByKey(root: HTMLElement, key: string) {
  return [...root.querySelectorAll<SVGElement>('[data-morph-trigger][data-node-key]')]
    .find((trigger) => trigger.dataset.nodeKey === key);
}

/** One shared, delegated interaction model keeps every chart mutually exclusive. */
function JourneyMorphRoot({ children, name }: PropsWithChildren<{ name: JourneyChartName }>) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const rootId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const suppressFocusOpen = useRef(false);

  function restoreTriggerFocus(key: string) {
    const root = rootRef.current;
    if (!root) return;
    const trigger = findTriggerByKey(root, key);
    if (!trigger) return;

    suppressFocusOpen.current = true;
    trigger.focus({ preventScroll: true });
    queueMicrotask(() => {
      suppressFocusOpen.current = false;
    });
  }

  function openMorph(key: string) {
    document.dispatchEvent(new CustomEvent(JOURNEY_MORPH_OPEN_EVENT, { detail: { rootId } }));
    setOpenKey(key);
  }

  useEffect(() => {
    function closeFromOutside(event: PointerEvent) {
      const root = rootRef.current;
      if (root && event.target instanceof Node && !root.contains(event.target)) {
        const key = openKey;
        const outsideControl = event.target instanceof Element
          ? event.target.closest<HTMLElement>(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
          : null;
        if (key && !outsideControl && document.activeElement instanceof Node && root.contains(document.activeElement)) {
          window.setTimeout(() => restoreTriggerFocus(key), 0);
        }
        setOpenKey(null);
      }
    }

    function closeFromEscape(event: KeyboardEvent) {
      const key = openKey;
      if (event.key !== 'Escape' || !key) return;

      event.preventDefault();
      const root = rootRef.current;
      if (root && document.activeElement instanceof Node && root.contains(document.activeElement)) {
        restoreTriggerFocus(key);
      }
      setOpenKey(null);
    }

    function closeFromOtherJourney(event: Event) {
      const sourceRootId = (event as CustomEvent<{ rootId?: string }>).detail?.rootId;
      if (sourceRootId && sourceRootId !== rootId) setOpenKey(null);
    }

    document.addEventListener('pointerdown', closeFromOutside);
    document.addEventListener('keydown', closeFromEscape);
    document.addEventListener(JOURNEY_MORPH_OPEN_EVENT, closeFromOtherJourney);
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside);
      document.removeEventListener('keydown', closeFromEscape);
      document.removeEventListener(JOURNEY_MORPH_OPEN_EVENT, closeFromOtherJourney);
    };
  }, [openKey, rootId]);

  useEffect(() => {
    if (!openKey || !window.matchMedia('(max-width: 48rem)').matches) return;

    const frame = window.requestAnimationFrame(() => {
      const panel = rootRef.current?.querySelector<HTMLElement>(
        `[data-morph-panel][data-morph-key="${CSS.escape(openKey)}"]`,
      );
      panel?.scrollIntoView?.({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [openKey]);

  const value = useMemo(() => ({ openKey }), [openKey]);

  return (
    <JourneyMorphContext.Provider value={value}>
      <div
        className={styles.journeyMorphRoot}
        data-journey-chart={name}
        data-open-key={openKey ?? ''}
        onClickCapture={(event) => {
          const trigger = findMorphTrigger(event.target);
          if (
            !trigger
            || event.button !== 0
            || event.altKey
            || event.ctrlKey
            || event.metaKey
            || event.shiftKey
          ) return;

          event.preventDefault();
          const key = trigger.dataset.nodeKey;
          if (!key) return;
          openMorph(key);
        }}
        onFocusCapture={(event) => {
          if (suppressFocusOpen.current) return;
          const trigger = findMorphTrigger(event.target);
          const key = trigger?.dataset.nodeKey;
          if (key) openMorph(key);
        }}
        onKeyDownCapture={(event) => {
          if (event.key === 'Escape' && openKey) {
            event.preventDefault();
            event.stopPropagation();
            restoreTriggerFocus(openKey);
            setOpenKey(null);
            return;
          }

          if (event.key !== 'Enter' && event.key !== ' ') return;
          const trigger = findMorphTrigger(event.target);
          const key = trigger?.dataset.nodeKey;
          if (!trigger || !key) return;

          event.preventDefault();
          openMorph(key);
          queueMicrotask(() => {
            const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
            panel?.querySelector<HTMLElement>('[data-morph-cta]')?.focus({ preventScroll: true });
          });
        }}
        onPointerOver={(event) => {
          if (event.pointerType !== 'mouse') return;
          const root = rootRef.current;
          if (root && document.activeElement instanceof Element && root.contains(document.activeElement)) {
            const focusedTrigger = findMorphTrigger(document.activeElement);
            const focusedPanel = document.activeElement.closest<HTMLElement>('[data-morph-panel][data-morph-key]');
            const focusedKey = focusedTrigger?.dataset.nodeKey ?? focusedPanel?.dataset.morphKey;
            if (focusedKey) {
              openMorph(focusedKey);
              return;
            }
          }
          const key = findMorphTrigger(event.target)?.dataset.nodeKey;
          if (key) openMorph(key);
        }}
        onPointerOut={(event) => {
          if (event.pointerType !== 'mouse') return;
          const trigger = findMorphTrigger(event.target);
          const panel = event.target instanceof Element
            ? event.target.closest<HTMLElement>('[data-morph-panel][data-morph-key]')
            : null;
          const key = trigger?.dataset.nodeKey ?? panel?.dataset.morphKey;
          if (!key) return;

          const nextTarget = event.relatedTarget;
          if (nextTarget instanceof Element) {
            const nextTrigger = findMorphTrigger(nextTarget);
            const nextPanel = nextTarget.closest<HTMLElement>('[data-morph-panel][data-morph-key]');
            if (nextTrigger?.dataset.nodeKey === key || nextPanel?.dataset.morphKey === key) return;
          }
          const focusedTrigger = findMorphTrigger(document.activeElement);
          const focusedPanel = document.activeElement instanceof Element
            ? document.activeElement.closest<HTMLElement>('[data-morph-panel][data-morph-key]')
            : null;
          const focusedKey = focusedTrigger?.dataset.nodeKey ?? focusedPanel?.dataset.morphKey;
          if (focusedKey) {
            openMorph(focusedKey);
            return;
          }
          setOpenKey((current) => (current === key ? null : current));
        }}
        ref={rootRef}
      >
        {children}
      </div>
    </JourneyMorphContext.Provider>
  );
}

interface JourneyMorphTriggerProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'ref'> {
  accessibleLabel: string;
  dataKey: string;
  panelId: string;
}

function JourneyMorphTrigger({
  accessibleLabel,
  children,
  dataKey,
  panelId,
  ...props
}: JourneyMorphTriggerProps) {
  const { openKey } = useContext(JourneyMorphContext);

  return (
    <a
      {...props}
      aria-controls={panelId}
      aria-expanded={openKey === dataKey}
      aria-label={accessibleLabel}
      data-morph-trigger=""
      data-node-key={dataKey}
      id={`${panelId}-trigger`}
    >
      {children}
    </a>
  );
}

type MorphPanelStyle = CSSProperties & {
  '--morph-tone': string;
  '--morph-x'?: string;
  '--morph-y'?: string;
};

interface JourneyMorphPanelProps {
  anchor: 'left' | 'right';
  className?: string;
  dataKey: string;
  eyebrow: string;
  href: string;
  id: string;
  image?: string;
  lines: readonly string[];
  style: MorphPanelStyle;
  title: string;
}

/**
 * The selected node becomes the information surface itself. The capsule is
 * composed as two layers so its shell can finish expanding before readable
 * copy fades in, without scaling or distorting the typography.
 */
function JourneyMorphPanel({
  anchor,
  className,
  dataKey,
  eyebrow,
  href,
  id,
  image,
  lines,
  style,
  title,
}: JourneyMorphPanelProps) {
  const { openKey } = useContext(JourneyMorphContext);
  const isOpen = openKey === dataKey;

  return (
    <aside
      aria-hidden={!isOpen}
      aria-labelledby={`${id}-trigger`}
      className={`${styles.journeyMorphPanel}${className ? ` ${className}` : ''}`}
      data-anchor={anchor}
      data-morph-key={dataKey}
      data-morph-panel=""
      data-open={isOpen ? 'true' : 'false'}
      id={id}
      role="region"
      style={style}
    >
      <span aria-hidden="true" className={styles.journeyMorphPanelShell} />
      <div className={styles.journeyMorphPanelContent}>
        {image ? (
          <span className={styles.journeyMorphPanelImage}>
            <Image alt="" height={112} src={image} width={112} />
          </span>
        ) : null}
        <div className={styles.journeyMorphPanelCopy}>
          <span className={styles.journeyMorphPanelEyebrow}>{eyebrow}</span>
          <strong className={styles.journeyMorphPanelTitle}>{title}</strong>
          <ul className={styles.journeyMorphPanelList}>
            {lines.map((line) => <li key={line}>{line}</li>)}
          </ul>
          <a
            className={styles.journeyMorphPanelCta}
            data-morph-cta=""
            href={href}
            tabIndex={isOpen ? 0 : -1}
          >
            Xem chi tiết
          </a>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// 01 — Nghiên cứu: hai dãy hồ sơ, hai luồng tri thức, tổng 14
// ---------------------------------------------------------------------------

const researchBands = [
  researchItems.filter((item) => item.crossDisciplinary === true),
  researchItems.filter((item) => item.crossDisciplinary === false),
] as const;

const RESEARCH_STEP = 134;
const RESEARCH_X = Array.from({ length: 7 }, (_, index) => 344 + index * RESEARCH_STEP);
/** Two measured streams carry the records toward the shared research total. */
const RESEARCH_ROW_Y = [
  [238, 234, 242, 258, 278, 300, 320],
  [536, 532, 524, 510, 490, 462, 430],
] as const;
const RESEARCH_AVATAR_R = [43, 46, 48, 50, 48, 46, 43] as const;
const RESEARCH_STREAMS = [
  'M238 238C390 225 548 235 690 260C804 280 862 350 964 342C1084 332 1160 286 1320 328',
  'M238 536C398 548 550 528 690 504C812 482 870 404 974 408C1094 414 1170 452 1320 410',
] as const;
/**
 * The two pomelo entries are separate, sourced studies (2015 and 2016). Their
 * fixtures currently share one hero, so use the second pomelo photograph that
 * already ships in the research deck to keep the records visually distinct.
 * Items without sourced editorial art render as numbered avatars; unrelated
 * news/course imagery must never stand in for a research publication.
 */
const RESEARCH_MEDIA_OVERRIDES = new Map<string, string>([
  ['sustainable-dairy-com-b', '/images/knowledge-journey/research-avatars/sustainable-dairy-com-b.webp'],
  ['animal-welfare-wtp', '/images/knowledge-journey/research-avatars/animal-welfare-wtp.webp'],
  ['alternative-crops', '/images/knowledge-journey/research-avatars/alternative-crops.webp'],
  ['rca-nrca-competitiveness', '/images/knowledge-journey/research-avatars/rca-nrca-competitiveness.webp'],
  ['eu-food-quality-sustainability', '/images/knowledge-journey/research-avatars/eu-food-quality-sustainability.webp'],
  ['short-food-supply-chains-measurement', '/images/knowledge-journey/research-avatars/short-food-supply-chains-measurement.webp'],
  ['intra-industry-trade', '/images/knowledge-journey/research-avatars/intra-industry-trade.webp'],
  ['trade-specialisation', '/images/knowledge-journey/research-avatars/trade-specialisation.webp'],
  ['pomelo-value-chain-2016', '/images/knowledge-deck/research-pomelo-value-chain.webp'],
  ['short-food-supply-chains-framework', '/images/knowledge-journey/research-avatars/short-food-supply-chains-framework.webp'],
]);

/**
 * Concise, descriptive copy for the inline morph surface. Long publication
 * titles remain available to assistive technology and on the linked article;
 * this layer is deliberately scannable at journey scale.
 */
const RESEARCH_MORPH_CONTENT: Record<string, { title: string; lines: readonly [string, string] }> = {
  'benchmarking-pms': {
    title: 'Mô hình chuẩn đối sánh hiệu suất',
    lines: ['Đo hiệu suất trên ba trục: năng suất, quản lý và bền vững.', 'Phân tích thực tế tại doanh nghiệp đồ gỗ Việt Nam.'],
  },
  'food-quality-price-premium': {
    title: 'Chất lượng thực phẩm & chênh lệch giá',
    lines: ['So sánh sản phẩm PDO, PGI, hữu cơ với nhóm đối chứng.', 'Đo chênh lệch giá theo ngành và từng khâu giá trị.'],
  },
  'pomelo-value-chain-2015': {
    title: 'Chuỗi giá trị bưởi da xanh',
    lines: ['Lập bản đồ chuỗi giá trị bưởi tại Bến Tre.', 'Đánh giá đóng góp tài chính và năng lực cạnh tranh.'],
  },
  'ai-chatbot-experience': {
    title: 'Trải nghiệm khách hàng với AI',
    lines: ['Đánh giá chất lượng dịch vụ và cá nhân hóa thuật toán.', 'Kết nối trí tuệ cảm xúc với niềm tin khách hàng.'],
  },
  'sustainable-dairy-com-b': {
    title: 'Hành vi tiêu dùng sữa bền vững',
    lines: ['Ứng dụng COM-B để nhận diện động lực và rào cản.', 'Liên kết tâm lý hành vi với phát triển bền vững.'],
  },
  'animal-welfare-wtp': {
    title: 'Chi trả cho phúc lợi động vật',
    lines: ['Đo mức sẵn sàng trả thêm cho nhãn phúc lợi.', 'Kết hợp kinh tế thực phẩm và tâm lý lựa chọn.'],
  },
  'alternative-crops': {
    title: 'Lợi thế của cây trồng thay thế',
    lines: ['So sánh ba nhóm cây trồng bằng DRC, SCB và PAM.', 'Làm rõ lợi thế cạnh tranh tại Bến Tre.'],
  },
  'rca-nrca-competitiveness': {
    title: 'Năng lực cạnh tranh nông nghiệp',
    lines: ['Đo lợi thế xuất khẩu bằng RCA, NRCA và RTA.', 'Đối chiếu độ nhất quán giữa các chỉ số cạnh tranh.'],
  },
  'eu-food-quality-sustainability': {
    title: 'Hệ thống chất lượng thực phẩm EU',
    lines: ['Đánh giá đồng thời kinh tế, môi trường và xã hội.', 'Phân tích quản trị PDO, PGI và nông nghiệp hữu cơ.'],
  },
  'short-food-supply-chains-measurement': {
    title: 'Đo lường chuỗi cung ứng ngắn',
    lines: ['Đo ba chiều: kinh tế, môi trường và xã hội.', 'Tạo khung đánh giá cho chuỗi thực phẩm địa phương.'],
  },
  'intra-industry-trade': {
    title: 'Thương mại nội ngành nông nghiệp',
    lines: ['Phân tích động lực thương mại trong và giữa ngành.', 'Nghiên cứu trường hợp toàn diện tại Việt Nam.'],
  },
  'trade-specialisation': {
    title: 'Chuyên môn hóa thương mại nông nghiệp',
    lines: ['Theo dõi chuyên môn hóa bằng chỉ số Lafay.', 'Đối chiếu dữ liệu các nền kinh tế chuyển đổi.'],
  },
  'pomelo-value-chain-2016': {
    title: 'Giá trị gia tăng chuỗi bưởi Bến Tre',
    lines: ['Đo chi phí, lợi nhuận và giá trị theo từng khâu.', 'Nhận diện điểm nâng cấp cho chuỗi bưởi da xanh.'],
  },
  'short-food-supply-chains-framework': {
    title: 'Khung bền vững cho chuỗi cung ứng ngắn',
    lines: ['Sáu trụ cột với 28 chỉ số kinh tế và xã hội.', 'Bao quát việc làm, công bằng, sức khỏe và ô nhiễm.'],
  },
};

function ResearchCard({ index, item, row }: { index: number; item: (typeof researchItems)[number]; row: number }) {
  const cx = RESEARCH_X[index];
  const cy = RESEARCH_ROW_Y[row][index];
  const radius = RESEARCH_AVATAR_R[index];
  const record = researchRecords.get(item.id);
  const itemIndex = researchItems.findIndex((researchItem) => researchItem.id === item.id);
  const thumbnail = RESEARCH_MEDIA_OVERRIDES.get(item.id) ?? record?.image?.src;
  const clipId = `research-photo-${row}-${index}`;
  const panelId = `research-detail-${item.id}`;
  const classification = item.crossDisciplinary ? 'Liên ngành' : 'Đơn ngành';
  const link = researchLinks.get(item.id) ?? {
    href: '/nghien-cuu/bai-bao-khoa-hoc',
    label: item.title,
  };
  return (
    <JourneyMorphTrigger
      accessibleLabel={`Xem công trình nghiên cứu: ${link.label}. ${classification}${item.year ? `, ${item.year}` : ''}.`}
      className={`${styles.entityLink} ${styles.researchEntityLink}`}
      dataKey={String(itemIndex)}
      href={link.href}
      panelId={panelId}
    >
      <title>{link.label}</title>
      <desc>{`${classification}${item.year ? ` · ${item.year}` : ''}`}</desc>
      <g className={styles.researchCard} style={motion(2, index, 7)}>
        {thumbnail ? (
          <defs>
            <clipPath id={clipId}>
              <circle cx={cx} cy={cy} r={radius} />
            </clipPath>
          </defs>
        ) : null}
        <g className={styles.researchAvatar}>
          <circle className={styles.researchAvatarHalo} cx={cx} cy={cy} r={radius + 13} />
          <circle
            className={`${styles.entityHit} ${styles.researchAvatarHit}`}
            cx={cx}
            cy={cy}
            r={radius + 12}
          />
          <circle className={styles.researchAvatarShadow} cx={cx} cy={cy + 5} r={radius + 2} />
          <circle
            className={styles.researchAvatarFallback}
            cx={cx}
            cy={cy}
            fill={`url(#research-thumb-${(row * 7 + index) % RESEARCH_THUMBS.length})`}
            r={radius}
          />
          {thumbnail ? (
            <image
              className={styles.researchThumbPhoto}
              clipPath={`url(#${clipId})`}
              height={radius * 2}
              href={thumbnail}
              preserveAspectRatio="xMidYMid slice"
              width={radius * 2}
              x={cx - radius}
              y={cy - radius}
            />
          ) : (
            <text className={styles.researchAvatarIndex} textAnchor="middle" x={cx} y={cy + 8}>
              {String(itemIndex + 1).padStart(2, '0')}
            </text>
          )}
          <circle className={styles.researchThumbRing} cx={cx} cy={cy} r={radius} />
        </g>
      </g>
    </JourneyMorphTrigger>
  );
}

const RESEARCH_THUMBS = [
  ['#8ec45f', '#3f7526'],
  ['#7cb8de', '#1f5f92'],
  ['#6fa9cc', '#2d6788'],
  ['#5db2e8', '#125b96'],
  ['#8bbb8d', '#33704a'],
  ['#9cb3c4', '#3f5f78'],
];

function ResearchPlate() {
  return (
    <div className={styles.researchStage}>
      <svg
        aria-label={`Theo phân loại nội bộ dựa trên nội dung công trình: ${researchBands[0].length} nghiên cứu liên ngành và ${researchBands[1].length} nghiên cứu đơn ngành, hội tụ về tổng ${researchItems.length} công trình nghiên cứu.`}
        className={styles.plate}
        role="group"
        viewBox="0 0 1600 780"
      >
      <desc>Mở từng ảnh đại diện để xem tên, năm và căn cứ phân loại của công trình.</desc>
      <defs>
        <filter height="140%" id="research-media-depth" width="140%" x="-20%" y="-20%">
          <feDropShadow dx="0" dy="4" floodColor="#0f3554" floodOpacity=".22" stdDeviation="4" />
        </filter>
        <linearGradient id="research-chip-dark" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#082f53" />
          <stop offset="1" stopColor="#0d4c79" />
        </linearGradient>
        <linearGradient id="research-chip-blue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#07528d" />
          <stop offset="1" stopColor="#1584ca" />
        </linearGradient>
        <radialGradient cx="34%" cy="26%" id="research-medallion-face" r="78%">
          <stop offset="0" stopColor="#fffef9" />
          <stop offset=".7" stopColor="#f7edd9" />
          <stop offset="1" stopColor="#dfc894" />
        </radialGradient>
        <linearGradient id="research-medallion-gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff0b8" />
          <stop offset=".28" stopColor="#d2a24d" />
          <stop offset=".62" stopColor="#f7d988" />
          <stop offset="1" stopColor="#a96e20" />
        </linearGradient>
        <linearGradient id="research-stream-dark" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#063f72" />
          <stop offset=".58" stopColor="#0c5b91" />
          <stop offset="1" stopColor="#397e9a" />
        </linearGradient>
        <linearGradient id="research-stream-blue" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0879b9" />
          <stop offset=".55" stopColor="#1c85b8" />
          <stop offset="1" stopColor="#6f9f85" />
        </linearGradient>
        {RESEARCH_THUMBS.map(([light, deep], index) => (
          <radialGradient cx="32%" cy="22%" id={`research-thumb-${index}`} key={light} r="96%">
            <stop offset="0" stopColor={light} />
            <stop offset="0.55" stopColor={light} />
            <stop offset="1" stopColor={deep} />
          </radialGradient>
        ))}
      </defs>

      <circle className={styles.decorRing} cx="18" cy="710" r="27" />

      {/* Two continuous streams replace fourteen loose connector lines. */}
      {RESEARCH_STREAMS.map((path, row) => (
        <g className={styles.researchStreamGroup} data-research-stream={row} key={path} style={motion(row + 3)}>
          <path className={styles.researchStreamShadow} d={path} pathLength="1" />
          <path className={styles.researchStreamRim} d={path} pathLength="1" />
          <path
            className={`${styles.researchStream} ${row === 0 ? styles.researchStreamDark : styles.researchStreamBlue}`}
            d={path}
            pathLength="1"
          />
          <path className={styles.researchStreamLight} d={path} pathLength="1" />
        </g>
      ))}

      {/* nhãn hai dãy */}
      <g className={styles.researchChip} style={motion(2)}>
        <rect className={styles.researchChipShadow} height="112" rx="34" width="286" x="0" y="192" />
        <rect className={styles.researchChipFaceDark} height="112" rx="34" width="286" x="0" y="182" />
        <circle className={styles.researchChipMedallionShadow} cx="59" cy="243" r="37" />
        <circle className={styles.researchChipMedallionOuter} cx="59" cy="238" r="37" />
        <circle className={styles.researchChipMedallionFace} cx="59" cy="238" r="31" />
        <circle className={styles.researchChipMedallionRim} cx="59" cy="238" r="27" />
        <JourneyGlyph className={styles.researchChipGlyph} name="atom" size={0.76} x={59} y={238} />
        <path className={styles.researchChipDivider} d="M104 202v72" />
        <text className={styles.researchChipValue} x="121" y="236">{researchBands[0].length}</text>
        <text className={styles.researchChipLabel} x="121" y="266">LIÊN NGÀNH</text>
        <text className={styles.researchChipNote} x="121" y="286">PHÂN LOẠI NỘI BỘ</text>
      </g>
      <g className={styles.researchChip} style={motion(2)}>
        <rect className={styles.researchChipShadow} height="112" rx="34" width="286" x="0" y="490" />
        <rect className={styles.researchChipFaceBlue} height="112" rx="34" width="286" x="0" y="480" />
        <circle className={styles.researchChipMedallionShadow} cx="59" cy="541" r="37" />
        <circle className={styles.researchChipMedallionOuter} cx="59" cy="536" r="37" />
        <circle className={styles.researchChipMedallionFace} cx="59" cy="536" r="31" />
        <circle className={styles.researchChipMedallionRim} cx="59" cy="536" r="27" />
        <JourneyGlyph className={styles.researchChipGlyph} name="flask" size={0.76} x={59} y={536} />
        <path className={styles.researchChipDivider} d="M104 500v72" />
        <text className={styles.researchChipValue} x="121" y="534">{researchBands[1].length}</text>
        <text className={styles.researchChipLabel} x="121" y="564">ĐƠN NGÀNH</text>
        <text className={styles.researchChipNote} x="121" y="584">PHÂN LOẠI NỘI BỘ</text>
      </g>

      {researchBands.map((band, row) =>
        band.map((item, index) => <ResearchCard index={index} item={item} key={item.id} row={row} />),
      )}

      {/* tổng 14 */}
      <a aria-label="Xem toàn bộ 14 công trình nghiên cứu" className={styles.entityLink} href={RESEARCH_INDEX_PATH}>
      <g className={styles.researchTotalCard} style={motion(6)}>
        <rect className={styles.entityHit} height="284" rx="50" width="286" x="1300" y="250" />
        <rect className={styles.researchStack} height="248" rx="40" width="258" x="1288" y="278" />
        <rect className={styles.researchAccent} height="258" rx="40" width="252" x="1334" y="268" />
        <rect className={styles.researchTotalShadow} height="258" rx="42" width="258" x="1312" y="258" />
        <rect className={styles.researchTotalFace} height="258" rx="42" width="258" x="1302" y="250" />
        <rect className={styles.researchTotalRim} height="246" rx="37" width="246" x="1308" y="256" />
        <text className={styles.researchTotalValue} textAnchor="middle" x="1431" y="387">
          {researchItems.length}
        </text>
        <text className={styles.researchTotalLabel} textAnchor="middle" x="1431" y="438">CÔNG TRÌNH</text>
        <text className={styles.researchTotalLabel} textAnchor="middle" x="1431" y="476">NGHIÊN CỨU</text>
      </g>
      </a>
      </svg>
      <div className={styles.researchHtmlPopoverLayer}>
        {researchBands.flat().map((item, index) => {
          const record = researchRecords.get(item.id);
          const itemIndex = researchItems.findIndex((researchItem) => researchItem.id === item.id);
          const image = RESEARCH_MEDIA_OVERRIDES.get(item.id) ?? record?.image?.src;
          const classification = item.crossDisciplinary ? 'Liên ngành' : 'Đơn ngành';
          const rowIndex = item.crossDisciplinary ? 0 : 1;
          const columnIndex = index % RESEARCH_X.length;
          const extendsRight = columnIndex <= 3;
          const nodeX = 20 + (RESEARCH_X[columnIndex] / 1600) * 60;
          const nodeY = (RESEARCH_ROW_Y[rowIndex][columnIndex] / 780) * 100;
          const panelLeft = extendsRight ? nodeX - 4.2 : nodeX - 31.8;
          const content = RESEARCH_MORPH_CONTENT[item.id] ?? {
            title: item.title,
            lines: [item.disciplinaryBasis ?? classification, record?.summary ?? 'Xem toàn bộ nội dung nghiên cứu.'],
          };
          const href = researchLinks.get(item.id)?.href ?? RESEARCH_INDEX_PATH;
          return (
            <JourneyMorphPanel
              anchor={extendsRight ? 'right' : 'left'}
              className={styles.researchMorphPanel}
              dataKey={String(itemIndex)}
              eyebrow={`${classification}${item.year ? ` · ${item.year}` : ''}`}
              href={href}
              id={`research-detail-${item.id}`}
              image={image}
              key={item.id}
              lines={content.lines}
              style={{
                '--morph-tone': item.crossDisciplinary ? '#0d5d8e' : '#1688b7',
                '--morph-x': `${panelLeft.toFixed(2)}%`,
                '--morph-y': `${nodeY.toFixed(2)}%`,
              }}
              title={content.title}
            />
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 02 — Tư vấn: 29 có trước, sáu cánh mở từ phải sang trái
// ---------------------------------------------------------------------------

const STRATEGY_CENTER = { x: 800, y: 452 };
const STRATEGY_INNER = 150;
const STRATEGY_OUTER = 420;
const STRATEGY_ICON_RADIUS = (STRATEGY_INNER + STRATEGY_OUTER) / 2;
/** Corner radius of a petal, painted as a same-colour round-join stroke. */
const STRATEGY_ROUND = 18;
const STRATEGY_HALF = 29;

function strategyIcon(angle: number) {
  return {
    size: 112,
    ...polar(STRATEGY_CENTER.x, STRATEGY_CENTER.y, STRATEGY_ICON_RADIUS, angle),
  };
}

const STRATEGY_SECTORS = [
  { angle: -120, icon: strategyIcon(-120), phase: 1, tone: '#075638' },
  { angle: -60, icon: strategyIcon(-60), phase: 2, tone: '#489f32' },
  { angle: 0, icon: strategyIcon(0), phase: 3, tone: '#89ce1d' },
  { angle: 60, icon: strategyIcon(60), phase: 4, tone: '#ffb411' },
  { angle: 120, icon: strategyIcon(120), phase: 5, tone: '#d9aa24' },
  { angle: 180, icon: strategyIcon(180), phase: 6, tone: '#5a814d' },
];
const CONSULTING_ICON_ASSETS = [
  '/icons/consulting/sustainable-development.png',
  '/icons/consulting/management-business.png',
  '/icons/consulting/behavioral-psychology.png',
  '/icons/consulting/people-organization.png',
  '/icons/consulting/food-agriculture-rural.png',
  '/icons/consulting/economic-policy.png',
] as const;
const STRATEGY_MORPHS = [
  {
    anchor: 'left' as const,
    top: '28%',
    summary: ['Chiến lược dài hạn và tăng trưởng xanh', 'Đo lường tác động môi trường', 'Kinh tế tuần hoàn · ESG · CSV · CSR'],
  },
  {
    anchor: 'right' as const,
    top: '28%',
    summary: ['Chiến lược và tái cấu trúc tổ chức', 'Đổi mới sáng tạo · chuyển đổi số', 'Vận hành, thương hiệu và quản trị rủi ro'],
  },
  {
    anchor: 'right' as const,
    top: '50%',
    summary: ['Phân tích và thiết kế can thiệp hành vi', 'Giáo dục cảm xúc và sức khỏe tinh thần', 'Thay đổi tích cực, thích ứng bền vững'],
  },
  {
    anchor: 'right' as const,
    top: '72%',
    summary: ['Chiến lược nhân sự gắn mục tiêu tổ chức', 'Hiệu suất · năng lực · đào tạo kỹ năng', 'Văn hóa và hạnh phúc nơi làm việc'],
  },
  {
    anchor: 'left' as const,
    top: '72%',
    summary: ['Nông nghiệp bền vững và sinh kế bao trùm', 'Chuỗi giá trị công bằng, hiệu quả', 'An ninh lương thực và phát triển nông thôn'],
  },
  {
    anchor: 'left' as const,
    top: '50%',
    summary: ['Kinh tế vĩ mô, vùng và địa phương', 'Hệ sinh thái ngành và hỗ trợ doanh nghiệp', 'Nhân lực, hội nhập và năng lực cạnh tranh'],
  },
] as const;
const consultingTotal = consultingPillars.reduce((sum, pillar) => sum + pillar.listedItems, 0);

/**
 * Petal outline inset by `STRATEGY_ROUND` on every side. Stroking it with the
 * same colour at `2 × STRATEGY_ROUND` and a round join restores the true edges
 * and rounds all four corners — cheaper and more exact than arc-filleting.
 */
function strategySector(angle: number) {
  const inner = STRATEGY_INNER + STRATEGY_ROUND;
  const outer = STRATEGY_OUTER - STRATEGY_ROUND;
  const degrees = 180 / Math.PI;
  const insetIn = (STRATEGY_ROUND / inner) * degrees;
  const insetOut = (STRATEGY_ROUND / outer) * degrees;
  const a = polar(STRATEGY_CENTER.x, STRATEGY_CENTER.y, inner, angle - STRATEGY_HALF + insetIn);
  const b = polar(STRATEGY_CENTER.x, STRATEGY_CENTER.y, outer, angle - STRATEGY_HALF + insetOut);
  const c = polar(STRATEGY_CENTER.x, STRATEGY_CENTER.y, outer, angle + STRATEGY_HALF - insetOut);
  const d = polar(STRATEGY_CENTER.x, STRATEGY_CENTER.y, inner, angle + STRATEGY_HALF - insetIn);
  return `M${a.x} ${a.y}L${b.x} ${b.y}A${outer} ${outer} 0 0 1 ${c.x} ${c.y}L${d.x} ${d.y}A${inner} ${inner} 0 0 0 ${a.x} ${a.y}Z`;
}

function StrategyPlate() {
  return (
    <div className={styles.strategyStage}>
      <svg
        aria-label={`Sáu lĩnh vực tư vấn, tổng cộng ${consultingTotal} hạng mục: ${consultingPillars.map((item) => `${item.pillar} ${item.listedItems}`).join(', ')}.`}
        className={styles.plate}
        role="group"
        viewBox={VIEW_BOX}
      >
      <defs>
        <linearGradient id="strategy-gloss" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".32" />
          <stop offset=".4" stopColor="#ffffff" stopOpacity=".04" />
          <stop offset="1" stopColor="#071f2b" stopOpacity=".2" />
        </linearGradient>
        <linearGradient id="strategy-pill-gloss" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".3" />
          <stop offset=".48" stopColor="#ffffff" stopOpacity=".04" />
          <stop offset="1" stopColor="#062f29" stopOpacity=".12" />
        </linearGradient>
        <radialGradient id="strategy-plate-face" cx="42%" cy="34%" r="72%">
          <stop offset="0" stopColor="#fffefb" />
          <stop offset=".72" stopColor="#fbf7ef" />
          <stop offset="1" stopColor="#eee6da" />
        </radialGradient>
        <radialGradient id="strategy-dish-face" cx="43%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fffefb" />
          <stop offset=".75" stopColor="#f9f4eb" />
          <stop offset="1" stopColor="#e9dfd1" />
        </radialGradient>
        <radialGradient id="strategy-core-face" cx="42%" cy="32%" r="76%">
          <stop offset="0" stopColor="#fffefa" />
          <stop offset=".68" stopColor="#fbf7ef" />
          <stop offset="1" stopColor="#eee5d8" />
        </radialGradient>
        {STRATEGY_SECTORS.map((sector, index) => (
          <clipPath id={`consulting-icon-clip-${index}`} key={sector.angle}>
            <circle cx={sector.icon.x} cy={sector.icon.y} r={sector.icon.size / 2} />
          </clipPath>
        ))}
      </defs>
      <circle className={styles.decorRing} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y} r="458" />
      <circle className={styles.decorRing} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y} r="432" />

      {/* 29 xuất hiện trước */}
      <g className={styles.strategyCoreGroup} style={motion(0)}>
        <circle className={styles.strategyPlateShadow} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y + 15} r="438" />
        <circle className={styles.strategyPlateDisc} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y} r="438" />
        <circle className={styles.strategyPlateRim} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y} r="432" />
        <circle className={styles.strategyDish} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y} r="146" />
        <a
          aria-label="Xem toàn bộ 29 hạng mục tư vấn"
          className={styles.entityLink}
          href={CONSULTING_INDEX_PATH}
        >
          <circle className={styles.entityHit} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y} r="128" />
          <circle className={styles.strategyCoreHalo} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y + 5} r="106" />
          <circle className={styles.strategyCore} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y} r="94" />
          <circle className={styles.strategyCoreInnerRing} cx={STRATEGY_CENTER.x} cy={STRATEGY_CENTER.y} r="82" />
          <text className={styles.strategyTotal} textAnchor="middle" x={STRATEGY_CENTER.x} y={STRATEGY_CENTER.y + 3}>
            {consultingTotal}
          </text>
          <path className={styles.strategyCoreDivider} d={`M${STRATEGY_CENTER.x - 17} ${STRATEGY_CENTER.y + 22}h34`} />
          <text className={styles.strategyCoreLabel} textAnchor="middle" x={STRATEGY_CENTER.x} y={STRATEGY_CENTER.y + 46}>
            HẠNG MỤC
          </text>
          <text className={styles.strategyCoreSublabel} textAnchor="middle" x={STRATEGY_CENTER.x} y={STRATEGY_CENTER.y + 65}>
            TƯ VẤN
          </text>
        </a>
      </g>

      {consultingPillars.map((pillar, index) => {
        const sector = STRATEGY_SECTORS[index];
        const icon = sector.icon;
        const pillarHref = `/tu-van/linh-vuc#${toAnchorId(pillar.pillar)}`;
        const panelId = `consulting-pillar-detail-${index}`;
        return (
          <g className={styles.consultingPetal} key={pillar.pillar} style={tone(sector.tone, motion(sector.phase))}>
            <JourneyMorphTrigger
              accessibleLabel={`Xem lĩnh vực tư vấn ${pillar.pillar}`}
              className={`${styles.entityLink} ${styles.strategyPopoverTrigger}`}
              dataKey={String(index)}
              href={pillarHref}
              panelId={panelId}
            >
              <title>{pillar.pillar}</title>
              <path className={styles.strategySectorFrame} d={strategySector(sector.angle)} />
              <path className={styles.strategySectorShadow} d={strategySector(sector.angle)} />
              <path className={styles.strategySector} d={strategySector(sector.angle)} />
              <path className={styles.strategySectorGloss} d={strategySector(sector.angle)} />
              <path className={styles.strategySectorHighlight} d={strategySector(sector.angle)} />
              <circle
                className={styles.strategyIconFrame}
                cx={icon.x}
                cy={icon.y}
                r={icon.size / 2 + 23}
              />
              <circle
                className={styles.strategyIconBevel}
                cx={icon.x}
                cy={icon.y}
                r={icon.size / 2 + 14}
              />
              <image
                className={styles.strategyIconAsset}
                clipPath={`url(#consulting-icon-clip-${index})`}
                height={icon.size}
                href={CONSULTING_ICON_ASSETS[index]}
                preserveAspectRatio="xMidYMid slice"
                width={icon.size}
                x={icon.x - icon.size / 2}
                y={icon.y - icon.size / 2}
              />
              <circle
                className={styles.strategyIconRim}
                cx={icon.x}
                cy={icon.y}
                r={icon.size / 2 + 2}
              />
            </JourneyMorphTrigger>
          </g>
        );
      })}
      </svg>
      <div className={styles.strategyHtmlPopoverLayer}>
        {consultingPillars.map((pillar, index) => {
          const morph = STRATEGY_MORPHS[index];
          const sector = STRATEGY_SECTORS[index];
          const href = `/tu-van/linh-vuc#${toAnchorId(pillar.pillar)}`;
          return (
            <JourneyMorphPanel
              anchor={morph.anchor}
              className={styles.strategyMorphPanel}
              dataKey={String(index)}
              eyebrow={`${pillar.listedItems} hạng mục tư vấn`}
              href={href}
              id={`consulting-pillar-detail-${index}`}
              image={CONSULTING_ICON_ASSETS[index]}
              key={pillar.pillar}
              lines={morph.summary}
              style={{
                '--morph-tone': sector.tone,
                '--morph-y': morph.top,
              }}
              title={pillar.pillar}
            />
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 03 — Đào tạo: 49 có sẵn, bậc thang nâng dần, năm mốc bật lên
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Artwork-backed plates
// ---------------------------------------------------------------------------

/**
 * The selected visual is already a finished illustration. Rebuilding its
 * ceramic relief, enamel, gold trim and braided ribbons from SVG primitives
 * introduced visible drift, so the supplied artwork is now the visual source
 * of truth. The transparent SVG geometry below only provides semantic links,
 * keyboard focus and readable inline detail panels.
 */
const trainingTotal = trainingPathway.reduce((sum, stage) => sum + stage.listedCourses, 0);
/**
 * Training uses a wider artboard than the circular plates. At the desktop QA
 * viewport (1800 × 736) 2380 × 900 maps one-to-one onto the wrapper's 80vw
 * field, so the staircase reaches the exact 10% page gutters without stretching
 * circles or type. Each broad tread leaves a 70px hand-off for a soft S-curve.
 */
const TRAINING_VIEW_BOX = '0 -230 2380 1130';
const TRAINING_PLATFORM_W = 320;
const TRAINING_FLATS = [
  { x0: 170, x1: 340, y: 720 },
  { x0: 410, x1: 750, y: 570 },
  { x0: 820, x1: 1160, y: 490 },
  { x0: 1230, x1: 1570, y: 415 },
  { x0: 1640, x1: 1980, y: 335 },
  { x0: 2050, x1: 2314, y: 248 },
];
const TRAINING_STAGES = [
  {
    columns: 2,
    dark: '#0554b8',
    drop: 818,
    glyph: 'flask' as const,
    light: '#2c94f5',
    tone: '#1064d4',
    x: 580,
    y: 570,
  },
  {
    columns: 1,
    dark: '#0865cd',
    drop: 718,
    glyph: 'microscope' as const,
    light: '#2aa6f7',
    tone: '#1478e8',
    x: 990,
    y: 490,
  },
  {
    columns: 1,
    dark: '#0798cc',
    drop: 691,
    glyph: 'tubePlant' as const,
    light: '#52cdf7',
    tone: '#20addd',
    x: 1400,
    y: 415,
  },
  {
    columns: 1,
    dark: '#dc3f0e',
    drop: 643,
    glyph: 'barsArrow' as const,
    light: '#ff7d28',
    tone: '#f4511e',
    x: 1810,
    y: 335,
  },
  {
    columns: 1,
    dark: '#e88b00',
    drop: 578,
    glyph: 'trophy' as const,
    light: '#ffc43b',
    tone: '#f5a000',
    x: 2220,
    y: 248,
  },
];
const TRAINING_ICON_ASSETS = [
  '/icons/journey/training/core-flask.png',
  '/icons/journey/training/edge-microscope.png',
  '/icons/consulting/food-agriculture-rural.png',
  '/icons/consulting/management-business.png',
  '/icons/journey/training/legacy-trophy.png',
] as const;
const TRAINING_MORPH_LAYOUT = [
  { left: '8%', origin: '38% 66%', top: '32%' },
  { left: '25%', origin: '42% 66%', top: '25%' },
  { left: '42%', origin: '50% 66%', top: '18%' },
  { left: '58%', origin: '62% 66%', top: '12%' },
  { left: '65%', origin: '84% 66%', top: '6%' },
] as const;

const TRAINING_PATH = TRAINING_FLATS.reduce((path, flat, index) => {
  const head = index === 0 ? `M${flat.x0} ${flat.y}` : '';
  const line = `${head}H${flat.x1}`;
  const next = TRAINING_FLATS[index + 1];
  if (!next) return path + line;
  const bend = (flat.x1 + next.x0) / 2;
  return `${path}${line}C${bend} ${flat.y} ${bend} ${next.y} ${next.x0} ${next.y}`;
}, '');

function TrainingPlate() {
  const { openKey } = useContext(JourneyMorphContext);

  return (
    <div className={styles.trainingStageShell}>
      <svg
        aria-label={`Lộ trình năm chương trình gồm ${trainingTotal} khóa: ${trainingPathway.map((stage) => `${stage.name} ${stage.listedCourses}`).join(', ')}.`}
        className={`${styles.plate} ${styles.trainingPlate}`}
        role="group"
        viewBox={TRAINING_VIEW_BOX}
      >
      <defs>
        {/* Tight hand-off at the RISE → ASCEND riser: a wide cyan-to-orange
            blend crosses grey and would read as mud. */}
        <linearGradient gradientUnits="userSpaceOnUse" id="training-ribbon" x1="150" x2="2380">
          <stop offset="0" stopColor="#0d4fa8" />
          <stop offset="0.18" stopColor="#1064d4" />
          <stop offset="0.34" stopColor="#1478e8" />
          <stop offset="0.48" stopColor="#29b6f6" />
          <stop offset="0.628" stopColor="#35c0f7" />
          <stop offset="0.638" stopColor="#f4511e" />
          <stop offset="0.78" stopColor="#f57c1f" />
          <stop offset="0.9" stopColor="#fa9c22" />
          <stop offset="1" stopColor="#ffb300" />
        </linearGradient>
        <linearGradient id="training-platform-face" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.72" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#f5efe5" />
        </linearGradient>
        <linearGradient id="training-total-face" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.76" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#f2ebe0" />
        </linearGradient>
        {TRAINING_STAGES.map((spot, index) => (
          <radialGradient cx="30%" cy="22%" id={`training-medallion-${index}`} key={spot.tone} r="82%">
            <stop offset="0" stopColor={spot.light} />
            <stop offset="0.58" stopColor={spot.tone} />
            <stop offset="1" stopColor={spot.dark} />
          </radialGradient>
        ))}
        {TRAINING_STAGES.map((spot, index) => (
          <clipPath id={`training-icon-clip-${index}`} key={`clip-${spot.tone}`}>
            <circle cx={spot.x} cy={spot.y - 108} r="80" />
          </clipPath>
        ))}
      </defs>

      <circle className={styles.decorRing} cx="210" cy="672" r="195" />
      <circle className={styles.decorRing} cx="210" cy="672" r="165" />

      {/* bậc thang */}
      <path className={styles.trainingRibbonShadow} d={TRAINING_PATH} pathLength="1" style={motion(0)} />
      <path className={styles.trainingRibbonEdge} d={TRAINING_PATH} pathLength="1" style={motion(0)} />
      <path className={styles.trainingRibbonRim} d={TRAINING_PATH} pathLength="1" style={motion(0)} />
      <path className={styles.trainingRibbon} d={TRAINING_PATH} pathLength="1" style={motion(0)} />
      <path className={styles.trainingRibbonLine} d={TRAINING_PATH} pathLength="1" style={motion(0)} />

      {trainingPathway.map((stage, index) => {
        const spot = TRAINING_STAGES[index];
        const dropTop = spot.y + 88;
        const courses = trainingCourseLinks[index];
        const dots = courses.length;
        const rows = Math.ceil(dots / spot.columns);
        const panelId = `training-program-${stage.slug}`;
        const dataKey = String(index);
        return (
          <g
            className={styles.trainingStage}
            data-stage-key={String(index)}
            key={stage.slug}
            style={tone(spot.tone, motion(index + 2))}
          >
            <JourneyMorphTrigger
              accessibleLabel={`${stage.name}. ${stage.subtitle}. ${stage.listedCourses} khóa học trong danh mục. Nội dung, lợi ích và danh sách khóa học.`}
              className={`${styles.entityLink} ${styles.trainingProgramLink}`}
              dataKey={dataKey}
              href={trainingProgramLinks[index]}
              panelId={panelId}
            >
              <title>{`${stage.name} — ${stage.subtitle}`}</title>
              <rect
                className={styles.entityHit}
                height="260"
                rx="86"
                width={TRAINING_PLATFORM_W + 32}
                x={spot.x - TRAINING_PLATFORM_W / 2 - 16}
                y={spot.y - 224}
              />
              <rect
                className={styles.trainingPlatformShadow}
                height="120"
                rx="60"
                width={TRAINING_PLATFORM_W}
                x={spot.x - TRAINING_PLATFORM_W / 2}
                y={spot.y - 34}
              />
              <rect
                className={styles.trainingPlatformBase}
                height="116"
                rx="58"
                width={TRAINING_PLATFORM_W}
                x={spot.x - TRAINING_PLATFORM_W / 2}
                y={spot.y - 25}
              />
              <rect
                className={styles.trainingPlatformFace}
                height="120"
                rx="60"
                width={TRAINING_PLATFORM_W}
                x={spot.x - TRAINING_PLATFORM_W / 2}
                y={spot.y - 64}
              />
              <text className={styles.trainingPlatformLabel} textAnchor="middle" x={spot.x} y={spot.y + 16}>
                {stage.name.toUpperCase().replace(/^GISA\s+/, '')} · {stage.listedCourses}
              </text>
              <circle className={styles.trainingMedallionShadow} cx={spot.x} cy={spot.y - 96} r="92" />
              <circle className={styles.trainingMedallionRing} cx={spot.x} cy={spot.y - 108} r="92" />
              <circle
                className={styles.trainingMedallion}
                cx={spot.x}
                cy={spot.y - 108}
                r="81"
                style={{ fill: `url('#training-medallion-${index}')` }}
              />
              <image
                className={styles.trainingIconAsset}
                clipPath={`url(#training-icon-clip-${index})`}
                height="160"
                href={TRAINING_ICON_ASSETS[index]}
                preserveAspectRatio="xMidYMid slice"
                width="160"
                x={spot.x - 80}
                y={spot.y - 188}
              />
            </JourneyMorphTrigger>
            {courses.map((course, dot) => {
              const column = dot % spot.columns;
              const row = Math.floor(dot / spot.columns);
              const cx = spot.x + (column - (spot.columns - 1) / 2) * 18;
              const cy = dropTop + ((spot.drop - dropTop) * row) / Math.max(1, rows - 1);
              const isEnd = row === rows - 1;
              return (
                <a
                  aria-label={`Xem khóa học: ${course.label}`}
                  className={styles.entityLink}
                  href={course.href}
                  key={course.href}
                >
                  <title>{course.label}</title>
                  <circle className={styles.entityHit} cx={cx} cy={cy} r="15" />
                  <circle
                    className={isEnd ? styles.trainingDropEnd : styles.trainingDropDot}
                    cx={cx}
                    cy={cy}
                    r={isEnd ? 7.5 : 3.4}
                    style={motion(index + 2, dot, dots)}
                  />
                </a>
              );
            })}
            {spot.columns > 1 ? (
              <circle
                aria-hidden="true"
                className={styles.trainingDropEnd}
                cx={spot.x + 9}
                cy={spot.drop}
                r="7.5"
                style={motion(index + 2, rows - 1, rows)}
              />
            ) : null}
          </g>
        );
      })}

      {/* 49 có sẵn từ đầu chương */}
      <a aria-label="Xem toàn bộ 49 khóa học" className={styles.entityLink} href={COURSE_INDEX_PATH}>
      <g className={styles.trainingTotalCard}>
        <rect className={styles.entityHit} height="310" rx="72" width="410" x="0" y="500" />
        <rect className={styles.trainingTotalStack} height="250" rx="58" width="380" x="14" y="558" />
        <rect className={styles.trainingTotalStack} height="260" rx="60" width="380" x="22" y="546" />
        <rect className={styles.trainingTotalShadow} height="260" rx="58" width="380" x="22" y="560" />
        <rect className={styles.trainingTotalFace} height="260" rx="58" width="380" x="22" y="525" />
        <text className={styles.trainingTotalValue} textAnchor="middle" x="212" y="680">{trainingTotal}</text>
        <text className={styles.trainingTotalLabel} textAnchor="middle" x="212" y="748">KHÓA HỌC</text>
      </g>
      </a>
      </svg>
      <div className={styles.trainingHtmlPopoverLayer}>
        {trainingPathway.map((stage, index) => {
          const layout = TRAINING_MORPH_LAYOUT[index];
          const dataKey = String(index);
          const panelId = `training-program-${stage.slug}`;
          const isOpen = openKey === dataKey;
          return (
            <aside
              aria-hidden={!isOpen}
              aria-labelledby={`${panelId}-trigger`}
              className={styles.trainingMorphPanel}
              data-morph-key={dataKey}
              data-morph-panel=""
              data-open={isOpen ? 'true' : 'false'}
              id={panelId}
              key={stage.slug}
              role="region"
              style={{
                '--morph-left': layout.left,
                '--morph-origin': layout.origin,
                '--morph-top': layout.top,
                '--tone': TRAINING_STAGES[index].tone,
              } as MotionStyle}
            >
              <span className={styles.trainingMorphIdentity}>
                <span className={styles.trainingMorphMedallion}>
                  <Image alt="" height={160} src={TRAINING_ICON_ASSETS[index]} width={160} />
                </span>
                <span className={styles.trainingMorphHeading}>
                  <small>Chương trình đào tạo</small>
                  <strong>{stage.name}</strong>
                </span>
              </span>
              <span aria-hidden="true" className={styles.trainingMorphDivider} />
              <ul className={styles.trainingMorphFacts}>
                <li>
                  <b>01</b>
                  <span>{stage.subtitle}</span>
                </li>
                <li>
                  <b>02</b>
                  <span>{stage.listedCourses} khóa học trong danh mục</span>
                </li>
                <li>
                  <b>03</b>
                  <span>Nội dung, lợi ích &amp; danh sách khóa học</span>
                </li>
              </ul>
              <a
                className={styles.journeyMorphPanelCta}
                data-morph-cta=""
                href={trainingProgramLinks[index]}
                tabIndex={isOpen ? 0 : -1}
              >
                Xem chương trình
              </a>
            </aside>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 04 — Chuyển giao: GISA mở ra bốn dải, bốn thẻ đích bật lần lượt
// ---------------------------------------------------------------------------

const TRANSFER_VIEW_BOX = '33.43 60 1559 780';
const TRANSFER_SOURCE = { h: 230, w: 220, x: 45, y: 345 };
const TRANSFER_TARGETS = [
  {
    accent: '#58a86b',
    accentSoft: '#a7d7aa',
    cardEnd: '#124a35',
    cardStart: '#287956',
    from: -55,
    glyph: 'leaf' as const,
    label: 'Công nghệ xanh',
    stream: transferStreamOrder[0],
    y: 205,
  },
  {
    accent: '#18aeb8',
    accentSoft: '#8bd7da',
    cardEnd: '#075563',
    cardStart: '#087f88',
    from: -15,
    glyph: 'monitorChart' as const,
    label: 'Giải pháp số',
    stream: transferStreamOrder[1],
    y: 375,
  },
  {
    accent: '#328dcc',
    accentSoft: '#9bcce8',
    cardEnd: '#143e68',
    cardStart: '#1b6f9c',
    from: 25,
    glyph: 'checklist' as const,
    label: 'Quy trình mới',
    stream: transferStreamOrder[2],
    y: 545,
  },
  {
    accent: '#f26f33',
    accentSoft: '#f7b17f',
    cardEnd: '#74351f',
    cardStart: '#b64d27',
    from: 55,
    glyph: 'lineChart' as const,
    label: 'Mô hình kinh doanh',
    stream: transferStreamOrder[3],
    y: 715,
  },
];
const TRANSFER_ICON_ASSETS = [
  '/icons/consulting/sustainable-development.png',
  '/icons/journey/transfer/digital-solutions.png',
  '/icons/journey/transfer/new-process.png',
  '/icons/consulting/management-business.png',
] as const;
const TRANSFER_BANDS = [
  ['#23734f', '#58a86b', '#a7d7aa'],
  ['#08727b', '#18aeb8', '#8bd7da'],
  ['#1b6697', '#328dcc', '#9bcce8'],
  ['#bd4e26', '#f26f33', '#f7b17f'],
];
const TRANSFER_MORPH_COPY = [
  ['Sáng kiến kinh tế bền vững', 'Ứng dụng bằng công nghệ và vận hành xanh', 'Định tính — không biểu thị tỷ trọng'],
  ['Khoa học và công nghệ đổi mới', 'Chuyển tri thức thành giải pháp số', 'Định tính — không biểu thị tỷ trọng'],
  ['Tâm lý và phát triển con người', 'Chuẩn hóa thành quy trình có thể áp dụng', 'Định tính — không biểu thị tỷ trọng'],
  ['Quản lý và kinh doanh tiên tiến', 'Chuyển hóa thành mô hình vận hành thực tiễn', 'Định tính — không biểu thị tỷ trọng'],
] as const;

type TransferTargetStyle = MotionStyle & {
  '--transfer-accent': string;
  '--transfer-accent-soft': string;
};

function TransferPlate() {
  const sourceMid = TRANSFER_SOURCE.y + TRANSFER_SOURCE.h / 2;
  const sourceEdge = TRANSFER_SOURCE.x + TRANSFER_SOURCE.w;
  return (
    <div className={styles.transferStageShell}>
      <svg
        aria-label={`GISA chuyển giao tri thức vào bốn hướng ứng dụng không có trọng số: ${applicationStreams.map((stream) => stream.label).join(', ')}.`}
        className={`${styles.plate} ${styles.transferPlate}`}
        role="group"
        viewBox={TRANSFER_VIEW_BOX}
      >
      <defs>
        {TRANSFER_BANDS.map(([start, middle, end], index) => (
          <linearGradient gradientUnits="userSpaceOnUse" id={`transfer-band-${index}`} key={index} x1="290" x2="1130">
            <stop offset="0" stopColor={start} />
            <stop offset="0.52" stopColor={middle} />
            <stop offset="1" stopColor={end} />
          </linearGradient>
        ))}
        {TRANSFER_TARGETS.map((target, index) => (
          <g key={target.label}>
            <linearGradient id={`transfer-card-${index}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor={target.cardStart} />
              <stop offset="1" stopColor={target.cardEnd} />
            </linearGradient>
            <clipPath id={`transfer-icon-clip-${index}`}>
              <circle cx="1239" cy={target.y} r="38" />
            </clipPath>
          </g>
        ))}
        <linearGradient id="transfer-spectrum" x1="0" x2="1">
          <stop offset="0" stopColor="#58a86b" />
          <stop offset="0.35" stopColor="#18aeb8" />
          <stop offset="0.68" stopColor="#328dcc" />
          <stop offset="1" stopColor="#f26f33" />
        </linearGradient>
        <linearGradient id="transfer-source" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#1b6b8d" />
          <stop offset="0.58" stopColor="#115875" />
          <stop offset="1" stopColor="#0b4567" />
        </linearGradient>
      </defs>

      <circle className={`${styles.decorRing} ${styles.transferRing}`} cx="188" cy="460" r="152" />
      <circle className={`${styles.decorRing} ${styles.transferRing}`} cx="188" cy="460" r="122" />

      {TRANSFER_TARGETS.map((target, index) => {
        const startY = sourceMid + target.from;
        const band = `M${sourceEdge} ${startY}C490 ${startY} 585 ${target.y} 850 ${target.y}L1178 ${target.y}`;
        const sheen = `M${sourceEdge} ${startY}C490 ${startY} 585 ${target.y} 850 ${target.y}L1088 ${target.y}`;
        const stream = applicationStreams[target.stream];
        const href = applicationLinkRoutes[target.stream];
        const panelId = `transfer-detail-${index}`;
        const targetStyle: TransferTargetStyle = {
          ...motion(index + 2),
          '--transfer-accent': target.accent,
          '--transfer-accent-soft': target.accentSoft,
        };
        return (
          <JourneyMorphTrigger
            accessibleLabel={`Xem lĩnh vực ứng dụng: ${stream.label}`}
            className={`${styles.entityLink} ${styles.transferEntityLink}`}
            dataKey={String(index)}
            href={href}
            key={target.label}
            panelId={panelId}
          >
            <title>{stream.label}</title>
            <path className={styles.transferBandShadow} d={band} pathLength="1" style={motion(index + 1)} />
            <path className={styles.transferBandRim} d={band} pathLength="1" style={motion(index + 1)} />
            <path
              className={styles.transferBand}
              d={band}
              pathLength="1"
              stroke={`url(#transfer-band-${index})`}
              style={motion(index + 1)}
            />
            <path className={styles.transferBandHit} d={band} />
            <path className={styles.transferBandLine} d={sheen} pathLength="1" style={motion(index + 1)} />
            <path
              className={styles.transferArrow}
              d={`M1088 ${target.y}h29M1107 ${target.y - 10} 1118 ${target.y} 1107 ${target.y + 10}`}
              style={motion(index + 1)}
            />
            <g className={styles.transferTarget} style={targetStyle}>
              <g className={styles.transferTargetSurface}>
                <rect className={styles.entityHit} height="178" rx="44" width="450" x="1155" y={target.y - 89} />
                <rect className={styles.transferAccent} height="130" rx="36" width="414" x="1190" y={target.y - 64} />
                <rect className={styles.transferCardShadow} height="150" rx="40" width="420" x="1165" y={target.y - 61} />
                <rect
                  className={styles.transferCard}
                  fill={`url(#transfer-card-${index})`}
                  height="150"
                  rx="40"
                  width="420"
                  x="1165"
                  y={target.y - 75}
                />
                <circle className={styles.transferIconDisc} cx="1239" cy={target.y} r="42" />
                <circle className={styles.transferIconRing} cx="1239" cy={target.y} r="34" />
                <image
                  className={styles.transferIconAsset}
                  clipPath={`url(#transfer-icon-clip-${index})`}
                  height="76"
                  href={TRANSFER_ICON_ASSETS[index]}
                  preserveAspectRatio="xMidYMid slice"
                  width="76"
                  x="1201"
                  y={target.y - 38}
                />
                <path className={styles.transferDivider} d={`M1309 ${target.y - 42}v84`} />
                <text className={styles.transferLabel} x="1343" y={target.y + 9}>{target.label}</text>
              </g>
            </g>
          </JourneyMorphTrigger>
        );
      })}

      <a aria-label="Xem toàn bộ lĩnh vực ứng dụng của GISA" className={styles.entityLink} href={TRANSFER_INDEX_PATH}>
      <g className={styles.transferSource} style={motion(0)}>
        <rect
          className={styles.entityHit}
          height={TRANSFER_SOURCE.h + 24}
          rx="38"
          width={TRANSFER_SOURCE.w + 24}
          x={TRANSFER_SOURCE.x - 12}
          y={TRANSFER_SOURCE.y - 12}
        />
        <rect
          className={styles.transferSourceShadow}
          height={TRANSFER_SOURCE.h}
          rx="30"
          width={TRANSFER_SOURCE.w}
          x={TRANSFER_SOURCE.x}
          y={TRANSFER_SOURCE.y + 12}
        />
        <rect
          className={styles.transferSourceStack}
          height={TRANSFER_SOURCE.h}
          rx="36"
          width={TRANSFER_SOURCE.w}
          x={TRANSFER_SOURCE.x - 8}
          y={TRANSFER_SOURCE.y + 7}
        />
        <rect
          className={styles.transferSourceFace}
          height={TRANSFER_SOURCE.h}
          rx="36"
          width={TRANSFER_SOURCE.w}
          x={TRANSFER_SOURCE.x}
          y={TRANSFER_SOURCE.y}
        />
        <text
          className={styles.transferSourceLabel}
          textAnchor="middle"
          x={TRANSFER_SOURCE.x + TRANSFER_SOURCE.w / 2}
          y={sourceMid + 15}
        >
          GISA
        </text>
        <path className={styles.transferSourceSpectrum} d={`M92 ${sourceMid + 53}h126`} />
      </g>
      </a>
      </svg>
      <div className={styles.transferHtmlPopoverLayer}>
        {TRANSFER_TARGETS.map((target, index) => {
          const anchorY = ((target.y - 60) / 780) * 100;
          const href = applicationLinkRoutes[target.stream];
          return (
            <JourneyMorphPanel
              anchor="left"
              className={styles.transferMorphPanel}
              dataKey={String(index)}
              eyebrow="Hướng chuyển giao"
              href={href}
              id={`transfer-detail-${index}`}
              image={TRANSFER_ICON_ASSETS[index]}
              key={target.label}
              lines={TRANSFER_MORPH_COPY[index]}
              style={{
                '--morph-tone': target.accent,
                '--morph-y': `${anchorY}%`,
              }}
              title={target.label}
            />
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 05 — Mạng lưới: chuyên gia → tổ chức → dự án → quỹ & nhà tài trợ
// ---------------------------------------------------------------------------

const [expertCluster, orgCluster, projectCluster, fundCluster] = verifiedNetworkClusters;
const NETWORK_EXPERT_R = 18;
const NETWORK_ORG_R = 15;
const NETWORK_PROJECT_R = 58;

/** Five calm avatar trays, four future portrait slots in each tray. */
const NETWORK_EXPERT_PODS = [
  { x: 145, y: 238 },
  { x: 165, y: 342 },
  { x: 145, y: 446 },
  { x: 165, y: 550 },
  { x: 145, y: 654 },
] as const;
const NETWORK_EXPERT_OFFSETS = [
  { x: -72, y: 0 },
  { x: -24, y: 0 },
  { x: 24, y: 0 },
  { x: 72, y: 0 },
] as const;
const networkExperts = NETWORK_EXPERT_PODS.flatMap((pod, podIndex) =>
  NETWORK_EXPERT_OFFSETS.map((offset, slot) => ({
    podIndex,
    slot,
    x: pod.x + offset.x,
    y: pod.y + offset.y,
  })),
);

/** Eight six-node constellations placed on the upper and lower orbital rails. */
const NETWORK_ORG_CLUSTERS = [
  { x: 390, y: 268 },
  { x: 555, y: 232 },
  { x: 1045, y: 232 },
  { x: 1210, y: 268 },
  { x: 390, y: 628 },
  { x: 555, y: 664 },
  { x: 1045, y: 664 },
  { x: 1210, y: 628 },
] as const;
const NETWORK_ORG_OFFSETS = [
  { x: -29, y: -17 },
  { x: 0, y: -32 },
  { x: 29, y: -17 },
  { x: 29, y: 17 },
  { x: 0, y: 32 },
  { x: -29, y: 17 },
] as const;
const networkOrgs = NETWORK_ORG_CLUSTERS.flatMap((cluster, clusterIndex) =>
  NETWORK_ORG_OFFSETS.map((offset, slot) => ({
    clusterIndex,
    slot,
    x: cluster.x + offset.x,
    y: cluster.y + offset.y,
  })),
);

const networkProjects = [
  { x: 800, y: 278 },
  { x: 625, y: 448 },
  { x: 975, y: 448 },
  { x: 800, y: 618 },
] as const;
const NETWORK_PROJECT_MEDIA = [
  '/icons/gisa-trade4sd-icon.png',
  '/icons/gisa-valumics-icon.png',
  '/icons/gisa-strength2food-icon.png',
  '/icons/research-british-council.png',
] as const;

/** Eleven empty logo wells, ready for verified fund and sponsor artwork. */
const networkFunds = Array.from({ length: fundCluster.memberCount }, (_, index) => ({
  x: 1402 + (index % 2) * 92,
  y: 236 + Math.floor(index / 2) * 82 + (index % 2) * 18,
}));

const NETWORK_METRICS = [
  { label: 'CHUYÊN GIA', value: expertCluster.memberCount, x: 145, y: 120 },
  { label: 'TỔ CHỨC', value: orgCluster.memberCount, x: 800, y: 106 },
  { label: 'QUỸ & NHÀ TÀI TRỢ', value: fundCluster.memberCount, x: 1448, y: 120 },
] as const;
const NETWORK_EXPERT_POD_TONES = ['#0b3b67', '#007c83', '#0b3b67', '#007c83', '#0b3b67'] as const;
const NETWORK_ORG_TONES = ['#0b3b67', '#007c83', '#20b7d8', '#007c83', '#63a644', '#e5a521', '#f36b2b', '#63a644'] as const;
const NETWORK_PROJECT_RINGS = ['#007c83', '#20b7d8', '#f36b2b', '#63a644'];
const NETWORK_FUND_TONES = [
  '#0b3b67',
  '#10486f',
  '#145579',
  '#12657e',
  '#08747f',
  '#007c83',
  '#07898e',
  '#0f969b',
  '#16a2aa',
  '#1aacc1',
  '#20b7d8',
] as const;

/**
 * Four macro flows only. Each is a broad molded band with two restrained inner
 * strands; none of them claims a verified entity-to-entity relationship.
 */
const NETWORK_FLOW_BANDS = [
  {
    d: 'M267 446C390 414 510 417 625 448',
    strandA: 'M267 441C390 409 510 412 625 443',
    strandB: 'M267 451C390 419 510 422 625 453',
    tone: 'url(#network-flow-expert)',
  },
  {
    d: 'M448 252C566 202 687 216 800 278',
    strandA: 'M447 247C566 197 687 211 801 273',
    strandB: 'M449 257C566 207 687 221 799 283',
    tone: 'url(#network-flow-upper)',
  },
  {
    d: 'M448 644C566 694 687 680 800 618',
    strandA: 'M447 649C566 699 687 685 801 623',
    strandB: 'M449 639C566 689 687 675 799 613',
    tone: 'url(#network-flow-lower)',
  },
  {
    d: 'M975 448C1098 424 1228 425 1350 448',
    strandA: 'M975 443C1098 419 1228 420 1350 443',
    strandB: 'M975 453C1098 429 1228 430 1350 453',
    tone: 'url(#network-flow-funder)',
  },
] as const;

function networkFineCurve(
  from: { x: number; y: number },
  to: { x: number; y: number },
  bias = 0,
) {
  const span = to.x - from.x;
  return `M${from.x} ${from.y}C${from.x + span * 0.38} ${from.y + bias} ${from.x + span * 0.68} ${to.y - bias} ${to.x} ${to.y}`;
}

function NetworkPlate() {
  return (
    <svg
      aria-label={`Mạng lưới GISA gồm bốn nhóm riêng biệt: ${verifiedNetworkClusters.map((cluster) => `${cluster.memberCount} ${cluster.unit}`).join(', ')}. Các nhóm không được cộng thành một tổng.`}
      className={`${styles.plate} ${styles.networkPlate}`}
      role="group"
      viewBox="0 72 1600 664"
    >
      <desc>Các slot chuyên gia, tổ chức và quỹ được để trống để bổ sung ảnh hoặc logo đã xác minh sau này. Ảnh dự án lấy từ dữ liệu GISA hiện có. Đường nối chỉ mô tả cấu trúc trực quan, không tuyên bố quan hệ đã được kiểm chứng giữa từng thực thể.</desc>
      <defs>
        <linearGradient id="network-slot-face" x1="0" x2="0.75" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.65" stopColor="#fbf8f2" />
          <stop offset="1" stopColor="#eee8df" />
        </linearGradient>
        <linearGradient id="network-panel-face" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.82" />
          <stop offset="1" stopColor="#f4eee6" stopOpacity="0.68" />
        </linearGradient>
        <linearGradient id="network-project-face" x1="0" x2="0.72" y1="0" y2="1">
          <stop offset="0" stopColor="#fffefb" />
          <stop offset="1" stopColor="#f5efe7" />
        </linearGradient>
        <linearGradient id="network-fund-face" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fffefa" />
          <stop offset="1" stopColor="#f3eee7" />
        </linearGradient>
        <linearGradient id="network-compass-frame" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fffefa" />
          <stop offset="0.52" stopColor="#e9dfd2" />
          <stop offset="1" stopColor="#fbf6ef" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="network-flow-expert" x1="267" x2="625" y1="446" y2="448">
          <stop offset="0" stopColor="#0b3b67" stopOpacity="0.66" />
          <stop offset="1" stopColor="#007c83" stopOpacity="0.58" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="network-flow-upper" x1="448" x2="800" y1="252" y2="278">
          <stop offset="0" stopColor="#20b7d8" stopOpacity="0.58" />
          <stop offset="1" stopColor="#007c83" stopOpacity="0.64" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="network-flow-lower" x1="448" x2="800" y1="644" y2="618">
          <stop offset="0" stopColor="#63a644" stopOpacity="0.58" />
          <stop offset="1" stopColor="#007c83" stopOpacity="0.64" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="network-flow-funder" x1="975" x2="1350" y1="448" y2="448">
          <stop offset="0" stopColor="#f36b2b" stopOpacity="0.68" />
          <stop offset="1" stopColor="#e5a521" stopOpacity="0.54" />
        </linearGradient>
        {networkProjects.map((point, index) => (
          <clipPath id={`network-project-image-${index}`} key={`network-project-image-${index}`}>
            <circle cx={point.x} cy={point.y} r={NETWORK_PROJECT_R - 15} />
          </clipPath>
        ))}
      </defs>

      {NETWORK_METRICS.map((metric, index) => (
        <g className={styles.networkHeading} key={metric.label} style={motion(index === 2 ? 6 : index * 2)}>
          <text className={styles.networkValue} textAnchor="middle" x={metric.x} y={metric.y}>{metric.value}</text>
          <text className={styles.networkLabel} textAnchor="middle" x={metric.x} y={metric.y + 30}>{metric.label}</text>
          <path className={styles.networkMetricRule} d={`M${metric.x - 58} ${metric.y + 44}H${metric.x + 58}`} />
          <circle className={styles.networkMetricSpark} cx={metric.x} cy={metric.y + 44} r="3.5" />
        </g>
      ))}

      <g aria-hidden="true">
        <rect className={styles.networkSidePanelShadow} height="540" rx="44" width="272" x="18" y="176" />
        <rect className={styles.networkSidePanel} height="540" rx="44" width="272" x="18" y="176" />
        <rect className={styles.networkSidePanelShadow} height="540" rx="44" width="210" x="1354" y="176" />
        <rect className={styles.networkSidePanel} height="540" rx="44" width="210" x="1354" y="176" />
        <path className={styles.networkOrbitShadow} d="M286 350C430 222 612 205 800 278C988 205 1170 222 1328 350" />
        <path className={styles.networkOrbitRail} d="M286 350C430 222 612 205 800 278C988 205 1170 222 1328 350" />
        <path className={styles.networkOrbitShadow} d="M286 546C430 674 612 691 800 618C988 691 1170 674 1328 546" />
        <path className={styles.networkOrbitRail} d="M286 546C430 674 612 691 800 618C988 691 1170 674 1328 546" />
        {NETWORK_FLOW_BANDS.map((band, index) => (
          <g
            className={styles.networkFlowGroup}
            key={`network-band-${index}`}
            style={tone(band.tone, motion(index + 1))}
          >
            <path className={styles.networkFlowBandShadow} d={band.d} pathLength="1" />
            <path className={styles.networkFlowBand} d={band.d} pathLength="1" />
            <path className={styles.networkFlowStrand} d={band.strandA} pathLength="1" />
            <path className={styles.networkFlowStrand} d={band.strandB} pathLength="1" />
          </g>
        ))}
        <circle className={styles.networkFlowSpark} cx="574" cy="437" r="5" />
        <circle className={styles.networkFlowSpark} cx="1322" cy="442" r="5" />
      </g>

      {NETWORK_EXPERT_PODS.map((pod, index) => (
        <g
          className={styles.networkExpertPod}
          key={`expert-pod-${index}`}
          style={tone(NETWORK_EXPERT_POD_TONES[index], motion(0, index, NETWORK_EXPERT_PODS.length))}
        >
          <rect
            className={styles.networkPodShadow}
            height="72"
            rx="36"
            width="232"
            x={pod.x - 116}
            y={pod.y - 30}
          />
          <rect
            className={styles.networkPodDish}
            height="72"
            rx="36"
            width="232"
            x={pod.x - 116}
            y={pod.y - 36}
          />
          <rect
            className={styles.networkPodInset}
            height="58"
            rx="29"
            width="218"
            x={pod.x - 109}
            y={pod.y - 29}
          />
        </g>
      ))}

      {NETWORK_ORG_CLUSTERS.map((cluster, index) => {
        const nodes = networkOrgs.filter((node) => node.clusterIndex === index);
        return (
          <g
            className={styles.networkOrgCluster}
            key={`org-cluster-${index}`}
            style={tone(NETWORK_ORG_TONES[index], motion(2, index, NETWORK_ORG_CLUSTERS.length))}
          >
            <circle className={styles.networkOrgClusterShadow} cx={cluster.x - 4} cy={cluster.y + 7} r="60" />
            <circle className={styles.networkOrgClusterDish} cx={cluster.x} cy={cluster.y} r="60" />
            <polyline
              className={styles.networkConstellationLine}
              points={`${nodes.map((node) => `${node.x},${node.y}`).join(' ')} ${nodes[0].x},${nodes[0].y}`}
            />
            <circle className={styles.networkConstellationCore} cx={cluster.x} cy={cluster.y} r="3" />
          </g>
        );
      })}

      <g aria-hidden="true" className={styles.networkCompass} style={motion(4)}>
        <path className={styles.networkCompassShadow} d="M800 278L975 448L800 618L625 448Z" />
        <path className={styles.networkCompassFrame} d="M800 278L975 448L800 618L625 448Z" />
        <path className={styles.networkCompassWire} d="M800 278L975 448L800 618L625 448Z" />
        <circle className={styles.networkCompassCoreShadow} cx="796" cy="455" r="43" />
        <circle className={styles.networkCompassCore} cx="800" cy="448" r="43" />
        <text className={styles.networkCompassValue} textAnchor="middle" x="800" y="447">{projectCluster.memberCount}</text>
        <text className={styles.networkCompassLabel} textAnchor="middle" x="800" y="469">DỰ ÁN</text>
      </g>

      {networkExperts.map((dot, index) => {
        const expert = expertFixtures[index];
        return (
          <a
            aria-label={`Xem chuyên gia: ${expert.title}`}
            className={`${styles.entityLink} ${styles.networkEntity}`}
            href={expert.path}
            key={expert.id}
          >
            <title>{expert.title}</title>
            <path
              className={styles.networkFineLink}
              d={networkFineCurve(dot, { x: 574, y: 448 }, (dot.podIndex - 2) * 8)}
              pathLength="1"
              style={tone(NETWORK_FUND_TONES[(dot.podIndex * 2 + dot.slot) % NETWORK_FUND_TONES.length], motion(1, index, networkExperts.length))}
            />
            <circle className={styles.entityHit} cx={dot.x} cy={dot.y} r="24" />
            <circle
              className={styles.networkExpert}
              cx={dot.x}
              cy={dot.y}
              r={NETWORK_EXPERT_R}
              style={tone(NETWORK_EXPERT_POD_TONES[dot.podIndex], motion(0, index, networkExperts.length))}
            />
            <circle className={styles.networkExpertInset} cx={dot.x} cy={dot.y} r={NETWORK_EXPERT_R - 5} />
            <circle className={styles.networkBeadGlint} cx={dot.x - 5} cy={dot.y - 6} r="2" />
          </a>
        );
      })}

      {networkOrgs.map((dot, index) => {
        const partner = partnerFixtures[index];
        return (
          <a
            aria-label={`Xem tổ chức: ${partner.title}`}
            className={`${styles.entityLink} ${styles.networkEntity}`}
            href={partner.path}
            key={partner.id}
          >
            <title>{partner.title}</title>
            <path
              className={styles.networkFineLink}
              d={networkFineCurve(
                dot,
                dot.clusterIndex < 4 ? { x: 800, y: 278 } : { x: 800, y: 618 },
                (dot.slot - 2.5) * 3,
              )}
              pathLength="1"
              style={tone(NETWORK_FUND_TONES[(dot.clusterIndex + dot.slot) % NETWORK_FUND_TONES.length], motion(3, index, networkOrgs.length))}
            />
            <circle className={styles.entityHit} cx={dot.x} cy={dot.y} r="17" />
            <circle
              className={styles.networkOrg}
              cx={dot.x}
              cy={dot.y}
              r={NETWORK_ORG_R}
              style={tone(NETWORK_ORG_TONES[dot.clusterIndex], motion(2, index, networkOrgs.length))}
            />
            <circle className={styles.networkOrgSlot} cx={dot.x} cy={dot.y} r={NETWORK_ORG_R - 3} />
          </a>
        );
      })}

      {networkProjects.map((point, index) => {
        const project = projectFixtures[index];
        return (
          <a
            aria-label={`Xem dự án: ${project.title}`}
            className={`${styles.entityLink} ${styles.networkEntity}`}
            href={project.path}
            key={project.id}
          >
            <title>{project.title}</title>
            <g
              className={styles.networkProject}
              style={tone(NETWORK_PROJECT_RINGS[index], motion(4, index, 4))}
            >
              <circle className={styles.entityHit} cx={point.x} cy={point.y} r={NETWORK_PROJECT_R + 12} />
              <ellipse className={styles.networkProjectGround} cx={point.x - 1} cy={point.y + 62} rx="45" ry="12" />
              <circle className={styles.networkProjectStack} cx={point.x - 7} cy={point.y + 10} r={NETWORK_PROJECT_R} />
              <circle className={styles.networkProjectRing} cx={point.x} cy={point.y} r={NETWORK_PROJECT_R} />
              <circle className={styles.networkProjectCore} cx={point.x} cy={point.y} r={NETWORK_PROJECT_R - 11} />
              <image
                aria-hidden="true"
                className={styles.networkProjectImage}
                clipPath={`url(#network-project-image-${index})`}
                height="82"
                href={NETWORK_PROJECT_MEDIA[index]}
                preserveAspectRatio="xMidYMid meet"
                width="82"
                x={point.x - 41}
                y={point.y - 41}
              />
              <circle className={styles.networkProjectInset} cx={point.x} cy={point.y} r={NETWORK_PROJECT_R - 10} />
              <text className={styles.networkProjectName} textAnchor="middle" x={point.x} y={point.y + 78}>{project.title}</text>
            </g>
          </a>
        );
      })}

      {networkFunds.map((pill, index) => {
        const fund = fundLinks[index] ?? {
          href: '/mang-luoi/quy-nha-tai-tro',
          label: `Quỹ hoặc nhà tài trợ ${index + 1}`,
        };
        return (
          <a
            aria-label={`Mở thông tin quỹ hoặc nhà tài trợ: ${fund.label}`}
            className={`${styles.entityLink} ${styles.networkEntity}`}
            href={fund.href}
            key={fund.href}
            rel={fund.href.startsWith('http') ? 'noreferrer' : undefined}
            target={fund.href.startsWith('http') ? '_blank' : undefined}
          >
            <title>{fund.label}</title>
            <path
              className={styles.networkFineLink}
              d={networkFineCurve({ x: 1026, y: 448 }, { x: pill.x - 37, y: pill.y }, (index - 5) * 4)}
              pathLength="1"
              style={tone(NETWORK_FUND_TONES[index], motion(6, index, networkFunds.length))}
            />
            <g
              className={styles.networkFund}
              style={tone(NETWORK_FUND_TONES[index], motion(6, index, networkFunds.length))}
            >
              <circle className={styles.entityHit} cx={pill.x} cy={pill.y} r="36" />
              <circle className={styles.networkFundShadow} cx={pill.x - 3} cy={pill.y + 6} r="28" />
              <circle className={styles.networkFundFace} cx={pill.x} cy={pill.y} r="28" />
              <circle className={styles.networkFundSheen} cx={pill.x - 4} cy={pill.y - 5} r="21" />
              <circle className={styles.networkFundBadge} cx={pill.x} cy={pill.y} r="21" />
            </g>
          </a>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 06 — Tác động: ba trụ trước, rồi đầu vào → hoạt động → vòng quay → kết quả
// ---------------------------------------------------------------------------

const IMPACT_PILLARS = [
  { detail: 'Bảo vệ môi trường và thúc đẩy thực hành phát triển bền vững.', glyph: 'leaf' as const, href: '/cong-dong/bao-ve-moi-truong', label: 'MÔI TRƯỜNG', tone: '#3f9f68', x: 800, y: 280 },
  { detail: 'Trách nhiệm xã hội và giá trị tích cực cho cộng đồng.', glyph: 'people' as const, href: '/cong-dong/trach-nhiem-xa-hoi', label: 'XÃ HỘI', tone: '#1f9fc3', x: 655, y: 500 },
  { detail: 'Các sáng kiến và mô hình hướng tới kinh tế bền vững.', glyph: 'barsArrow' as const, href: '/cong-dong/kinh-te-ben-vung', label: 'KINH TẾ', tone: '#e7a22d', x: 945, y: 500 },
];
const IMPACT_PILLAR_ASSETS = [
  '/icons/consulting/sustainable-development.png',
  '/icons/consulting/people-organization.png',
  '/icons/consulting/economic-policy.png',
] as const;
const IMPACT_NODES = [
  { detail: 'Nguồn lực, đối tác và quỹ hỗ trợ cho hành trình.', glyph: 'funnel' as const, href: '/mang-luoi/quy-nha-tai-tro', label: 'ĐẦU VÀO', phase: 1, tone: '#164f73', x: 128 },
  { detail: 'Các hoạt động được triển khai cùng cộng đồng.', glyph: 'gear' as const, href: '/cong-dong/quan-tri-hieu-qua', label: 'HOẠT ĐỘNG', phase: 2, tone: '#078d8b', x: 390 },
  { detail: 'Kết quả được theo dõi qua hệ thống đánh giá phát triển bền vững.', glyph: 'checklist' as const, href: '/cong-dong/he-thong-danh-gia-phat-trien-ben-vung-cap-dia-phuong', label: 'KẾT QUẢ', phase: 5, tone: '#169fc5', x: 1210 },
  { detail: 'Phân tích tác động đa chiều của chính sách và sáng kiến.', glyph: 'target' as const, href: '/cong-dong/giai-phap-phan-tich-tac-dong-da-chieu-cua-chinh-sach', label: 'TÁC ĐỘNG', phase: 6, tone: '#e4772d', x: 1460 },
];
const IMPACT_NODE_ASSETS = [
  '/icons/journey/impact/input-funnel.png',
  '/icons/journey/impact/activity-gear.png',
  '/icons/journey/impact/results-checklist.png',
  '/icons/journey/impact/impact-target.png',
] as const;

/** Approved impact-flow redesign: one calm horizontal system with a readable
 * GISA hub and three distinct, non-overlapping impact pillars. */
function ApprovedImpactPlate() {
  const nodeX = [135, 390, 1210, 1465];
  const nodeY = 430;
  const pillarX = [800, 675, 925];
  const pillarY = [225, 535, 535];
  const coreX = 800;
  const coreY = 410;

  return (
    <div className={styles.impactStageShell}>
    <svg
      aria-label="Khung định tính gồm ba trụ cột Môi trường, Xã hội và Kinh tế, cùng bốn giai đoạn Đầu vào, Hoạt động, Kết quả và Tác động. Không biểu thị tỷ trọng hay số lượng."
      className={`${styles.plate} ${styles.impactPlate} ${styles.approvedImpactPlate}`}
      role="group"
      viewBox={IMPACT_VIEW_BOX}
    >
      <defs>
        <filter height="150%" id="impact-soft-shadow" width="150%" x="-25%" y="-25%">
          <feDropShadow dx="0" dy="10" floodColor="#153c57" floodOpacity=".14" stdDeviation="10" />
        </filter>
        {IMPACT_PILLARS.map((pillar, index) => (
          <clipPath id={`approved-impact-pillar-${index}`} key={pillar.label}>
            <circle cx={pillarX[index]} cy={pillarY[index] - 18} r="61" />
          </clipPath>
        ))}
        {IMPACT_NODES.map((node, index) => (
          <clipPath id={`approved-impact-node-${index}`} key={node.label}>
            <circle cx={nodeX[index]} cy={nodeY - 15} r="62" />
          </clipPath>
        ))}
      </defs>

      <g aria-hidden="true" className={styles.approvedImpactFlow}>
        <path className={styles.approvedImpactBackbone} d="M235 430C270 430 286 430 300 430M480 430C560 430 608 406 666 406M934 406C992 406 1040 430 1120 430M1300 430C1318 430 1330 430 1365 430" />
        <path className={styles.approvedImpactBackboneColor} d="M235 430C270 430 286 430 300 430M480 430C560 430 608 406 666 406M934 406C992 406 1040 430 1120 430M1300 430C1318 430 1330 430 1365 430" pathLength="1" style={motion(0)} />
        {[268, 535, 1065, 1332].map((x, index) => (
          <g className={styles.approvedImpactArrow} key={x} style={tone(IMPACT_NODES[index].tone, motion(IMPACT_NODES[index].phase))}>
            <circle cx={x} cy="430" r="13" />
            <path d={`M${x - 4} 423L${x + 4} 430L${x - 4} 437`} />
          </g>
        ))}

        <path className={`${styles.approvedImpactPetal} ${styles.approvedImpactPetalTop}`} d="M690 348C678 286 694 146 800 112C906 146 922 286 910 348C868 326 732 326 690 348Z" style={tone(IMPACT_PILLARS[0].tone, motion(2, 0, 3))} />
        <path className={`${styles.approvedImpactPetal} ${styles.approvedImpactPetalLeft}`} d="M755 374C684 352 590 406 576 506C608 606 714 646 790 570C760 518 744 442 755 374Z" style={tone(IMPACT_PILLARS[1].tone, motion(2, 1, 3))} />
        <path className={`${styles.approvedImpactPetal} ${styles.approvedImpactPetalRight}`} d="M845 374C916 352 1010 406 1024 506C992 606 886 646 810 570C840 518 856 442 845 374Z" style={tone(IMPACT_PILLARS[2].tone, motion(2, 2, 3))} />
        <path className={styles.approvedImpactHubLink} d="M800 315V330M748 460L720 488M852 460L880 488" pathLength="1" style={motion(3)} />
      </g>

      {IMPACT_PILLARS.map((pillar, index) => {
        const panelId = `impact-pillar-detail-${index}`;
        return (
          <JourneyMorphTrigger
            accessibleLabel={`Xem nội dung ${pillar.label.toLocaleLowerCase('vi')}: ${pillar.detail}`}
            className={`${styles.entityLink} ${styles.impactEntityLink}`}
            dataKey={`pillar-${index}`}
            href={pillar.href}
            key={pillar.label}
            panelId={panelId}
          >
            <title>{`${pillar.label}: ${pillar.detail}`}</title>
            <g className={`${styles.impactPillar} ${styles.approvedImpactPillar}`} style={tone(pillar.tone, motion(2, index, IMPACT_PILLARS.length))}>
              <circle className={styles.entityHit} cx={pillarX[index]} cy={pillarY[index]} r="112" />
              <circle className={styles.approvedImpactPillarField} cx={pillarX[index]} cy={pillarY[index]} r="104" />
              <circle className={styles.approvedImpactIconField} cx={pillarX[index]} cy={pillarY[index] - 18} r="68" />
              <image
                className={styles.impactIconAsset}
                clipPath={`url(#approved-impact-pillar-${index})`}
                height="122"
                href={IMPACT_PILLAR_ASSETS[index]}
                preserveAspectRatio="xMidYMid slice"
                width="122"
                x={pillarX[index] - 61}
                y={pillarY[index] - 79}
              />
              <text className={styles.approvedImpactPillarLabel} textAnchor="middle" x={pillarX[index]} y={pillarY[index] + 70}>{pillar.label}</text>
            </g>
          </JourneyMorphTrigger>
        );
      })}

      <JourneyMorphTrigger
        accessibleLabel="Xem các hoạt động cộng đồng của GISA: kết nối nguồn lực, hoạt động và các trụ cột tác động"
        className={`${styles.entityLink} ${styles.impactEntityLink}`}
        dataKey="core"
        href={COMMUNITY_INDEX_PATH}
        panelId="impact-core-detail"
      >
        <title>GISA — trung tâm kết nối</title>
        <g className={`${styles.impactCore} ${styles.approvedImpactCore}`} style={motion(3)}>
          <circle className={styles.entityHit} cx={coreX} cy={coreY} r="116" />
          <circle className={styles.approvedImpactCoreShadow} cx={coreX} cy={coreY + 10} r="108" />
          <circle className={styles.approvedImpactCoreFace} cx={coreX} cy={coreY} r="106" />
          <text className={styles.approvedImpactWordmark} textAnchor="middle" x={coreX} y={coreY + 12}>
            <tspan className={styles.impactCoreWordmarkG}>G</tspan>
            <tspan className={styles.impactCoreWordmarkI}>I</tspan>
            <tspan className={styles.impactCoreWordmarkS}>S</tspan>
            <tspan className={styles.impactCoreWordmarkA}>A</tspan>
          </text>
          <text className={styles.approvedImpactCoreLabel} textAnchor="middle" x={coreX} y={coreY + 52}>KẾT NỐI</text>
        </g>
      </JourneyMorphTrigger>

      {IMPACT_NODES.map((node, index) => {
        const panelId = `impact-node-detail-${index}`;
        return (
          <JourneyMorphTrigger
            accessibleLabel={`Xem nội dung giai đoạn ${node.label.toLocaleLowerCase('vi')}: ${node.detail}`}
            className={`${styles.entityLink} ${styles.impactEntityLink}`}
            dataKey={`node-${index}`}
            href={node.href}
            key={node.label}
            panelId={panelId}
          >
            <title>{`${node.label}: ${node.detail}`}</title>
            <g className={`${styles.impactNode} ${styles.approvedImpactNode} ${index < 2 ? styles.approvedImpactNodeStart : styles.approvedImpactNodeEnd}`} style={tone(node.tone, motion(node.phase))}>
              <rect className={styles.entityHit} height="250" rx="72" width="216" x={nodeX[index] - 108} y={nodeY - 125} />
              <rect className={styles.approvedImpactNodeShadow} height="226" rx="68" width="202" x={nodeX[index] - 101} y={nodeY - 105} />
              <rect className={styles.approvedImpactNodeFace} height="226" rx="68" width="202" x={nodeX[index] - 101} y={nodeY - 114} />
              <circle className={styles.approvedImpactIconField} cx={nodeX[index]} cy={nodeY - 15} r="68" />
              <image
                className={styles.impactIconAsset}
                clipPath={`url(#approved-impact-node-${index})`}
                height="124"
                href={IMPACT_NODE_ASSETS[index]}
                preserveAspectRatio="xMidYMid slice"
                width="124"
                x={nodeX[index] - 62}
                y={nodeY - 77}
              />
              <text className={styles.approvedImpactNodeLabel} textAnchor="middle" x={nodeX[index]} y={nodeY + 82}>{node.label}</text>
            </g>
          </JourneyMorphTrigger>
        );
      })}
    </svg>
    <div className={styles.impactMorphLayer}>
      {IMPACT_PILLARS.map((pillar, index) => (
        <JourneyMorphPanel
          anchor={index === 1 ? 'left' : 'right'}
          className={`${styles.impactMorphPanel} ${styles[`impactMorphPillar${index}`]}`}
          dataKey={`pillar-${index}`}
          eyebrow="Trụ cột tác động"
          href={pillar.href}
          id={`impact-pillar-detail-${index}`}
          image={IMPACT_PILLAR_ASSETS[index]}
          key={pillar.label}
          lines={[pillar.detail, 'Định hướng giải pháp liên ngành', 'Khung định tính — không biểu thị tỷ trọng']}
          style={{ '--morph-tone': pillar.tone }}
          title={pillar.label}
        />
      ))}
      <JourneyMorphPanel
        anchor="right"
        className={`${styles.impactMorphPanel} ${styles.impactMorphCore}`}
        dataKey="core"
        eyebrow="Trung tâm hệ thống"
        href={COMMUNITY_INDEX_PATH}
        id="impact-core-detail"
        image="/icons/journey/impact/gisa-handshake.png"
        lines={['Kết nối nguồn lực, hoạt động và ba trụ cột', 'Điều phối tri thức thành hành động', 'Khung định tính — không biểu thị tỷ trọng']}
        style={{ '--morph-tone': '#078d8b' }}
        title="GISA Kết nối"
      />
      {IMPACT_NODES.map((node, index) => {
        const outcome = [
          'Tạo nền tảng cho toàn bộ hành trình',
          'Biến nguồn lực thành can thiệp thực tiễn',
          'Theo dõi đầu ra và thay đổi đạt được',
          'Đánh giá giá trị dài hạn của sáng kiến',
        ][index];
        return (
          <JourneyMorphPanel
            anchor={index < 2 ? 'right' : 'left'}
            className={`${styles.impactMorphPanel} ${styles[`impactMorphNode${index}`]}`}
            dataKey={`node-${index}`}
            eyebrow="Giai đoạn tác động"
            href={node.href}
            id={`impact-node-detail-${index}`}
            image={IMPACT_NODE_ASSETS[index]}
            key={node.label}
            lines={[node.detail, outcome, 'Một mắt xích trong chuỗi tác động']}
            style={{ '--morph-tone': node.tone }}
            title={node.label}
          />
        );
      })}
    </div>
    </div>
  );
}

const plates: Record<JourneyChartName, () => React.JSX.Element> = {
  impact: ApprovedImpactPlate,
  network: NetworkPlate,
  research: ResearchPlate,
  strategy: StrategyPlate,
  training: TrainingPlate,
  transfer: TransferPlate,
};

export function JourneyChart({ name }: { name: JourneyChartName }) {
  const Plate = plates[name];
  return (
    <JourneyMorphRoot name={name}>
      <Plate />
    </JourneyMorphRoot>
  );
}
