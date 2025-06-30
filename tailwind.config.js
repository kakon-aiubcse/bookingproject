// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
   
    extend: {
      colors: {
        bgrnd: ["#16161a"],
        scdry: ["#72757e"],
        hdline: ["#fffffe"],
        prgraph: ["#94a1b2"],
        btton: ["#7f5af0"],
        bttext: ["#fffffe"],
      },
      fontFamily: {
        ios: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"San Francisco"',
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        roboto: ["Roboto", "sans-serif"],
      },
       screens:{
      xs: {max: "430px"}
    }
    },
   
  },
  plugins: [],
};
