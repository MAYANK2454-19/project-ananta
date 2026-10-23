/**
 * The poster's photo treatment, done at build time.
 *
 * Two effects, both real image processing rather than CSS filters:
 *
 *   xerox()  high-contrast photocopy - desaturate, crush the midtones, add
 *            paper grain, then map the result onto two ink colours. A real
 *            duotone: multiply by the highlight colour so white becomes paper,
 *            screen with the shadow colour so black becomes ink/saffron/navy.
 *
 *   tornEdge() an SVG mask with a hand-torn outline, applied with dest-in so
 *            the alpha channel actually carries the tear. Deterministic: the
 *            same slug always tears the same way, so builds are reproducible
 *            and nothing shifts between deploys.
 */
import sharp from 'sharp';

/** Mulberry32 - small deterministic PRNG, seeded from the photo slug. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedOf(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const hexToRgb = (hex) => {
  const [r, g, b] = hex
    .replace('#', '')
    .match(/../g)
    .map((x) => parseInt(x, 16));
  return { r, g, b };
};

/**
 * A torn paper edge as an SVG path. Each side is walked in small steps with a
 * jittered offset, so the outline wobbles like a tear rather than a cut.
 */
export function tornEdgeSvg(width, height, slug, { bite = 0.022, steps = 26 } = {}) {
  const rand = rng(seedOf(slug));
  const bx = width * bite;
  const by = height * bite;
  const pts = [];

  const walk = (from, to, n, place) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      // Two octaves of jitter: a slow wander plus a fine ragged edge.
      const coarse = (rand() - 0.5) * 2;
      const fine = (rand() - 0.5) * 0.8;
      pts.push(place(from + (to - from) * t, coarse + fine));
    }
  };

  walk(bx, width - bx, steps, (x, j) => [x, by + j * by]);
  walk(by, height - by, Math.round(steps * (height / width)), (y, j) => [
    width - bx + j * bx,
    y,
  ]);
  walk(width - bx, bx, steps, (x, j) => [x, height - by + j * by]);
  walk(height - by, by, Math.round(steps * (height / width)), (y, j) => [bx + j * bx, y]);

  const d =
    pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('') +
    'Z';

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<path d="${d}" fill="#fff"/></svg>`,
  );
}

/** Paper grain, so flat areas are not dead-smooth after the contrast crush. */
async function grain(width, height, slug, strength = 16) {
  const rand = rng(seedOf(slug + ':grain'));
  const px = Buffer.allocUnsafe(width * height);
  for (let i = 0; i < px.length; i++) {
    px[i] = 128 + Math.round((rand() - 0.5) * strength * 2);
  }
  return sharp(px, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();
}

export const DUOTONES = {
  // shadow (what black becomes), highlight (what white becomes)
  ink: { shadow: '#16181D', highlight: '#F7F0E3' },
  saffron: { shadow: '#C85F00', highlight: '#F7F0E3' },
  navy: { shadow: '#13204A', highlight: '#F7F0E3' },
};

/**
 * @param {Buffer|string} input
 * @param {object} opts
 * @param {number} opts.width      target width
 * @param {string} opts.slug       seeds the tear and the grain
 * @param {keyof DUOTONES} opts.tone
 * @param {boolean} opts.torn      apply the torn-edge mask
 * @param {number}  opts.contrast  1 = none, higher crushes harder
 */
export async function xerox(
  input,
  { width, slug, tone = 'ink', torn = true, contrast = 1.45, aspect = null },
) {
  const { shadow, highlight } = DUOTONES[tone] ?? DUOTONES.ink;

  let img = sharp(input).rotate();
  if (aspect) {
    const height = Math.round(width / aspect);
    img = img.resize(width, height, { fit: 'cover', position: sharp.strategy.attention });
  } else {
    img = img.resize({ width, withoutEnlargement: false });
  }

  // Photocopy: drop colour, stretch the range, then crush toward black/white.
  img = img
    .greyscale()
    .normalise()
    .linear(contrast, -(128 * contrast) + 128 + 10)
    .modulate({ brightness: 1.04 })
    .sharpen({ sigma: 0.7 });

  // .png() on every intermediate buffer: without it sharp re-encodes in the
  // source format (JPEG), which has no alpha channel - the torn edge would be
  // flattened to black - and re-compresses the image on every pass.
  const meta = await img.clone().png().toBuffer({ resolveWithObject: true });
  const w = meta.info.width;
  const h = meta.info.height;

  // Grain first, while the image is still single-channel grey.
  img = sharp(
    await img
      .composite([{ input: await grain(w, h, slug), blend: 'overlay' }])
      .toColourspace('b-w')
      .png()
      .toBuffer(),
  );

  const hi = hexToRgb(highlight);
  const sh = hexToRgb(shadow);
  const solid = (c) =>
    sharp({ create: { width: w, height: h, channels: 3, background: c } })
      .png()
      .toBuffer();

  // Duotone: multiply pulls white down to the highlight colour, screen lifts
  // black up to the shadow colour. Order matters.
  img = sharp(
    await img
      .toColourspace('srgb')
      .composite([{ input: await solid(hi), blend: 'multiply' }])
      .png()
      .toBuffer(),
  );
  img = sharp(
    await img
      .composite([{ input: await solid(sh), blend: 'screen' }])
      .png()
      .toBuffer(),
  );

  if (torn) {
    img = sharp(
      await img
        .ensureAlpha()
        .composite([{ input: tornEdgeSvg(w, h, slug), blend: 'dest-in' }])
        .png()
        .toBuffer(),
    );
  }

  return { pipeline: img, width: w, height: h };
}
