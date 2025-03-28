import { SITE_URL } from '@/constants';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/lab/, /tags/'],
    },
    sitemap: `${SITE_URL.toString()}sitemap.xml`,
  };
}
