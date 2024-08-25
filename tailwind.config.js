/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    /*
    "main.js",
    "space.js",*/
    "./js/*.js",
    "./js/components/*.js",
    "./elements/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

