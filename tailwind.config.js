/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#f2f2f7",
        dark: "#300030",
        "dark-section-dark": "#480048",
        "dark-section-light": "#601848",
        "accent-active": "#FF9233",
        accent: "#ff7d08",
      },
      backgroundImage: {
        // relative to ./app/globals.css
        "dark-pattern":
          "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0)), url('./img/dark-bricks.png')",
        "light-pattern":
          "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0)), url('./img/light-bricks.png')",

        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 270deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
