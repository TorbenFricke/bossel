module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    options: {
      safelist: [
        /^bg-\S*-\d{3}/,
        /^text-\S*-\d{3}/,
        /^border-\S*-\d{3}/,
        /^dark:bg-\S*-\d{3}/,
        /^dark:text-\S*-\d{3}/,
        /^dark:border-\S*-\d{3}/,
      ] // optimize to exclude opacity and so on
    }
  },
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last'],
      borderWidth: ['last'],
    },
  },
  plugins: [],
}
