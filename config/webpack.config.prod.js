const { merge } = require ('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

const commonConfig = require('./webpack.config.common');

const publicUrl = '.';
const env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

module.exports = merge(commonConfig, {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
  },
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [paths.appSrc,paths.appNodeModules],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', 'react-app'],
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ["autoprefixer"]
                ]
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: 'static/css/[name].[contenthash:8].css' }),
  ]
});
