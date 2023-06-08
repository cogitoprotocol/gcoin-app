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
        dark: "#300030",
        "light-section-dark": "#EAEBEB",
        "light-section-light": "#F5F5F5",
        "dark-section-dark": "#480048",
        "dark-section-light": "#601848",
        "accent-active": "#FF9233",
        accent: "#ff7d08",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 270deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
