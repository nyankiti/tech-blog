"use client";
import { useMemo } from "react";
import he from "he";
import { getMDXComponent } from "mdx-bundler/client";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { RiShareBoxFill } from "react-icons/ri";

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
        a: ({ ...props }) => {
          if (
            (typeof props.className === "string" &&
              props.className.includes("toc")) ||
            (typeof props.href === "string" && !props.href.startsWith("http"))
          ) {
            return <a {...props}>{props.children}</a>;
          }
          return (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors ml-2"
              href={props.href}
            >
              {props.children}
              <RiShareBoxFill />
            </a>
          );
        },
      }}
    >
      <Component />
    </MDXProvider>
  );
}
