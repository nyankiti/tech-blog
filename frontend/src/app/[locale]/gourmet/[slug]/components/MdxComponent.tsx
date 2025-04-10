"use client";
import { useMemo } from "react";
import NextImage from "next/image";
import he from "he";
import { getMDXComponent } from "mdx-bundler/client";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";

import { TweetEmbed } from "@/components/MDXComponents/TweetEmbed";
import { YouTubeEmbed } from "@/components/MDXComponents/YoutubeEmbed";
import { BLOG_CONTENTS_URL } from "@/constants";

const GLOBAL_CONFIG = {
  MdxJsReact: {
    useMDXComponents,
  },
  he: he,
};

type Props = {
  code: string;
};

export function MDXComponent({ code }: Props) {
  const Component = useMemo(
    () => getMDXComponent(code, { ...GLOBAL_CONFIG }),
    [code]
  );

  return (
    <MDXProvider
      components={{
        h1: ({ ...props }) => {
          return (
            <h1 {...props.node?.properties} id={props.id} className="mt-6">
              {props.children}
            </h1>
          );
        },
        img: ({ ...props }) => {
          // 相対パスが指定された場合、blog-contents側の画像を参照する
          const src =
            props.src.startsWith("images") | props.src.startsWith("/") ||
            props.src.startsWith("./") ||
            props.src.startsWith("../")
              ? `${BLOG_CONTENTS_URL}/${props.src}`
              : props.src;
          return (
            <NextImage
              className="w-full object-cover rounded-xl"
              src={src}
              alt={props.alt || ""}
              width={300}
              height={200}
            />
          );
        },
        // TODO: この辺りのComponentをblog-contents側によせたい
        TweetEmbed: TweetEmbed,
        YouTubeEmbed: YouTubeEmbed,
      }}
    >
      <Component />
    </MDXProvider>
  );
}
