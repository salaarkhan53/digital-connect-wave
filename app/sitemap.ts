import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { capabilities } from '@/content/capabilities';
import { industries } from '@/content/industries';

// A static export has no server to generate sitemap.xml on request.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  /*
   * The trailing slash has to follow whatever the build is doing, because the
   * two targets disagree and the wrong choice makes every URL here a redirect.
   *
   * The Pages build sets `trailingSlash: true`, so /about answers 301 and
   * /about/ is canonical. A Node host runs the default, where /about is
   * canonical and /about/ answers 308. Same flag as next.config.ts, so the
   * sitemap cannot drift from the routing.
   */
  const slash = process.env.GITHUB_PAGES === 'true';
  const url = (path: string) =>
    `${site.url}${path === '/' ? '/' : slash ? `${path}/` : path}`;

  const staticRoutes = [
    { path: '/', priority: 1 },
    { path: '/capabilities', priority: 0.9 },
    { path: '/industries', priority: 0.9 },
    { path: '/compliance', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/careers', priority: 0.6 },
    { path: '/careers/apply', priority: 0.5 },
    { path: '/contact', priority: 0.8 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: url(r.path),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: r.priority,
    })),
    ...capabilities.map((c) => ({
      url: url(`/capabilities/${c.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...industries.map((i) => ({
      url: url(`/industries/${i.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
