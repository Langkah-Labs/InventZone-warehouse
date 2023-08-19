import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(({ addComponents }: any) => {
      addComponents({
        ".body-4large-bold": {
          fontSize: "3rem",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: 1.5,
        },
        ".body-4large-semibold": {
          fontSize: "3rem",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: 1.5,
        },
        ".body-4large-regular": {
          fontSize: "3rem",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: 1.5,
        },
        ".body-2large-bold": {
          fontSize: "1.75rem",

          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: 1.5,
        },
        ".body-2large-semibold": {
          fontSize: "1.75rem",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: 1.5,
        },
        ".body-2large-regular": {
          fontSize: "1.75rem",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: 1.5,
        },
        ".body-extralarge-semibold": {
          fontSize: "1.25rem",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: 1.5,
        },
        ".body-extralarge-medium": {
          fontSize: "1.25rem",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: 1.5,
        },
        ".body-extralarge-regular": {
          fontSize: "1.25rem",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: 1.5,
        },
        ".body-large-medium": {
          fontSize: "1rem",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: 1.5,
        },
        ".body-large-regular": {
          fontSize: "1rem",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: 1.5,
        },
        ".body-large-semibold": {
          fontSize: "1rem",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: 1.5,
        },
        ".body-base-medium": {
          fontSize: "0.875rem",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: 1.5,
        },
        ".body-base-regular": {
          fontSize: "0.875rem",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: 1.5,
        },
        ".body-base-semibold": {
          fontSize: "0.875rem",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: 1.5,
        },
        ".body-small-medium": {
          fontSize: "0.75rem",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: 1.5,
        },
        ".body-small-regular": {
          fontSize: "0.75rem",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: 1.5,
        },
      });
    }),
  ],
};
export default config;
