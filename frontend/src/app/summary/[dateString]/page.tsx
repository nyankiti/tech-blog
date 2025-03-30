import { notFound } from "next/navigation";
import { getSummaryDates, getSummaryPost } from "@/libs/summary";
import { loadMDX } from "./mdx-loader";
import { MDXComponent } from "./components/MdxComponent";
import DateSelector from "./components/DateSelector";

type Props = {
  params: Promise<{ dateString: string }>;
};

export default async function Page({ params }: Props) {
  const { dateString } = await params;
  try {
    const summaryPost = await getSummaryPost(dateString);
    const summaryDates = await getSummaryDates();

    if (!summaryPost) return notFound();

    console.log("summaryPost", summaryPost);

    const mdx = await loadMDX(summaryPost["tech-feed.md"]);
    const { code } = mdx;

    return (
      <article className="max-w-7xl w-full flex justify-center px-5 py-24 mx-auto lg:px-32">
        <div className="flex w-full md:w-8/12 flex-col mx-auto mb-2 text-left">
          {/* メインコンテンツ */}
          <header className="flex flex-col-reverse gap-1 mb-4">
            <h1 className="font-bold text-4xl">デイリー要約 - {dateString}</h1>
          </header>
          <DateSelector currentDate={dateString} summaryDates={summaryDates} />
          <div className="post prose dark:prose-invert">
            <MDXComponent code={code} />
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
