import niwatoriImage from "../../public/niwatori.jpeg";
import Image from "next/image";
import { IoLogoTwitter, IoLogoGithub } from "react-icons/io5";

export const Profile = () => {
  return (
    <div className="flex gap-2">
      <div className="shrink-0">
        <Image
          className="shrink-0 size-16 rounded-full"
          src={niwatoriImage}
          alt="Avatar"
        />
      </div>

      <div className="grow">
        <h1 className="text-lg font-medium text-gray-800 dark:text-neutral-200">
          管理人
        </h1>

        <p className="text-sm text-gray-600 dark:text-neutral-400">
          23卒のweb屋さん, 日日是好日
          <br />
          <a
            className="text-blue-600 dark:text-blue-500 hover:underline"
            href="https://www.youtube.com/watch?v=9NKK_DmI8SU"
            target="_blank"
            rel="noopener noreferrer"
          >
            松尾のひよこ
          </a>
          とnook（隅、隠れ家）が好き
          <br />
          <a
            className="hover:underline"
            href="https://x.com/20hajimemashite/status/1743216794700284326"
            target="_blank"
            rel="noopener noreferrer"
          >
            アイコンはフリー素材らしいです
          </a>
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
