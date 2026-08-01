'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/ui/icon';
import { bindPhrases } from '@/lib/vietnamese-text';

import {
  audience,
  careerLadder,
  closingQuote,
  comparison,
  deliverables,
  enrolment,
  facts,
  formatBreakdown,
  hero,
  instructors,
  methods,
  objectives,
  openingStatement,
  philosophy,
  pillars,
  REGISTER_HREF,
  utli,
  valueGroups,
} from './data';
import styles from './landing.module.css';

export function LandingClient() {
  const [stuck, setStuck] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Observing the hero keeps the bar correct when the page is restored
  // mid-scroll, and costs nothing per scroll frame.
  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(heroElement);
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      {/* ------------------------------------------------------------ hero */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroMedia}>
          <Image
            alt=""
            aria-hidden="true"
            fill
            priority
            quality={92}
            sizes="100vw"
            src="/images/hero-gisa-team.png"
          />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
            <h1 className={styles.heroTitle}>{hero.title}</h1>
            <p className={styles.heroSubtitle}>{bindPhrases(hero.subtitle)}</p>
            <p className={styles.heroTagline}>{bindPhrases(hero.tagline)}</p>
            <p className={styles.heroLead}>“{bindPhrases(hero.lead)}”</p>
            <div className={styles.heroButtons}>
              <Link className={styles.brassButton} href={REGISTER_HREF}>
                Ghi danh <Icon name="arrow" size={17} />
              </Link>
              <Link className={styles.outlineButton} href="#mo-hinh">
                Mô hình UTLI <Icon name="arrow" size={17} />
              </Link>
            </div>
          </div>
        </div>
        <dl className={styles.factLedger}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{bindPhrases(fact.value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* -------------------------------------------------------- the gap */}
      <section className={styles.section} id="khoang-cach">
        <div className={styles.container}>
          <div className={styles.openingLayout}>
            <div>
              <p className={styles.eyebrow}>{openingStatement.eyebrow}</p>
              <h2 className={styles.display}>{bindPhrases(openingStatement.title)}</h2>
            </div>
            <div>
              {openingStatement.body.map((paragraph, index) => (
                <p
                  className={`${styles.lead} ${index === 0 ? styles.dropCap : ''}`}
                  key={paragraph.slice(0, 40)}
                >
                  {bindPhrases(paragraph)}
                </p>
              ))}
            </div>
          </div>

          <div className={styles.compareTable}>
            <div className={styles.compareHead}>
              <span>Chương trình Leadership truyền thống</span>
              <span aria-hidden="true" />
              <span>Leadership Psychology</span>
            </div>
            {comparison.map((row) => (
              <div className={styles.compareRow} key={row.ours}>
                <span>{bindPhrases(row.traditional)}</span>
                <span aria-hidden="true" className={styles.compareArrow}>
                  <Icon name="arrow" size={18} />
                </span>
                <span>{bindPhrases(row.ours)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ UTLI model */}
      <section className={`${styles.section} ${styles.sectionDark}`} id="mo-hinh">
        <div className={styles.container}>
          <div className={styles.utliHead}>
            <p className={styles.eyebrow}>GISA — UTLI Leadership Transformation Model</p>
            <h2 className={styles.display}>{bindPhrases('BỐN BƯỚC CỦA MỘT HÀNH TRÌNH CHUYỂN HÓA')}</h2>
            <p className={styles.lead}>
              {bindPhrases(
                'Toàn bộ chương trình được xây dựng trên mô hình phát triển lãnh đạo của GISA — từ hiểu chính mình đến kiến tạo ảnh hưởng xã hội.',
              )}
            </p>
          </div>
          <div className={styles.utliGrid}>
            {utli.map((item) => (
              <article key={item.letter}>
                <span className={styles.utliLetter}>{item.letter}</span>
                <h3>{bindPhrases(item.vi)}</h3>
                <p>{item.en}</p>
                <p>{bindPhrases(item.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- pillars */}
      <section className={styles.section} id="cau-truc">
        <div className={styles.container}>
          <div className={styles.utliHead}>
            <p className={styles.eyebrow}>Cấu trúc chương trình</p>
            <h2 className={styles.display}>{bindPhrases('BỐN TRỤ CỘT LIÊN KẾT')}</h2>
          </div>
          <ol className={styles.pillarList}>
            {pillars.map((pillar) => (
              <li key={pillar.index}>
                <span className={styles.pillarIndex}>{pillar.index}</span>
                <h3>{bindPhrases(pillar.title)}</h3>
                <p>{bindPhrases(pillar.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------ philosophy */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.philosophyBand}>
          <span aria-hidden="true" className={styles.philosophyMark}>
            “
          </span>
          {philosophy.map((line) => (
            <p key={line}>{bindPhrases(line)}</p>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ objectives */}
      <section className={styles.section} id="muc-tieu">
        <div className={styles.container}>
          <div className={styles.utliHead}>
            <p className={styles.eyebrow}>Mục tiêu chương trình</p>
            <h2 className={styles.display}>
              {bindPhrases('BỐN NĂNG LỰC NỀN TẢNG CỦA NHÀ LÃNH ĐẠO HIỆN ĐẠI')}
            </h2>
          </div>
          <div className={styles.objectiveGrid}>
            {objectives.map((item, index) => (
              <article key={item.en}>
                <span className={styles.objectiveNum}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{bindPhrases(item.vi)}</h3>
                <em>{item.en}</em>
                <p>{bindPhrases(item.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- methods & class format */}
      <section className={`${styles.section} ${styles.sectionWarm}`} id="phuong-phap">
        <div className={styles.container}>
          <div className={styles.methodLayout}>
            <div>
              <p className={styles.eyebrow}>Phương pháp học tập</p>
              <h2 className={styles.display}>{bindPhrases('KHOA HỌC · TRẢI NGHIỆM · THỰC HÀNH')}</h2>
              <p className={styles.lead}>
                {bindPhrases(
                  'Người học không chỉ tiếp nhận kiến thức mà còn liên tục phản tư, thực hành, điều chỉnh và hoàn thiện bản thân trong suốt hành trình.',
                )}
              </p>
              <ul className={styles.methodList}>
                {methods.map((item, index) => (
                  <li key={item.en}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <strong>{item.en}</strong>
                      <small>{bindPhrases(item.vi)}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.formatCard}>
              <h3>{bindPhrases('Hình thức học tập')}</h3>
              <p>{bindPhrases('12 buổi · tổng thời lượng dự kiến 50–60 giờ')}</p>
              <ul className={styles.formatBreakdown}>
                {formatBreakdown.map((item) => (
                  <li key={item.text}>
                    <strong>{item.count}</strong>
                    <span>{bindPhrases(item.text)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- values */}
      <section className={styles.section} id="gia-tri">
        <div className={styles.container}>
          <div className={styles.utliHead}>
            <p className={styles.eyebrow}>Giá trị và kết quả đạt được</p>
            <h2 className={styles.display}>{bindPhrases('THAY ĐỔI THỰC CHẤT, KHÔNG CHỈ KIẾN THỨC')}</h2>
          </div>
          <div className={styles.valueGrid}>
            {valueGroups.map((group) => (
              <div key={group.title}>
                <h3>{bindPhrases(group.title)}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{bindPhrases(item)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- career ladder */}
      <section className={`${styles.section} ${styles.sectionDark}`} id="lo-trinh">
        <div className={styles.container}>
          <div className={styles.ladderLayout}>
            <div>
              <p className={styles.eyebrow}>Hệ sinh thái GISA</p>
              <h2 className={styles.display}>
                {bindPhrases('CON ĐƯỜNG TIẾP TỤC SAU KHI KẾT THÚC CHƯƠNG TRÌNH')}
              </h2>
              <p className={styles.lead}>
                {bindPhrases(
                  'Với những học viên có năng lực, đam mê và mong muốn phát triển trong lĩnh vực đào tạo, coaching hoặc phát triển nguồn nhân lực, chương trình mở ra lộ trình tham gia sâu hơn vào hệ sinh thái học tập của GISA.',
                )}
              </p>
            </div>
            <ol className={styles.ladder}>
              {careerLadder.map((item) => (
                <li key={item.step}>
                  <span aria-hidden="true" className={styles.ladderMark}>
                    {item.step}
                  </span>
                  <h3>{bindPhrases(item.title)}</h3>
                  <p>{bindPhrases(item.text)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- deliverables */}
      <section className={styles.section} id="dau-ra">
        <div className={styles.container}>
          <div className={styles.utliHead}>
            <p className={styles.eyebrow}>Kết quả đầu ra</p>
            <h2 className={styles.display}>{bindPhrases('SÁU SẢN PHẨM MỖI HỌC VIÊN SỞ HỮU')}</h2>
          </div>
          <ol className={styles.deliverableList}>
            {deliverables.map((item, index) => (
              <li key={item.en}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{bindPhrases(item.vi)}</strong>
                <small>{item.en}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------ audience & staff */}
      <section className={`${styles.section} ${styles.sectionWarm}`} id="doi-tuong">
        <div className={styles.container}>
          <div className={styles.audienceLayout}>
            <div>
              <p className={styles.eyebrow}>Đối tượng tham gia</p>
              <h2 className={styles.display}>{bindPhrases('DÀNH CHO NGƯỜI ĐANG CHUẨN BỊ DẪN DẮT')}</h2>
              <ul className={styles.audienceList}>
                {audience.map((item) => (
                  <li key={item}>{bindPhrases(item)}</li>
                ))}
              </ul>
              <p className={styles.staffNote}>
                {bindPhrases(
                  'Để bảo đảm chất lượng học tập, coaching và kết nối, mỗi khóa được tổ chức với quy mô 60–80 học viên và chia thành các nhóm học tập đồng hành trong suốt chương trình.',
                )}
              </p>
            </div>
            <div>
              <p className={styles.eyebrow}>Giảng viên phụ trách</p>
              <div className={styles.instructorList}>
                {instructors.map((person) => (
                  <div key={person.name}>
                    <strong>{person.name}</strong>
                    <small>{person.title}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- enrolment */}
      <section className={styles.section} id="ghi-danh">
        <div className={styles.container}>
          <div className={styles.utliHead}>
            <p className={styles.eyebrow}>Ghi danh</p>
            <h2 className={styles.display}>{bindPhrases(enrolment.cohort)}</h2>
          </div>
          <div className={styles.enrolLayout}>
            <dl className={styles.enrolFacts}>
              <div>
                <dt>Khai giảng</dt>
                <dd>{enrolment.start}</dd>
              </div>
              <div>
                <dt>Hạn ghi danh</dt>
                <dd>{enrolment.deadline}</dd>
              </div>
              <div>
                <dt>Lịch học</dt>
                <dd>{bindPhrases(enrolment.schedule)}</dd>
              </div>
              <div>
                <dt>Quy mô</dt>
                <dd>{bindPhrases(enrolment.seats)}</dd>
              </div>
              <div>
                <dt>Đồng hành doanh nghiệp</dt>
                <dd>{bindPhrases(enrolment.groupNote)}</dd>
              </div>
            </dl>
            <div className={styles.priceCard}>
              <p className={styles.priceLabel}>Ưu đãi ghi danh sớm</p>
              <p className={styles.priceValue}>{enrolment.earlyPrice}</p>
              <p className={styles.priceStrike}>
                Học phí trọn chương trình <s>{enrolment.standardPrice}</s>
              </p>
              <div className={styles.priceMeta}>
                <span>{bindPhrases(enrolment.earlyUntil)}</span>
                <span>{bindPhrases('Bao gồm coaching, tài liệu và bộ sáu sản phẩm đầu ra')}</span>
              </div>
              <Link className={styles.brassButton} href={REGISTER_HREF}>
                Ghi danh ngay <Icon name="arrow" size={17} />
              </Link>
              <Link className={styles.outlineButton} href="/lien-he">
                Trao đổi trước <Icon name="arrowUp" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- closing */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className={styles.closing}>
          <blockquote>{bindPhrases(closingQuote.vi)}</blockquote>
          <p>{closingQuote.en}</p>
          <div className={styles.closingActions}>
            <Link className={styles.brassButton} href={REGISTER_HREF}>
              Ghi danh khóa 01 / 2026 <Icon name="arrow" size={17} />
            </Link>
            <Link className={styles.inkButton} href="#mo-hinh">
              Xem lại mô hình UTLI
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- sticky bar */}
      <div
        aria-hidden={!stuck}
        className={`${styles.stickyBar} ${stuck ? styles.stickyBarVisible : ''}`}
      >
        <div className={styles.stickyInner}>
          <div className={styles.stickyCopy}>
            <strong>{bindPhrases('Tâm lý học Lãnh đạo — Chuyển hóa từ bên trong')}</strong>
            <small>
              {bindPhrases(
                `Khai giảng ${enrolment.start} · ${enrolment.earlyPrice} ưu đãi ghi danh sớm`,
              )}
            </small>
          </div>
          <div className={styles.stickyActions}>
            <Link className={styles.outlineButton} href="#cau-truc" tabIndex={stuck ? undefined : -1}>
              Cấu trúc
            </Link>
            <Link className={styles.brassButton} href={REGISTER_HREF} tabIndex={stuck ? undefined : -1}>
              Ghi danh <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
