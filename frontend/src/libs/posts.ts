import { compareDesc } from "date-fns";
import path from "node:path";
import { readFile, readdir } from "node:fs/promises";
import { compileMDX } from "next-mdx-remote/rsc";

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

export const getAllPosts = async (): Promise<FrontMatter[]> => {
  const postDirPath = path.join(
    process.cwd(),
    `../../blog-contents/contents/tech-blog`
  );
  const postFiles = await readdir(postDirPath);
  const postFilesWithoutExtension = postFiles.map((file) =>
    path.basename(file, path.extname(file))
  );
  const frontMatters: FrontMatter[] = [];

  // TODO: Promise.allを使って並列処理にする
  for (const slug of postFilesWithoutExtension) {
    const filepath = path.join(
      process.cwd(),
      // TODO: mdがない場合、mdxを読み込むようにする
      `../blog-contents/contents/tech-blog/${slug}.md`
    );
    const data = await readFile(filepath, { encoding: "utf-8" });
    const compiledData = await compileMDX<FrontMatter>({
      source: data,
      options: {
        parseFrontmatter: true,
      },
    });
    frontMatters.push(compiledData.frontmatter);
  }
  return frontMatters;
};

export const getSortedPost = async (): Promise<FrontMatter[]> => {
  return (await getAllPosts())
    .filter((post) => post.isPublished === true && post.idDeleted !== true)
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
    );
};

export const getSlugs = async (): Promise<string[]> => {
  const postDirPath = path.join(
    process.cwd(),
    `../../blog-contents/contents/tech-blog`
  );
  const postFiles = await readdir(postDirPath);
  return postFiles.map((file) => path.basename(file, path.extname(file)));
};

// 全てのタグ
export const TAGS = Array.from(
  new Set(
    (await getAllPosts())
      .filter((post) => post.isPublished === true && post.idDeleted !== true)
      .flatMap((post) => post.tags)
  )
);
