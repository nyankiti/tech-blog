"use client";

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface DesktopControlsProps {
  onPrevVideo: () => void;
  onNextVideo: () => void;
  currentIndex: number;
  totalVideos: number;
}

const DesktopControls: React.FC<DesktopControlsProps> = ({
  onPrevVideo,
  onNextVideo,
  currentIndex,
  totalVideos,
}) => {
  return (
    <>
      {/* ナビゲーションボタン */}
      <div className="fixed left-1/2 top-4 transform -translate-x-1/2 z-20 bg-black/30 px-3 py-1 rounded-full text-white text-sm">
        {currentIndex + 1} / {totalVideos}
      </div>

      <button
        className={`fixed left-1/2 top-20 transform -translate-x-1/2 z-20 bg-black/30 w-10 h-10 flex items-center justify-center rounded-full text-white ${
          currentIndex === 0
            ? "opacity-30 cursor-not-allowed"
            : "opacity-70 hover:opacity-100"
        }`}
        onClick={onPrevVideo}
        disabled={currentIndex === 0}
      >
        <FaChevronUp size={20} />
      </button>

      <button
        className={`fixed left-1/2 bottom-20 transform -translate-x-1/2 z-20 bg-black/30 w-10 h-10 flex items-center justify-center rounded-full text-white ${
          currentIndex === totalVideos - 1
            ? "opacity-30 cursor-not-allowed"
            : "opacity-70 hover:opacity-100"
        }`}
        onClick={onNextVideo}
        disabled={currentIndex === totalVideos - 1}
      >
        <FaChevronDown size={20} />
      </button>

      {/* フレーム */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md h-screen border-l border-r border-gray-800 z-10 pointer-events-none" />
    </>
  );
};

export default DesktopControls;
