import { NextResponse } from "next/server";
import { Locale } from "next-intl";
import { generateFeed } from "@/libs/feed";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ locale: Locale }> }
): Promise<NextResponse> => {
  const { locale } = await params;
  const feed = await generateFeed(locale);

  return new NextResponse(feed, {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
      "Content-Type": "text/xml",
    },
  });
};
