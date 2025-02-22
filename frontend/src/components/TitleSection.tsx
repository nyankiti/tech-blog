import { SITE_TITLE, SITE_DESCRIPTION } from "@/constants";

export const TitleSection = () => {
  return (
    <div className="max-w-2xl text-center mx-auto mb-10 lg:mb-14">
      <h2 className="text-4xl font-black tracking-tighter text-gray-800 dark:dark:text-white">
        {SITE_TITLE}
      </h2>
      <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-neutral-400">
        {SITE_DESCRIPTION}
      </p>
    </div>
  );
};
