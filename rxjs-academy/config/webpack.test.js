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
				],
				exclude: /node_modules/
			}
		]
	}
};
