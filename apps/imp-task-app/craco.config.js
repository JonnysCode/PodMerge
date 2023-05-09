module.exports = {
  webpack: {
    configure: {
      experiments: {
        topLevelAwait: true,
      },
    },
  },
  devServer: {
    port: 3003,
  },
};
