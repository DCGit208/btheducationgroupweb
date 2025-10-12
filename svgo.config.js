module.exports = {
  multipass: true,
  js2svg: { indent: 0, pretty: false },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        }
      }
    },
    // Keep dimensions removal optional; many logos scale with viewBox only
    { name: 'removeDimensions', active: true }
  ]
};