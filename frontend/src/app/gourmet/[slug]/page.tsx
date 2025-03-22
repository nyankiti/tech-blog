import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import { getGourmetPost, getAllGourmetPosts } from "@/libs/gourmet";
import { MDXComponent } from "./components/MdxComponent";
import { loadMDX } from "./mdx-loader";
import { Tag } from "@/components/Tag";
import { TbCalendar } from "react-icons/tb";
import { Datetime } from "@/components/Datetime";
import { unstable_ViewTransition as ViewTransition } from "react";
import { BLOG_CONTENTS_URL } from "@/constants";
import NextImage from "next/image";

export async function generateStaticParams() {
  const slugs = (await getAllGourmetPosts()).map((post) => post.slug);
  return slugs.map((slug) => {
    return { slug };
  });
}

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getGourmetPost(slug);

  if (!post || post.isDeleted === true) return notFound();

  return {
    title: post.title,
    description: post.description || post.title,
    alternates: {
      canonical: `https://sokes-nook.net/gourmet/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `/gourmet/${slug}`,
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
  const { slug } = await params;
  try {
    const post = await getGourmetPost(slug);

    if (!post || post.isDeleted === true) return notFound();

    const mdx = await loadMDX(post.content);
    const { code } = mdx;

    return (
      <article className="max-w-7xl w-full flex justify-center px-5 py-24 mx-auto lg:px-32">
        <div className="flex w-full md:w-8/12 flex-col mx-auto mb-2 text-left">
          <div className="mb-5 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="text-gray-600 flex dark:text-neutral-400 mr-3">
                <TbCalendar size={20} className="" />
                <Datetime
                  className="text-gray-600  dark:text-neutral-400"
                  datetime={post.visitedAt}
                  format="yyyy/MM/dd"
                />
              </div>

              <div className="flex flex-wrap gap-y-1 mb-1">
                {post.gourmetTags.map((tag, i) => (
                  <Tag key={i} tag={tag} />
                ))}
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
                className="w-full object-cover rounded-xl transition-all duration-300 ease-in-out"
                src={`${BLOG_CONTENTS_URL}/${post.thumbnail}`}
                width={300}
                height={200}
                alt="Blog Image"
              />
            </ViewTransition>
            <MDXComponent code={code} />
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error("Failed to load MDX:", error);
    console.error("slug:", slug);
    return notFound();
  }
}
