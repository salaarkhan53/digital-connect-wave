/**
 * Builds the 1200x630 card that link previews render.
 *
 * A file rather than a generated route: `output: 'export'` has no server to run
 * Next's ImageResponse on. PNG rather than WebP, because the social crawlers
 * are still inconsistent about WebP and a card that fails to decode is worse
 * than a slightly larger file.
 *
 *   node scripts/generate-og-image.mjs
 */
import sharp from 'sharp';

const W = 1200;
const H = 630;
const OUT = 'public/brand/og.png';

/*
 * The backdrop, in the same language as the site: near-black, a blue glow
 * behind where the mark sits, and the faint engineering grid.
 */
const grid = Array.from({ length: Math.ceil(W / 64) + 1 }, (_, i) =>
  `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="${H}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`,
)
  .concat(
    Array.from({ length: Math.ceil(H / 64) + 1 }, (_, i) =>
      `<line x1="0" y1="${i * 64}" x2="${W}" y2="${i * 64}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`,
    ),
  )
  .join('');

const backdrop = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="72%" cy="42%" r="58%">
      <stop offset="0%" stop-color="#0c7bf0" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#05070e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#05070e"/>
  ${grid}
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
</svg>`);

/*
 * Type is drawn as SVG paths-free text with a generic family: the brand faces
 * are woff2 in app/fonts and sharp cannot load them, and a card that renders in
 * a fallback face is far better than one that fails to build. Weight and
 * spacing are set to sit as close to the wordmark as a system sans allows.
 */
const words = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="72" y="286" font-family="Segoe UI, Arial, Helvetica, sans-serif"
        font-size="30" letter-spacing="7" font-weight="600" fill="#6fe3ff">US CONTACT OPERATIONS</text>

  <text x="70" y="372" font-family="Segoe UI, Arial, Helvetica, sans-serif"
        font-size="68" font-weight="700" fill="#ffffff">DIGITAL <tspan fill="#2ea8ff">CONNECT WAVE</tspan></text>

  <text x="72" y="432" font-family="Segoe UI, Arial, Helvetica, sans-serif"
        font-size="29" font-weight="400" fill="rgba(255,255,255,0.66)">Connecting tomorrow’s possibilities.</text>

  <rect x="72" y="480" width="86" height="4" rx="2" fill="#0b70e0"/>

  <text x="72" y="546" font-family="Segoe UI, Arial, Helvetica, sans-serif"
        font-size="25" font-weight="400" fill="rgba(255,255,255,0.5)">Inbound · Outbound · Lead generation · Verification</text>
</svg>`);

const mark = await sharp('public/brand/symbol.webp')
  .resize({ width: 470, fit: 'inside' })
  .toBuffer();

await sharp(backdrop)
  .composite([
    { input: mark, left: 700, top: 96, blend: 'screen' },
    { input: words, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const { size } = await sharp(OUT).metadata().then(async (m) => ({
  size: (await import('node:fs')).statSync(OUT).size,
  m,
}));

console.log(`${OUT} written — ${W}x${H}, ${(size / 1024).toFixed(0)} KB`);
