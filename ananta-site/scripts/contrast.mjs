/**
 * Prints the contrast ratio for every text/background pair the design system
 * uses. Run with `node scripts/contrast.mjs`; the table goes in the PR.
 */
const HEX = (h) =>
  h
    .replace('#', '')
    .match(/../g)
    .map((x) => parseInt(x, 16));
const lin = (c) =>
  c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4;
const L = (h) => {
  const [r, g, b] = HEX(h);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [x, y] = [L(a), L(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const T = {
  cream: '#F7F0E3',
  ink: '#16181D',
  saffron: '#F07800',
  green: '#007830',
  navy: '#13204A',
  white: '#FFFFFF',
  charcoal: '#2E2E2E',
  dgBlue: '#0078C0',
  ccViolet: '#6A4BFF',
  terracotta: '#C0663A',
  ochre: '#B8984E',
  teal: '#3F6E5F',
  slate: '#4F6C96',
};

const pairs = [
  ['ink', 'cream', 'body text, headings'],
  ['navy', 'cream', 'strong labels on paper'],
  ['green', 'cream', 'links, small accent text'],
  ['saffron', 'cream', 'DISPLAY ONLY - large type'],
  ['ink', 'saffron', 'saffron strips and fills'],
  ['navy', 'saffron', 'saffron strip, alt'],
  ['cream', 'navy', 'dark sections, footer'],
  ['white', 'navy', 'dark sections, max contrast'],
  ['saffron', 'navy', 'accent on dark - large only'],
  ['cream', 'ink', 'ink label strips'],
  ['white', 'ink', 'ink label strips, alt'],
  ['cream', 'charcoal', 'Code Club panel'],
  ['ccViolet', 'charcoal', 'Code Club tag - large only'],
  ['white', 'dgBlue', 'DevGrowth tag'],
  ['cream', 'dgBlue', 'DevGrowth tag, alt'],
  ['white', 'terracotta', 'SANGAM tag'],
  ['ink', 'ochre', 'SANGAM tag'],
  ['white', 'teal', 'SANGAM tag'],
  ['white', 'slate', 'SANGAM tag'],
];

const pad = (s, n) => String(s).padEnd(n);
console.log(
  pad('fg', 12) +
    pad('bg', 12) +
    pad('ratio', 9) +
    pad('AA sm', 8) +
    pad('AA lg', 8) +
    'use',
);
console.log('-'.repeat(84));
let fails = 0;
for (const [fg, bg, use] of pairs) {
  const r = ratio(T[fg], T[bg]);
  const sm = r >= 4.5,
    lg = r >= 3;
  const expectedLarge = /large|DISPLAY/i.test(use);
  if (!sm && !expectedLarge) fails++;
  console.log(
    pad(fg, 12) +
      pad(bg, 12) +
      pad(r.toFixed(2) + ':1', 9) +
      pad(sm ? 'PASS' : 'fail', 8) +
      pad(lg ? 'PASS' : 'FAIL', 8) +
      use,
  );
}
console.log('-'.repeat(84));
console.log(
  fails
    ? `${fails} pair(s) fail AA small and are not marked large-only`
    : 'All body-text pairs meet AA.',
);
