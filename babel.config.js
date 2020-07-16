const { NODE_ENV, BABEL_ENV } = process.env;
const useESModules = NODE_ENV !== 'test' && BABEL_ENV !== 'commonjs';
const loose = true;

module.exports = {
    presets: [['@babel/env', { loose, modules: false }]],
    plugins: [
        ['@babel/proposal-object-rest-spread', { loose }],
        '@babel/transform-react-jsx',
        ['@babel/transform-runtime', { useESModules }],
        !useESModules && ['@babel/transform-modules-commonjs', { loose }],
    ].filter(Boolean),
    env: {
        production: {
            plugins: ['transform-react-remove-prop-types'],
        },
    },
};
