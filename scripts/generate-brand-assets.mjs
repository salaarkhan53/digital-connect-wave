/**
 * Derives the web-optimized brand assets from the source symbol artwork.
 * The source lives outside the repo; this script writes only the small
 * derivatives that ship with the site.
 *
 *   node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = process.env.DCW_LOGO_DIR ?? 'X:/Obaid Ceo/DCW';
const OUT = 'public/brand';
const APP = 'app';

const SYMBOL = `${SRC}/symbol.png`;
const CTA = `${SRC}/Let's talk.png`;

await mkdir(OUT, { recursive: true });

/*
 * The current brand symbol: the clean wireframe lemniscate with its signal
 * waves. It arrives as glow painted on a near-black card rather than with an
 * alpha channel, so transparency is rebuilt from the artwork itself.
 *
 * Alpha comes from the brightest channel, not from luminance. Luminance weights
 * blue at 7%, so a blue glow on black would read as almost transparent and the
 * mark would disappear. The colour is then un-premultiplied — divided back out
 * by that alpha — so the blue stays saturated instead of washing toward the
 * background it was painted on.
 */
{
  const { data, info } = await sharp(SYMBOL)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = info.width * info.height;
  const out = Buffer.alloc(px * 4);
  // The card is ~#101010, so anything at or below that is background.
  const FLOOR = 18;
  const scale = 255 / (255 - FLOOR);

  for (let i = 0; i < px; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];

    const peak = Math.max(r, g, b);
    const a = Math.max(0, Math.min(255, Math.round((peak - FLOOR) * scale)));

    if (a === 0) {
      out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = out[i * 4 + 3] = 0;
      continue;
    }

    const k = 255 / a;
    out[i * 4] = Math.min(255, Math.round(r * k));
    out[i * 4 + 1] = Math.min(255, Math.round(g * k));
    out[i * 4 + 2] = Math.min(255, Math.round(b * k));
    out[i * 4 + 3] = a;
  }

  const cut = await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 4 })
    .png()
    .toBuffer();

  const meta = await sharp(cut).metadata();
  console.log(`symbol trimmed -> ${meta.width}x${meta.height}`);

  /*
   * Three sizes, because a dense wireframe barely compresses — dropping WebP
   * quality from 92 to 60 saves under 20%, while halving the width saves 60%.
   * So each one is cut to what its slot actually renders at rather than
   * shipping one large file everywhere.
   */
  // Hero fallback: the only place the symbol is seen at full strength.
  await sharp(cut).resize({ width: 800 }).webp({ quality: 72, effort: 6 })
    .toFile(`${OUT}/symbol.webp`);
  // Footer and CTA watermarks, rendered at 6-10% opacity — detail is invisible.
  await sharp(cut).resize({ width: 480 }).webp({ quality: 62, effort: 6 })
    .toFile(`${OUT}/symbol-bg.webp`);
  // Header lockup, ~36px tall on screen.
  await sharp(cut).resize({ width: 320 }).webp({ quality: 80, effort: 6 })
    .toFile(`${OUT}/symbol-sm.webp`);
}

/*
 * Backdrop for the closing call to action. It is a wide, soft gradient field,
 * so it survives heavy compression: quality 62 is indistinguishable here and a
 * third of the size that 80 would cost.
 */
await sharp(CTA)
  .resize({ width: 1400 })
  .webp({ quality: 62, effort: 6 })
  .toFile(`${OUT}/cta.webp`);

// Square app icons: the symbol centred on the brand void colour.
async function square(size, file) {
  const inner = await sharp(`${OUT}/symbol.webp`)
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
