import { compareDesc } from "date-fns";
import { generatePostsDescription } from "./generate-posts-description";
import { BLOG_CONTENTS_URL } from "@/constants";
import { Locale } from "next-intl";

export type TechBlogPost = {
  title: string;
  slug: string;
  tags: string[];
  isPublished: boolean;
  isDeleted: boolean;
  publishedAt: string;
  updatedAt: string;
  views: number;
  content: string;
  description?: string;
};

export const getAllPosts = async (locale: Locale): Promise<TechBlogPost[]> => {
  const fetchUrl =
    locale === "ja"
      ? `${BLOG_CONTENTS_URL}/posts.json`
      : `${BLOG_CONTENTS_URL}/en/posts.json`;
  const response = await fetch(fetchUrl);
  if (!response.ok) {
    console.error("Failed to fetch posts.json");
    return [];
  }

  const posts = (await response.json()) as TechBlogPost[];
  const result = await Promise.all(
    posts
      .filter((post) => post.isPublished && !post.isDeleted)
      .map(async (post) => {
        const description =
          post.description || (await generatePostsDescription(post.content));
        return {
          ...post,
          description,
        };
      })
  );
  return result;
};

export const getTechBlogPost = async (
  slug: string,
  locale: Locale
): Promise<TechBlogPost | null> => {
  const posts = await getAllPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
};

export const getSortedPosts = async (
  locale: Locale
): Promise<TechBlogPost[]> => {
  const posts = await getAllPosts(locale);
  return posts.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
};

export const getSlugs = async (locale: Locale): Promise<string[]> => {
  const posts = await getAllPosts(locale);
  return posts.map((post) => post.slug);
};

export const getTags = async (locale: Locale): Promise<string[]> => {
  const posts = await getAllPosts(locale);
  return Array.from(new Set(posts.flatMap((post) => post.tags))).filter(
    (tag) => tag !== ""
  );
};
