import type { MDXComponents } from "mdx/types";

/**
 * ⚠️ next-mdx-remote で読み込むページには対応していない
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
