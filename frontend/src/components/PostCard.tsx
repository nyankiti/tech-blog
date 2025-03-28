import type { TechBlogPost } from '@/libs/posts';
import NextLink from 'next/link';
import { Datetime } from './Datetime';
import { Tag } from './Tag';

type Props = {
  post: TechBlogPost;
};

export const PostCard = ({ post }: Props) => {
  return (
    <article className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
      <div className="p-4 md:p-5">
        <div className="flex flex-wrap gap-y-1">
          {post.tags.map((tag, i) => (
            <Tag key={i.toString()} tag={tag} />
          ))}
        </div>
        <NextLink href={`/blog/${post.slug}`}>
          <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white">
            {post.title}
          </h3>
          <div className="flex items-center justify-between">
            <Datetime
              className="text-gray-600 text-xs dark:text-neutral-400"
              datetime={post.publishedAt}
              format="yyyy/MM/dd"
            />

            {post.views > 0 && (
              <p className="text-gray-600 text-xs pr-2 underline ml-auto dark:text-neutral-400">
                {post.views} views
              </p>
            )}
            <p className="inline-flex items-center gap-x-1 text-sm text-gray-800 dark:text-neutral-200">
              Read more
              <svg
                className="flex-shrink-0 size-4 transition ease-in-out group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-labelledby="arrow-icon-title"
              >
                <title id="arrow-icon-title">Arrow pointing right</title>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </p>
          </div>
        </NextLink>
      </div>
    </article>
  );
};
