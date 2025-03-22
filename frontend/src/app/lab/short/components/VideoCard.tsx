"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaCommentDots,
  FaShare,
  FaPlay,
} from "react-icons/fa";
import { VideoData, SwipeHandlers, DeviceType } from "../types";
import useSwipeHandler from "../hooks/useSwipeHandler";

interface VideoCardProps extends SwipeHandlers {
  video: VideoData;
  isActive: boolean;
  deviceType: DeviceType;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isActive,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  deviceType,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // スワイプハンドラーのカスタムフック
  useSwipeHandler(containerRef, {
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
  });

  // 動画の再生・停止制御
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = (): void => {
      setPlaying(true);
    };

    const handlePause = (): void => {
      setPlaying(false);
    };

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    if (isActive) {
      videoElement.play().catch((error) => {
        console.error("自動再生エラー:", error);
        setPlaying(false);
      });
    } else {
      videoElement.pause();
      setPlaying(false);
    }

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.pause();
    };
  }, [isActive]);

  // 動画をクリックしたときの再生/一時停止切り替え
  const handleVideoClick = (): void => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (playing) {
      videoElement.pause();
    } else {
      videoElement.play().catch((error) => {
        console.error("再生エラー:", error);
      });
    }
  };

  // いいねボタンのハンドラ
  const toggleLike = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={false}
        poster="/thumbnail.jpg"
      />

      {!playing && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center bg-black/30 rounded-full opacity-80 pointer-events-none">
          <FaPlay className="text-white text-3xl" />
        </div>
      )}

      <div className="absolute bottom-28 left-5 text-white z-10 max-w-[70%]">
        <div className="flex items-center mb-2">
          <img
            src={video.user.avatar}
            alt={video.user.username}
            className="w-10 h-10 rounded-full mr-3 border-2 border-white"
          />
          <p className="font-bold text-base m-0">@{video.user.username}</p>
        </div>
        <p className="text-sm my-1 drop-shadow-md">{video.description}</p>
      </div>

      <div className="absolute right-5 bottom-28 flex flex-col items-center z-10">
        <button
          className="bg-transparent border-none text-white flex flex-col items-center mb-6 cursor-pointer"
          onClick={toggleLike}
        >
          {isLiked ? (
            <FaHeart className="text-3xl text-red-500" />
          ) : (
            <FaRegHeart className="text-3xl text-white" />
          )}
          <span className="mt-1 text-xs">
            {isLiked ? video.likes + 1 : video.likes}
          </span>
        </button>

        <button className="bg-transparent border-none text-white flex flex-col items-center mb-6 cursor-pointer">
          <FaCommentDots className="text-3xl text-white" />
          <span className="mt-1 text-xs">{video.comments}</span>
        </button>

        <button className="bg-transparent border-none text-white flex flex-col items-center mb-6 cursor-pointer">
          <FaShare className="text-3xl text-white" />
          <span className="mt-1 text-xs">{video.shares}</span>
        </button>
      </div>

      {/* デスクトップ用追加インストラクション */}
      {deviceType === "desktop" && !playing && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/40 px-3 py-1 rounded-full">
          上下矢印キーでナビゲーション、クリックで再生/一時停止
        </div>
      )}
    </div>
  );
};

export default VideoCard;
