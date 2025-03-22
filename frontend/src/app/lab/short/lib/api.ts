// lib/api.ts
import { VideoData } from "../types";

// サーバーサイドで初期ビデオデータを取得する関数
export async function getInitialVideos(): Promise<VideoData[]> {
  return [
    {
      id: "video-1",
      url: "https://example.com/video1.mp4",
      user: { username: "user1", avatar: "/avatars/user1.jpg" },
      description: "サンプル動画1の説明 #nextjs #react",
      likes: 1200,
      comments: 340,
      shares: 120,
    },
    {
      id: "video-2",
      url: "https://example.com/video2.mp4",
      user: { username: "user2", avatar: "/avatars/user2.jpg" },
      description: "サンプル動画2の説明 #webdev",
      likes: 8500,
      comments: 620,
      shares: 430,
    },
    {
      id: "video-3",
      url: "https://example.com/video3.mp4",
      user: { username: "user3", avatar: "/avatars/user3.jpg" },
      description: "サンプル動画3の説明 #typescript",
      likes: 4300,
      comments: 290,
      shares: 180,
    },
  ];
}

// クライアントサイドでさらに動画を取得する関数（APIルート経由）
export async function fetchMoreVideos(page: number): Promise<VideoData[]> {
  const response = await fetch(`/lab/short/api/videos?page=${page}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch more videos");
  }

  return response.json();
}
