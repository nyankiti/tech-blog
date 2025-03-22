import VideosContainer from "./components/VideosContainer";
import { getInitialVideos } from "./lib/api";

export default async function Home() {
  // サーバーコンポーネントでの初期データ取得
  const initialVideos = await getInitialVideos();

  return (
    <main className="w-full h-screen overflow-hidden bg-black relative">
      <VideosContainer initialVideos={initialVideos} />
    </main>
  );
}
