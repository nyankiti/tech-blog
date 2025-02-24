import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";

export async function extractBookmarkUrls(source: string): Promise<string[]> {
  const urls: string[] = [];

  const ast = unified().use(remarkParse).use(remarkMdx).parse(source);

  visit(ast, "mdxJsxFlowElement", (node) => {
    if (node.name === "Bookmark") {
      const hrefAttr = node.attributes?.find(
        (attr) => attr.type === "mdxJsxAttribute" && attr.name === "href"
      );
      if (hrefAttr?.value) {
        urls.push(hrefAttr.value as string);
      }
    }
  });

  console.log("extractBookmarkUrls urls:", urls);

  return [...new Set(urls)];
}
