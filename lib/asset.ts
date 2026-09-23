/**
 * Prefixes a path in `public/` with the deployment's base path.
 *
 * Next normally handles this for you, but `next/image` with
 * `unoptimized: true` — which a static export on GitHub Pages requires —
 * passes `src` through untouched. Without this, every brand image 404s when
 * the site is served from /digital-connect-wave/ instead of the root.
 *
 * Empty string on a normal deploy, so this is a no-op there.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string) => `${BASE_PATH}${path}`;
