"use client";

import { useEffect, RefObject } from "react";
import { SwipeHandlers } from "../types";

// タッチ/マウスによるスワイプ操作を処理するカスタムフック
const useSwipeHandler = (
  ref: RefObject<HTMLDivElement | null>,
  handlers: SwipeHandlers
): void => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    // スワイプ開始
    const handleTouchStart = (e: TouchEvent): void => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleMouseDown = (e: MouseEvent): void => {
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();

      // マウスムーブとマウスアップのイベントリスナーを追加
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    // スワイプ中（マウスのみ）
    const handleMouseMove = (e: MouseEvent): void => {
      // ドラッグ処理が必要な場合はここに実装
      console.log("mouse move", e);
    };

    // スワイプ終了
    const handleTouchEnd = (e: TouchEvent): void => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      handleSwipeEnd(touchEndX, touchEndY);
    };

    const handleMouseUp = (e: MouseEvent): void => {
      handleSwipeEnd(e.clientX, e.clientY);

      // イベントリスナーを削除
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // スワイプの方向を判断して適切なハンドラーを呼び出す
    const handleSwipeEnd = (endX: number, endY: number): void => {
      const diffX = startX - endX;
      const diffY = startY - endY;
      const elapsedTime = Date.now() - startTime;

      // 50ms以上かつ50px以上の移動でスワイプと判定
      if (elapsedTime < 300) {
        const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

        if (isHorizontalSwipe) {
          // 左右スワイプ
          if (diffX > 50 && handlers.onSwipeLeft) {
            handlers.onSwipeLeft();
          } else if (diffX < -50 && handlers.onSwipeRight) {
            handlers.onSwipeRight();
          }
        } else {
          // 上下スワイプ
          if (diffY > 50) {
            handlers.onSwipeUp();
          } else if (diffY < -50) {
            handlers.onSwipeDown();
          }
        }
      }
    };

    // イベントリスナーを追加
    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchend", handleTouchEnd);
    element.addEventListener("mousedown", handleMouseDown);

    // クリーンアップ
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref, handlers]);
};

export default useSwipeHandler;
