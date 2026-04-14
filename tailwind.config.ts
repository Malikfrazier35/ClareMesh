import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#E8EEF0",
          100: "#C8D6DB",
          200: "#A3B8C0",
          400: "#4F6D7A",   // primary accent
          600: "#3A5361",
          800: "#253D48",
          900: "#162A33",
        },
        warm: {
          white: "#FAFAF8",
          50: "#F5F4F0",
          100: "#E8E6E0",
          200: "#D4D1C9",
          400: "#9C998F",
          600: "#6B6860",
          800: "#3D3B36",
          900: "#1E1D1A",
        },
        copper: {
          light: "#F2ECE6",
          DEFAULT: "#9D7356",
          dark: "#7A5C43",
        },
      },
      fontFamily: {
        display: ["Instrument Sans", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [],
};

export default config;
