import fs from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";
import { SITE_TITLE } from "@/constants";
import { getFrontMatter, getSlugs } from "@/libs/posts";

export const dynamic = "error";
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug) => {
    return { slug };
  });
}

const assetsDirectory = process.cwd() + "/assets";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const frontmatter = await getFrontMatter(slug);

  if (!frontmatter) return new Response("Not Found", { status: 404 });

  const fontInter = await fs.readFile(
    path.join(assetsDirectory, "Inter-Bold.ttf")
  );
  const fontNotSansJP = await fs.readFile(
    path.join(assetsDirectory, "NotoSansJP-Bold.ttf")
  );

  return new ImageResponse(
    (
      <div
        lang="ja-JP"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "80px 100px 120px",
          fontFamily: "Inter, NotoSansJP",
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.4,
          letterSpacing: "-0.01em",
          color: "black",
          background: "white",
          maxHeight: "100%",
          position: "relative",
        }}
      >
        <div>{frontmatter.title}</div>
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            marginRight: 12,
            letterSpacing: "-0.05em",
          }}
        >
          {SITE_TITLE}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontInter,
          style: "normal",
          weight: 700,
        },
        {
          name: "NotoSansJP",
          data: fontNotSansJP,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
