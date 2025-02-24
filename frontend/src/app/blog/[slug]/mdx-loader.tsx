import { bundleMDX } from "mdx-bundler";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeToc, { HtmlElementNode } from "rehype-toc";
import { FrontMatter, getPostDirPath, readFileFromMdorMds } from "@/libs/posts";

const globals = {
  "@mdx-js/react": {
    varName: "MdxJsReact",
    namedExports: ["useMDXComponents"],
    defaultExport: false,
  },
};

export const loadMDX = async (slug: string) => {
  try {
    const fileContent = await readFileFromMdorMds(slug);
    if (!fileContent) return undefined;

    return bundleMDX<FrontMatter>({
      source: fileContent,
      globals,
      cwd: getPostDirPath(),
      mdxOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeSlug,
          [
            rehypeToc,
            {
              headings: ["h1", "h2", "h3"],
              cssClasses: {
                toc: "sp-toc",
                list: "sp-toc-list",
                listItem: "sp-toc-list-item",
                link: "sp-toc-link",
              },
              customizeTOC: (toc: HtmlElementNode) => {
                return {
                  type: "element",
                  tagName: "div",
                  properties: {
                    className:
                      "mb-4 border-b border-neutral-300 dark:border-neutral-800",
                    id: "sp-toc",
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "p",
                      properties: {
                        className:
                          "mt-0 mb-0 text-xl font-bold tracking-tight translate-y-4",
                      },
                      children: [
                        {
                          type: "text",
                          value: "目次",
                        },
                      ],
                    },
                    ...(toc.children || []),
                  ],
                };
              },
            },
          ],
        ];

        return { ...options, providerImportSource: "@mdx-js/react" };
        return options;
      },
    });
  } catch {
    return undefined;
  }
};
