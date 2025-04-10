import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSortedPosts, getTags } from "@/libs/posts";
import { Tag } from "@/components/Tag";
import { PostCard } from "@/components/PostCard";
import { TitleSection } from "@/components/TitleSection";
import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ tagName: string; locale: Locale }>;
};

export const generateStaticParams = async () => {
  const tags = await getTags("ja");
  return tags.map((tag) => ({ tagName: tag }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale, tagName: encodedTagName } = await params;
  const tagName = decodeURIComponent(encodedTagName);

  const t = await getTranslations({ locale, namespace: "TagPage" });

  const articles = (await getSortedPosts(locale)).filter((post) =>
    post.tags.includes(tagName)
  );

  if (articles.length === 0) {
    return notFound();
  }

  return {
    title: `tag: ${tagName}`,
    description: t("description", {
      tag: tagName,
    }),
    alternates: {
      canonical: `https://sokes-nook.net/${locale}/tags/${tagName}`,
    },
    openGraph: {
      type: "website",
      url: `/${locale}/tags/${tagName}`,
      title: `tag: ${tagName}`,
      description: t("description", {
        tag: tagName,
      }),
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
  const { locale, tagName: encodedTagName } = await params;
  // 静的レンダリングを有効化
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "TagPage" });
  const tagName = decodeURIComponent(encodedTagName);

  const posts = (await getSortedPosts(locale)).filter((post) =>
    post.tags.includes(tagName)
  );

  const tags = await getTags(locale);

  if (posts.length === 0) notFound();

  return (
    <div className="max-w-[85rem] px-4 pb-10 sm:px-6 lg:px-8 mx-auto">
      <TitleSection />
      <div className="grid gap-4 grid-rows-[auto] md:grid-rows-1 md:grid-cols-[7fr_3fr]">
        <div className="order-1 md:order-2">
          {tagName && (
            <>
              <span>{t("selectedTag")} </span>
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
