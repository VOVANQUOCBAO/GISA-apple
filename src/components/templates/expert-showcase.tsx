'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Image from '@/components/ui/content-image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { expertFixtures } from '@/content/fixtures/experts';
import { bindPhrases } from '@/lib/vietnamese-text';

import styles from './expert-showcase.module.css';

const showcaseOrder = ['ngo-thanh-hanh', 'le-khanh-lam', 'hoang-van-viet', 'tran-anh-khang', 'phan-thi-kim-anh', 'tran-van-quy'];

const experts = [...expertFixtures].sort((left, right) =>
  (showcaseOrder.indexOf(left.slug) < 0 ? 100 : showcaseOrder.indexOf(left.slug)) -
  (showcaseOrder.indexOf(right.slug) < 0 ? 100 : showcaseOrder.indexOf(right.slug)),
).map((expert) => {
  const metadata = expert.metadata as Record<string, string[] | undefined>;
  const expertise = Array.isArray(metadata.expertise)
    ? metadata.expertise
    : expert.tags;

  return {
    description: expertise[0] ?? expert.tags[0] ?? 'Kết nối tri thức',
    id: expert.id,
    image: expert.image,
    path: expert.path,
    title: expert.title,
  };
});

const initialExpertIndex = Math.max(
  0,
  experts.findIndex((expert) => expert.id === 'expert-hoang-van-viet'),
);

/** Quãng kéo ngang (px) tương ứng một bước chuyển chuyên gia. */
const DRAG_STEP_PX = 90;

export function ExpertShowcase() {
  const [activeIndex, setActiveIndex] = useState(initialExpertIndex);
  /* Giữ vị trí ban đầu cho đến khi người xem chọn hoặc kéo ảnh. */
  const dragRef = useRef<{ origin: number; pointerId: number } | null>(null);

  const step = (direction: number) => {
    setActiveIndex((current) => (current + direction + experts.length) % experts.length);
  };

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
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          dragRef.current = { origin: event.clientX, pointerId: event.pointerId };
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
        }}
        onPointerCancel={() => {
          dragRef.current = null;
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
                        quality={95}
                        sizes="(max-width: 48rem) 92vw, (max-width: 68rem) 23vw, 20vw"
                        src={expert.image.src}
                      />
                    ) : (
                      <span
                        aria-label={`${expert.title} chưa có ảnh thật`}
                        className={styles.initialPortrait}
                        role="img"
                      >
                        {expert.title.split(/\s+/).slice(-2).map((word) => word[0]).join('')}
                      </span>
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
