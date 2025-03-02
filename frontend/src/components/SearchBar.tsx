"use client";
import { useState, useEffect, useRef } from "react";
import { PostDocument } from "@/libs/generate-search-index";
import FlexSearch, { Document } from "flexsearch";

export const SearchBar = () => {
  const indexRef = useRef<Document<PostDocument, string[]> | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PostDocument[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // インデックスの読み込みと初期化
  useEffect(() => {
    async function initializeSearchIndex() {
      if (typeof window === "undefined") return;
      setIsLoading(true);
      try {
        // インデックスを初期化
        const index = new FlexSearch.Document<PostDocument, string[]>({
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

        data.forEach((post: PostDocument) => {
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

      const titleResults = indexRef.current.search<true>(searchTerm, 10, {
        index: "title",
        enrich: true,
      });

      console.log("titleResults:", titleResults);

      const contentsResults = indexRef.current.search<true>(searchTerm, 10, {
        index: "content",
        enrich: true,
      });
      console.log("contentsResults:", contentsResults);

      const tagsResults = indexRef.current.search<true>(searchTerm, 10, {
        index: "tags",
        enrich: true,
      });
      console.log("tagsResults:", tagsResults);

      const allResults = new Map<string, PostDocument>(); // 重複を除くために Map を使用
      [titleResults, contentsResults, tagsResults].forEach((resultSet) => {
        if (resultSet.length > 0) {
          resultSet[0].result.forEach((item) => {
            if (!allResults.has(item.doc.slug)) {
              allResults.set(item.doc.slug, item.doc);
            }
          });
        }
      });

      const mergedResults = Array.from(allResults.values());

      setSearchResults(mergedResults);
      setIsModalOpen(mergedResults.length > 0);
    } catch (error) {
      console.error("検索処理中にエラーが発生しました:", error);
    }
  }, [searchTerm, isLoading]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  // 検索結果のハイライト
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const segments = text.split(new RegExp(`(${query})`, "gi"));
    return segments.map((segment, index) =>
      segment.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {segment}
        </span>
      ) : (
        segment
      )
    );
  };

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 記事の内容を抜粋（検索語を含む部分）
  const getContentExcerpt = (
    content: string,
    query: string,
    length: number = 150
  ) => {
    if (!query.trim()) return content.slice(0, length) + "...";

    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) return content.slice(0, length) + "...";

    const start = Math.max(0, index - length / 2);
    const end = Math.min(content.length, index + query.length + length / 2);

    return (
      (start > 0 ? "..." : "") +
      content.slice(start, end) +
      (end < content.length ? "..." : "")
    );
  };
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="ブログ内を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* 検索結果モーダル */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 flex items-start justify-center pt-20"
          onClick={handleOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] overflow-hidden z-50">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">
                「{searchTerm}」の検索結果 ({searchResults.length}件)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 検索結果リスト */}
            <div className="overflow-y-auto max-h-[calc(70vh-65px)]">
              {searchResults.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {searchResults.map((result) => (
                    <li key={result.slug} className="p-4 hover:bg-gray-50">
                      <a href={`/blog/${result.slug}`} className="block">
                        <h4 className="text-lg font-semibold mb-1 text-blue-600">
                          {highlightText(result.title, searchTerm)}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span>{formatDate(result.date)}</span>
                          <span>•</span>
                          <div className="flex flex-wrap gap-1">
                            {result.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {highlightText(tag, searchTerm)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {highlightText(
                            getContentExcerpt(result.content, searchTerm),
                            searchTerm
                          )}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">検索結果がありません</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
