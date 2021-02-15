const { NODE_ENV, BABEL_ENV } = process.env;

const useESModules = NODE_ENV !== 'test' && BABEL_ENV !== 'commonjs';

module.exports = {
  presets: [['@babel/env', { modules: false }], '@babel/react'],
  plugins: [
    '@babel/proposal-object-rest-spread',
    !useESModules && '@babel/plugin-transform-modules-commonjs',
    ['@babel/transform-runtime', { useESModules }],
  ].filter(Boolean),
  env: {
    production: {
      plugins: ['transform-react-remove-prop-types'],
    },
  },
};
