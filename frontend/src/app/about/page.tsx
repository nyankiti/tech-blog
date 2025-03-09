import { Metadata } from "next/types";
import { SITE_TITLE } from "@/constants";
import Image from "next/image";
import niwatoriImage from "../../../public/niwatori.jpeg";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = `about | ${SITE_TITLE}`;
  const description = `about | ${SITE_TITLE}`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://sokes-nook.net/about`,
    },
    openGraph: {
      type: "article",
      url: `/blog/about`,
      title,
      description,
      publishedTime: "2024-03-05",
      modifiedTime: "2024-03-05",
      tags: ["about"],
    },
    twitter: {
      card: "summary_large_image",
      creator: `@soken_nowi`,
    },
  };
};

export default async function Page() {
  return (
    // <div className="flex gap-2">
    //   <div className="shrink-0">
    //     <Image
    //       className="shrink-0 size-16 rounded-full"
    //       src={niwatoriImage}
    //       alt="Avatar"
    //     />
    //   </div>

    //   <div className="grow">
    //     <h1 className="text-lg font-medium text-gray-800 dark:text-neutral-200">
    //       たろ
    //     </h1>

    //     <p className="text-sm text-gray-600 dark:text-neutral-400">
    //       23卒のしがないweb屋さん
    //       <br />
    //       nook（隅、隠れ家）とニワトリが好き
    //       <br />
    //       アイコンは大好きな
    //       <a
    //         className="text-blue-600 dark:text-blue-500 hover:underline"
    //         href="https://www.youtube.com/watch?v=XqkJBqW3JQ0"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         松尾のニワトリ
    //       </a>
    //       &nbsp;フリー素材
    //     </p>

    //     <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400"></p>
    //   </div>
    // </div>
    <div className="dark:bg-gray-900 dark:text-white bg-white text-black min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-12 flex items-center space-x-6">
          <Image
            className="shrink-0 size-16 rounded-full"
            src={niwatoriImage}
            alt="Avatar"
          />
          <div>
            <h1 className="text-xl font-bold mb-2">ひよこ</h1>
            <div className="flex space-x-4">
              <a
                href="https://github.com/username"
                target="_blank"
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/username"
                target="_blank"
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/in/username"
                target="_blank"
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </header>

        {/* 自己紹介 */}
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">
            23卒のweb屋さん
            <br />
            日日是好日
            <br />
            nook（隅、隠れ家）が好き
            <br />
            アイコンは大好きな
            <a
              className="text-blue-600 dark:text-blue-500 hover:underline"
              href="https://www.youtube.com/watch?v=XqkJBqW3JQ0"
              target="_blank"
              rel="noopener noreferrer"
            >
              はじめまして松尾です
            </a>
            のフリー素材
          </p>
        </section>

        {/* 技術スタック */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">技術スタック</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {[
              {
                name: "React",
                color:
                  "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
              },
              {
                name: "TypeScript",
                color:
                  "bg-blue-200 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
              },
              {
                name: "Node.js",
                color:
                  "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
              },
              {
                name: "Docker",
                color:
                  "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300",
              },
              {
                name: "AWS",
                color:
                  "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300",
              },
              {
                name: "Python",
                color:
                  "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300",
              },
              {
                name: "GraphQL",
                color:
                  "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300",
              },
              {
                name: "Next.js",
                color:
                  "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
              },
            ].map((tech) => (
              <div
                key={tech.name}
                className={`${tech.color} p-3 rounded-lg text-center font-medium transition-all duration-300 hover:scale-105`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </section>

        {/* 副業条件 */}
        <section className="mb-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">副業募集条件</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">業務範囲</h3>
              <ul className="list-disc list-inside dark:text-gray-300">
                <li>バックエンド開発</li>
                <li>フロントエンド開発</li>
                <li>API設計</li>
                <li>インフラ構築</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">契約条件</h3>
              <ul className="list-disc list-inside dark:text-gray-300">
                <li>時給: 5,000〜8,000円</li>
                <li>リモートワーク可</li>
                <li>週10〜20時間</li>
                <li>3ヶ月以上の長期案件優先</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 連絡先 */}
        <footer className="text-center">
          <a
            href="mailto:contact@example.com"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            連絡を取る
          </a>
        </footer>
      </div>
    </div>
  );
}
