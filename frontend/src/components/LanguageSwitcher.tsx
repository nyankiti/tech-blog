"use client";

import { Locale, useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { DropdownMenu } from "radix-ui";
import { useEffect, useState } from "react";
import { IoLanguageSharp } from "react-icons/io5";

export const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages: { code: Locale; name: string }[] = [
    { code: "en", name: "English" },
    { code: "ja", name: "日本語" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded border p-1.5 dark:border-gray-500">
        <div className="size-5"></div>
      </div>
    );
  }

  const handleLanguageChange = (locale: Locale) => {
    router.push(pathname, { locale });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label={t("selectLanguage")}
          className="rounded border p-2 text-gray-700 dark:border-gray-500 dark:text-slate-300"
          type="button"
        >
          <IoLanguageSharp className="size-6" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="overflow-hidden rounded border bg-white shadow-sm dark:border-gray-500 dark:bg-gray-950"
          sideOffset={8}
        >
          <DropdownMenu.Group className="flex flex-col">
            {languages.map((language) => (
              <DropdownMenu.Item
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-gray-800 ${
                  language.code === locale ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
              >
                <span>{language.name}</span>
                {language.code === locale && (
                  <span className="sr-only">（選択中）</span>
                )}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
