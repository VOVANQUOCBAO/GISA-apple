import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { Icon, type IconName } from '@/components/ui/icon';
import type { ContentRecord } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import { ContentBlocks } from './content-blocks';
import { profileForPath, SectionSubnav } from './inner-page-chrome';
import styles from './project-tool-detail-template.module.css';

type SupportedKind = Extract<ContentRecord['kind'], 'project' | 'tool'>;
const SUPPORTED_KINDS = new Set<ContentRecord['kind']>(['project', 'tool']);

interface Direction {
  action: { href: string; label: string };
  eyebrow: string;
  parent: { href: string; label: string };
  root: { href: string; label: string };
  tone: 'project' | 'tool';
}

interface VisualFallbackContent {
  detail?: string;
  eyebrow: string;
  title: string;
}

function directionFor(record: ContentRecord): Direction {
  if (record.kind === 'tool') {
    return {
      action: { href: '/dang-ky/tu-van', label: 'Trao đổi cách áp dụng' },
      eyebrow: 'Công cụ',
      parent: { href: '/tu-van/cong-cu', label: 'Công cụ tư vấn' },
      root: { href: '/tu-van', label: 'Tư vấn' },
      tone: 'tool',
    };
  }

  const consulting = record.path.startsWith('/tu-van/');
  return {
    action: consulting
      ? { href: '/dang-ky/tu-van', label: 'Trao đổi nhu cầu tư vấn' }
      : { href: '/nghien-cuu/du-an', label: 'Xem các dự án nghiên cứu' },
    eyebrow: 'Dự án',
    parent: consulting
      ? { href: '/tu-van/du-an', label: 'Dự án tư vấn' }
      : { href: '/nghien-cuu/du-an', label: 'Dự án nghiên cứu' },
    root: consulting
      ? { href: '/tu-van', label: 'Tư vấn' }
      : { href: '/nghien-cuu', label: 'Nghiên cứu' },
    tone: 'project',
  };
}

export function supportsProjectToolDetail(record: ContentRecord) {
  return SUPPORTED_KINDS.has(record.kind as SupportedKind);
}

function metadataValue(record: ContentRecord, key: string) {
  const value = record.metadata[key];
  return Array.isArray(value) ? value.join(', ') : value;
}

function visualFallbackFor(record: ContentRecord): VisualFallbackContent {
  if (record.kind === 'tool') {
    const toolCount = metadataValue(record, 'toolCount');

    return {
      detail: toolCount ? `${toolCount} công cụ trong nhóm` : undefined,
      eyebrow: 'Nhóm công cụ',
      title: metadataValue(record, 'group') ?? record.title,
    };
  }

  return {
    detail:
      metadataValue(record, 'projectType') ?? metadataValue(record, 'method'),
    eyebrow: 'Hồ sơ dự án',
    title:
      metadataValue(record, 'topic') ??
      metadataValue(record, 'context') ??
      record.title,
  };
}

function toolIconFor(record: ContentRecord): IconName {
  const group = metadataValue(record, 'group')?.toLocaleLowerCase('vi');
  if (group?.includes('nghiên cứu')) return 'microscope';
  if (group?.includes('tổ chức') || group?.includes('nhân sự')) return 'users';
  if (group?.includes('bền vững')) return 'leaf';
  if (group?.includes('huấn luyện') || group?.includes('cố vấn')) return 'training';
  if (group?.includes('đổi mới')) return 'lightbulb';
  return 'compass';
}

function visibleText(text: string) {
  return bindPhrases(text.replace(/\s*[—–]\s*/g, ' · ').replace(/\s{2,}/g, ' ').trim());
}

export function ProjectToolDetailTemplate({ record }: { record: ContentRecord }) {
  if (!supportsProjectToolDetail(record)) return null;

  const direction = directionFor(record);
  const profile = profileForPath(record.path);
  const facts = record.kind === 'tool'
    ? [
        { key: 'group', label: 'Nhóm công cụ' },
        { key: 'toolCount', label: 'Quy mô bộ công cụ' },
      ]
    : [
        { key: 'context', label: 'Bối cảnh' },
        { key: 'method', label: 'Phương pháp' },
        { key: 'role', label: 'Vai trò của GISA' },
        { key: 'result', label: 'Giá trị đã xác nhận' },
      ];
  const visibleFacts = facts.flatMap((fact) => {
    const value = metadataValue(record, fact.key);
    return value ? [{ ...fact, value }] : [];
  });
  const visualFallback = visualFallbackFor(record);
  const projectLogo = record.kind === 'project' ? metadataValue(record, 'logo') : undefined;

  return (
    <main id="main-content" tabIndex={-1}>
      <article className={styles.page} data-section={profile.section} data-tone={direction.tone}>
        <div className={styles.container}>
          <Breadcrumbs
            items={[
              { href: '/', label: 'Trang chủ' },
              direction.root,
              direction.parent,
              { label: record.title },
            ]}
          />

          <header
            className={styles.masthead}
            data-title-length={record.title.length > 44 ? 'long' : 'standard'}
          >
            <div className={styles.mastheadCopy}>
              <p className={styles.eyebrow}>{direction.eyebrow}</p>
              <h1>{visibleText(record.title)}</h1>
              <p className={styles.lede}>{visibleText(record.summary)}</p>
            </div>
            <div
              className={styles.mastheadVisual}
              data-has-image={record.image ? 'true' : 'false'}
            >
              {record.image ? (
                <Image
                  alt={record.image.alt}
                  fill
                  priority
                  sizes="(max-width: 48rem) 94vw, 38vw"
                  src={record.image.src}
                />
              ) : (
                <div aria-hidden="true" className={styles.visualFallback}>
                  {record.kind === 'tool' ? (
                    <span className={styles.fallbackIcon}>
                      <Icon name={toolIconFor(record)} size={52} />
                    </span>
                  ) : null}
                  <p>{visualFallback.eyebrow}</p>
                  <strong>{visibleText(visualFallback.title)}</strong>
                  {visualFallback.detail ? (
                    <span>{visibleText(visualFallback.detail)}</span>
                  ) : null}
                </div>
              )}
              {projectLogo ? (
                <span aria-hidden="true" className={styles.projectLogo}>
                  <Image alt="" fill sizes="12rem" src={projectLogo} />
                </span>
              ) : null}
            </div>
          </header>
          <SectionSubnav path={record.path} />

          {visibleFacts.length > 0 ? (
            <section className={styles.factLedger} aria-label="Thông tin chính">
              {visibleFacts.map((fact, index) => (
                <div key={fact.key}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <dl>
                    <dt>{fact.label}</dt>
                    <dd>{visibleText(fact.value)}</dd>
                  </dl>
                </div>
              ))}
            </section>
          ) : null}

          <section className={styles.readingStage}>
            <div className={styles.bodyColumn}>
              <ContentBlocks blocks={record.body} />
            </div>
            <aside className={styles.contextAside}>
              <div className={styles.actionCard}>
                <p>Bước tiếp theo</p>
                <h2>{record.kind === 'tool' ? 'Đặt công cụ vào đúng bối cảnh' : 'Tiếp tục từ bằng chứng đã có'}</h2>
                <Link href={direction.action.href}>{direction.action.label}</Link>
              </div>
            </aside>
          </section>
        </div>
      </article>
    </main>
  );
}
