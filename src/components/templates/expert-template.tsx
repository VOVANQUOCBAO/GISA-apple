import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { SourceNote } from '@/components/ui/source-note';
import type { ContentRecord } from '@/content/types';
import { bindPhrases } from '@/lib/vietnamese-text';

import { expertInitials } from './expert-listing-template';
import { profileForPath, SectionSubnav } from './inner-page-chrome';
import styles from './expert-template.module.css';
import layoutStyles from './templates.module.css';

function expertiseFor(record: ContentRecord) {
  const value = record.metadata.expertise;
  return Array.isArray(value) ? value : [];
}

function supportingParagraphs(record: ContentRecord) {
  return record.body.flatMap((block) => {
    if (block.type !== 'paragraph' || block.text === record.summary) return [];
    return [block.text];
  });
}

export function ExpertTemplate({ record }: { record: ContentRecord }) {
  const expertise = expertiseFor(record);
  const notes = supportingParagraphs(record);
  const profile = profileForPath(record.path);
  const isPublishedExpertPath = record.path.startsWith('/chuyen-gia/');

  return (
    <main id="main-content" tabIndex={-1}>
      <article className={`${styles.pageContainer} ${layoutStyles.sectionTheme}`} data-section={profile.section}>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Trang chủ' },
            ...(isPublishedExpertPath
              ? [
                  { href: '/gioi-thieu', label: 'Giới thiệu' },
                  { href: '/chuyen-gia', label: 'Chuyên gia' },
                ]
              : []),
            { label: record.title },
          ]}
        />

        <header className={styles.profileHero}>
          <div className={styles.profileCopy}>
            <p className={styles.eyebrow}>Chuyên gia</p>
            <h1>{bindPhrases(record.title)}</h1>
            <p className={styles.affiliation}>{bindPhrases(record.summary)}</p>
          </div>
          <div className={styles.profilePortrait}>
            {record.image ? (
              <Image
                alt={record.image.alt}
                fill
                priority
                sizes="(max-width: 48rem) 94vw, 38vw"
                src={record.image.src}
              />
            ) : (
              <div
                aria-label={`Hồ sơ ${record.title} chưa có ảnh được công bố`}
                className={styles.profileInitials}
                role="img"
              >
                <span aria-hidden="true">{expertInitials(record.title)}</span>
              </div>
            )}
          </div>
        </header>
        {isPublishedExpertPath ? <SectionSubnav path={record.path} /> : null}

        <div className={styles.profileBody}>
          <aside className={styles.profileIndex}>
            <p>Hồ sơ chuyên môn</p>
            <span>{String(expertise.length).padStart(2, '0')}</span>
          </aside>
          <div className={styles.profileContent}>
            {expertise.length > 0 ? (
              <section className={styles.expertiseSection} aria-labelledby="expertise-title">
                <h2 id="expertise-title">Lĩnh vực chuyên môn</h2>
                <ul>
                  {expertise.map((specialty) => <li key={specialty}>{bindPhrases(specialty)}</li>)}
                </ul>
              </section>
            ) : null}

            {notes.length > 0 ? (
              <section className={styles.scopeSection} aria-labelledby="scope-title">
                <h2 id="scope-title">Phạm vi thông tin đã xác minh</h2>
                {notes.map((note) => <p key={note}>{bindPhrases(note)}</p>)}
              </section>
            ) : null}

            <nav className={styles.backStage} aria-label="Quay lại danh sách chuyên gia">
              <p>Khám phá thêm hồ sơ trong mạng lưới chuyên môn của GISA.</p>
              <Link href="/chuyen-gia">Xem tất cả chuyên gia</Link>
            </nav>
            <SourceNote
              checkedAt={record.checkedAt}
              sourceLabel={record.sourceLabel.replace(/\s*[–—]\s*/g, ' - ')}
              sourceUrl={record.sourceUrl}
            />
          </div>
        </div>
      </article>
    </main>
  );
}
