import path from "node:path";
import { readFile } from "node:fs/promises";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeToc, { HtmlElementNode } from "rehype-toc";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FrontMatter } from "@/libs/posts";
import { Paragraph } from "@/components/MDXRenderer/Paragraph";

export const loadMDX = async (filename: string) => {
  try {
    const filepath = path.join(
      process.cwd(),
      // TODO: mdがない場合、mdxを読み込むようにする
      `../blog-contents/contents/tech-blog/${filename}.md`
    );
    const data = await readFile(filepath, { encoding: "utf-8" });
    return compileMDX<FrontMatter>({
      source: data,
      components: {
        p: Paragraph,
        h1: ({ ...props }) => {
          return (
            <h1 {...props.node?.properties} className="mt-6">
              {props.children}
            </h1>
          );
        },
        code: ({ className, children, ...props }) => {
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
      },
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
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
          ],
          format: "mdx",
        },
      },
    });
  } catch {
    return undefined;
  }
};
