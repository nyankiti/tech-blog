import { NextRequest, NextResponse } from "next/server";
import { VideoData } from "../../types";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);

  // APIからビデオを取得（ここでは簡易的なモックデータ）
  const videos: VideoData[] = [
    {
      id: `video-${page}-1`,
      url: "https://example.com/video1.mp4",
      user: { username: `user${page}1`, avatar: "/avatars/user1.jpg" },
      description: `ページ${page}のサンプル動画1の説明 #nextjs`,
      likes: 1200 + page * 100,
      comments: 340 + page * 20,
      shares: 120 + page * 10,
    },
    {
      id: `video-${page}-2`,
      url: "https://example.com/video2.mp4",
      user: { username: `user${page}2`, avatar: "/avatars/user2.jpg" },
      description: `ページ${page}のサンプル動画2の説明 #react`,
      likes: 8500 + page * 100,
      comments: 620 + page * 20,
      shares: 430 + page * 10,
    },
    {
      id: `video-${page}-3`,
      url: "https://example.com/video3.mp4",
      user: { username: `user${page}3`, avatar: "/avatars/user3.jpg" },
      description: `ページ${page}のサンプル動画3の説明 #typescript`,
      likes: 4300 + page * 100,
      comments: 290 + page * 20,
      shares: 180 + page * 10,
    },
  ];

  // 少し遅延を入れて非同期処理をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(videos);
}
