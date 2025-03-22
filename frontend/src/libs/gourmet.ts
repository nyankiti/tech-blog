import { BLOG_CONTENTS_URL } from "@/constants";
import { compareDesc } from "date-fns";

export type GourmetPost = {
  title: string;
  slug: string;
  locationTags: string[];
  gourmetTags: string[];
  isPublished: boolean;
  isDeleted: boolean;
  visitedAt: string;
  publishedAt: string;
  updatedAt: string;
  views: number;
  thumbnail: string;
  geo: string;
  content: string;
  description?: string;
};

export const getAllGourmetPosts = async (): Promise<GourmetPost[]> => {
  const response = await fetch(`${BLOG_CONTENTS_URL}/gourmets.json`);
  if (!response.ok) {
    console.error("Failed to fetch posts.json");
    return [];
  }
  const gourmetPosts = (await response.json()) as GourmetPost[];
  return gourmetPosts;
};

export const getGourmetPost = async (
  slug: string
): Promise<GourmetPost | null> => {
  const posts = await getAllGourmetPosts();
  return posts.find((post) => post.slug === slug) ?? null;
};

export const getSortedGourmetPosts = async (): Promise<GourmetPost[]> => {
  const posts = await getAllGourmetPosts();
  return posts
    .filter((post) => post.isPublished && !post.isDeleted)
    .sort((a, b) => compareDesc(new Date(a.visitedAt), new Date(b.visitedAt)));
};

export const getLocationTags = async (): Promise<string[]> => {
  const posts = await getAllGourmetPosts();
  return Array.from(
    new Set(
      posts
        .filter((post) => post.isPublished && !post.isDeleted)
        .flatMap((post) => post.locationTags)
    )
  ).filter((tag) => tag !== "");
};

export const getGourmetTags = async (): Promise<string[]> => {
  const posts = await getAllGourmetPosts();
  return Array.from(
    new Set(
      posts
        .filter((post) => post.isPublished && !post.isDeleted)
        .flatMap((post) => post.gourmetTags)
    )
  ).filter((tag) => tag !== "");
};
