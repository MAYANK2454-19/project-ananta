import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/event';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The organiser area is behind auth; there is no reason to crawl it.
      disallow: ['/admin', '/admin/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
