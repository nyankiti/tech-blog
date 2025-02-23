import { Suspense } from "react";
import { SITE_URL } from "@/constants";
import { fetchSiteMetadata } from "./utils";
import { BookmarkClient } from "./BookmarkClient";

type Props = {
  href: string;
};

export const Bookmark: React.FC<Props> = async ({ href }) => {
  const url = new URL(href, SITE_URL); // hrefを相対パスで指定された場合は SITE_URL利用されるようにする
  const metadata = await fetchSiteMetadata(url.href);

  if (!metadata) {
    return <BookmarkError href={href} />;
  }

  return (
    <Suspense fallback={<BookmarkSkeleton />}>
      <BookmarkClient metadata={metadata} href={href} />
    </Suspense>
  );
};

const BookmarkError: React.FC<{ href: string }> = ({ href }) => {
  return (
    <a
      className="flex flex-col gap-2 p-4 rounded-lg border border-link-card-border text-text-primary transition-colors duration-200 hover:border-link-card-border-hover hover:bg-link-card-bg-hover"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <p className="font-medium">ページを読み込めませんでした</p>
      <div className="text-sm text-text-secondary">{href}</div>
    </a>
  );
};

const BookmarkSkeleton: React.FC = () => {
  return (
    <div className="flex gap-2 h-36 w-full rounded-lg border border-link-card-border overflow-hidden">
      <div className="flex flex-col p-2 flex-1 h-full">
        <div className="flex flex-col gap-2">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-4/5 h-4 bg-gray-200 rounded"></div>
        </div>

        <div className="flex flex-col gap-2 mt-6 flex-1">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-4/5 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="w-40 h-full bg-gray-200"></div>
    </div>
  );
};
