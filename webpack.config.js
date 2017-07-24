'use strict';

const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const plugins = [];
if (process.env.NODE_ENV === "production") {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings: false
			},
			output: {comments: false}
		})
	);
}

module.exports = {
	devtool: 'source-map',
	entry: ['pixi.js', './src/index.js'],
	output: {
		filename: 'dist/game.js'
	},
	resolve: {
		extensions: ["", ".js"]
	},
	// plugins: plugins,
	module: {
		postLoaders: [
			{
				loader: "transform/cacheable?brfs"
			}
		],
		loaders: [
			{
				test: /\.json$/,
				include: path.join(__dirname, 'node_modules', 'pixi.js'),
				loader: 'json',
			},
			// {
			// 	test: require.resolve('createjs-easeljs'),
			// 	loader: 'imports?this=>window!exports?window.createjs'
			// },
			{
				test: /\.js$/,
				exclude: path.join(__dirname, 'node_modules'),
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'stage-0']
				}
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: './fill', to: './dist' },
		], {
			copyUnmodified: true
		})
	]
};
