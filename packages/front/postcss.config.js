const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env'),
    // postcss-sorting会导致vite卡死
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // require('postcss-sorting')({
    //   order: ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules'],
    //   'properties-order': 'alphabetical',
    //   'unspecified-properties-position': 'bottom',
    // }),
  ],
  map: isDevelopment ? 'inline' : false,
}
