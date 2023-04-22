/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-1": "#2A73FF",
        "blue-2": "#0057FF",
        "gray-1": "#404446",
        "gray-2": "#303437",
        light: "#F2F4F5",
        "purple-1": "#E7E7FF",
        "purple-2": "#6B4EFF",
        pink: "#FF007B",
      },
    },
  },
  plugins: [],
};
