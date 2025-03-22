import { Datetime } from "@/components/Datetime";
import { BLOG_CONTENTS_URL } from "@/constants";
import {
  //   getGourmetTags,
  //   getLocationTags,
  getSortedGourmetPosts,
} from "@/libs/gourmet";
import NextImage from "next/image";

export default async function GourmetPage() {
  const gourmetPosts = await getSortedGourmetPosts();
  console.log(gourmetPosts);
  //   const locationsTags = await getLocationTags();
  //   const gourmetTags = await getGourmetTags();
  return (
    <div className="max-w-[85rem] px-4 pb-10 sm:px-6 lg:px-8 mx-auto">
      <div className="max-w-2xl my-8">
        <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
          X,
          instgramはタグ管理や検索が微妙で使いたくない。だけど日々の写真をはいい感じに整理しておきたい。そういう場所。
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gourmetPosts.map((post, i) => {
          return (
            <a
              key={i}
              className="group block rounded-xl focus:outline-hidden"
              href={`/gourmet/${post.slug}`}
            >
              <div className="aspect-w-16 aspect-h-9">
                <NextImage
                  className="w-full object-cover rounded-xl"
                  src={`${BLOG_CONTENTS_URL}/${post.thumbnail}`}
                  width={300}
                  height={200}
                  alt="Blog Image"
                />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white dark:group-focus:text-white">
                {post.title}
              </h3>
              {/* <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                {post.visitedAt}
              </p> */}
              <Datetime
                className="text-gray-600  dark:text-neutral-400"
                datetime={post.visitedAt}
                format="yyyy/MM/dd"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
