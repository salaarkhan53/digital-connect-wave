# Digital Connect Wave

Marketing site for Digital Connect Wave — *Connecting Tomorrow's Possibilities*.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · GSAP/ScrollTrigger · Three.js (React Three Fiber) · Lenis.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start
```

---

## Before you launch

**Read [`content/REVIEW.md`](content/REVIEW.md).** It lists every fact on the site
that has not been confirmed by DCW — the headline statistics, the compliance
statements, the company history — along with the two things that are wired but
not finished (contact form delivery, careers applications).

Every record in `content/` carries a `verified` flag. Search for `verified: false`
to find them in place.

Three rules are baked into the content and must stay that way:

1. **US market only.** No reference to any offshore location anywhere — not in
   copy, metadata, alt text or structured data. The source material this content
   came from was offshore-framed; that framing was stripped, not softened.
2. **One contact record.** `Contact@digitalconnectwave.net`, `+1 (325) 202-4836`,
   30 N Gould St Ste R, Sheridan, WY 82801. It lives in `content/contact.ts` and
   feeds the header, footer, contact page and JSON-LD. Nothing else is permitted.
3. **Careers roles are titles only.** No location, responsibilities, requirements
   or salary bands. Do not add those fields without being asked.

---

## Structure

```
app/                  routes, fonts, global tokens
  fonts/              Clash Display + Satoshi (self-hosted woff2)
content/              the single source of truth for all copy
  REVIEW.md           pre-launch checklist — read this
components/
  symbol/             the animated brand mark (WebGL)
  home/               home page sections, in page order
  ui/                 shared primitives (Reveal, SectionHeading, CTABand, …)
  art/                generated brand art used instead of photography
  layout/             header and footer
lib/
  motion.ts           one motion scale for the whole site
  gsap.ts             single plugin registration point
  savings.ts          savings estimator arithmetic
scripts/              asset generation and browser QA
```

**Content never lives in components.** Every page reads from `content/`, so copy
changes are one file, not a hunt through JSX.

---

## Design notes

**Palette** is derived from the logo: neon blue on near-black. The page
alternates dark and light bands rather than offering a theme toggle, so tokens
are absolute.

The logo blue `#0c7bf0` only reaches 4.11:1 against white, so it cannot carry
white button text or small text on a light band. Two working tones exist:

- `--color-blue` `#0b70e0` — fills and buttons
- `--color-blue-ink` `#0a5fbf` — blue text and icons on light bands

The original brightness survives in `--color-blue-bright`, `--color-spark` and
the WebGL shader, where nothing has to be read.

**Photography** is used for the industry verticals only. `components/art/
IndustryVisual.tsx` renders the supplied photo where one exists and falls back
to generated brand art (`MeshPanel.tsx`) where it does not, so a vertical
without a photo degrades to something deliberate rather than leaving a hole.
Technology & SaaS is currently the only one without.

Everything else (capabilities, careers, the mega-menu tile) stays on generated
art: gradient fields and contour lines from the logo's own language.

Run `node scripts/generate-industry-images.mjs` to re-derive the optimized
industry photos from their sources.

**No em dashes in any rendered copy.** Use a colon, a comma or a full stop.
`npm run build` then grep `out/**/*.html` for the character to confirm.

**Body prose is justified.** The `.body-justify` utility carries it, applied to
the descriptive paragraph in each section and never to labels, figures or
centred text. It reverts to left-aligned below 480px, where the column is too
narrow to justify without visible gaps.

---

## The animated mark

`components/symbol/` generates the logo live rather than playing a video: a tube
swept along a lemniscate (`lemniscate.ts`), rendered as a wireframe so the
crosshatch *is* the geometry, with an additive shader carrying the travelling
flares and a bloom pass for the glow.

It is wrapped in `<HeroSymbol source="webgl" | "frames" | "video" />`. If you
later want to supply a rendered frame sequence or a video, it drops into that
interface without touching the hero.

The scene is deliberately expensive to load, so it is fenced in:

- **Code split** — Three.js never reaches a page without the mark. Pages without
  it score 100 on Lighthouse performance.
- **Deferred to idle** — it mounts on `requestIdleCallback`, so parsing never
  competes with first paint.
- **Skipped on low-end devices** — Save-Data, ≤2 GB memory or <4 cores get the
  static brand PNG instead. Same symbol, no motion, no cost.
- **Paused offscreen** — an IntersectionObserver stops the render loop once the
  mark scrolls away.
- **Cross-faded in** — the static mark holds the space and fades out as the live
  scene fades in, because swapping them instantly reads as a glitch.

---

## Motion

All durations, easings and stagger values live in `lib/motion.ts`. Nothing is
one-off.

`<Reveal>` drives scroll reveals. Two guards stop it ever hiding content
permanently: children are hidden only when `data-js` is on `<html>` (set inline
before first paint), **and** only inside a `[data-reveal-root]`. A stray
`data-reveal` outside a `<Reveal>` renders visible rather than disappearing.

Under `prefers-reduced-motion` everything is still: the marquee stops, the pin
is skipped, and all 78 reveal targets render immediately without scrolling.
`npm run qa:motion` verifies this.

Only one section on the site is pinned — the process scene, and only above
1024px wide *and* 760px tall. Pinning fights native scroll; more than one or two
per page makes everything feel sticky.

---

## QA

Browser checks run against a local server with Playwright (`playwright-core`
using the system Chrome).

```bash
npm run qa:routes             # every route: status, h1 count, x-overflow, console errors
PORT=3000 npm run qa:routes 390 844 m   # mobile widths
npm run qa:tour               # screenshot the home page viewport by viewport
npm run qa:motion             # compare reduced-motion against normal
```

A `fullPage` screenshot is useless on this site — it does not scroll the way a
person does, so every scroll reveal is captured still hidden. `qa:tour` wheels
down the page instead.

Current Lighthouse (desktop preset, production build): **100** accessibility,
best practices and SEO on every page. Performance is **100** on pages without
the 3D mark and **79** on the home page, where Three.js costs main-thread time.
Measured under headless software rendering, which overstates that cost
considerably; with WebGL unavailable the same page scores 99.

## Regenerating brand assets

```bash
npm run brand:assets
```

Reads the source logos (outside the repo — they are 3–12 MB each) and writes the
optimized derivatives into `public/brand/` plus the app icons. Override the
source location with `DCW_LOGO_DIR`.

---

## Review deployment (GitHub Pages)

`.github/workflows/deploy-pages.yml` publishes a static export to
<https://salaarkhan53.github.io/digital-connect-wave/> on every push to
`master`.

The Pages build is deliberately different from production, driven by three
environment variables the workflow sets:

| Variable | Effect |
|---|---|
| `GITHUB_PAGES=true` | switches `next.config.ts` to `output: 'export'` with the repo `basePath` |
| `NEXT_PUBLIC_PREVIEW=true` | `noindex, nofollow` on every page and a `Disallow: /` robots.txt |
| `NEXT_PUBLIC_SITE_URL` | canonical URLs point at Pages rather than claiming to be the production domain |

**The published site is world-readable.** GitHub Pages has no access control
outside Enterprise Cloud, so treat the review URL as public even though the
figures in `content/REVIEW.md` are not signed off. The `noindex` keeps it out
of search results; it does not keep it private.

Two things to know about the static export:

- `next/image` runs `unoptimized`, because Pages has no image optimizer. That
  also means it does not prefix `basePath` onto `src`, which is what
  `lib/asset.ts` exists to do.
- Link prefetch payloads 404 in devtools — a Next 16 export quirk documented in
  `next.config.ts`. Navigation is unaffected and it does not occur on a real
  Next.js host.
