import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import { NextLink } from "@/i18n/navigation";
import {
  getGourmetPost,
  getAllGourmetPosts,
  getRelatedGourmetPosts,
} from "@/libs/gourmet";
import { MDXComponent } from "./components/MdxComponent";
import { loadMDX } from "./mdx-loader";
import { TbCalendar } from "react-icons/tb";
import { Datetime } from "@/components/Datetime";
import { unstable_ViewTransition as ViewTransition } from "react";
import NextImage from "next/image";
import RelatedPostCard from "../components/RelatedPostCard";
import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateStaticParams() {
  const slugs = (await getAllGourmetPosts()).map((post) => post.slug);
  return slugs.map((slug) => {
    return { slug };
  });
}

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug, locale } = await params;

  const post = await getGourmetPost(slug);

  if (!post || post.isDeleted === true) return notFound();

  return {
    title: post.title,
    description: post.description || post.title,
    alternates: {
      canonical: `https://sokes-nook.net/${locale}/gourmet/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `/${locale}/gourmet/${slug}`,
      title: post.title,
      description: post.description || post.title,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: [...post.locationTags, ...post.gourmetTags],
      images: post.thumbnail,
    },
    twitter: {
      card: "summary_large_image",
      creator: `@soken_nowi`,
    },
  };
};

export default async function Page({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("GourmetPage");

  try {
    const post = await getGourmetPost(slug);

    if (!post || post.isDeleted === true) return notFound();

    const relatedPosts = await getRelatedGourmetPosts(post);

    const mdx = await loadMDX(post.content);
    const { code } = mdx;

    return (
      <article className="max-w-7xl w-full flex justify-center px-5 pt-12 pb-24 mx-auto lg:px-32">
        <div className="w-full grid md:grid-cols-12 gap-8">
          {/* メインコンテンツ */}
          <div className="md:col-span-8 break-all">
            <div className="mb-5 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="text-gray-600 flex dark:text-neutral-400 mr-3">
                  <TbCalendar size={20} />
                  <Datetime
                    className="text-gray-600 dark:text-neutral-400"
                    datetime={post.visitedAt}
                    format="yyyy/MM/dd"
                  />
                </div>

                <div className="flex flex-wrap gap-y-1 mb-1">
                  {post.locationTags?.length > 0 && (
                    <div className="flex gap-2">
                      {post.locationTags.map((tag, i) => (
                        <NextLink
                          key={i}
                          href={{
                            pathname: "/gourmet",
                            query: { locations: tag },
                          }}
                          className="center relative inline-flex items-center justify-center select-none whitespace-nowrap rounded-md py-1 px-2 mr-1 align-middle font-sans border border-gray-500 text-gray-700 text-xs font-medium leading-none tracking-wide hover:opacity-90 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          # {tag}
                        </NextLink>
                      ))}
                    </div>
                  )}
                  {post.gourmetTags?.length > 0 && (
                    <div className="flex gap-2 ml-2">
                      {post.gourmetTags.map((tag) => (
                        <NextLink
                          key={tag}
                          href={{
                            pathname: "/gourmet",
                            query: { gourmet: tag },
                          }}
                          className="center relative inline-flex items-center justify-center select-none whitespace-nowrap rounded-md py-1 px-2 mr-1 align-middle font-sans border border-gray-500 text-gray-700 text-xs font-medium leading-none tracking-wide hover:opacity-90 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          # {tag}
                        </NextLink>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ViewTransition name={`gourmet-post-title-${post.slug}`}>
              <header className="flex flex-col-reverse gap-1 mb-4">
                <h1 className="font-bold text-4xl">{post.title}</h1>
              </header>
            </ViewTransition>

            <div className="post prose dark:prose-invert">
              <ViewTransition name={`gourmet-post-image-${post.slug}`}>
                <NextImage
                  loading="eager"
                  decoding="sync"
                  className="w-full object-cover rounded-xl"
                  src={post.thumbnail}
                  width={300}
                  height={200}
                  alt="Blog Image"
                />
              </ViewTransition>
              <MDXComponent code={code} />
            </div>
          </div>

          <aside className="md:col-span-3">
            {relatedPosts.length > 0 && (
              <div className="mt-12 md:mt-0">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  {t("relatedPosts")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <RelatedPostCard
                      key={relatedPost.slug}
                      post={relatedPost}
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>
    );
  } catch (error) {
    console.error("Failed to load MDX:", error);
    console.error("slug:", slug);
    return notFound();
  }
}
