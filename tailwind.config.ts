import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        heading: ["Manrope", "sans-serif"],
      },
      colors: {
        obsidian: "#0B0B0C",
        charcoal: "#151517",
        graphite: "#202023",
        ivory: "#F4F0E8",
        warmGrey: "#A7A198",
        gold: {
          DEFAULT: "#C7A46A",
          light: "#D8BC8A",
          dark: "#A88349",
          muted: "rgba(199, 164, 106, 0.12)",
        },
        charcoalBorder: "#302D28",
        deepBlack: "#191919",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
