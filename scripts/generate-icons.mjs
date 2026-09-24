/**
 * Builds the favicon set from the brand symbol, on transparency.
 *
 * The previous set was the symbol composited onto the brand's near-black, so
 * every tab showed a dark tile rather than the mark itself. These carry alpha
 * all the way through, which means the mark sits on whatever the browser's tab
 * strip happens to be.
 *
 *   node scripts/generate-icons.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SRC = 'public/brand/symbol.webp';

/**
 * The source is a wide lemniscate on a lot of empty space. Trimmed and then
 * padded back to a square, so the mark fills as much of a 16px tile as it can
 * rather than sitting in a letterbox.
 */
async function squared(size) {
  /*
   * Below 32px the wireframe mesh aliases into mush, and with nothing behind
   * it the mark goes dim on a dark tab strip. A brightness lift on the small
   * entries only keeps it legible there without touching the large ones or
   * putting a tile back behind it.
   */
  const lift = size <= 32 ? { brightness: 1.35, saturation: 1.15 } : null;

  const trimmed = await (lift ? sharp(SRC).modulate(lift) : sharp(SRC))
    .trim({ threshold: 1 })
    .toBuffer();
  const { width, height } = await sharp(trimmed).metadata();

  // A little breathing room, or the mark touches the edge of the tile.
  const inner = Math.round(size * 0.94);
  const scale = inner / Math.max(width, height);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp(trimmed)
          .resize({
            width: Math.max(1, Math.round(width * scale)),
            height: Math.max(1, Math.round(height * scale)),
            fit: 'inside',
          })
          .toBuffer(),
        gravity: 'centre',
      },
    ])
    /*
     * Palette-encoded. The mark is a handful of blues on transparency, so
     * quantizing costs nothing visible and takes the 512px icon from 239KB to
     * 64KB — it is a favicon, not artwork.
     */
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

/**
 * An ICO wrapping PNG entries.
 *
 * sharp cannot write .ico, and the format has allowed PNG-compressed entries
 * since Vista, which every browser this site supports can read. Writing the
 * 22-byte header by hand is less machinery than pulling in a dependency for
 * one file.
 */
function ico(pngs) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0); // reserved
  head.writeUInt16LE(1, 2); // 1 = icon
  head.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = [];
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size; // 0 means 256
    e[1] = size >= 256 ? 0 : size;
    e[2] = 0; // palette size
    e[3] = 0; // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }

  return Buffer.concat([head, ...entries, ...pngs.map((p) => p.data)]);
}

const icon = await squared(512);
await writeFile('app/icon.png', icon);

/*
 * iOS ignores alpha on a home-screen icon and composites it, historically onto
 * black — which is the brand's own background, so a transparent source lands
 * on the right colour rather than a random one.
 */
await writeFile('app/apple-icon.png', await squared(180));

/*
 * No 256 entry. `icon.png` is what a browser picks for a high-DPI tab or a
 * bookmark tile, so carrying a third copy of it inside the .ico only made the
 * file bigger than everything it is competing with.
 */
const sizes = [16, 32, 48, 64];
await writeFile(
  'app/favicon.ico',
  ico(await Promise.all(sizes.map(async (size) => ({ size, data: await squared(size) })))),
);

console.log('app/icon.png        512x512  transparent');
console.log('app/apple-icon.png  180x180  transparent');
console.log(`app/favicon.ico     ${sizes.join(', ')}  transparent PNG entries`);
