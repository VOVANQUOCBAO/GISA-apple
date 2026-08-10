'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { expertFixtures } from '@/content/fixtures/experts';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './expert-showcase.module.css';

const AUTO_ADVANCE_MS = 4600;

const hiddenPortraitIds = new Set([
  'expert-hoang-van-viet',
  'expert-tran-anh-khang',
]);

const mockPortraitClasses = [
  styles.mockPortraitOne,
  styles.mockPortraitTwo,
  styles.mockPortraitThree,
  styles.mockPortraitFour,
  styles.mockPortraitFive,
];

const experts = expertFixtures.map((expert, index) => {
  const metadata = expert.metadata as Record<string, string[] | undefined>;
  const expertise = Array.isArray(metadata.expertise)
    ? metadata.expertise
    : expert.tags;

  return {
    description: expertise[0] ?? expert.tags[0] ?? 'Kết nối tri thức',
    hidePortrait: hiddenPortraitIds.has(expert.id),
    id: expert.id,
    mockPortraitClass: mockPortraitClasses[index % mockPortraitClasses.length],
    path: expert.path,
    title: expert.title,
  };
});

const initialExpertIndex = Math.max(
  0,
  experts.findIndex((expert) => expert.id === 'expert-tran-anh-khang'),
);

export function ExpertShowcase() {
  const [activeIndex, setActiveIndex] = useState(initialExpertIndex);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % experts.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      aria-labelledby="expert-showcase-title"
      className={styles.section}
      data-scroll-motion-ignore
      id="chuyen-gia-noi-bat"
    >
      <h2 className={styles.srOnly} id="expert-showcase-title">
        Mạng lưới tri thức GISA
      </h2>

      <div
        className={styles.shell}
        data-scroll-motion="reveal"
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
        onFocusCapture={() => setIsPaused(true)}
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
      >
        <div className={styles.track}>
          {experts.map((expert, expertIndex) => {
            const forwardOffset = (expertIndex - activeIndex + experts.length) % experts.length;
            const offset = forwardOffset > experts.length / 2
              ? forwardOffset - experts.length
              : forwardOffset;
            const slot = Math.max(-3, Math.min(3, offset));
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            return (
              <article
                aria-hidden={isVisible ? undefined : true}
                className={styles.card}
                data-active={isActive ? 'true' : 'false'}
                data-slot={slot}
                key={expert.id}
              >
                <button
                  aria-label={`Chọn ${expert.title}`}
                  className={styles.cardSelect}
                  onClick={() => setActiveIndex(expertIndex)}
                  tabIndex={isVisible ? 0 : -1}
                  type="button"
                >
                  <span className={styles.portrait}>
                    {expert.hidePortrait ? (
                      <span aria-hidden="true" className={styles.emptyPortrait} />
                    ) : (
                      <span
                        aria-label={`Ảnh minh họa cho ${expert.title}`}
                        className={`${styles.mockPortrait} ${expert.mockPortraitClass}`}
                        role="img"
                      />
                    )}
                  </span>
                  <span className={styles.caption}>
                    <strong>{bindPhrases(expert.title)}</strong>
                    <small>{bindPhrases(expert.description)}</small>
                  </span>
                </button>

                <Link
                  aria-hidden={isActive ? undefined : true}
                  aria-label={`Xem hồ sơ ${expert.title}`}
                  className={styles.profileLink}
                  href={expert.path}
                  tabIndex={isActive ? 0 : -1}
                >
                  <ArrowRight aria-hidden="true" size={20} weight="bold" />
                </Link>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
