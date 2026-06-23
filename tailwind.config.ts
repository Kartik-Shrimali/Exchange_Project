import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: "0.7rem",
      sm: "0.8rem",
    },
    extend: {
      colors: {
        greenBackgroundTransparent: 'rgba(0,194,120,.12)',
        redBackgroundTransparent: 'rgba(234,56,59,.12)',
        baseBackgroundL2: "rgb(32,33,39)",
        baseBackgroundL3: "rgb(42,43,49)",
        greenPrimaryButtonBackground: "rgb(0,194,120)",
      },
      borderColor: {
        redBorder: 'rgba(234,56,59,.5)',
        greenBorder: 'rgba(0,194,120,.4)',
        baseBorderMed: 'rgb(50,51,57)',
        baseBorderFocus: 'rgb(80,81,87)',
        accentBlue: "rgb(76,148,255)",
        baseBorderLight: "rgb(32,33,39)",
      },
      textColor: {
        greenText: "rgb(0,194,120)",
        redText: "rgb(234,56,59)",
        greenPrimaryButtonText: "rgb(20,21,27)",
        baseTextHighEmphasis: "rgb(244,244,246)",
        baseTextMedEmphasis: "rgb(142,142,147)",
      }
    },
  },
  plugins: [],
};
export default config;