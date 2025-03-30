import { notFound } from "next/navigation";
import { getSummaryDates, getSummaryPost } from "@/libs/summary";
import { loadMDX } from "./mdx-loader";
import DateSelector from "./components/DateSelector";
import SummaryTabs from "./components/SummaryTabs";
import SummaryTOC from "./components/SummaryTOC";

type Props = {
  params: Promise<{ dateString: string }>;
};

export default async function Page({ params }: Props) {
  const { dateString } = await params;
  try {
    const summaryPost = await getSummaryPost(dateString);
    const summaryDates = await getSummaryDates();

    if (!summaryPost) return notFound();

    const { code: techFeedCode } = await loadMDX(summaryPost["tech-feed.md"]);
    const { code: redditCode } = await loadMDX(summaryPost["reddit.md"]);
    const { code: hackerNewsCode } = await loadMDX(
      summaryPost["hacker-news.md"]
    );

    return (
      <article className="max-w-7xl w-full flex justify-center px-5 mt-12 mb-24 mx-auto lg:px-32">
        <div className="flex w-full md:w-8/12 flex-col mx-auto mb-2 text-left">
          {/* メインコンテンツ */}
          <DateSelector currentDate={dateString} summaryDates={summaryDates} />
          <header className="flex flex-col-reverse gap-1 mb-4">
            <h1 className="font-bold text-4xl">{dateString} AI 要約</h1>
          </header>
          <div className="prose dark:prose-invert break-all">
            <SummaryTabs
              techFeedCode={techFeedCode}
              redditCode={redditCode}
              hackerNewsCode={hackerNewsCode}
            />
          </div>
        </div>
        <div className="hidden sticky top-0 self-start md:block md:w-4/12">
          <div className="ml-8">
            <SummaryTOC />
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error("Failed to load MDX:", error);
    console.error("dateString:", dateString);
    return notFound();
  }
}
