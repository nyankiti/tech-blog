import { SITE_DESCRIPTION } from "@/constants";

export const TitleSection = () => {
  return (
    <div className="max-w-2xl my-8">
      <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
        {SITE_DESCRIPTION}
      </p>
    </div>
  );
};
