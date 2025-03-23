import { unstable_ViewTransition as ViewTransition } from "react";
import NextImage from "next/image";
import NextLink from "next/link";

import { GourmetPost } from "@/libs/gourmet";
import { Datetime } from "@/components/Datetime";
import { BLOG_CONTENTS_URL } from "@/constants";

export default function GourmetPostCard({ post }: { post: GourmetPost }) {
  return (
    <NextLink
      className="group block rounded-xl focus:outline-hidden"
      href={`/gourmet/${post.slug}`}
    >
      <ViewTransition name={`gourmet-post-image-${post.slug}`}>
        <NextImage
          loading="eager"
          decoding="sync"
          className="w-full object-cover rounded-xl"
          src={`${BLOG_CONTENTS_URL}/${post.thumbnail}`}
          width={300}
          height={200}
          alt="Blog Image"
        />
      </ViewTransition>
      <ViewTransition name={`gourmet-post-title-${post.slug}`}>
        <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white dark:group-focus:text-white">
          {post.title}
        </h3>
      </ViewTransition>
      <Datetime
        className="text-gray-600  dark:text-neutral-400"
        datetime={post.visitedAt}
        format="yyyy/MM/dd"
      />
    </NextLink>
  );
}
