const webpack = require("webpack");
const baseConfig = require("./webpack.config.base.js");

const config = Object.assign({}, baseConfig);

config.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
}));

config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
        screw_ie8: true,
        warnings: false
    }
}));

module.exports = config;
