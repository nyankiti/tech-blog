"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type TagFilterProps = {
  locationsTags: string[];
  gourmetTags: string[];
};

export default function TagFilter({
  locationsTags,
  gourmetTags,
}: TagFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("GourmetPage");

  const [selectedLocationTags, setSelectedLocationTags] = useState<string[]>(
    () => {
      const locationsParam = searchParams.get("locations");
      return locationsParam ? locationsParam.split(",").filter(Boolean) : [];
    }
  );

  const [selectedGourmetTags, setSelectedGourmetTags] = useState<string[]>(
    () => {
      const gourmetParam = searchParams.get("gourmet");
      return gourmetParam ? gourmetParam.split(",").filter(Boolean) : [];
    }
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedLocationTags.length > 0) {
      params.set("locations", selectedLocationTags.join(","));
    } else {
      params.delete("locations");
    }

    if (selectedGourmetTags.length > 0) {
      params.set("gourmet", selectedGourmetTags.join(","));
    } else {
      params.delete("gourmet");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    selectedLocationTags,
    selectedGourmetTags,
    pathname,
    router,
    searchParams,
  ]);

  const toggleLocationTag = (tag: string) => {
    setSelectedLocationTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleGourmetTag = (tag: string) => {
    setSelectedGourmetTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedLocationTags([]);
    setSelectedGourmetTags([]);
  };

  return (
    <>
      <div className="my-4">
        <h3>{t("location")}</h3>
        <div className="flex flex-wrap gap-2">
          {locationsTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleLocationTag(tag)}
              className={`center relative inline-flex items-center justify-center select-none whitespace-nowrap rounded-md py-1 px-2 mr-1 align-middle font-sans border border-gray-500 text-gray-700 text-xs font-medium leading-none tracking-wide hover:opacity-90 dark:text-gray-300  ${
                selectedLocationTags.includes(tag)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              }`}
            >
              # {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3>{t("genre")}</h3>
        <div className="flex flex-wrap gap-2">
          {gourmetTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleGourmetTag(tag)}
              className={`center relative inline-flex items-center justify-center select-none whitespace-nowrap rounded-md py-1 px-2 mr-1 align-middle font-sans border border-gray-500 text-gray-700 text-xs font-medium leading-none tracking-wide hover:opacity-90 dark:text-gray-300 ${
                selectedGourmetTags.includes(tag)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              }`}
            >
              # {tag}
            </button>
          ))}
        </div>
      </div>

      {(selectedLocationTags.length > 0 || selectedGourmetTags.length > 0) && (
        <button
          onClick={clearFilters}
          className="center relative inline-flex items-center justify-center select-none whitespace-nowrap rounded-md py-1 px-2 mr-1 align-middle font-sans border border-gray-500 text-gray-700 text-xs font-medium leading-none tracking-wide hover:opacity-90 dark:text-gray-100"
          // className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          フィルターをクリア
        </button>
      )}
    </>
  );
}
