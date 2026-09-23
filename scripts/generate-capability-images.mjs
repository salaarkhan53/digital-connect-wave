/**
 * Optimizes the supplied capability photography into the size the site uses.
 *
 * The sources are ~1.9 MB square PNGs living outside the repo; only the
 * derivatives ship. Set DCW_CAPABILITY_DIR to point somewhere else.
 *
 *   node scripts/generate-capability-images.mjs
 */
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';

const SRC = process.env.DCW_CAPABILITY_DIR ?? 'X:/Obaid Ceo/DCW/Capibilities';
const OUT = 'public/capabilities';

/**
 * Source file basename (without extension) to capability slug.
 *
 * Spelling follows the files as supplied, typos included, so the mapping keeps
 * working without anyone having to rename the originals.
 */
const bySlug = {
  'Inbound contact centre': 'inbound-support',
  'Outbound Campaigns': 'outbound-campaigns',
  'Customer Support Desk': 'customer-support',
  'Lead Generation': 'lead-generation',
  'Sales Verification': 'sales-verification',
  'Medical Billing Support': 'medical-billing',
  'B2B Outreach': 'b2b-outreach',
  'Digital Marketinng': 'digital-marketing',
};

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const seen = new Set();

for (const file of files) {
  const slug = bySlug[file.replace(/\.[^.]+$/, '')];

  if (!slug) {
    console.warn(`skipped (no slug mapped): ${file}`);
    continue;
  }

  /*
   * Two derivatives, because the art lands in two very different frames and
   * one file cannot serve both: the detail hero is 5:4 and the index cards
   * are 16:9, and letting CSS crop the taller file down to the wider one cut
   * the top off three of the eight subjects' heads.
   *
   * Both crops are anchored a quarter of the way down the spare height rather
   * than centred. Every one of these compositions sits its subject in the
   * upper two thirds with desk in the bottom third, so a centre crop loses
   * heads and sharp's `attention` strategy is worse still: it chases the
   * brightest glowing overlay, which sits lower, and decapitates four of them.
   */
  const { width, height } = await sharp(`${SRC}/${file}`).metadata();

  for (const [suffix, w, h] of [
    ['', 1200, 960], // 5:4, the detail hero
    ['-wide', 1280, 720], // 16:9, the index cards
  ]) {
    const cropHeight = Math.round((width * h) / w);
    const top = Math.round((height - cropHeight) * 0.25);

    await sharp(`${SRC}/${file}`)
      .extract({ left: 0, top, width, height: cropHeight })
      .resize({ width: w, height: h, fit: 'cover' })
      .webp({ quality: 72, effort: 6 })
      .toFile(`${OUT}/${slug}${suffix}.webp`);
  }

  seen.add(slug);
  console.log(`${file}  ->  ${slug}.webp`);
}

console.log(`\n${seen.size} capability images written to ${OUT}`);
