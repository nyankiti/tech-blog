import { compareDesc } from "date-fns";
import { generatePostsDescription } from "./generate-posts-description";
import { BLOG_CONTENTS_URL } from "@/constants";

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

let cachedTechBlogPosts: TechBlogPost[] | null = null;

export const getAllPosts = async (): Promise<TechBlogPost[]> => {
  if (cachedTechBlogPosts) return cachedTechBlogPosts;

  const response = await fetch(`${BLOG_CONTENTS_URL}/posts.json`);
  if (!response.ok) {
    console.error("Failed to fetch posts.json");
    return [];
  }
  const posts = (await response.json()) as TechBlogPost[];
  cachedTechBlogPosts = await Promise.all(
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
  return cachedTechBlogPosts;
};

export const getTechBlogPost = async (
  slug: string
): Promise<TechBlogPost | null> => {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
};

export const getSortedPosts = async (): Promise<TechBlogPost[]> => {
  const posts = await getAllPosts();
  return posts.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
};

export const getSlugs = async (): Promise<string[]> => {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
};

export const getTags = async (): Promise<string[]> => {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.flatMap((post) => post.tags))).filter(
    (tag) => tag !== ""
  );
};
