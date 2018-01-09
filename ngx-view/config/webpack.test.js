const helpers = require('./helpers'),
	path = require('path'),
	webpack = require('webpack');

module.exports = {

	devtool: 'inline-source-map',

	resolve: {
		extensions: ['.ts', '.js']
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loaders: [
					'awesome-typescript-loader',
					'angular2-template-loader'
				],
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loaders: [
					'to-string-loader',
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				loaders: [
					'to-string-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.html$/,
				loader: 'raw-loader'
			}
		]

	},

	plugins: [
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)/,
			helpers.root('./src'),
			{}
		)
	]

};
