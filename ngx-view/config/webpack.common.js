const helpers = require('./helpers'),
	webpack = require('webpack'),
	path = require('path'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	precss = require('precss'),
	autoprefixer = require('autoprefixer'),
	LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

module.exports = {

	entry: {
		'polyfills': './src/polyfills.browser.ts',
		'vendor': './src/vendor.browser.ts',
		'main': './src/main.browser.ts'
	},

	output: {
		filename: '[name].bundle.js',
		path: path.join(__dirname, '../dist')
	},

	resolve: {
		extensions: ['.js', '.ts', '.scss', '.css', '.json'],
		modules: [
			path.join(__dirname, '../node_modules'),
			path.join(__dirname, '../src')
		]
	},

	resolveLoader: {
		moduleExtensions: ['-loader']
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
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				exclude: /\.ngx.scss$/,
				loaders: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.ngx.scss$/,
				loaders: [
					'to-string-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(jpg|png)$/,
				loader: 'url-loader?limit=10000000'
			},
			{
				test: /\.html$/,
				loader: 'raw-loader'
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/octet-stream'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=image/svg+xml'
			}
		]

	},

	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			chunksSortMode: 'dependency'
		}),
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)@angular/,
			helpers.root('./src'),
			{}
		),
		new CopyWebpackPlugin([{
			from: path.join(__dirname, '../src/assets'),
			to: path.join(__dirname, '../dist/assets')
		}]),
		new LoaderOptionsPlugin({
			options: {

				/**
				 * Static analysis linter for TypeScript advanced options configuration
				 * Description: An extensible linter for the TypeScript language.
				 *
				 * See: https://github.com/wbuchwalter/tslint-loader
				 */
				tslint: {
					emitErrors: false,
					failOnHint: false,
					resourcePath: 'src'
				},

				postcss: function () {
					return [
						precss,
						autoprefixer
					];
				}
			}
		})
	]

};
