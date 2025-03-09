import { compareDesc } from "date-fns";
import path from "node:path";
import { readFile, readdir } from "node:fs/promises";
import matter from "gray-matter";
import { generatePostsDescription } from "./generate-posts-description";

export type FrontMatter = {
  title: string;
  slug: string;
  tags: string[];
  isPublished: boolean;
  idDeleted: boolean;
  publishedAt: string;
  updatedAt: string;
  views: number;
  description?: string;
};

export const baseDir = process.env.BASE_DIR || process.cwd();

export const getPostDirPath = () =>
  path.join(baseDir, "../blog-contents/contents/tech-blog");

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
    console.warn(`No valid file found for slug: ${slug}${usedExt}`);
    return null;
  }
  return fileContent;
}

export async function getFrontMatter(
  slug: string
): Promise<FrontMatter | null> {
  try {
    const fileContent = await readFileFromMdorMds(slug);
    if (!fileContent) return null;
    const { data, content } = matter(fileContent);
    const description = await generatePostsDescription(content);

    return {
      ...data,
      description,
    } as FrontMatter;
  } catch (error) {
    console.error("Error reading Markdown file:", error);
    return null;
  }
}

export const getAllPosts = async (): Promise<FrontMatter[]> => {
  const postDirPath = getPostDirPath();
  const postFiles = await readdir(postDirPath);
  const slugs = postFiles.map((file) =>
    path.basename(file, path.extname(file))
  );

  const frontMattersPromises = slugs.map((slug) => getFrontMatter(slug));
  const frontMatters = (await Promise.all(frontMattersPromises)).filter(
    (post): post is FrontMatter => post !== null
  );
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
    .map((file) => {
      if (path.extname(file) === ".md" || path.extname(file) === ".mdx") {
        const slug = path.basename(file, path.extname(file));
        return slug;
      }
      return null;
    })
    .filter(Boolean) as string[];
};

export const getTags = async (): Promise<string[]> => {
  const posts = await getAllPosts();
  return Array.from(
    new Set(
      posts
        .filter((post) => post.isPublished && !post.idDeleted)
        .flatMap((post) => post.tags)
    )
  ).filter((tag) => tag !== "");
};
