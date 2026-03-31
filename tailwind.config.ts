import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#062767",
          dark: "#041d4a",
          light: "#0a3a8f",
          50: "#e8eef8",
          100: "#c5d4ed",
          200: "#9fb7e0",
          300: "#789ad3",
          400: "#5b83c9",
          500: "#3e6dbf",
          600: "#1e4f9a",
          700: "#0a3a8f",
          800: "#062767",
          900: "#041d4a",
        },
        gold: {
          DEFAULT: "#b19763",
          dark: "#8f7a4f",
          light: "#c9b07e",
          50: "#faf6ee",
          100: "#f0e6cf",
          200: "#e3d2aa",
          300: "#d5be85",
          400: "#c9b07e",
          500: "#b19763",
          600: "#9a824f",
          700: "#8f7a4f",
          800: "#6b5c3b",
          900: "#4a3f29",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
        opensans: ["var(--font-opensans)", "Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
