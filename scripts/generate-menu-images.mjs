/**
 * Optimizes the mega-menu featured-tile artwork.
 *
 * These are transparent PNGs that sit on the tile's own gradient, so the alpha
 * channel is preserved and the transparent margin is trimmed: the tile is only
 * about 250px wide, and padding baked into the source would waste a good part
 * of it.
 *
 *   node scripts/generate-menu-images.mjs
 */
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';

const SRC = process.env.DCW_MENU_DIR ?? 'X:/Obaid Ceo/DCW/Dropdown pics';
const OUT = 'public/menu';

/** Source basename to the featured tile it belongs to. */
const bySlug = {
  'How We Work': 'how-we-work',
  Compliance: 'compliance',
};

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(png|webp)$/i.test(f));
let written = 0;

for (const file of files) {
  const slug = bySlug[file.replace(/\.[^.]+$/, '')];

  if (!slug) {
    console.warn(`skipped (no tile mapped): ${file}`);
    continue;
  }

  await sharp(`${SRC}/${file}`)
    .trim({ threshold: 1 })
    .resize({ width: 640, withoutEnlargement: true })
    // `alphaQuality` over `quality`: the cut-out edge is what would band
    // against the tile's gradient.
    .webp({ quality: 78, alphaQuality: 92, effort: 6 })
    .toFile(`${OUT}/${slug}.webp`);

  written += 1;
  console.log(`${file}  ->  ${slug}.webp`);
}

console.log(`\n${written} menu images written to ${OUT}`);
