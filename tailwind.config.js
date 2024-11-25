import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,jsx}",
  ],
  theme: {},
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            focus: "#FE94E7",
            primary: {
              DEFAULT: "#FE94E7",
              dark: "#DE5D83",
              light: "#FAEBF9",
            },
            secondary: {
              DEFAULT: "#AFDCFF",
              dark: "#5EB2F8",
              light: "#DAEFFF",
            },
            gray: {
              100: "#FFFFFF",
              200: "#F3F4F6",
              300: "#E5E7EB",
              400: "#9CA3AF",
              900: "#000000",
            },
            error: "#D40000",
            warning: "#FFC700",
            success: "#008A57",
          },
        },
      },
    }),
  ],
};
