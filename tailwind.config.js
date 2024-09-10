/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./tailwindcss.html",
    "./input.css",
    "./js/*.js",
    "./js/**/*.js",
    "./js/components/*.js",
    "./elements/*.js",
  ],
  theme: {
    extend: {
      'animation': {
            'text':'text 5s ease infinite',
        },
        'keyframes': {
            'text': {
                '0%, 100%': {
                   'background-size':'200% 200%',
                    'background-position': 'left center'
                },
                '50%': {
                   'background-size':'200% 200%',
                    'background-position': 'right center'
                }
            },
        }
    },
  },
  plugins: [],
}

