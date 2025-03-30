import { Metadata } from "next";
import NextLink from "next/link";

export const metadata: Metadata = {
  robots: {
    index: false, // noindexの設定
  },
};

export default async function Page() {
  return (
    <div className="max-w-[85rem] px-4 pb-10 sm:px-6 lg:px-8 mx-auto">
      <div className="mt-8">
        <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
          気になった技術の実験場。
        </p>
      </div>
      <div className="prose">
        <ul>
          <li>
            <NextLink href="/lab/webpush">webpush</NextLink>
          </li>
          <li>
            <NextLink href="/gourmet">
              View Transition APIを用いたグルメブログ
            </NextLink>
          </li>
          <li>
            <NextLink href="/summary">
              個人的にウォッチしているTech系の情報を生成AIを用いて日次で要約
            </NextLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
