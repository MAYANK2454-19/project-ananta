/**
 * Fonts, self-hosted by next/font at build time. No @import, no request to
 * fonts.googleapis.com at runtime, and `display: swap` with a matched
 * fallback so nothing reflows once the real face lands.
 *
 * All four are SIL Open Font License. See assets/CREDITS.md.
 */
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  DM_Mono,
  Rozha_One,
} from 'next/font/google';

/**
 * Display. The poster's wordmark is an ultra-condensed heavy grotesque, so we
 * pull the `wdth` axis and drive it to 75% in CSS (--display-stretch).
 */
export const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  display: 'swap',
  variable: '--font-display',
  // Sized to sit close to the real face so swapping does not shift layout.
  adjustFontFallback: true,
  fallback: ['Arial Narrow', 'Helvetica Neue', 'sans-serif'],
});

/** Prose and pull lines, including the italic the poster uses for emphasis. */
export const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

/** Labels, dates, metadata, captions, the build log. */
export const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

/** अनन्त only. */
export const devanagari = Rozha_One({
  subsets: ['devanagari', 'latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-deva',
});

export const fontClassNames = [
  display.variable,
  serif.variable,
  mono.variable,
  devanagari.variable,
].join(' ');
