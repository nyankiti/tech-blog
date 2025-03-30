"use client";
import { useMemo } from "react";
import he from "he";
import { getMDXComponent } from "mdx-bundler/client";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";

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
      }}
    >
      <Component />
    </MDXProvider>
  );
}
