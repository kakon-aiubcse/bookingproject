// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
   screens: {
      xs: { max: "430px" },
    },
  theme: {
    extend: {},
  },
  plugins: [],
};
