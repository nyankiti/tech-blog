import {
  getGourmetTags,
  getLocationTags,
  getSortedGourmetPosts,
} from "@/libs/gourmet";

import TagFilter from "./components/TagFilter";
import FilteredPosts from "./components/FilteredPosts";
import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function GourmetPage({ searchParams, params }: Props) {
  const { locale } = await params;
  // 静的レンダリングを有効化
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "GourmetPage" });

  const sParams = await searchParams;
  const gourmetPosts = await getSortedGourmetPosts();
  const locationsTags = await getLocationTags();
  const gourmetTags = await getGourmetTags();

  return (
    <div className="max-w-[85rem] px-4 pb-10 sm:px-6 lg:px-8 mx-auto">
      <div className="mt-8">
        <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
          {t("description")}
        </p>
      </div>

      <div className="mb-8">
        <TagFilter locationsTags={locationsTags} gourmetTags={gourmetTags} />
      </div>

      <FilteredPosts initialPosts={gourmetPosts} sParams={sParams} />
    </div>
  );
}
