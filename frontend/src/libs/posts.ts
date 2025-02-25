import { compareDesc } from "date-fns";
import path from "node:path";
import { readFile, readdir } from "node:fs/promises";
import matter from "gray-matter";

export type FrontMatter = {
  title: string;
  slug: string;
  tags: string[];
  isPublished: boolean;
  idDeleted: boolean;
  publishedAt: string;
  updatedAt: string;
  views: number;
};

// メモ化用のキャッシュ
let postsCache: FrontMatter[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1時間のキャッシュ有効期限

export const baseDir = process.env.BASE_DIR || process.cwd();

export const getPostDirPath = () =>
  path.join(baseDir, "./blog-contents/contents/tech-blog");

export async function readFileFromMdorMds(
  slug: string
): Promise<string | null> {
  const extensions = [".md", ".mdx"];
  let fileContent: string | null = null;
  let usedExt: string | null = null;

  for (const ext of extensions) {
    const filepath = path.join(getPostDirPath(), `${slug}${ext}`);
    try {
      fileContent = await readFile(filepath, "utf-8");
      usedExt = ext;
      break;
    } catch {
      continue;
    }
  }

  if (!fileContent || !usedExt) {
    console.warn(`No valid file found for slug: ${slug}`);
    return null;
  } else {
    console.log(`Found file with extension ${usedExt} for slug: ${slug}`);
  }
  return fileContent;
}

export async function getFrontMatter(
  slug: string
): Promise<FrontMatter | null> {
  try {
    const fileContent = await readFileFromMdorMds(slug);
    if (!fileContent) return null;
    const { data } = matter(fileContent);

    // 型アサーションで FrontMatter 型を適用
    return data as FrontMatter;
  } catch (error) {
    console.error("Error reading Markdown file:", error);
    return null;
  }
}

export const getAllPosts = async (): Promise<FrontMatter[]> => {
  // キャッシュが有効な場合はキャッシュを返す
  const now = Date.now();
  if (postsCache && now - lastCacheTime < CACHE_TTL) {
    return postsCache;
  }

  const postDirPath = getPostDirPath();
  const postFiles = await readdir(postDirPath);
  const slugs = postFiles.map((file) =>
    path.basename(file, path.extname(file))
  );

  const frontMattersPromises = slugs.map((slug) => getFrontMatter(slug));
  const frontMatters = (await Promise.all(frontMattersPromises)).filter(
    (post): post is FrontMatter => post !== null
  );

  // キャッシュの更新
  postsCache = frontMatters;
  lastCacheTime = now;

  return frontMatters;
};

export const getSortedPosts = async (): Promise<FrontMatter[]> => {
  const posts = await getAllPosts();
  return posts
    .filter((post) => post.isPublished && !post.idDeleted)
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
    );
};

export const getSlugs = async (): Promise<string[]> => {
  const postDirPath = getPostDirPath();
  const postFiles = await readdir(postDirPath);
  return postFiles
    .map((file) => path.basename(file, path.extname(file)))
    .filter((slug) => slug !== "images");
};

export const getTags = async (): Promise<string[]> => {
  const posts = await getAllPosts();
  return Array.from(
    new Set(
      posts
        .filter((post) => post.isPublished && !post.idDeleted)
        .flatMap((post) => post.tags)
    )
  );
};
