const { resolve } = require('path');
const { readJsonSync, existsSync } = require('fs-extra');
const { merge } = require('lodash');

module.exports = () => {
  const defaultConfigPath = resolve(
    __dirname,
    '../coverage.config.default.json'
  );
  const defaultConfig = readJsonSync(defaultConfigPath);
  const configPath = resolve(process.cwd(), 'coverage.config.json');
  if (!existsSync(configPath)) {
    return defaultConfig;
  }
  const config = readJsonSync(configPath);
  return merge(defaultConfig, config);
};
