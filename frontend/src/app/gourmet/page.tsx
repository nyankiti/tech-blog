import {
  //   getGourmetTags,
  //   getLocationTags,
  getSortedGourmetPosts,
} from "@/libs/gourmet";
import GourmetPostCard from "./components/GourmetPostCard";

export default async function GourmetPage() {
  const gourmetPosts = await getSortedGourmetPosts();
  //   const locationsTags = await getLocationTags();
  //   const gourmetTags = await getGourmetTags();
  return (
    <div className="max-w-[85rem] px-4 pb-10 sm:px-6 lg:px-8 mx-auto">
      <div className="my-8">
        <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
          訪れたお店の写真を何となく残しておこうとする場所。写真を撮るのは下手。
          <br />
          nookは「隅、隠れ家」という意味。
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gourmetPosts.map((post, i) => {
          return <GourmetPostCard key={i} post={post} />;
        })}
      </div>
    </div>
  );
}
