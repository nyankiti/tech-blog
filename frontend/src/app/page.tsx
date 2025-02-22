import { PostCard } from "@/components/PostCard";
import { Tag } from "@/components/Tag";
import { TitleSection } from "@/components/TitleSection";
import { getSortedPost, TAGS } from "@/libs/posts";

export default async function Page() {
  const posts = await getSortedPost();
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <TitleSection />
      <div className="grid gap-4 grid-rows-[auto] md:grid-rows-1 md:grid-cols-[7fr_3fr]">
        <div>
          <ul className="grid gap-6 mb-10 lg:mb-14">
            {posts.map((item) => {
              return (
                <li key={item.slug}>
                  <PostCard post={item} />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="">
          {/* <Profile /> */}

          {/* divider */}
          <div className="my-6 border-t border-slate-200 w-full" />
          <div>
            <p>Tags</p>
            {TAGS.map((tag, i) => (
              <Tag key={i} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
