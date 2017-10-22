const webpack = require('webpack'),
      path = require('path');
// var CompressionPlugin = require("compression-webpack-plugin");

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {

    profile: true,
    devtool: false,
    entry: {
        'vendor': './src/vendor.browser.ts',
        'polyfills': './src/polyfills.browser.ts',
        'app': './src/main.aot.ts'
    },
    output: {
        path: "./dist-aot",
        filename: "[name].bundle.js",
        publicPath: "dist/"
    },
    resolve: {
        extensions: ['.ts', '.js', '.jpg', '.jpeg', '.gif', '.png', '.css', '.html'],
        modules: [
            path.join(__dirname, '../node_modules'),
            path.join(__dirname, '../src')
        ]
    },
    module: {
        rules: [
            { test: /\.(jpg|jpeg|gif|png)$/, loader:'file-loader?name=img/[path][name].[ext]' },
            { test: /\.(eof|woff|woff2|svg)$/, loader:'file-loader?name=img/[path][name].[ext]' },
            { test: /\.css$/, loader:'raw-loader' },
            { test: /\.html$/,  loaders: ['html-loader'] },
            { test: /\.ts$/, loaders: ['awesome-typescript-loader'], exclude: /node_modules/}
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
                inline:true,
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
