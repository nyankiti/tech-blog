import { bundleMDX } from "mdx-bundler";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import rehypeToc, { HtmlElementNode } from "rehype-toc";
import { baseDir, FrontMatter, getPostDirPath } from "@/libs/posts";
import path from "path";

export const loadMDX = async (fileContent: string) => {
  return bundleMDX<FrontMatter>({
    source: fileContent,
    globals: {
      globalMetadataMap: {
        varName: "globalMetadataMap",
      },
      he: "he",
      "@mdx-js/react": {
        varName: "MdxJsReact",
        namedExports: ["useMDXComponents"],
        defaultExport: false,
      },
    },
    cwd: getPostDirPath(),
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeMdxImportMedia,
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
    },
    esbuildOptions(options) {
      options.define = {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV), // Reactのモードを固定
      };
      options.outdir = path.join(baseDir, "public/images/blog/");
      options.loader = {
        ...options.loader,
        ".gif": "file",
        ".jpeg": "file",
        ".jpg": "file",
        ".png": "file",
        ".svg": "file",
        ".webp": "file",
        ".avif": "file",
      };
      options.publicPath = "/images/blog/";
      options.write = true;
      return options;
    },
  });
};
