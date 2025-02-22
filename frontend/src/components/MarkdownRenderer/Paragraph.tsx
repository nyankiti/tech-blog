import { Components } from "react-markdown";
import { TweetEmbed } from "./TweetEmbed";
import { extractTwitterUrl, extractYouTubeVideoId } from "./utils";
import { YouTubeEmbed } from "./YoutubeEmbed";
import { Bookmark } from "./Bookmark";

export const Paragraph: Components["p"] = ({ node, ...props }) => {
  const child = node?.children[0];
  if (
    node?.children.length === 1 &&
    child?.type === "element" &&
    child.tagName === "a" &&
    typeof child.properties?.href === "string" &&
    child.children[0].type === "text" &&
    // notionのbookmarkは値が"bookmarkになっている"
    child.children[0].value === "bookmark"
  ) {
    return <Bookmark href={child.properties.href} />;
  }

  if (
    node?.children.length === 1 &&
    child?.type === "element" &&
    child.tagName === "a" &&
    typeof child.properties?.href === "string" &&
    child.children[0].type === "text" &&
    child.properties.href === child.children[0].value
  ) {
    const twitterUrl = extractTwitterUrl(child.properties.href);
    if (twitterUrl) {
      return <TweetEmbed url={twitterUrl} />;
    }

    const videoId = extractYouTubeVideoId(child.properties.href);
    if (videoId) {
      return <YouTubeEmbed videoId={videoId} />;
    }
  }

  return <p {...props} />;
};
