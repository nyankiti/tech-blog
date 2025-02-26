"use client";
import { useState, useEffect, useRef } from "react";
import { PostSearchIndex } from "@/libs/generate-search-index";
import FlexSearch, { Document } from "flexsearch";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export const SearchBar = () => {
  const indexRef = useRef<Document<Post, string[]> | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // インデックスの読み込みと初期化
  useEffect(() => {
    async function initializeSearchIndex() {
      if (typeof window === "undefined") return;
      setIsLoading(true);
      try {
        // インデックスを初期化
        const index = new FlexSearch.Document<Post, string[]>({
          preset: "match",
          tokenize: "reverse",
          document: {
            id: "slug",
            index: ["title", "content", "tags"],
            store: ["slug", "title", "tags", "date", "content"],
          },
        });

        // 検索インデックスJSONを取得
        const res = await fetch("/search-index.json");
        const data = await res.json();

        console.log("data:", data);

        data.forEach((post: PostSearchIndex) => {
          index.add(post);
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
      console.log("searchTerm:", searchTerm);

      const titleResults = indexRef.current.search(searchTerm, {
        limit: 10,
        index: "title",
        enrich: true,
      });

      console.log("titleResults:", titleResults);

      const contentsResults = indexRef.current.search(searchTerm, {
        limit: 10,
        index: "content",
        enrich: true,
      });
      console.log("contentsResults:", contentsResults);

      const tagsResults = indexRef.current.search(searchTerm, {
        limit: 10,
        index: "tags",
        enrich: true,
      });
      console.log("tagsResults:", tagsResults);
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
