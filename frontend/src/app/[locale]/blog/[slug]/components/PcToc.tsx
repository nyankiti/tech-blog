"use client";

import { useEffect } from "react";
import * as tocbot from "tocbot";
import { Adsense } from "./Adsense";

export const PcToc: React.FC = () => {
  useEffect(() => {
    tocbot.init({
      tocSelector: ".toc",
      contentSelector: ".post", // 目次を抽出したい要素のクラス名
      headingSelector: "h1, h2, h3",
      scrollSmoothOffset: -60,
      headingsOffset: 60,
      scrollSmoothDuration: 300,
    });

    return () => tocbot.destroy();
  }, []);

  return (
    <div className="mt-16">
      <div className="mb-3 mt-1">
        <Adsense isVertical={false} />
      </div>
      <div className="toc px-0 pb-4 text-sm max-h-[calc(100vh-250px)] overflow-y-auto"></div>
    </div>
  );
};
