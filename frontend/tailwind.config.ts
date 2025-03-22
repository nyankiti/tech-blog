import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../blog-contents/**/*.{js,jsx,ts,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      extend: {
        animation: {
          "spin-slow": "spin 3s linear infinite",
        },
        keyframes: {
          pulse: {
            "0%, 100%": { opacity: "1" },
            "50%": { opacity: "0.5" },
          },
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("@tailwindcss/typography")],
  darkMode: ["selector", ".dark"],
} satisfies Config;
