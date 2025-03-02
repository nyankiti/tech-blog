import matter from "gray-matter";
import { baseDir, getSlugs, readFileFromMdorMds } from "./posts";
import path from "node:path";
import { writeFile } from "node:fs/promises";

export type PostDocument = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
};

export const generateSearchIndex = async () => {
  const slugs = await getSlugs();
  const searchIndex: PostDocument[] = [];
  for (const slug of slugs) {
    const fileContent = await readFileFromMdorMds(slug);
    if (!fileContent) return null;

    const { data, content } = matter(fileContent);
    searchIndex.push({
      slug,
      title: data.title || "",
      tags: data.tags || [],
      content: content || "",
      date: data.publishedAt || "",
    });
  }

  await writeFile(
    path.join(baseDir, "public", "search-index.json"),
    JSON.stringify(searchIndex)
  );

  console.log(
    `検索インデックスを生成しました。合計 ${searchIndex.length} 件の記事をインデックス化しました。`
  );
};

generateSearchIndex();
