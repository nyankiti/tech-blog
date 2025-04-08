import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextLink } from "@/i18n/navigation";

export const metadata: Metadata = {
  robots: {
    index: false, // noindexの設定
  },
};

export default async function Page() {
  const t = await getTranslations("Lab");
  return (
    <div className="max-w-[85rem] px-4 pb-10 sm:px-6 lg:px-8 mx-auto">
      <div className="mt-8">
        <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
          {t("description")}
        </p>
      </div>
      <div className="prose dark:prose-invert ">
        <ul>
          <li>
            <NextLink href="/lab/webpush">webpush</NextLink>
          </li>
          <li>
            <NextLink href="/gourmet">
              gourmet blog with View Transition API
            </NextLink>
          </li>
          <li>
            <NextLink href="/summary">
              Daily summaries of tech news I&apos;m following, powered by
              generative AI
            </NextLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
