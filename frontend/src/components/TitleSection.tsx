import { getTranslations } from "next-intl/server";

export const TitleSection = async () => {
  const t = await getTranslations("HomePage");

  return (
    <div className="my-8">
      <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
        {t("siteDescription")}
      </p>
    </div>
  );
};
