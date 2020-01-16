const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'react-prebid.min.js',
        library: {
            root: 'ReactPrebid',
            amd: 'react-prebid',
            commonjs: 'react-prebid'
        },
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            }
        ]
    },
    mode: 'production',
    devtool: 'source-map'
};
