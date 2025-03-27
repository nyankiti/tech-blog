"use client";
import { useMemo } from "react";
import he from "he";
import NextImage from "next/image";
import { getMDXComponent } from "mdx-bundler/client";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { SiteMetadata } from "@/components/MDXComponents/utils";
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
  globalMetadataMap: Record<string, SiteMetadata | null>;
};

export function MDXComponent({ code, globalMetadataMap }: Props) {
  const Component = useMemo(
    () => getMDXComponent(code, { ...GLOBAL_CONFIG, globalMetadataMap }),
    [code, globalMetadataMap]
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
              className="object-cover rounded-xl"
              src={src}
              alt={props.alt || ""}
              width={900}
              height={600}
            />
          );
        },
        // BookmarkのレンダリングをFE側に寄せる
        // Bookmark: Bookmark,
        TweetEmbed: TweetEmbed,
        YouTubeEmbed: YouTubeEmbed,
        code: ({ ...props }) => {
          const { className, children } = props;
          const match = /language-(\w+)/.exec(className || "");
          if (match) {
            const filename = className.split(":")[1] as string | undefined;
            return (
              <>
                {filename && (
                  <div className="text-sm text-neutral-200">{filename}</div>
                )}
                <SyntaxHighlighter
                  language={match[1]}
                  PreTag="div"
                  {...props}
                  style={oneDark}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </>
            );
          } else {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        },
      }}
    >
      <Component />
    </MDXProvider>
  );
}
