import { TweetEmbed } from "./TweetEmbed";
import { YouTubeEmbed } from "./YoutubeEmbed";
import { extractTwitterUrl, extractYouTubeVideoId } from "./utils";

// 型定義
interface AnchorProps {
  href: string;
  children: string;
}

// 型ガード関数
function isAnchorElement(
  child: unknown
): child is React.ReactElement<AnchorProps> {
  if (!child || typeof child !== "object") return false;

  const element = child as React.ReactElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = element.props as any;
  return (
    element.type === "a" &&
    typeof props?.href === "string" &&
    typeof props?.children === "string"
  );
}

export const Paragraph = ({ children }: { children: React.ReactNode }) => {
  // 配列チェック
  if (!children || Array.isArray(children)) {
    return <p>{children}</p>;
  }

  // 型ガードを使用してAnchor要素かどうかをチェック
  if (isAnchorElement(children)) {
    // URLが本文と同じ場合（埋め込みの可能性）
    if (children.props.href === children.props.children) {
      const twitterUrl = extractTwitterUrl(children.props.href);
      if (twitterUrl) {
        return <TweetEmbed url={twitterUrl} />;
      }

      const videoId = extractYouTubeVideoId(children.props.href);
      if (videoId) {
        return <YouTubeEmbed videoId={videoId} />;
      }
    }
  }

  return <p>{children}</p>;
};
