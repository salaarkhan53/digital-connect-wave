/**
 * Optimizes the "How we work" step illustrations.
 *
 * These are transparent PNGs, so the alpha channel is preserved: the step
 * panel is white and the illustrations have to sit on it without a visible
 * box around them.
 *
 *   node scripts/generate-process-images.mjs
 */
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';

const SRC = process.env.DCW_PROCESS_DIR ?? 'X:/Obaid Ceo/DCW/How we work';
const OUT = 'public/process';

/** Source basename to process step id. */
const bySlug = {
  Discover: 'discover',
  Build: 'build',
  Train: 'train',
  Launch: 'launch',
  Optimize: 'optimize',
};

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(png|webp)$/i.test(f));
let written = 0;

for (const file of files) {
  const slug = bySlug[file.replace(/\.[^.]+$/, '')];
  if (!slug) {
    console.warn(`skipped (no step mapped): ${file}`);
    continue;
  }

  await sharp(`${SRC}/${file}`)
    .resize({ width: 900, withoutEnlargement: true })
    // `alphaQuality` matters more than `quality` here: the cut-out edge is
    // what would show banding against the white panel.
    .webp({ quality: 74, alphaQuality: 90, effort: 6 })
    .toFile(`${OUT}/${slug}.webp`);

  written += 1;
  console.log(`${file}  ->  ${slug}.webp`);
}

console.log(`\n${written} process images written to ${OUT}`);
