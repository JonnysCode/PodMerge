/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  prefix: 'tw-',
  important: true,
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
