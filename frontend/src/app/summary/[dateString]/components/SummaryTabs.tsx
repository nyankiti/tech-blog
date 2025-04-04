"use client";
import { Tabs } from "radix-ui";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { MDXComponent } from "./MdxComponent";
import { RiShareBoxFill } from "react-icons/ri";

type Props = {
  techFeedCode: string;
  redditCode: string;
};

export default function SummaryTabs({ techFeedCode, redditCode }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = searchParams.get("tab") || "tech-feed";

  const handleTabChange = (tab: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", tab);
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Tabs.Root
      defaultValue="tech-feed"
      value={activeTab}
      onValueChange={handleTabChange}
      className="summary-post"
    >
      <Tabs.List className="flex border-b border-gray-200 mb-4">
        <Tabs.Trigger
          value="tech-feed"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          Tech Feed
        </Tabs.Trigger>
        <Tabs.Trigger
          value="reddit"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          Reddit
        </Tabs.Trigger>
        <Tabs.Trigger
          value="hacker-news"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          Hacker News
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="tech-feed" className="max-w-none">
        <MDXComponent code={techFeedCode} />
      </Tabs.Content>

      <Tabs.Content value="reddit" className="max-w-none">
        <MDXComponent code={redditCode} />
      </Tabs.Content>

      <Tabs.Content value="hacker-news" className="max-w-none">
        <a
          href="https://catnose.me/lab/hackernews-ja/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors ml-2"
        >
          catnoseさんのHacker News日本語まとめ
          <RiShareBoxFill />
        </a>
      </Tabs.Content>
    </Tabs.Root>
  );
}
