"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import * as tocbot from "tocbot";

export default function SummaryTOC() {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "tech-feed";

  useEffect(() => {
    // 既存の tocbot を破棄
    tocbot.destroy();

    // DOMの更新を待ってから tocbot を初期化
    const timer = setTimeout(() => {
      tocbot.init({
        tocSelector: ".toc",
        contentSelector: ".summary-post",
        headingSelector: "h1",
        scrollSmoothOffset: -60,
        headingsOffset: 60,
        scrollSmoothDuration: 300,
      });

      // **TOCのスクロールをリセット**
      const tocElement = document.querySelector(".toc");
      if (tocElement) {
        tocElement.scrollTop = 0;
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      tocbot.destroy();
    };
  }, [activeTab]);
  return (
    <div className="mt-16">
      <div className="toc px-0 pb-4 text-sm max-h-[calc(100vh-250px)] overflow-y-auto"></div>
    </div>
  );
}
