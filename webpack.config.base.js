const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
    entry: {
        'app': './src/public/scripts/bootstrap.js'
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].[hash].js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        /*new webpack.optimize.CommonsChunkPlugin({
         name: 'commons',
         filename: 'commons.[hash].js'
         }),*/
        new HtmlWebpackPlugin({
            template: './src/public/index.ejs',
            inject: 'head',
            chunks: [/*'commons', */'app'],
            filename: 'index.html',
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true
            },
            pkg: pkg
        })
    ],
    module: {
        loaders: [
            {test: /\.js?$/, exclude: /node_modules/, loader: 'babel'},
            {test: /bootstrap\.js$/, loader: 'imports?jQuery=jquery'},
            {test: /jquery\.js$/, loader: 'expose?jQuery'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.less/, loader: 'style!css!less'},
            {test: /\.html/, loader: 'raw'},
            {test: /\.(png|jpg)$/, loader: 'url?limit=25000'}
        ]
    },
    resolve: {
        alias: {
            'jquery': path.join(__dirname, 'node_modules/jquery/dist/jquery'),
            'Backbone': path.join(__dirname, 'node_modules/backbone/backbone'),
            'Marionette': path.join(__dirname, 'node_modules/backbone.marionette/lib/backbone.marionette')
        }
    },
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
};
