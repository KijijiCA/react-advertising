const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'react-advertising.min.js',
        library: 'ReactAdvertising',
        libraryTarget: 'umd',
    },
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
            },
        ],
    },
    mode: 'production',
    devtool: 'source-map',
};
