export const SITE_TITLE = "s's-nook:";

export const SITE_DESCRIPTION =
  "気になった技術や読み物の記録、雑記など残す個人ブログです。\nnookは「隅、隠れ家」という意味。";

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
