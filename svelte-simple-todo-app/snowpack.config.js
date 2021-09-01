module.exports = {
  mount: {
    public: '/',
    src: '/dist'
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-babel',
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
