"use client";
import { useEffect } from "react";

export const getIsProdEnv = () =>
  typeof window !== "undefined" && window.location.hostname == "sokes-nook.net";

export const AdsenseInitialization = () => {
  const isProdEnv = getIsProdEnv();
  useEffect(() => {
    if (isProdEnv) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }, [isProdEnv]);

  return <></>;
};
