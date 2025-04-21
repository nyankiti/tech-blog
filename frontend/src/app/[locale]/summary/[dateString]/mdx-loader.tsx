import { bundleMDX } from "mdx-bundler";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeToc, { HtmlElementNode } from "rehype-toc";

export const preprocessMDX = (content: string): string => {
  return (
    content
      // summaryではmdxの機能を利用しないのでパースエラー対策で全てエスケープする
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/=/g, "&#61;")
      // htmlコメントのエスケープ（例: <!-- comment -->）
      .replace(/<!--([\s\S]*?)-->/g, (_, content) => {
        return `{/* ${content.trim()} */}`;
      })
      // .{js,ts} をリテラルとして扱うために中括弧をエスケープ
      .replace(/\.{([a-z]+,[a-z]+)}/gi, (_match, p1) => `\`{${p1}}\``)
  );
};

export const loadMDX = async (fileContent: string) => {
  return bundleMDX({
    source: preprocessMDX(fileContent),
    globals: {
      "@mdx-js/react": {
        varName: "MdxJsReact",
        namedExports: ["useMDXComponents"],
        defaultExport: false,
      },
    },
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [
          rehypeToc,
          {
            headings: ["h1"],
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
        "process.env": JSON.stringify(process.env),
      };
      return options;
    },
  });
};
