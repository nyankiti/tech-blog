export function extractTwitterUrl(url: string): string | null {
  if (/https?:\/\/(www\.)?x.com\/\w{1,15}\/status\/.*/.test(url)) {
    // x.comは適切にembedされないため、twitter.comに変換する必要がある
    return url.replace("x.com", "twitter.com");
  }
  if (/https?:\/\/(www\.)?twitter.com\/\w{1,15}\/status\/.*/.test(url))
    return url;

  return null;
}

export function extractYouTubeVideoId(url: string): string | null {
  const matched =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    /^https?:\/\/(www\.)?youtube\.com\/watch\?(.*&)?v=(?<videoId>[^&]+)/.exec(
      url
    ) ??
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    /^https?:\/\/youtu\.be\/(?<videoId>[^?]+)/.exec(url) ??
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    /^https?:\/\/(www\.)?youtube\.com\/embed\/(?<videoId>[^?]+)/.exec(url);

  if (matched?.groups?.videoId) {
    return matched.groups.videoId;
  } else {
    return null;
  }
}
