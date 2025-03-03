import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import {
  GA_MEASUREMENT_ID,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/constants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Script from "next/script";
import { AdsenseInitialization } from "@/components/AdsenseInitialization";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_TITLE}`,
    default: `Home | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  twitter: {
    card: "summary",
    creator: `@stin_factory`,
  },
  openGraph: {
    type: "website",
    url: "/",
    title: {
      template: `%s | ${SITE_TITLE}`,
      default: `Home | ${SITE_TITLE}`,
    },
    description: SITE_DESCRIPTION,
    siteName: SITE_TITLE,
  },
  metadataBase: SITE_URL,
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
        <Script
          id="twitter-embed-script"
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
        />
        <Script
          id="twitter-embed-script"
          src="https://platform.x.com/widgets.js"
          strategy="lazyOnload"
        />
        {/* google search console */}
        <meta
          name="google-site-verification"
          content="kKGeMTlX0HUU7k60Fb5XucXqH0DVWUyCF4dHfG5igZg"
        />
        <meta
          name="google-site-verification"
          content="3fzIZJw9pGXRDzzCBbBdcoyvPGlFQndsvKZI31KJVTE"
        />
        {/* google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2129905454599896"
          crossOrigin="anonymous"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AdsenseInitialization />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
