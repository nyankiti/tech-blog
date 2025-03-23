import {
  getGourmetTags,
  getLocationTags,
  getSortedGourmetPosts,
} from "@/libs/gourmet";
import TagFilter from "./components/TagFilter";
import FilteredPosts from "./components/FilteredPosts";

export default async function GourmetPage() {
  const gourmetPosts = await getSortedGourmetPosts();
  const locationsTags = await getLocationTags();
  const gourmetTags = await getGourmetTags();

  return (
    <div className="max-w-[85rem] px-4 pb-10 sm:px-6 lg:px-8 mx-auto">
      <div className="my-8">
        <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
          訪れたお店の写真を何となく残しておこうとする場所。写真を撮るのは下手。
          <br />
          nookは「隅、隠れ家」という意味。
        </p>
      </div>

      <div className="mb-8">
        <TagFilter locationsTags={locationsTags} gourmetTags={gourmetTags} />
      </div>

      <FilteredPosts initialPosts={gourmetPosts} />
    </div>
  );
}
