"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, startTransition } from "react";
import GourmetPostCard from "./GourmetPostCard";
import { GourmetPost } from "@/libs/gourmet";

interface FilteredPostsProps {
  initialPosts: GourmetPost[];
}

export default function FilteredPosts({ initialPosts }: FilteredPostsProps) {
  const searchParams = useSearchParams();
  const [filteredPosts, setFilteredPosts] =
    useState<GourmetPost[]>(initialPosts);

  useEffect(() => {
    const locationFilters =
      searchParams.get("locations")?.split(",").filter(Boolean) || [];
    const gourmetFilters =
      searchParams.get("gourmet")?.split(",").filter(Boolean) || [];

    if (locationFilters.length === 0 && gourmetFilters.length === 0) {
      // setFilteredPosts(initialPosts);
      startTransition(() => {
        setFilteredPosts(initialPosts);
      });
      return;
    }

    startTransition(() => {
      setFilteredPosts(
        initialPosts.filter((post) => {
          const matchesLocation =
            locationFilters.length === 0 ||
            (post.locationTags &&
              locationFilters.some((tag) => post.locationTags?.includes(tag)));

          const matchesGourmet =
            gourmetFilters.length === 0 ||
            (post.gourmetTags &&
              gourmetFilters.some((tag) => post.gourmetTags?.includes(tag)));

          return matchesLocation && matchesGourmet;
        })
      );
    });
  }, [searchParams, initialPosts]);

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-400">
          該当する投稿がありません
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredPosts.map((post) => (
        <GourmetPostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
