const webpack = require('webpack'),
	webpackMerge = require('webpack-merge'),
	commonConfig = require('./webpack.common.js'),
	DefinePlugin = require('webpack/lib/DefinePlugin'),
	LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin'),
	path = require('path');

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

module.exports = {

	profile: true,
	devtool: false,
	entry: {
		'vendor': './src/vendor.browser.ts',
		'polyfills': './src/polyfills.browser.ts',
		'app': './src/main.aot.ts'
	},
	output: {
		path: path.join(__dirname, '../dist-aot'),
		filename: "[name].bundle.js",
		publicPath: "/dist-aot/"
	},
	resolve: {
		extensions: ['.ts', '.js', '.jpg', '.jpeg', '.gif', '.png', '.css', '.html'],
		modules: [
			path.join(__dirname, '../node_modules'),
			path.join(__dirname, '../src'),
			path.join(__dirname, '../aot')
		],
		alias: {
			'./app/app.module.ngfactory$': '../aot/src/app/app.module.ngfactory'
		}
	},
	module: {
		rules: [
			{test: /\.(jpg|jpeg|gif|png)$/, loader: 'file-loader?name=img/[path][name].[ext]'},
			{test: /\.(eof|woff|woff2|svg)$/, loader: 'file-loader?name=img/[path][name].[ext]'},
			{test: /\.css$/, loader: 'raw-loader'},
			{test: /\.html$/, loaders: ['html-loader']},
			{test: /\.ts$/, loaders: ['awesome-typescript-loader'], exclude: /node_modules/}
		],
		exprContextCritical: false
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: false,
			node: {
				__filename: true
			},
			devServer: {
				inline: true,
				port: 8080,
				historyApiFallback: true,
				watchOptions: {
					aggregateTimeout: 300,
					poll: 1000
				}
			}
		})

		// new webpack.LoaderOptionsPlugin({
		//     minimize: true,
		//     debug: false
		// }),
		// new webpack.optimize.UglifyJsPlugin({
		//     compress: {
		//         warnings: false
		//     },
		//     output: {
		//         comments: false
		//     },
		//     sourceMap: false
		// }),
		// new CompressionPlugin({
		//     asset: "[path].gz[query]",
		//     algorithm: "gzip",
		//     test: /\.js$|\.html$/,
		//     threshold: 10240,
		//     minRatio: 0.8
		// })
	]
};
