import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: "#58CC02",
          greenDark: "#46A302",
          red: "#FF4B4B",
          redDark: "#EA2B2B",
          blue: "#1CB0F6",
          blueDark: "#1899D6",
          yellow: "#FFC800",
          yellowDark: "#E5A400",
          gray: "#E5E5E5",
          grayDark: "#AFAFAF",
          cardBorder: "#E5E5E5",
        },
      },
    },
  },
  plugins: [],
};
export default config;