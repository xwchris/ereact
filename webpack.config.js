const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename: 'simple-react.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'xwSimpleReact',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader'
      }
    ]
  }
}
