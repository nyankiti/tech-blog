import matter from "gray-matter";
import { baseDir, getSlugs, readFileFromMdorMds } from "./posts";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { remark } from "remark";
import strip from "strip-markdown";

export type PostDocument = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
};

const cleanMarkdown = async (content: string) => {
  const result = await remark().use(strip).process(content);
  return String(result);
};

// 日本語文字列の分かち書き（簡易版）
// TODO: kuromoji.js や TinySegmenter などのライブラリを用いて精度改善
const tokenizeJapanese = (text: string): string => {
  // この簡易実装では、以下を行います：
  // 1. 英数字と日本語の間に空白を挿入
  // 2. 句読点の後に空白を挿入

  // 英数字と日本語の境界に空白を追加
  let tokenized = text.replace(/([a-zA-Z0-9]+)([ぁ-んァ-ン一-龥])/g, "$1 $2");
  tokenized = tokenized.replace(/([ぁ-んァ-ン一-龥])([a-zA-Z0-9]+)/g, "$1 $2");

  // 句読点の後に空白を追加（。、！？）
  tokenized = tokenized.replace(/([。、！？])/g, "$1 ");

  return tokenized;
};

export const generateSearchIndex = async () => {
  const slugs = await getSlugs();
  const searchIndex: PostDocument[] = [];

  for (const slug of slugs) {
    const fileContent = await readFileFromMdorMds(slug);
    if (!fileContent) continue;

    const { data, content } = matter(fileContent);

    // Markdownの記法を削除してクリーンなテキストを取得
    const cleanedContent = await cleanMarkdown(content);

    // 日本語のトークン化
    const tokenizedContent = tokenizeJapanese(cleanedContent);
    const tokenizedTitle = tokenizeJapanese(data.title || "");

    searchIndex.push({
      slug,
      title: tokenizedTitle,
      tags: data.tags || [],
      content: tokenizedContent,
      date: data.publishedAt || "",
    });
  }

  // コンテンツサイズを最適化するため、必要に応じて内容を制限
  const optimizedIndex = searchIndex.map((post) => {
    // 長すぎるコンテンツを制限（必要に応じて調整）
    const maxContentLength = 5000; // 約5000文字まで
    const truncatedContent =
      post.content.length > maxContentLength
        ? post.content.substring(0, maxContentLength) + "..."
        : post.content;

    return {
      ...post,
      content: truncatedContent,
    };
  });

  await writeFile(
    path.join(baseDir, "public", "search-index.json"),
    JSON.stringify(optimizedIndex)
  );

  // インデックスのファイルサイズ（概算）
  const indexSize = JSON.stringify(optimizedIndex).length / 1024; // KB単位

  console.log(
    `検索インデックスを生成しました。合計 ${
      searchIndex.length
    } 件の記事をインデックス化しました。（サイズ: 約${indexSize.toFixed(2)}KB）`
  );
};

generateSearchIndex();
