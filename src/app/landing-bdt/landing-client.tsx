'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Icon, type IconName } from '@/components/ui/icon';
import { Illustration, type IllustrationName } from '@/components/ui/illustration';
import { bindPhrases } from '@/lib/vietnamese-text';

import {
  audience,
  cohorts,
  deliverables,
  facts,
  faqs,
  foundations,
  hero,
  instructors,
  journey,
  learningFormats,
  method,
  outcomes,
  pains,
  REGISTER_HREF,
  stages,
  testimonials,
  tuition,
} from './data';
import styles from './landing.module.css';

type OutcomeKey = keyof typeof outcomes;

const outcomeTabs: Array<{ key: OutcomeKey; label: string }> = [
  { key: 'individual', label: 'Giá trị cho người tham gia' },
  { key: 'organisation', label: 'Giá trị cho doanh nghiệp' },
];

/** Initials for the instructor avatar — the proposal ships no portraits. */
function initials(name: string): string {
  const parts = name.replace(/^(ThS\.|TS\.|PGS\.|GS\.)\s*/u, '').trim().split(/\s+/u);
  return parts.slice(-2).map((part) => part[0]).join('').toUpperCase();
}

export function LandingClient() {
  const [activeStage, setActiveStage] = useState(stages[0].id);
  const [activeOutcome, setActiveOutcome] = useState<OutcomeKey>('individual');
  const [stuck, setStuck] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const stage = stages.find((item) => item.id === activeStage) ?? stages[0];
  const featuredTuition = tuition.find((item) => item.featured) ?? tuition[0];
  const nextCohort = cohorts.find((item) => item.highlight) ?? cohorts[0];

  // The sticky bar only earns its space once the hero CTA has scrolled away.
  // Observing the hero rather than listening on `scroll` keeps this correct when
  // the page is restored mid-scroll and avoids a handler on every scroll frame.
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
            src="/images/hero-gisa-strategy-table.png"
          />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{bindPhrases(hero.eyebrow)}</p>
            <h1 className={styles.heroTitle}>
              {hero.titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <em>{hero.titleAccent}</em>
            </h1>
            <p className={styles.heroTagline}>{bindPhrases(hero.tagline)}</p>
            <p className={styles.heroLead}>{bindPhrases(hero.lead)}</p>
            <div className={styles.heroButtons}>
              <Link className={styles.primaryButton} href={REGISTER_HREF}>
                Đăng ký khóa học <Icon name="arrow" size={19} />
              </Link>
              <Link className={styles.secondaryButton} href="#chuong-trinh">
                Xem chương trình <Icon name="arrow" size={19} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ fact strip */}
      <section aria-label="Thông tin nhanh về chương trình" className={styles.factStrip}>
        <dl className={styles.factInner}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <span className={styles.factIcon}>
                <Icon name={fact.icon as IconName} size={22} />
              </span>
              <div>
                <dt>{fact.label}</dt>
                <dd>{bindPhrases(fact.value)}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* ----------------------------------------------------------- pains */}
      <section className={styles.section} id="van-de">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={`${styles.eyebrow} ${styles.eyebrowOrange}`}>Bạn có đang gặp?</p>
            <h2 className={styles.sectionTitle}>
              {bindPhrases('KHÔNG PHẢI THIẾU KHÁCH — LÀ THIẾU HIỂU KHÁCH')}
            </h2>
            <p className={styles.sectionLead}>
              {bindPhrases(
                'Doanh nghiệp có thể sở hữu nhiều dữ liệu, mạng lưới rộng, đội ngũ bán hàng đông và marketing liên tục — nhưng vẫn khó chuyển sự quan tâm thành quyết định mua.',
              )}
            </p>
          </div>
          <ul className={styles.painGrid}>
            {pains.map((pain) => (
              <li key={pain}>
                <Icon name="megaphone" size={20} />
                <span>{bindPhrases(pain)}</span>
              </li>
            ))}
          </ul>
          <p className={styles.painFoot}>
            {bindPhrases(
              'Những vấn đề này không nằm ở kỹ thuật chốt đơn, mà ở con người: hành vi, nhu cầu, niềm tin, giá trị và trải nghiệm khách hàng.',
            )}
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------- foundations */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="nen-tang">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Ba nền tảng của chương trình</p>
            <h2 className={styles.sectionTitle}>{bindPhrases('KHOA HỌC HÀNH VI GẶP TƯ DUY THIẾT KẾ')}</h2>
            <p className={styles.sectionLead}>
              {bindPhrases(
                'Chương trình giúp người học chuyển từ tư duy bán sản phẩm sang tư duy kiến tạo giá trị; từ thuyết phục sang thấu hiểu và hỗ trợ khách hàng ra quyết định.',
              )}
            </p>
          </div>
          <div className={styles.foundationGrid}>
            {foundations.map((item) => (
              <article
                className={styles.foundationCard}
                key={item.name}
                style={{ '--accent': item.color } as React.CSSProperties}
              >
                <span className={styles.foundationIcon}>
                  <Illustration name={item.art as IllustrationName} size={52} />
                </span>
                <h3>{item.name}</h3>
                <p>{bindPhrases(item.vi)}</p>
                <p>{bindPhrases(item.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- journey */}
      <section className={styles.journeySection} id="hanh-trinh">
        <div className={styles.journeyPanel}>
          <p className={styles.eyebrow}>Mô hình kết quả</p>
          <h2>{bindPhrases('KHÔNG DỪNG Ở MỘT ĐƠN HÀNG')}</h2>
          <p>
            {bindPhrases(
              'Bán hàng bền vững là thiết kế cả một hành trình — từ lúc khách hàng biết đến, tin tưởng, mua, sử dụng, cho tới khi họ chủ động lan tỏa giá trị.',
            )}
          </p>
          <ol className={styles.journeyTrack}>
            {journey.map((step, index) => (
              <li key={step.en}>
                <span className={styles.journeyStep}>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step.en}</strong>
                <small>{bindPhrases(step.vi)}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- stages */}
      <section className={styles.section} id="chuong-trinh">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Cấu trúc 6 giai đoạn</p>
            <h2 className={styles.sectionTitle}>
              {bindPhrases('EMPATHIZE — DEFINE — IDEATE — PROTOTYPE — TEST — IMPLEMENT')}
            </h2>
            <p className={styles.sectionLead}>
              {bindPhrases(
                'Mỗi giai đoạn không chỉ là một phần kiến thức, mà là một bước trong quá trình giải quyết bài toán kinh doanh thực tế của chính người học.',
              )}
            </p>
          </div>
          <div className={styles.stageLayout}>
            <div aria-label="Sáu giai đoạn của chương trình" className={styles.stageNav} role="tablist">
              {stages.map((item) => (
                <button
                  aria-controls="stage-panel"
                  aria-selected={item.id === activeStage}
                  id={`stage-tab-${item.id}`}
                  key={item.id}
                  onClick={() => setActiveStage(item.id)}
                  role="tab"
                  style={{ '--stage-color': item.color } as React.CSSProperties}
                  type="button"
                >
                  <span>{item.index}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
            <div
              aria-labelledby={`stage-tab-${stage.id}`}
              className={styles.stagePanel}
              id="stage-panel"
              role="tabpanel"
              style={{ '--stage-color': stage.color } as React.CSSProperties}
              tabIndex={0}
            >
              <div className={styles.stagePanelHead}>
                <p>
                  Giai đoạn {stage.index} — {stage.name}
                </p>
                <h3>{bindPhrases(stage.vi)}</h3>
              </div>
              <div className={styles.stageColumns}>
                <div>
                  <h4>Nội dung trọng tâm</h4>
                  <ul>
                    {stage.contents.map((line) => (
                      <li key={line}>{bindPhrases(line)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Câu hỏi trọng tâm</h4>
                  <ul className={styles.stageQuestions}>
                    {stage.questions.map((line) => (
                      <li key={line}>{bindPhrases(line)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Đầu ra dự kiến</h4>
                  <ul className={styles.stageOutputs}>
                    {stage.outputs.map((line) => (
                      <li key={line}>{bindPhrases(line)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- method */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="phuong-phap">
        <div className={styles.container}>
          <div className={styles.methodLayout}>
            <div>
              <p className={`${styles.eyebrow} ${styles.eyebrowOrange}`}>Phương pháp 30 — 30 — 40</p>
              <h2 className={styles.sectionTitle}>{bindPhrases('HỌC ĐỂ LÀM ĐƯỢC, KHÔNG ĐỂ BIẾT THÊM')}</h2>
              <p className={styles.sectionLead}>
                {bindPhrases(
                  'Chương trình không đặt trọng tâm vào việc truyền đạt thật nhiều mô hình, mà hướng đến việc giúp người học dùng kiến thức để giải quyết một vấn đề thực tế của mình.',
                )}
              </p>
            </div>
            <div className={styles.methodBars}>
              {method.map((item) => (
                <div
                  className={styles.methodBar}
                  key={item.title}
                  style={{ '--accent': item.color, '--share': `${item.share}%` } as React.CSSProperties}
                >
                  <div className={styles.methodBarTop}>
                    <strong>{bindPhrases(item.title)}</strong>
                    <span>{item.share}%</span>
                  </div>
                  <div className={styles.methodTrack}>
                    <i />
                  </div>
                  <p>{bindPhrases(item.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- deliverables */}
      <section className={styles.section} id="dau-ra">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Sản phẩm đầu ra</p>
            <h2 className={styles.sectionTitle}>{bindPhrases('12 SẢN PHẨM ỨNG DỤNG MANG VỀ')}</h2>
            <p className={styles.sectionLead}>
              {bindPhrases(
                'Kết thúc chương trình, mỗi học viên hoặc nhóm hoàn thành một bộ sản phẩm có thể đưa thẳng vào công việc.',
              )}
            </p>
          </div>
          <ul className={styles.deliverableGrid}>
            {deliverables.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{bindPhrases(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------- outcomes */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="gia-tri">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Giá trị và kết quả</p>
            <h2 className={styles.sectionTitle}>{bindPhrases('TỪ CONTACT ĐẾN VALUE ADVOCATE')}</h2>
          </div>
          <div aria-label="Nhóm giá trị" className={styles.tabs} role="tablist">
            {outcomeTabs.map((tab) => (
              <button
                aria-controls="outcome-panel"
                aria-selected={activeOutcome === tab.key}
                id={`outcome-tab-${tab.key}`}
                key={tab.key}
                onClick={() => setActiveOutcome(tab.key)}
                role="tab"
                type="button"
              >
                {bindPhrases(tab.label)}
              </button>
            ))}
          </div>
          <ul
            aria-labelledby={`outcome-tab-${activeOutcome}`}
            className={styles.outcomeGrid}
            id="outcome-panel"
            role="tabpanel"
            tabIndex={0}
          >
            {outcomes[activeOutcome].map((item) => (
              <li key={item}>
                <Icon name="check" size={19} />
                <span>{bindPhrases(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- ethics */}
      <section className={styles.journeySection}>
        <div className={styles.ethicsBand}>
          <span className={styles.ethicsMark}>
            <Icon name="leaf" size={40} />
          </span>
          <div>
            <blockquote>Influence for Value — Not Manipulation for Conversion</blockquote>
            <p>
              {bindPhrases(
                'Các nguyên lý khoa học hành vi được sử dụng để giúp khách hàng hiểu rõ lựa chọn, giảm cảm nhận rủi ro và ra quyết định phù hợp. Chương trình không cổ súy việc dùng thiên kiến hành vi để gây áp lực, tạo hiểu lầm hoặc thúc đẩy khách hàng mua những thứ không phù hợp.',
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- audience & form */}
      <section className={styles.section} id="doi-tuong">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Dành cho ai</p>
            <h2 className={styles.sectionTitle}>{bindPhrases('ĐỐI TƯỢNG THAM GIA & HÌNH THỨC HỌC')}</h2>
          </div>
          <div className={styles.audienceLayout}>
            <div>
              <h3 className={styles.subHead}>{bindPhrases('Chương trình phù hợp với')}</h3>
              <ul className={styles.audienceList}>
                {audience.map((item) => (
                  <li key={item}>{bindPhrases(item)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.subHead}>{bindPhrases('Hình thức học tập')}</h3>
              <ul className={styles.formatList}>
                {learningFormats.map((item) => (
                  <li key={item}>{bindPhrases(item)}</li>
                ))}
              </ul>
              <div className={styles.instructorGrid} style={{ gridTemplateColumns: '1fr', marginTop: '2rem' }}>
                {instructors.map((person) => (
                  <article className={styles.instructorCard} key={person.name}>
                    <span aria-hidden="true" className={styles.instructorAvatar}>
                      {initials(person.name)}
                    </span>
                    <div>
                      <h3>{person.name}</h3>
                      <p>{bindPhrases(person.title)}</p>
                      <small>{bindPhrases(person.org)}</small>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------- cohorts and tuition */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="hoc-phi">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={`${styles.eyebrow} ${styles.eyebrowOrange}`}>Khai giảng & học phí</p>
            <h2 className={styles.sectionTitle}>{bindPhrases('CHỌN KHÓA PHÙ HỢP VỚI LỊCH CỦA BẠN')}</h2>
            <p className={styles.sectionLead}>
              {bindPhrases('Mỗi khóa giới hạn sĩ số để bảo đảm thời lượng coaching cho từng dự án.')}
            </p>
          </div>

          <div className={styles.cohortGrid}>
            {cohorts.map((cohort) => (
              <article
                className={`${styles.cohortCard} ${cohort.highlight ? styles.cohortCardActive : ''}`}
                key={cohort.code}
              >
                <div className={styles.cohortTop}>
                  <h3>{cohort.code}</h3>
                  {cohort.highlight && <span className={styles.cohortTag}>Sắp khai giảng</span>}
                </div>
                <dl className={styles.cohortFacts}>
                  <div>
                    <dt>Khai giảng</dt>
                    <dd>{cohort.start}</dd>
                  </div>
                  <div>
                    <dt>Hạn đăng ký</dt>
                    <dd>{cohort.deadline}</dd>
                  </div>
                  <div>
                    <dt>Lịch học</dt>
                    <dd>{cohort.mode}</dd>
                  </div>
                  <div>
                    <dt>Chỗ ngồi</dt>
                    <dd>{bindPhrases(cohort.seats)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className={styles.tuitionGrid}>
            {tuition.map((plan) => (
              <article
                className={`${styles.tuitionCard} ${plan.featured ? styles.tuitionFeatured : ''}`}
                key={plan.name}
              >
                <h3>{bindPhrases(plan.name)}</h3>
                <span className={styles.tuitionPrice}>{plan.price}</span>
                <small className={styles.tuitionNote}>{bindPhrases(plan.note)}</small>
                <ul>
                  {plan.perks.map((perk) => (
                    <li key={perk}>
                      <Icon name="check" size={18} />
                      <span>{bindPhrases(perk)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  className={plan.featured ? styles.primaryButton : styles.secondaryButton}
                  href={REGISTER_HREF}
                >
                  Đăng ký <Icon name="arrow" size={18} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- testimonials */}
      <section className={styles.section} id="phan-hoi">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            {/* Visible so this page cannot be shipped with placeholder quotes
                mistaken for real customer feedback. */}
            <span className={styles.mockBadge}>
              <Icon name="clipboard" size={14} /> Dữ liệu mẫu — chờ nội dung thật
            </span>
            <h2 className={styles.sectionTitle}>{bindPhrases('HỌC VIÊN NÓI GÌ')}</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((item) => (
              <article className={styles.testimonialCard} key={item.who}>
                <blockquote>{bindPhrases(item.quote)}</blockquote>
                <footer>
                  <strong>{item.who}</strong>
                  <small>{bindPhrases(item.role)}</small>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- faq */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="faq">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Câu hỏi thường gặp</p>
            <h2 className={styles.sectionTitle}>{bindPhrases('TRƯỚC KHI BẠN ĐĂNG KÝ')}</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq) => (
              <details className={styles.faqItem} key={faq.q}>
                <summary>
                  <span>{bindPhrases(faq.q)}</span>
                  <Icon name="caret" size={20} />
                </summary>
                <p>{bindPhrases(faq.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- final cta */}
      <section className={styles.journeySection} id="dang-ky">
        <div className={styles.finalCta}>
          <div>
            <h2>{bindPhrases('MANG BÀI TOÁN THẬT CỦA BẠN VÀO LỚP')}</h2>
            <p>
              {bindPhrases(
                'Mỗi người tham gia chọn một bài toán bán hàng, marketing hoặc phát triển khách hàng thực tế và giải quyết bài toán đó xuyên suốt sáu giai đoạn của chương trình.',
              )}
            </p>
            <ul className={styles.finalPoints}>
              <li>
                <Icon name="check" size={19} />
                <span>{bindPhrases('Một dự án ứng dụng hoàn chỉnh, có thể triển khai ngay')}</span>
              </li>
              <li>
                <Icon name="check" size={19} />
                <span>{bindPhrases('12 sản phẩm đầu ra và kế hoạch 30–60–90 ngày')}</span>
              </li>
              <li>
                <Icon name="check" size={19} />
                <span>{bindPhrases('Coaching trực tiếp từ giảng viên và chuyên gia GISA')}</span>
              </li>
            </ul>
          </div>
          <div className={styles.finalPanel}>
            <p>{bindPhrases(featuredTuition.name)}</p>
            <p className={styles.finalPrice}>{featuredTuition.price}</p>
            <small>{bindPhrases(featuredTuition.note)}</small>
            <small>
              {bindPhrases(`Khai giảng ${nextCohort.start} · ${nextCohort.seats}`)}
            </small>
            <Link className={styles.primaryButton} href={REGISTER_HREF}>
              Đăng ký khóa học <Icon name="arrow" size={19} />
            </Link>
            <Link className={styles.ghostButton} href="/lien-he">
              Cần tư vấn thêm <Icon name="arrowUp" size={18} />
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
            <strong>{bindPhrases('Behavioral Design Thinking for Sustainable Sales & Marketing')}</strong>
            <small>
              {bindPhrases(
                `Khai giảng ${nextCohort.start} · ${featuredTuition.price} (${featuredTuition.name.toLowerCase()})`,
              )}
            </small>
          </div>
          <div className={styles.stickyActions}>
            <Link className={styles.secondaryButton} href="#chuong-trinh" tabIndex={stuck ? undefined : -1}>
              Xem chương trình
            </Link>
            <Link className={styles.primaryButton} href={REGISTER_HREF} tabIndex={stuck ? undefined : -1}>
              Đăng ký <Icon name="arrow" size={17} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
