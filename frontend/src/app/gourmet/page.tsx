import {
  getGourmetTags,
  getLocationTags,
  getSortedGourmetPosts,
} from "@/libs/gourmet";
import TagFilter from "./components/TagFilter";
import FilteredPosts from "./components/FilteredPosts";
import { Suspense } from "react";

export default async function GourmetPage() {
  const gourmetPosts = await getSortedGourmetPosts();
  const locationsTags = await getLocationTags();
  const gourmetTags = await getGourmetTags();

  return (
    <div className="max-w-[85rem] px-4 pb-10 sm:px-6 lg:px-8 mx-auto">
      <div className="mt-8">
        <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
          訪れたお店の記録を何となく残しておこうとする場所。写真は素人。
        </p>
      </div>

      <Suspense fallback={<div>読み込み中...</div>}>
        <div className="mb-8">
          <TagFilter locationsTags={locationsTags} gourmetTags={gourmetTags} />
        </div>

        <FilteredPosts initialPosts={gourmetPosts} />
      </Suspense>
    </div>
  );
}
