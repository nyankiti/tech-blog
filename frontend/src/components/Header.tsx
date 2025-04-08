"use client";

import { NextLink } from "@/i18n/navigation";
import { ColorThemeSelector } from "./ColorThemeSelector";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SITE_TITLE } from "@/constants";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const titleLink = pathname.includes("gourmet") ? "/gourmet" : "/";
  return (
    <header className="sticky top-0 flex items-center justify-between px-4 md:px-8 py-2 border-b border-gray-200 backdrop-blur-sm z-10">
      <NextLink
        href={titleLink}
        className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter text-gray-800 dark:text-white"
      >
        {SITE_TITLE}
      </NextLink>
      <nav className="flex items-center gap-2">
        <NavLinks />
      </nav>
    </header>
  );
};

const NavLinks = () => {
  return (
    <>
      <NextLink
        href="/blog"
        className="text-sm text-gray-500 transition-colors duration-200 px-2 py-2 hover:text-gray-800"
      >
        Blog
      </NextLink>
      <NextLink
        href="/lab"
        className="text-sm text-gray-500 transition-colors duration-200 px-2 py-2 hover:text-gray-800"
      >
        Lab
      </NextLink>
      <ColorThemeSelector />
      <LanguageSwitcher />
    </>
  );
};
