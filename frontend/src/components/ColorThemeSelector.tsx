"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MdDarkMode, MdDevices, MdLightMode } from "react-icons/md";

export const ColorThemeSelector = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, themes, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded border p-1.5 dark:border-gray-500">
        <div className="size-5" />
      </div>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="カラーテーマを選択する"
          className="rounded border p-2 text-gray-700 dark:border-gray-500 dark:text-slate-300"
          type="button"
        >
          {resolvedTheme === "light" ? (
            <MdLightMode className="size-6" />
          ) : (
            <MdDarkMode className="size-6" />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="overflow-hidden rounded border bg-white shadow-sm dark:border-gray-500 dark:bg-gray-950"
          sideOffset={8}
        >
          <DropdownMenu.Group className="flex flex-col">
            {themes.map((item) => (
              <DropdownMenu.Item
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-gray-800 ${
                  item === theme ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                key={item}
                onClick={() => setTheme(item)}
              >
                {item === "light" ? (
                  <MdLightMode className="size-5" />
                ) : item === "system" ? (
                  <MdDevices className="size-5" />
                ) : (
                  <MdDarkMode className="size-5" />
                )}
                <span className="capitalize">{item}</span>
                {item === theme && <span className="sr-only">（選択中）</span>}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
