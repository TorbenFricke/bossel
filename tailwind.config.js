module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    options: {
      safelist: [
        /^bg-\S*-(\d{3}|50)/,
        /^text-\S*-(\d{3}|50)/,
        /^border-\S*-(\d{3}|50)/,
        /^dark:bg-\S*-(\d{3}|50)/,
        /^dark:text-\S*-(\d{3}|50)/,
        /^dark:border-\S*-(\d{3}|50)/,
      ] // optimize to exclude opacity and so on
    }
  },
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width'
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last'],
      borderWidth: ['last'],
    },
  },
  plugins: [],
}
