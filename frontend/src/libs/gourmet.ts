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

let cachedGourmetPosts: GourmetPost[] | null = null;

export const getAllGourmetPosts = async (): Promise<GourmetPost[]> => {
  if (cachedGourmetPosts) {
    return cachedGourmetPosts;
  }

  const response = await fetch(`${BLOG_CONTENTS_URL}/gourmets.json`);
  if (!response.ok) {
    console.error("Failed to fetch posts.json");
    return [];
  }
  cachedGourmetPosts = (await response.json()) as GourmetPost[];
  return cachedGourmetPosts;
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

export const getRelatedGourmetPosts = async (
  post: GourmetPost
): Promise<GourmetPost[]> => {
  const otherPosts = (await getSortedGourmetPosts()).filter(
    (p) => p.slug !== post.slug
  );

  // locationTagsが一つでも一致する投稿を取得
  const locationMatchedPosts = otherPosts.filter(
    (p) =>
      p.slug !== post.slug &&
      p.locationTags.some((tag) => post.locationTags.includes(tag))
  );
  // gourmetTagsが一つでも一致する投稿を取得
  const gourmetMatchedPosts = otherPosts.filter(
    (p) =>
      p.slug !== post.slug &&
      p.gourmetTags.some((tag) => post.gourmetTags.includes(tag))
  );
  const result = locationMatchedPosts || gourmetMatchedPosts;

  // 記事が4つに満たない場合は最新記事から補填する;
  for (const p of otherPosts) {
    if (result.length >= 4) break;
    if (!result.some((r) => r.slug === p.slug)) {
      result.push(p);
    }
  }
  return result.slice(0, 4);
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
