"use client";

import { useState, useEffect } from "react";
import { DeviceType } from "../types";

// デバイスタイプを検出するカスタムフック
const useDeviceDetect = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    // 初期チェックと画面サイズ変更時のリスナー
    const checkDevice = (): void => {
      // モバイルデバイスの判定（タッチイベントとウィンドウ幅で判定）
      const isMobile =
        ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
        window.innerWidth <= 768;

      setDeviceType(isMobile ? "mobile" : "desktop");
    };

    // 初期チェック
    checkDevice();

    // リサイズリスナー
    window.addEventListener("resize", checkDevice);

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return deviceType;
};

export default useDeviceDetect;
