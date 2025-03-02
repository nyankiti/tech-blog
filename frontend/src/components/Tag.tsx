"use client";
import NextLink from "next/link";
import { useState } from "react";

type Props = {
  tag: string;
  linkTo?: string;
};

export const Tag = ({ tag, linkTo }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <NextLink
      prefetch={false}
      key={tag}
      href={linkTo ? linkTo : `/tags/${tag}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="center relative inline-block select-none whitespace-nowrap rounded-md py-1 px-2 mr-1 align-baseline font-sans border border-gray-500 text-gray-700 text-xs font-medium leading-none tracking-wide hover:opacity-90 dark:text-gray-100"
    >
      <span className="mt-px">
        <span
          style={{
            color: isHovered ? "#a3e635" : "inherit",
          }}
          className="transition mr-1"
        >
          #
        </span>
        {tag}
      </span>
    </NextLink>
  );
};
