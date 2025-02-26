"use client";
import { useState, useEffect, useRef } from "react";
import { PostSearchIndex } from "@/libs/generate-search-index";
import FlexSearch, { Index } from "flexsearch";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export const SearchBar = () => {
  const indexRef = useRef<Index | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // インデックスの読み込みと初期化
  useEffect(() => {
    async function initializeSearchIndex() {
      if (typeof window === "undefined") return;
      setIsLoading(true);
      try {
        // インデックスを初期化
        const index = new FlexSearch.Index({
          tokenize: "forward",
          optimize: true,
        });

        // 検索インデックスJSONを取得
        const res = await fetch("/search-index.json");
        const data = await res.json();

        console.log("data:", data);

        data.forEach((post: PostSearchIndex) => {
          // 試しにtitleだけをindexに追加してみる
          index.append(data.slug, post.title);
        });

        // インデックスを参照に保持
        indexRef.current = index;
      } catch (error) {
        console.error("検索インデックスの初期化に失敗しました:", error);
      }
      setIsLoading(false);
    }

    initializeSearchIndex();
  }, []);

  // 検索処理
  useEffect(() => {
    if (searchTerm.trim() === "" || isLoading || !indexRef.current) {
      return;
    }

    try {
      // FlexSearch での検索実行
      const result = indexRef.current.search(searchTerm, 10);

      console.log("allResult:", result);
    } catch (error) {
      console.error("検索処理中にエラーが発生しました:", error);
    }
  }, [searchTerm, isLoading]);

  return (
    <div>
      SearchBar
      <input
        type="text"
        placeholder="ブログ内を検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
};
