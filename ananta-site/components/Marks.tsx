import styles from './Marks.module.css';

/**
 * The poster's rotated label strips — "DON'T PITCH IT." in ink, "SHIP IT." in
 * saffron. Set, not drawn: real text, selectable and readable by a screen
 * reader, with the rotation purely visual.
 */
export function Strip({
  children,
  tone = 'ink',
  rotate = -2,
  as: Tag = 'span',
  className,
}: {
  children: React.ReactNode;
  tone?: 'ink' | 'saffron' | 'navy';
  rotate?: number;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'div';
  className?: string;
}) {
  return (
    <Tag
      className={[styles.strip, styles[tone], className].filter(Boolean).join(' ')}
      style={{ '--rotate': `${rotate}deg` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/**
 * Divider in SANGAM's visual language: a circuit trace that runs, steps and
 * terminates in a ring node. Stands in for its four-ribbon motif, which is the
 * club's own mark and not ours to redraw.
 */
export function CircuitRule({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={[styles.circuit, flip ? styles.flip : '', className]
        .filter(Boolean)
        .join(' ')}
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 12 H232 l14 -9 H520 l10 9 H812 l12 -9 H1064"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="1080"
        cy="3"
        r="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1090 3 H1200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="232" cy="12" r="2" fill="currentColor" />
      <circle cx="812" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

/** Small uppercase mono label with a hairline above it. Section eyebrow. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={[styles.eyebrow, 'meta', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  );
}
