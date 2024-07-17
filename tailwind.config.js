/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        gray:"5A5959",
        yellow:"FFEAAE",
        darkyellow:"FFEAAE",
        orange:"",
        red:"D01C28",
        purple:"5F00D9"
      }
    },
  },
  plugins: [],
};
