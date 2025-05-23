"use client";

import { useEffect, useState, startTransition } from "react";
import GourmetPostCard from "./GourmetPostCard";
import { GourmetPost } from "@/libs/gourmet";

interface FilteredPostsProps {
  initialPosts: GourmetPost[];
  sParams: { [key: string]: string | string[] | undefined };
}

export default function FilteredPosts({
  initialPosts,
  sParams: searchParams,
}: FilteredPostsProps) {
  const [filteredPosts, setFilteredPosts] =
    useState<GourmetPost[]>(initialPosts);

  // FIXME: useEffect, useStateでフィルタリングする必要ないのでは？？ SRCの段階でフィルタリングできそう？
  useEffect(() => {
    const locations = searchParams["locations"];
    const locationFilters =
      (typeof locations === "string" && locations.split(",").filter(Boolean)) ||
      [];
    const gourmet = searchParams["gourmet"];
    const gourmetFilters =
      (typeof gourmet === "string" && gourmet.split(",").filter(Boolean)) || [];

    if (locationFilters.length === 0 && gourmetFilters.length === 0) {
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredPosts.map((post) => (
        <GourmetPostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
