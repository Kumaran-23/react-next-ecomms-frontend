/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["pastel"],
  },
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // adjust as needed
        '4xl': '0 30px 60px -15px rgba(0, 0, 0, 0.3)'  // adjust as needed
      },
    },
  },
};