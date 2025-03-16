import gorouImage from "../../public/gorou.jpg";
import Image from "next/image";
import { IoLogoTwitter, IoLogoGithub } from "react-icons/io5";

export const Profile = () => {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="shrink-0"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="hs-vertically-centered-modal"
        data-hs-overlay="#hs-vertically-centered-modal"
      >
        <Image
          className="shrink-0 size-16 rounded-full"
          src={gorouImage}
          alt="Avatar"
        />
      </button>

      <div className="grow">
        <h1 className="text-lg font-medium text-gray-800 dark:text-neutral-200">
          管理人
        </h1>

        <p className="text-sm text-gray-600 dark:text-neutral-400">
          23卒のweb屋さん, 日日是好日
          <br />
          実家猫のにゃんきちくんとnook（隅、隠れ家）が好き
          <br />
        </p>

        <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400"></p>
        <div className="mt-3 flex items-center gap-3">
          <a
            href="https://x.com/soken_nowi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
            aria-label="Twitter"
          >
            <IoLogoTwitter size={16} />
          </a>

          <a
            href="https://github.com/nyankiti"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors dark:hover:text-white"
            aria-label="GitHub"
          >
            <IoLogoGithub size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
