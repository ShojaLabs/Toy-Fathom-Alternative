import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui-components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'brand': {
          50: '#e9ebff',
          100: '#cfd2ff',
          200: '#9ba0ff',
          300: '#636cff',
          400: '#363fff',
          500: '#1823ff',
          600: '#0314ff',
          700: '#0009e5',
          800: '#0006cd',
          900: '#0002b5',
        },
        'gray': {
          50: "#FAFAFA",
          100: "#EBEBEB",
          200: "#d6d6d6",
          300: "#C2C2C2",
          400: "#ADADAD",
          500: "#999999",
          600: "#858585",
          700: "#707070",
          800: "#5C5C5C",
          900: "#474747",
        }
      }
    },
  },
  plugins: [],
};
export default config;
