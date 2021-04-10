const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = {
  entry: [
    paths.appIndexJs
  ],
  output: {
    path: paths.appBuild,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'fs': require.resolve('../src/helpers/fs_proxy.js')
    },
    modules: [
      ...paths.nodePaths,
      paths.ownNodeModules
    ]
  },
  
  module: {
    rules: [
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/
        ],
        type: 'asset/resource'
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: paths.appHtml,
    })
  ]
};
