'use client';

import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { bindPhrases } from '@/lib/vietnamese-text';
import { Icon, type IconName } from '@/components/ui/icon';

import styles from './rises-fold-panorama.module.css';

export type RiseValue = {
  code: string;
  color: string;
  label: string;
  text: string;
};

const RISES_PICTOGRAMS: IconName[] = ['check', 'lightbulb', 'microscope', 'chart', 'leaf'];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function RisesFoldPanorama({ values }: { values: RiseValue[] }) {
  const initialIndex = Math.min(1, values.length - 1);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const panelRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const motionRef = useRef({
    frame: 0,
    lastTime: 0,
    openness: values.map(() => 0),
    velocity: values.map(() => 0),
  });
  const visualIndex = previewIndex;

  const paintPanels = useCallback((openness: number[]) => {
    panelRefs.current.forEach((panel, index) => {
      if (!panel) return;
      const open = openness[index] ?? 0;
      panel.style.setProperty('--panel-grow', (1 + open * 1.45).toFixed(4));
      panel.style.setProperty('--panel-open', open.toFixed(4));
    });
  }, []);

  const settlePanels = useCallback((targetIndex: number | null) => {
    const motion = motionRef.current;
    cancelAnimationFrame(motion.frame);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      motion.openness = motion.openness.map((_, index) => Number(targetIndex !== null && index === targetIndex));
      motion.velocity.fill(0);
      paintPanels(motion.openness);
      return;
    }

    motion.lastTime = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - motion.lastTime) / 1000, 0.032);
      motion.lastTime = now;
      let moving = false;

      motion.openness = motion.openness.map((current, index) => {
        const target = Number(targetIndex !== null && index === targetIndex);
        const displacement = target - current;
        const acceleration = displacement * 205 - motion.velocity[index] * 28;
        const velocity = motion.velocity[index] + acceleration * dt;
        const next = current + velocity * dt;
        motion.velocity[index] = velocity;
        if (Math.abs(displacement) > 0.001 || Math.abs(velocity) > 0.001) moving = true;
        return clamp(next, 0, 1);
      });

      paintPanels(motion.openness);
      if (moving) {
        motion.frame = requestAnimationFrame(step);
      } else {
        motion.openness = motion.openness.map((_, index) => Number(targetIndex !== null && index === targetIndex));
        motion.velocity.fill(0);
        paintPanels(motion.openness);
      }
    };

    motion.frame = requestAnimationFrame(step);
  }, [paintPanels]);

  useEffect(() => {
    const motion = motionRef.current;
    paintPanels(motion.openness);
    return () => cancelAnimationFrame(motion.frame);
  }, [paintPanels]);

  useEffect(() => {
    settlePanels(visualIndex);
  }, [settlePanels, visualIndex]);

  const selectPanel = (index: number) => {
    const nextIndex = clamp(index, 0, values.length - 1);
    setActiveIndex(nextIndex);
    setPreviewIndex(nextIndex);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === 'ArrowLeft') nextIndex = clamp(index - 1, 0, values.length - 1);
    else if (event.key === 'ArrowRight') nextIndex = clamp(index + 1, 0, values.length - 1);
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = values.length - 1;
    else return;

    event.preventDefault();
    panelRefs.current[nextIndex]?.focus();
    selectPanel(nextIndex);
  };

  return (
    <div aria-label="Năm giá trị nền tảng RISES" className={styles.panoramaViewport}>
      <div className={styles.panoramaTrack}>
        {values.map((item, index) => {
          const active = index === activeIndex;
          const visuallyOpen = visualIndex !== null && index === visualIndex;

          return (
            <button
              aria-label={`${String(index + 1).padStart(2, '0')}. ${item.label}. ${item.text}`}
              aria-pressed={active}
              className={styles.foldPanel}
              data-active={visuallyOpen}
              data-scroll-motion="rises-card"
              key={`${item.code}-${item.label}`}
              onBlur={() => setPreviewIndex(null)}
              onClick={() => selectPanel(index)}
              onFocus={() => setPreviewIndex(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              onMouseEnter={() => setPreviewIndex(index)}
              onMouseLeave={() => setPreviewIndex(null)}
              ref={(node) => { panelRefs.current[index] = node; }}
              style={{
                '--accent': item.color,
                '--motion-index': index,
                '--panel-grow': 1,
                '--panel-open': 0,
              } as CSSProperties}
              type="button"
            >
              <span aria-hidden="true" className={styles.foldSurface}>
                <span className={styles.foldIndex}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.foldPictogram}>
                  <Icon name={RISES_PICTOGRAMS[index % RISES_PICTOGRAMS.length]} size={30} />
                </span>
                <span className={styles.foldLetter}>{item.code}</span>
                <span className={styles.foldLabel}>{item.label}</span>
                <span className={styles.foldRule} />
                <span className={styles.foldDescription}>{bindPhrases(item.text)}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className={styles.status}>
        {visualIndex === null ? '' : <>{values[visualIndex]?.label}: {bindPhrases(values[visualIndex]?.text ?? '')}</>}
      </p>
    </div>
  );
}
