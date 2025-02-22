import { SITE_URL } from "@/constants";
import { getSortedPost } from "@/libs/posts";
import type { MetadataRoute } from "next";

// /sitemap.xml にアクセスすると表示される
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL.toString();
  const blogs = (await getSortedPost()).map((post) => {
    return {
      url: `${siteUrl}blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    };
  });

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...blogs,
    {
      url: `${siteUrl}lab`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // labsは手動で追加するしかない
    {
      url: `${siteUrl}lab/unified`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
