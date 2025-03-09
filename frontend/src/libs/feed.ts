import { readFile } from "node:fs/promises";
import { Feed } from "feed";
import { FrontMatter } from "./posts";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/constants";
import { POSTS_JSON_PATH } from "@/libs/generate-posts-json";

export const generateFeed = async () => {
  const postsJsonString = await readFile(POSTS_JSON_PATH, "utf-8");
  const posts = JSON.parse(postsJsonString) as (FrontMatter & {
    content: string;
  })[];

  const feed = new Feed({
    id: SITE_URL.toString(),
    title: SITE_TITLE,
    copyright: `All right reserved ${new Date().getFullYear()}, ${SITE_TITLE}`,
    language: "ja",
    description: SITE_DESCRIPTION,
    link: SITE_URL.toString(),
    favicon: new URL("/favicon.ico", SITE_URL).toString(),
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
