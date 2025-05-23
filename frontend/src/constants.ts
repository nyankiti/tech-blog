export const SITE_TITLE = "nook:net:";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_URL
  ? new URL(`https://${process.env.VERCEL_URL}`)
  : new URL(`http://localhost:${process.env.PORT || 3000}`);

export const GA_MEASUREMENT_ID =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : undefined;

export const BLOG_CONTENTS_URL = "https://nyankiti.github.io/blog-contents";
