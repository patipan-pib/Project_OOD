/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Parisienne: ["Parisienne", "cursive"],
        PT: ["PT Sans Narrow", "sans-serif"],
      },
    },
  },
  plugins: [],
}