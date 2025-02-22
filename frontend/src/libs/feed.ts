import { Feed } from "feed";
import { getSortedPost } from "./posts";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/constants";

export const generateFeed = async () => {
  const posts = await getSortedPost();

  const feed = new Feed({
    id: SITE_URL.toString(),
    title: SITE_TITLE,
    copyright: `All right reserved ${new Date().getFullYear()}, kentaro_soda`,
    language: "ja",
    description: SITE_DESCRIPTION,
    link: SITE_URL.toString(),
    // image: new URL("/images/og.png", SITE_URL).toString(),
    favicon: new URL("/icon.ico", SITE_URL).toString(),
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
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
