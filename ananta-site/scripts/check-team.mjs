/**
 * Refuses to ship a team page full of "TODO Name".
 *
 * Fails the build only on a real production deploy. CI and local builds get a
 * warning instead, because the placeholders are deliberate until Aryaveer adds
 * the real people and CI has to stay green in the meantime.
 *
 * Production is detected from VERCEL_ENV=production (set by Vercel) or
 * ANANTA_ENV=production (set by hand anywhere else).
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEAM_FILE = join(ROOT, 'content', 'team.ts');

const isProduction =
  process.env.VERCEL_ENV === 'production' || process.env.ANANTA_ENV === 'production';

const src = readFileSync(TEAM_FILE, 'utf8');

// Count the entries, not every mention of the word.
const todos = (src.match(/name:\s*['"]TODO[^'"]*['"]/g) ?? []).length;

if (todos === 0) {
  console.log('team check passed: no placeholder entries');
  process.exit(0);
}

const lines = [
  `content/team.ts still has ${todos} placeholder ${todos === 1 ? 'entry' : 'entries'} named "TODO Name".`,
  `Replace them with the real people before this goes public.`,
];

if (isProduction) {
  console.error(`\n  Team check failed:\n`);
  for (const l of lines) console.error(`  - ${l}`);
  console.error(
    `\n  This check only fails on a production deploy. To build anyway, unset\n` +
      `  VERCEL_ENV / ANANTA_ENV, but do not publish the site in this state.\n`,
  );
  process.exit(1);
}

console.warn(`\n  Team check warning (not a production build):`);
for (const l of lines) console.warn(`  - ${l}`);
console.warn('');
