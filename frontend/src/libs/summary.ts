export type SummaryPost = {
  "tech-feed.md": string;
  "reddit.md": string;
  "hacker-news.md": string;
};

export const getSummaryPost = async (
  dateString: string
): Promise<SummaryPost | null> => {
  const response = await fetch(
    `https://nyankiti.github.io/genai-lab/summary/${dateString}.json`
  );
  if (!response.ok) {
    console.error("Failed to fetch summary.json");
    return null;
  }
  const summaryPosts = await response.json();
  return {
    "tech-feed.md": summaryPosts["tech-feed.md"] ?? "要約が存在しません",
    "reddit.md": summaryPosts["reddit.md"] ?? "要約が存在しません",
    "hacker-news.md": summaryPosts["hacker-news.md"] ?? "要約が存在しません",
  };
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
  return summaryDates.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
};
