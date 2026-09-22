/**
 * Derives the web-optimized brand assets from the source logo PNGs.
 * The sources live outside the repo (they are 3-12 MB each); this script
 * writes only the small derivatives that ship with the site.
 *
 *   node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = process.env.DCW_LOGO_DIR ?? 'X:/Obaid Ceo/DCW';
const OUT = 'public/brand';
const APP = 'app';

const MARK = `${SRC}/logo no bg.png`;
const LOCKUP = `${SRC}/Digital Connect Wave.png`;

await mkdir(OUT, { recursive: true });

// The mark is transparent but its glow is painted on black; trim the dead margin
// so the symbol fills its box predictably at every size.
const mark = await sharp(MARK).trim({ threshold: 10 }).toBuffer();
const { width, height } = await sharp(mark).metadata();
console.log(`mark trimmed -> ${width}x${height}`);

await sharp(mark).resize({ width: 1200 }).webp({ quality: 92 }).toFile(`${OUT}/mark.webp`);
await sharp(mark).resize({ width: 256 }).webp({ quality: 92 }).toFile(`${OUT}/mark-sm.webp`);

// Full lockup, trimmed of its white margin — used for social share art.
await sharp(LOCKUP)
  .trim({ threshold: 15 })
  .resize({ width: 900 })
  .webp({ quality: 92 })
  .toFile(`${OUT}/lockup.webp`);

// Square app icons: the mark centred on the brand void colour.
async function square(size, file) {
  const inner = await sharp(mark)
    .resize({ width: Math.round(size * 0.82), fit: 'inside' })
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 5, g: 7, b: 14, alpha: 1 } },
  })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(file);
}

await square(512, `${APP}/icon.png`);
await square(180, `${APP}/apple-icon.png`);

console.log('brand assets written');
