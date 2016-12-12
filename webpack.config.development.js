const webpack = require('webpack');
const baseConfig = require('./webpack.config.base.js');

const config = Object.assign({}, baseConfig);

config.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
}));

module.exports = config;
