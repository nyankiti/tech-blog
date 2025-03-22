"use client";

import { useEffect, useRef, useState } from "react";
import { VideoData } from "../types";
import VideoCard from "./VideoCard";
import { fetchMoreVideos } from "../lib/api";
import useDeviceDetect from "../hooks/useDeviceDetect";
import DesktopControls from "./DesktopControls";

interface VideosContainerProps {
  initialVideos: VideoData[];
}

const VideosContainer: React.FC<VideosContainerProps> = ({ initialVideos }) => {
  const [videos, setVideos] = useState<VideoData[]>(initialVideos);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceType = useDeviceDetect();

  // ビデオの追加取得
  const loadMoreVideos = async (): Promise<void> => {
    if (loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const newVideos = await fetchMoreVideos(nextPage);

      setVideos((prev) => [...prev, ...newVideos]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // インターセクションオブザーバーで無限スクロール実装
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && !loading && videos.length > 0) {
          // 最後から2つ目の動画が表示されたら次のバッチをロード
          if (currentIndex >= videos.length - 2) {
            loadMoreVideos();
          }
        }
      },
      { threshold: 0.5 }
    );

    const container = containerRef.current;
    const videoElements = container.querySelectorAll(".video-item");

    if (videoElements.length > 0) {
      observer.observe(videoElements[videoElements.length - 1]);
    }

    return () => {
      if (videoElements.length > 0) {
        observer.unobserve(videoElements[videoElements.length - 1]);
      }
    };
  }, [videos, currentIndex, loading]);

  // キーボードコントロール (デスクトップ向け)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowUp" || e.key === "k") {
        handlePrevVideo();
      } else if (e.key === "ArrowDown" || e.key === "j") {
        handleNextVideo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, videos.length]);

  // ビデオナビゲーション
  const handleNextVideo = (): void => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevVideo = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // スワイプハンドラー
  const handleSwipe = (direction: "up" | "down" | "left" | "right"): void => {
    if (direction === "up") {
      handleNextVideo();
    } else if (direction === "down") {
      handlePrevVideo();
    }
    // 左右スワイプは将来の機能のために予約
  };

  return (
    <div className="w-full h-full relative overflow-hidden" ref={containerRef}>
      {/* デスクトップ向けUI要素 */}
      {deviceType === "desktop" && (
        <DesktopControls
          onPrevVideo={handlePrevVideo}
          onNextVideo={handleNextVideo}
          currentIndex={currentIndex}
          totalVideos={videos.length}
        />
      )}

      <div
        className={`w-full h-full relative ${
          deviceType === "desktop" ? "max-w-md mx-auto" : ""
        }`}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`video-item absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-out ${
              index === currentIndex ? "z-10" : ""
            }`}
            style={{
              transform: `translateY(${(index - currentIndex) * 100}vh)`,
            }}
          >
            <VideoCard
              video={video}
              isActive={index === currentIndex}
              onSwipeUp={() => handleSwipe("up")}
              onSwipeDown={() => handleSwipe("down")}
              onSwipeLeft={() => handleSwipe("left")}
              onSwipeRight={() => handleSwipe("right")}
              deviceType={deviceType}
            />
          </div>
        ))}

        {loading && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-5 py-2 bg-black/50 text-white rounded-full z-50">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosContainer;
