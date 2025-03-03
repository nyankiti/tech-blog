"use client";

import { getIsProdEnv } from "@/components/AdsenseInitialization";

type Props = {
  isVertical: boolean;
};

export const Adsense = ({ isVertical }: Props) => {
  const isProdEnv = getIsProdEnv();

  return (
    <div>
      {isProdEnv ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="auto"
          data-ad-client="ca-pub-2129905454599896"
          data-ad-slot={isVertical ? "4791650532" : "2905249020"}
          data-full-width-responsive="true"
        ></ins>
      ) : (
        <div style={{ padding: "10px", border: "1px solid #333" }}>広告</div>
      )}
    </div>
  );
};
