/**
 * Subsets the display face to the one instance the site sets.
 *
 *   npm run fonts
 *
 * The variable Bricolage Grotesque from Google ships opsz, wdth and wght —
 * 128 kB for a design space we never move through. We set exactly one point in
 * it (condensed, extra-bold), so this takes the vendored static instance and
 * cuts it to the characters the site uses: about 12 kB, and it is the page's
 * LCP font.
 *
 * Re-run after adding display copy with characters outside the set below.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const FONTS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'fonts');
const SRC = join(FONTS, 'BricolageGrotesque-Condensed-ExtraBold.ttf');
const OUT = join(FONTS, 'BricolageGrotesque-Condensed-ExtraBold.woff2');

/** Latin, digits and the punctuation the display type actually sets. */
const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  'abcdefghijklmnopqrstuvwxyz' +
  '0123456789' +
  ' .,:;!?&/()[]-—–₹·×%+@#' +
  '’‘“”';

const src = await readFile(SRC);
const out = await subsetFont(src, CHARS, { targetFormat: 'woff2' });
await writeFile(OUT, out);

console.log(
  `display font: ${Math.round(out.length / 1024)} kB woff2 ` +
    `(from ${Math.round(src.length / 1024)} kB ttf)`,
);
