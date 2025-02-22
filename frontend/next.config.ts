import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
};

const withMDX = createMDX({
  // ⚠️ next-mdx-remote で読み込むページにはここのoptionが対応していない
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
