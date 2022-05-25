module.exports = {
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /native_modules\/.+\.node$/,
          use: 'node-loader',
        },
        {
          test: /\.(m?js|node)$/,
          parser: { amd: false },
          use: {
            loader: '@vercel/webpack-asset-relocator-loader',
            options: {
              outputAssetBase: 'native_modules',
            },
          },
        },
      ]
    }
  }