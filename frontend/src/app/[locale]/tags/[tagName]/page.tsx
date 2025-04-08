import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSortedPosts, getTags } from "@/libs/posts";
import { Tag } from "@/components/Tag";
import { PostCard } from "@/components/PostCard";
import { TitleSection } from "@/components/TitleSection";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ tagName: string; locale: Locale }>;
};

export const generateStaticParams = async () => {
  const tags = await getTags();
  return tags.map((tag) => ({ tagName: tag }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale, tagName: encodedTagName } = await params;
  setRequestLocale(locale);
  const tagName = decodeURIComponent(encodedTagName);

  const articles = (await getSortedPosts()).filter((post) =>
    post.tags.includes(tagName)
  );

  if (articles.length === 0) {
    return notFound();
  }

  return {
    title: `tag: ${tagName}`,
    description: `${tagName} でタグ付けされた記事一覧`,
    alternates: {
      canonical: `https://sokes-nook.net/${locale}/tags/${tagName}`,
    },
    openGraph: {
      type: "website",
      url: `/${locale}/tags/${tagName}`,
      title: `tag: ${tagName}`,
      description: `${tagName} でタグ付けされた記事一覧`,
    },
    twitter: {
      card: "summary_large_image",
      creator: `@soken_nowi`,
    },
    robots: {
      index: false, // noindexの設定
    },
  };
};

const TagPage: React.FC<Props> = async ({ params }) => {
  const tagName = decodeURIComponent((await params).tagName);

  const posts = (await getSortedPosts()).filter((post) =>
    post.tags.includes(tagName)
  );

  const tags = await getTags();

  if (posts.length === 0) notFound();

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <TitleSection />
      <div className="grid gap-4 grid-rows-[auto] md:grid-rows-1 md:grid-cols-[7fr_3fr]">
        <div className="order-1 md:order-2">
          {tagName && (
            <>
              <span>選択中のタグ: </span>
              <Tag tag={tagName} href="/" />
            </>
          )}
          <div>
            <p>Tags</p>
            {tags.map((tag, i) => (
              <Tag key={i} tag={tag} />
            ))}
          </div>
        </div>
        <div className="order-2 md:order-1">
          <ul className="grid gap-6 mb-10 lg:mb-14">
            {posts.map((item) => {
              if (!item.slug) return; // slugがない場合は表示しない。
              return (
                <li key={item.slug}>
                  <PostCard post={item} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TagPage;
