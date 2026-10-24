/**
 * Makes one consistent set out of whatever phone photos people send.
 *
 *   npm run team:photos
 *   npm run team:photos -- --force
 *
 * Drop a raw photo at public/team/raw/<slug>.jpg (any size, any lighting) and
 * run this. Each one is cropped to 4:5 around the face (sharp's attention
 * strategy), then given the same paper treatment as the event photos, so a
 * bright studio headshot and a dim corridor snap end up looking like they were
 * printed on the same sheet.
 *
 * Two sizes per photo, AVIF and WebP:
 *   <slug>-320.avif/.webp   the board
 *   <slug>-640.avif/.webp   2x, and the larger faculty cards
 *
 * Colour is kept here. The page shows them desaturated and brings the colour
 * back on hover and focus, on pointer devices only.
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'public', 'team', 'raw');
const OUT = join(ROOT, 'public', 'team');
const force = process.argv.includes('--force');

const SIZES = [320, 640];
const ASPECT = 4 / 5;
const ACCEPT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic']);

async function newerThan(a, b) {
  const [sa, sb] = await Promise.all([
    stat(a).catch(() => null),
    stat(b).catch(() => null),
  ]);
  return !sa || !sb || sa.mtimeMs > sb.mtimeMs;
}

/**
 * Paper treatment: lift the shadows a little so dark phone photos keep their
 * detail, flatten the contrast range toward newsprint, and warm the whole
 * thing toward the cream. Gentler than the event-photo xerox — faces have to
 * stay recognisable.
 */
function treat(pipeline) {
  return pipeline
    .normalise({ lower: 2, upper: 98 })
    .linear(1.08, -6)
    .modulate({ saturation: 0.82, brightness: 1.02 })
    .tint({ r: 252, g: 247, b: 236 })
    .sharpen({ sigma: 0.6 });
}

async function main() {
  await mkdir(RAW, { recursive: true });

  let files = [];
  try {
    files = (await readdir(RAW)).filter((f) => ACCEPT.has(extname(f).toLowerCase()));
  } catch {
    files = [];
  }

  if (files.length === 0) {
    console.log(
      `No raw photos in public/team/raw.\n` +
        `Drop photos there named <slug>.jpg (e.g. mukti-porwal.jpg), then run this again.\n` +
        `People with no photo get an initials card, which is a valid final state.`,
    );
    await writeFile(join(OUT, 'manifest.json'), JSON.stringify({}, null, 2) + '\n');
    return;
  }

  const manifest = {};
  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = basename(file, extname(file));
    const src = join(RAW, file);

    for (const width of SIZES) {
      const avif = join(OUT, `${slug}-${width}.avif`);
      const webp = join(OUT, `${slug}-${width}.webp`);

      if (!force && !(await newerThan(src, avif)) && !(await newerThan(src, webp))) {
        skipped += 2;
        continue;
      }

      const base = treat(
        sharp(src)
          .rotate() // honour EXIF orientation; phone photos are full of it
          .resize(width, Math.round(width / ASPECT), {
            fit: 'cover',
            position: sharp.strategy.attention,
          }),
      );

      await base.clone().avif({ quality: 58, effort: 5 }).toFile(avif);
      await base.clone().webp({ quality: 78 }).toFile(webp);
      written += 2;
    }

    manifest[slug] = { width: SIZES[0], height: Math.round(SIZES[0] / ASPECT) };
    console.log(`  ${slug}  4:5  ${SIZES.join(', ')}`);
  }

  await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\nteam photos: ${written} written, ${skipped} up to date`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
