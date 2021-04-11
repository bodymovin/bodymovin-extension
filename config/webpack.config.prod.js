const { merge } = require ('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');

const commonConfig = require('./webpack.config.common');

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
					loader: 'babel-loader'
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
					'postcss-loader'
				]
			}
		]
	},

	plugins: [
		new MiniCssExtractPlugin({ filename: 'static/css/[name].[contenthash:8].css' }),
	]
});
