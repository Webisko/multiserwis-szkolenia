/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "./apps/site/**/*.{astro,js,ts,jsx,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#002a36",
          primary: "#003d4d", // Main Deep Teal
          secondary: "#005c73",
          accent: "#ff6600", // Safety Orange
          accentHover: "#e65c00",
          surface: "#f8fafc",
          border: "#e2e8f0",
        },
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
