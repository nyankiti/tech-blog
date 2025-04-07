export type SummaryPost = {
  "tech-feed.md": string;
  "reddit.md": string;
  "github-trending.md": string;
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
    "tech-feed.md":
      typeof summaryPosts["tech-feed.md"] === "string" &&
      summaryPosts["tech-feed.md"].length > 0
        ? summaryPosts["tech-feed.md"]
        : "要約が存在しません",
    "reddit.md":
      typeof summaryPosts["reddit.md"] === "string" &&
      summaryPosts["reddit.md"].length > 0
        ? summaryPosts["reddit.md"]
        : "要約が存在しません",
    "github-trending.md":
      typeof summaryPosts["github-trending.md"] === "string" &&
      summaryPosts["github-trending.md"].length > 0
        ? summaryPosts["github-trending.md"]
        : "要約が存在しません",
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
