"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Paragraph } from "@/components/MDXRenderer/Paragraph";
import { getMDXComponent } from "mdx-bundler/client";

import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { useMemo } from "react";

const MDX_GLOBAL_CONFIG = {
  MdxJsReact: {
    useMDXComponents,
  },
};

type Props = {
  code: string;
};

export function MDXComponent({ code }: Props) {
  const Component = useMemo(
    () => getMDXComponent(code, MDX_GLOBAL_CONFIG),
    [code]
  );

  return (
    <MDXProvider
      components={{
        p: Paragraph,
        h1: ({ ...props }) => {
          return (
            <h1 {...props.node?.properties} className="mt-6">
              {props.children}
            </h1>
          );
        },
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
