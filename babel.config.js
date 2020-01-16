module.exports = {
    presets: ['@babel/env', '@babel/react'],
    plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/transform-runtime',
        '@babel/plugin-transform-modules-commonjs'
    ],
    env: {
        production: {
            plugins: ['transform-react-remove-prop-types']
        }
    }
};
