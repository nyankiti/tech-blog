import { Feed } from "feed";
import { TechBlogPost } from "./posts";
import {
  BLOG_CONTENTS_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/constants";

export const generateFeed = async () => {
  const response = await fetch(`${BLOG_CONTENTS_URL}/posts.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts.json");
  }
  const posts = (await response.json()) as TechBlogPost[];

  const feed = new Feed({
    id: SITE_URL.toString(),
    title: SITE_TITLE,
    copyright: `All right reserved ${new Date().getFullYear()}, ${SITE_TITLE}`,
    language: "ja",
    description: SITE_DESCRIPTION,
    link: SITE_URL.toString(),
    favicon: new URL("/favicon.ico", SITE_URL).toString(),
  });

  posts.forEach(async (post) => {
    feed.addItem({
      title: post.title,
      description: post.description ?? post.title,
      id: new URL(`/blog/${post.slug}`, SITE_URL).toString(),
      link: new URL(`/blog/${post.slug}`, SITE_URL).toString(),
      date: new Date(post.publishedAt),
      image: {
        url: new URL(`/blog/${post.slug}/opengraph-image`, SITE_URL).toString(),
        type: "image/png",
      },
    });
  });

  return feed.rss2();
};
