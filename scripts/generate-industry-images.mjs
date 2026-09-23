/**
 * Optimizes the supplied industry photography into the sizes the site uses.
 *
 * The sources are ~1.8 MB PNGs living outside the repo; only the derivatives
 * ship. Set DCW_INDUSTRY_DIR to point somewhere else.
 *
 *   node scripts/generate-industry-images.mjs
 */
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';

const SRC = process.env.DCW_INDUSTRY_DIR ?? 'X:/Obaid Ceo/DCW/Home Pics';
const OUT = 'public/industries';

/** Source file basename (without extension) to industry slug. */
const bySlug = {
  Insurance: 'insurance',
  Medicare: 'medicare',
  'Final Expense': 'final-expense',
  'Healthcare and Billing': 'healthcare',
  'Financial Services': 'financial-services',
  'Retail and E-commerce': 'retail-ecommerce',
  Telecom: 'telecom',
  'Home Services': 'home-services',
};

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const seen = new Set();

for (const file of files) {
  const base = file.replace(/\.[^.]+$/, '');
  const slug = bySlug[base];

  if (!slug) {
    console.warn(`skipped (no slug mapped): ${file}`);
    continue;
  }

  /*
   * The sources are 9:16 portrait and every frame that uses them is portrait
   * too, so the crop stays gentle. `position: attention` lets sharp pick the
   * focal area rather than blindly taking the centre, which matters because
   * these compositions sit their subject below the midline.
   */
  await sharp(`${SRC}/${file}`)
    .resize({ width: 720, height: 1000, fit: 'cover', position: sharp.strategy.attention })
    .webp({ quality: 70, effort: 6 })
    .toFile(`${OUT}/${slug}.webp`);

  seen.add(slug);
  console.log(`${file}  ->  ${slug}.webp`);
}

console.log(`\n${seen.size} industry images written to ${OUT}`);
