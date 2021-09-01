const production = process.env.NODE_ENV === 'production';

function babelOptions() {
  return {
    plugins: production ? ['transform-remove-console'] : []
  };
}

module.exports = {
  mount: {
    public: '/',
    src: '/dist'
  },
  plugins: [
    '@snowpack/plugin-svelte',
    ['@snowpack/plugin-babel', {
      transformOptions: babelOptions()
    }],
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-sass',
    '@snowpack/plugin-optimize'
  ],
  alias: {
    '~': './src'
  },
  devOptions: {
    port: 5000,
    open: 'none'
  }
};
