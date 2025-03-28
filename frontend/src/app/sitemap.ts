import { SITE_URL } from '@/constants';
import { getSortedGourmetPosts } from '@/libs/gourmet';
import { getSortedPosts } from '@/libs/posts';
import type { MetadataRoute } from 'next';

// /sitemap.xml にアクセスすると表示される
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL.toString();
  const blogs = (await getSortedPosts()).map((post) => {
    return {
      url: `${siteUrl}blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      priority: 0.5,
    };
  });
  const gourmets = (await getSortedGourmetPosts()).map((post) => {
    return {
      url: `${siteUrl}gourmet/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      priority: 0.5,
    };
  });

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...blogs,
    ...gourmets,
    {
      url: `${siteUrl}lab`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // labsは手動で追加するしかない
    {
      url: `${siteUrl}lab/webpush`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
