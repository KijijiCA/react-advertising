module.exports = {
    presets: ['@babel/env', '@babel/react'],
    plugins: ['@babel/plugin-proposal-object-rest-spread'],
    env: {
        production: {
            plugins: ['transform-react-remove-prop-types']
        }
    }
};
