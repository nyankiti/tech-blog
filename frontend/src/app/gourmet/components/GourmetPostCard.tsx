import NextImage from 'next/image';
import NextLink from 'next/link';
import { unstable_ViewTransition as ViewTransition } from 'react';

import { Datetime } from '@/components/Datetime';
import type { GourmetPost } from '@/libs/gourmet';

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
          src={post.thumbnail}
          width={600}
          height={400}
          alt="Blog Image"
        />
      </ViewTransition>
      <ViewTransition name={`gourmet-post-title-${post.slug}`}>
        <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white dark:group-focus:text-white">
          {post.title}
        </h3>
      </ViewTransition>
      <Datetime
        className="text-gray-600 dark:text-neutral-400"
        datetime={post.visitedAt}
        format="yyyy/MM/dd"
      />
    </NextLink>
  );
}
