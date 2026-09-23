import type { NextConfig } from 'next';

/**
 * GitHub Pages serves this repo from a subpath and runs no Next.js server, so
 * the Pages build is a fully static export. A deploy to a real domain keeps the
 * default server build, which is why none of this is unconditional.
 *
 * Set GITHUB_PAGES=true to produce the Pages build (the workflow does).
 *
 * Known quirk of this mode: Next 16 writes its RSC prefetch payloads to
 * `__next.<route>/__PAGE__.txt` but the client asks for
 * `__next.<route>.__PAGE__.txt`, so link prefetching 404s in devtools. Pages
 * still navigate correctly — only the pre-warming is lost — and it does not
 * happen on a real Next.js host, so it is left alone rather than worked around.
 */
const isPages = process.env.GITHUB_PAGES === 'true';

/** Repo name, because the site is served from /<repo>/ rather than the root. */
const basePath = isPages ? '/digital-connect-wave' : '';

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: 'export',
        basePath,
        // Pages serves files from disk, so /about has to resolve to
        // /about/index.html — without this it 404s.
        trailingSlash: true,
        // There is no image optimizer on Pages; serve the files as they are.
        images: { unoptimized: true },
      }
    : {}),
  // Read by lib/asset.ts, because next/image with `unoptimized` does not
  // prefix basePath onto src itself.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
