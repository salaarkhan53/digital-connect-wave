import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

// A static export has no server to generate robots.txt on request.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // The review deployment is closed to crawlers entirely — it carries numbers
  // that have not been signed off, and none of it should reach a search index.
  if (process.env.NEXT_PUBLIC_PREVIEW === 'true') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
