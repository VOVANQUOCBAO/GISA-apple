import Image from 'next/image';
import Link from 'next/link';

import { journeyChapters } from '@/content/journey';
import { bindPhrases } from '@/lib/vietnamese-text';

import { Icon } from '../ui/icon';
import styles from './knowledge-journey.module.css';

export function KnowledgeJourney() {
  return (
    <section
      aria-labelledby="journey-title"
      className={styles.section}
      id="phat-trien-ben-vung"
    >
      <header className={styles.head}>
        <h2 id="journey-title">{bindPhrases('TRI THỨC TẠO CHUYỂN BIẾN')}</h2>
        <p className={styles.headLead}>
          {bindPhrases(
            'GISA kết nối cam kết phát triển bền vững với năng lực nghiên cứu, tư vấn và triển khai thực tiễn.',
          )}
        </p>
        <span aria-hidden="true" className={styles.headRule} />
      </header>

      <ol aria-label="Năm năng lực tạo chuyển biến của GISA" className={styles.stack}>
        {journeyChapters.map((chapter, index) => (
          <li className={styles.slide} data-reverse={index % 2 === 1 ? 'true' : undefined} key={chapter.id}>
            <div className={styles.copy}>
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <h3>{bindPhrases(chapter.title)}</h3>
              <p>{bindPhrases(chapter.lead)}</p>
              <Link
                aria-label={`Tìm hiểu thêm về ${chapter.title}`}
                className={styles.link}
                href={chapter.href}
              >
                <span>{bindPhrases('Tìm hiểu thêm')}</span>
                <Icon name="arrow" size={18} />
              </Link>
            </div>

            <figure className={styles.media}>
              <Image
                alt={chapter.imageAlt}
                fill
                sizes="(max-width: 48rem) calc(100vw - 2rem), (max-width: 90rem) 62vw, 52rem"
                src={chapter.image}
                unoptimized
              />
            </figure>
          </li>
        ))}
      </ol>
    </section>
  );
}
