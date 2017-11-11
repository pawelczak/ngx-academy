const webpackMerge = require('webpack-merge'),
	commonConfig = require('./webpack.common.js'),
	DefinePlugin = require('webpack/lib/DefinePlugin'),
	LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

const config = webpackMerge(commonConfig, {

	devtool: 'cheap-module-eval-source-map',

	plugins: [
		new DefinePlugin({
			'ENV': JSON.stringify(ENV)
		}),
		new LoaderOptionsPlugin({
			debug: true,
			options: {
				// tslint: {
				// 	emitErrors: true,
				// 	failOnHint: true,
				// 	resourcePath: 'src'
				// }
			}
		})
	]
});

module.exports = config;
