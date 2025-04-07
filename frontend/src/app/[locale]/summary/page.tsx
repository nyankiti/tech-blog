import { NextLink } from "@/i18n/navigation";
import { getSummaryDates } from "@/libs/summary";

/**
 * https://github.com/nyankiti/genai-lab にて生成されたTech情報のサマリを表示する
 */
export default async function SummaryPage() {
  const summaryDates = await getSummaryDates();
  return (
    <div className="max-w-[85rem] px-4 pb-10 sm:px-6 lg:px-8 mx-auto">
      <div className="mt-8">
        <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
          個人的にウォッチしているTech系の情報を生成AIで要約したものを公開する場所。
        </p>
      </div>
      <div className="prose dark:prose-invert ">
        <ul>
          {summaryDates.map((date) => (
            <li key={date} className="mt-2">
              <NextLink href={`/summary/${date}`}>{date}</NextLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
