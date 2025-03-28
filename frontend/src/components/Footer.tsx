import { SITE_TITLE } from '@/constants';

export const Footer = () => {
  return (
    <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-t absolute left-0 w-screen border-gray-200 dark:border-neutral-700" />

      <div className="py-6">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <p className="text-xs text-gray-600 dark:text-neutral-400">© 2025 {SITE_TITLE}</p>
          </div>

          <ul className="flex flex-wrap items-center">
            {/* <li className="inline-block relative pe-4 text-xs last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-1.5 before:-translate-y-1/2 before:size-[3px] before:rounded-full before:bg-gray-400 dark:text-neutral-500 dark:before:bg-neutral-600">
              <a
                className="text-xs text-gray-500 underline hover:text-gray-800 hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                href="https://x.com/soken_nowi"
              >
                X (Twitter)
              </a>
            </li>
            <li className="inline-block relative pe-4 text-xs last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-1.5 before:-translate-y-1/2 before:size-[3px] before:rounded-full before:bg-gray-400 dark:text-neutral-500 dark:before:bg-neutral-600">
              <a
                className="text-xs text-gray-500 underline hover:text-gray-800 hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                href="https://github.com/nyankiti"
              >
                Github
              </a>
            </li> */}
            <li className="inline-block relative pe-4 text-xs last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-1.5 before:-translate-y-1/2 before:size-[3px] before:rounded-full before:bg-gray-400 dark:text-neutral-500 dark:before:bg-neutral-600">
              <a
                className="text-xs text-gray-500 underline hover:text-gray-800 hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                href="/privacy-policy"
              >
                プライバシーボリシー
              </a>
            </li>
            <li className="inline-block pe-4 text-xs">
              <a
                className="text-xs text-gray-500 underline hover:text-gray-800 hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                href={`mailto:nowi41cic77mav@gmail.com?subject=お問い合わせ|${SITE_TITLE}&body=お問い合わせ内容を入力してください`}
              >
                問い合わせ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
