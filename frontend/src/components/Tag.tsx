"use client";
import NextLink, { LinkProps } from "next/link";
import { useState } from "react";

type Props = {
  tag: string;
  href?: LinkProps["href"];
};

export const Tag = ({ tag, href }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <NextLink
      prefetch={false}
      key={tag}
      href={href ? href : `/tags/${tag}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="center relative inline-flex items-center justify-center select-none whitespace-nowrap rounded-md py-1 px-2 mr-1 align-middle font-sans border border-gray-500 text-gray-700 text-xs font-medium leading-none tracking-wide hover:opacity-90 dark:text-gray-100"
    >
      <span className="flex items-center">
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
