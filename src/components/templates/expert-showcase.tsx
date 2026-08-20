'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { expertFixtures } from '@/content/fixtures/experts';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './expert-showcase.module.css';

const AUTO_ADVANCE_MS = 4600;

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
    id: expert.id,
    image: expert.image,
    mockPortraitClass: mockPortraitClasses[index % mockPortraitClasses.length],
    path: expert.path,
    title: expert.title,
  };
});

const initialExpertIndex = Math.max(
  0,
  experts.findIndex((expert) => expert.id === 'expert-tran-anh-khang'),
);

/** Quãng kéo ngang (px) tương ứng một bước chuyển chuyên gia. */
const DRAG_STEP_PX = 90;

export function ExpertShowcase() {
  const [activeIndex, setActiveIndex] = useState(initialExpertIndex);
  const [isPaused, setIsPaused] = useState(false);
  /* Kéo trái/phải bằng chuột hoặc ngón tay. Băng vẫn tự chạy như cũ; trong lúc
     kéo thì tạm dừng, thả ra chạy tiếp. `origin` là mốc tính quãng đã kéo, dời
     theo mỗi bước để kéo dài đổi được nhiều chuyên gia. */
  const dragRef = useRef<{ origin: number; pointerId: number } | null>(null);

  const step = (direction: number) => {
    setActiveIndex((current) => (current + direction + experts.length) % experts.length);
  };

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
      <header className={styles.heading}>
        <h2 id="expert-showcase-title">Đội ngũ chuyên gia</h2>
        <Link href="/chuyen-gia">Xem toàn bộ đội ngũ <ArrowRight aria-hidden="true" size={20} weight="bold" /></Link>
      </header>

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
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          dragRef.current = { origin: event.clientX, pointerId: event.pointerId };
          setIsPaused(true);
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== event.pointerId) return;
          const distance = event.clientX - drag.origin;
          if (Math.abs(distance) < DRAG_STEP_PX) return;
          step(distance < 0 ? 1 : -1);
          drag.origin = event.clientX;
        }}
        onPointerUp={() => {
          dragRef.current = null;
          setIsPaused(false);
        }}
        onPointerCancel={() => {
          dragRef.current = null;
          setIsPaused(false);
        }}
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
                    {expert.image ? (
                      <Image
                        alt={expert.image.alt}
                        fill
                        sizes="(max-width: 48rem) 92vw, (max-width: 68rem) 23vw, 20vw"
                        src={expert.image.src}
                      />
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
