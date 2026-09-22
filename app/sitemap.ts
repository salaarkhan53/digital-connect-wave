import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { capabilities } from '@/content/capabilities';
import { industries } from '@/content/industries';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${site.url}${path}`;

  const staticRoutes = [
    { path: '/', priority: 1 },
    { path: '/capabilities', priority: 0.9 },
    { path: '/industries', priority: 0.9 },
    { path: '/compliance', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/careers', priority: 0.6 },
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
