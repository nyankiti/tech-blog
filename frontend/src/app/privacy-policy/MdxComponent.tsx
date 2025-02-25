"use client";
import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";

type Props = {
  code: string;
};

export function MDXComponent({ code }: Props) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return <Component />;
}
