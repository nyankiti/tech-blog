import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import { TbRefresh, TbCalendar } from "react-icons/tb";
import {
  getFrontMatter,
  getPostDirPath,
  getSlugs,
  readFileFromMdorMds,
} from "@/libs/posts";
import { Tag } from "@/components/Tag";
import { Datetime } from "@/components/Datetime";
import { loadMDX } from "./mdx-loader";
import { extractBookmarkUrls } from "./extract-bookmark-urls";
import {
  fetchSiteMetadata,
  SiteMetadata,
} from "@/components/MDXComponents/utils";

import { PcToc } from "./components/PcToc";
import { Adsense } from "./components/Adsense";
import { MDXComponent } from "./components/MdxComponent";

export const dynamic = "error";
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getSlugs();
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
  const frontmatter = await getFrontMatter(slug);

  if (!frontmatter || frontmatter.isDeleted === true) return notFound();

  return {
    title: frontmatter.title,
    description: frontmatter.description || frontmatter.title,
    alternates: {
      canonical: `https://sokes-nook.net/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `/blog/${slug}`,
      title: frontmatter.title,
      description: frontmatter.description || frontmatter.title,
      publishedTime: frontmatter.publishedAt,
      modifiedTime: frontmatter.updatedAt,
      tags: frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      creator: `@soken_nowi`,
    },
  };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const fileContent = await readFileFromMdorMds(slug, getPostDirPath());
  if (!fileContent) return notFound();

  // Bookmark用のmetadataを事前に取得してMDXのglobalsに注入する
  const mookmarkUrls = await extractBookmarkUrls(fileContent ?? "");

  const globalMetadataMap: Record<string, SiteMetadata | null> =
    await Promise.all(
      mookmarkUrls.map(async (url) => {
        try {
          const metadata = await fetchSiteMetadata(url);
          return [url, metadata];
        } catch (error) {
          console.error(`Failed to fetch metadata for ${url}:`, error);
          return [url, null];
        }
      })
    ).then(Object.fromEntries);
  try {
    const mdx = await loadMDX(fileContent);
    const { frontmatter, code } = mdx;

    const publishedDate = new Date(frontmatter.publishedAt);
    const lastEditedDate = new Date(frontmatter.updatedAt);
    const isShowEditTime =
      publishedDate < lastEditedDate &&
      publishedDate.toISOString().slice(0, 10) !==
        lastEditedDate.toISOString().slice(0, 10); // 同じ日付の場合は変更日を表示しない

    return (
      <article className="max-w-7xl w-full flex justify-center px-5 py-24 mx-auto lg:px-32">
        <div className="flex w-full md:w-8/12 flex-col mx-auto mb-2 text-left">
          <div className="mb-5 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="text-gray-600 flex dark:text-neutral-400 mr-3">
                <TbCalendar size={20} className="" />
                <Datetime
                  className="text-gray-600  dark:text-neutral-400"
                  datetime={frontmatter.publishedAt}
                  format="yyyy/MM/dd"
                />
                {isShowEditTime && <TbRefresh size={20} className="ml-3" />}
                {frontmatter.updatedAt && isShowEditTime && (
                  <Datetime
                    datetime={frontmatter.updatedAt}
                    format="yyyy/MM/dd"
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-y-1 mb-1">
                {frontmatter.tags.map((tag, i) => (
                  <Tag key={i} tag={tag} />
                ))}
              </div>
            </div>
          </div>
          <header className="flex flex-col-reverse gap-1 mb-4">
            <h1 className="font-bold text-4xl">{frontmatter.title}</h1>
          </header>
          <div className="post prose dark:prose-invert">
            <MDXComponent code={code} globalMetadataMap={globalMetadataMap} />
          </div>

          <div className="relative left-0 mt-10">
            <div className="border-t absolute left-0 w-full border-gray-200 dark:border-neutral-700" />
            <div className="mt-4 flex justify-center items-center gap-2">
              <div className="w-full ml-2">
                <Adsense isVertical={false} />
              </div>
              <div className="w-full mr-2 hidden md:block">
                <Adsense isVertical={false} />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sticky top-0 self-start md:block md:w-4/12">
          <div className="ml-8">
            <PcToc />
          </div>
        </div>
      </article>
    );
  } catch (e) {
    console.error("Failed to load MDX:", e);
    console.error("filecontent:", fileContent);
    return notFound();
  }
}
