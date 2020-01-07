module.exports = {
    entry: ['regenerator-runtime/runtime', './index.js'],
    output: {
        path: __dirname,
        filename: 'dist/index.min.js',
        libraryTarget: 'commonjs2'
    },
    externals: {
        react: {
            commonjs2: 'react'
        },
        'prop-types': {
            commonjs2: 'prop-types'
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
