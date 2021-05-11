const srcDirName = process.env.INSTRUMENTED ? 'instrumented' : 'src';
module.exports = {
  stories: [
    `../${srcDirName}/**/*.stories.mdx`,
    `../${srcDirName}/**/*.stories.@(js|jsx|ts|tsx)`,
  ],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: { controls: false, actions: false },
    },
  ],
};
