/**
 * Prepares the paper texture for the page background.
 *
 *   npm run textures
 *
 * The source scan is 2246x3174 and 1.3 MB, far too heavy to ship as-is for a
 * background. It is reduced to a small tile and mirrored into a 2x2 block so
 * it repeats with no visible seam: a straight crop would show a hard grid
 * line every tile.
 */
import { mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets', 'textures', 'paper.jpg');
const OUT = join(ROOT, 'public', 'textures');

/** Half the final tile. 260 -> a 520px seamless tile. */
const HALF = 260;

async function main() {
  await mkdir(OUT, { recursive: true });

  // A calm patch from the middle of the scan: no torn corner, no shadow.
  const patch = await sharp(SRC)
    .extract({ left: 700, top: 1100, width: 1000, height: 1000 })
    .resize(HALF, HALF, { fit: 'fill' })
    .greyscale()
    .normalise()
    .linear(0.55, 108) // flatten it; this sits under text at low opacity
    .png()
    .toBuffer();

  const flipH = await sharp(patch).flop().png().toBuffer();
  const flipV = await sharp(patch).flip().png().toBuffer();
  const flipBoth = await sharp(patch).flip().flop().png().toBuffer();

  // Mirrored 2x2: edges meet their own reflection, so the tile is seamless.
  const tile = sharp({
    create: { width: HALF * 2, height: HALF * 2, channels: 3, background: '#ffffff' },
  }).composite([
    { input: patch, left: 0, top: 0 },
    { input: flipH, left: HALF, top: 0 },
    { input: flipV, left: 0, top: HALF },
    { input: flipBoth, left: HALF, top: HALF },
  ]);

  const buf = await tile.png().toBuffer();

  await sharp(buf)
    .jpeg({ quality: 62, progressive: true })
    .toFile(join(OUT, 'paper.jpg'));
  await sharp(buf).webp({ quality: 70 }).toFile(join(OUT, 'paper.webp'));

  const { size } = await stat(join(OUT, 'paper.jpg'));
  console.log(
    `textures: paper tile ${HALF * 2}x${HALF * 2}, ${Math.round(size / 1024)} kB`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
