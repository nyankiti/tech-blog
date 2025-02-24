import { YouTubeEmbed as NextYouTubeEmbed } from "@next/third-parties/google";
import { FC } from "react";
import { extractYouTubeVideoId } from "./utils";

export const YouTubeEmbed: FC<{ url: string }> = ({ url }) => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return <a href={url}>{url}</a>;
  return (
    <NextYouTubeEmbed
      videoid={videoId}
      style={`background-image: url('https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg');`}
    />
  );
};
