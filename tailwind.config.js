/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/superstore/src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
