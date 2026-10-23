'use client';

import { useEffect, useRef } from 'react';
import styles from './Stamp.module.css';
import { EVENT } from '@/content/event';

const RING_TEXT = 'ONE LIVE PRODUCT · SIX WEEKS · ALL YEARS · ';

/** Circle path for the textPath, drawn clockwise from the left. */
const ring = (r: number) =>
  `M 50 50 m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0`;

type Props = {
  /** Rendered width. The SVG itself is a 100x100 viewBox. */
  size?: number;
  className?: string;
};

/**
 * The poster's rubber stamp: अनन्त inside a ring of set text.
 *
 * Turns slowly with the scroll position. The listener is passive, writes one
 * custom property and does nothing else, and is never attached at all when the
 * visitor prefers reduced motion — the stamp then simply sits still, which is
 * what a stamp does anyway.
 */
export function Stamp({ size = 132, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)');
    if (!motionOk.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // A third of a turn over a full page scroll. Slow on purpose.
      el.style.setProperty('--turn', `${window.scrollY * 0.04}deg`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={[styles.stamp, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <defs>
          <path id="stamp-ring" d={ring(40)} fill="none" />
        </defs>

        <circle cx="50" cy="50" r="47.5" className={styles.outer} />
        <circle cx="50" cy="50" r="30" className={styles.inner} />

        <text className={styles.ringText}>
          <textPath href="#stamp-ring" startOffset="0">
            {RING_TEXT.repeat(2)}
          </textPath>
        </text>
      </svg>

      <span className={styles.deva} aria-hidden="true">
        {EVENT.devanagari}
      </span>

      {/* The stamp carries meaning, so it has a text equivalent. */}
      <span className="visually-hidden">
        {EVENT.devanagari} — one live product, six weeks, all years.
      </span>
    </div>
  );
}
