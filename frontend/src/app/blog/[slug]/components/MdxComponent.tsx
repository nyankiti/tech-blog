"use client";
import { useMemo } from "react";
import he from "he";
import { getMDXComponent } from "mdx-bundler/client";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { SiteMetadata } from "@/components/MDXComponents/utils";
import { TweetEmbed } from "@/components/MDXComponents/TweetEmbed";
import { YouTubeEmbed } from "@/components/MDXComponents/YoutubeEmbed";

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
        // TODO: この辺りのComponentをblog-contents側によせたい
        TweetEmbed: TweetEmbed,
        YouTubeEmbed: YouTubeEmbed,
        code: ({ ...props }) => {
          const { className, children } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              language={match[1]}
              PreTag="div"
              {...props}
              style={oneDark}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      <Component />
    </MDXProvider>
  );
}
