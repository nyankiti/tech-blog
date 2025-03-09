import { Feed } from "feed";
import { FrontMatter } from "./posts";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/constants";

const getPostJsonUrl = () => {
  if (typeof window !== "undefined") {
    // クライアント側: 相対パスで OK
    return "/posts.json";
  }
  // サーバー側: 絶対 URL が必要
  return new URL("/posts.json", SITE_URL).toString();
};

export const generateFeed = async () => {
  const response = await fetch(getPostJsonUrl());
  if (!response.ok) {
    throw new Error("Failed to fetch posts.json");
  }
  const posts = (await response.json()) as (FrontMatter & {
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
