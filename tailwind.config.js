/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "Roboto", "Doto", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Montserrat", "Doto", "Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "Roboto Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
    },
  },
  plugins: [],
}