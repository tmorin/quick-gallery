const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
    entry: {
        'gallery': './src/public/gallery/index.js',
        'admin': './src/public/admin/index.js',
        'basket': './src/public/basket/index.js'
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            {test: /\.pug$/, loader: "pug-loader"},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.less/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=25000'}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons.[hash].js'
        }),
        new HtmlWebpackPlugin({
            template: './src/public/tpl.pug',
            inject: 'body',
            chunks: ['commons', 'gallery'],
            filename: 'index.html',
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true
            },
            pkg: pkg
        }),
        new HtmlWebpackPlugin({
            template: './src/public/tpl.pug',
            inject: 'body',
            chunks: ['commons', 'admin'],
            filename: 'admin.html',
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true
            },
            pkg: pkg
        }),
        new HtmlWebpackPlugin({
            template: './src/public/tpl.pug',
            inject: 'body',
            chunks: ['commons', 'basket'],
            filename: 'basket.html',
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true
            },
            pkg: pkg
        })
    ],
    devServer: {
        contentBase: 'public',
        noInfo: false,
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: 3000,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        proxy: {
            '/': {
                target: 'http://localhost:4000',
                secure: false
            }
        }
    }
}
;
