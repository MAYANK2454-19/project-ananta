'use client';

import { useEffect, useState } from 'react';
import styles from './Countdown.module.css';

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remaining(target: number, now: number): Remaining | null {
  const ms = target - now;
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Counts down to the registration deadline.
 *
 * The ticking digits are aria-hidden and the deadline is given once, as a
 * plain sentence, in text a screen reader actually reads — a live region that
 * re-announces every second would be unusable.
 *
 * Renders the static sentence on the server and during the first client
 * render, then starts ticking: the remaining time depends on the clock, so
 * rendering it during hydration would guarantee a mismatch.
 */
export function Countdown({
  deadline,
  label,
  closedLabel = 'Registration has closed.',
}: {
  /** ISO 8601 with an explicit offset. */
  deadline: string;
  /** The plain sentence, e.g. "Registration closes 4 November 2026, 23:59 IST". */
  label: string;
  closedLabel?: string;
}) {
  const target = new Date(deadline).getTime();
  const [left, setLeft] = useState<Remaining | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setLeft(remaining(target, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const units =
    left == null
      ? null
      : ([
          ['Days', left.days],
          ['Hrs', left.hours],
          ['Min', left.minutes],
          ['Sec', left.seconds],
        ] as const);

  return (
    <div className={styles.wrap}>
      {units && (
        <p className={styles.digits} aria-hidden="true">
          {units.map(([unit, value]) => (
            <span key={unit} className={styles.unit}>
              <span className={styles.value}>{pad(value)}</span>
              <span className={styles.unitLabel}>{unit}</span>
            </span>
          ))}
        </p>
      )}

      {/* undefined = not mounted yet; null = deadline passed. */}
      {left === null && (
        <p className={styles.closed} aria-hidden="true">
          {closedLabel}
        </p>
      )}

      <p className={styles.label}>
        <time dateTime={deadline}>{left === null ? closedLabel : label}</time>
      </p>
    </div>
  );
}
