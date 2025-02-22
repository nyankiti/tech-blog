import path from "node:path";
import { readFile, readdir } from "node:fs/promises";
import { compileMDX } from "next-mdx-remote/rsc";

type FrontMatter = {
  title: string;
  slug: string;
  tags: string[];
  published: boolean;
  deleted: boolean;
  publishedAt: string;
  lastEditedAt: string;
  views: number;
};

export async function generateStaticParams() {
  const postDirPath = path.join(
    process.cwd(),
    `../../blog-contents/contents/tech-blog`
  );
  const postFiles = await readdir(postDirPath);
  const postFilesWithoutExtension = postFiles.map((file) =>
    path.basename(file, path.extname(file))
  );

  return postFilesWithoutExtension.map((slug) => {
    return { slug };
  });
}

async function loadMDX(filename: string) {
  const filepath = path.join(
    process.cwd(),
    // TODO: mdがない場合、mdxを読み込むようにする
    `../blog-contents/contents/tech-blog/${filename}.md`
  );
  console.log("filepath", filepath);
  const data = await readFile(filepath, { encoding: "utf-8" });
  // TODO: remark,rehypeのプラグインを指定する場合、
  // front-matterもパースする場合、ここで指定する
  return compileMDX<FrontMatter>({
    source: data,
    options: {
      parseFrontmatter: true,
    },
  });
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const mdx = await loadMDX(slug);
  const metaInfo = mdx.frontmatter;
  console.log("metaInfo", metaInfo);
  return <>{mdx.content}</>;
}
