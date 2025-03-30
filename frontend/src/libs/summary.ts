export type SummaryPost = {
  "tech-feed.md": string;
  "reddit.md"?: string;
  "hacker-news.md"?: string;
};

export const getSummaryPost = async (dateString: string) => {
  const response = await fetch(
    `https://nyankiti.github.io/genai-lab/summary/${dateString}.json`
  );
  if (!response.ok) {
    console.error("Failed to fetch summary.json");
    return null;
  }
  const summaryPosts = (await response.json()) as SummaryPost;
  return summaryPosts;
};

export const getSummaryDates = async (): Promise<string[]> => {
  const response = await fetch(
    `https://nyankiti.github.io/genai-lab/summary/list.json`
  );
  if (!response.ok) {
    console.error("Failed to fetch list.json");
    return [];
  }
  const summaryDates = (await response.json()) as string[];
  return summaryDates;
};
