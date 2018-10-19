'use strict';

const path = require('path');
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode,
  devtool: mode === 'production' ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  entry: './test.js',
  output: {
    filename: `ereact.${mode}.js`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/static',
    library: 'EReact',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  }
};
