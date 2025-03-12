/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  docs: {
    autodocs: true
  },
  staticDirs: ['../public'],
  // Simple webpack configuration to handle React
  webpackFinal: async (config) => {
    // Add fallbacks for Node.js core modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      zlib: false,
    };
    
    // Remove react-docgen-typescript-loader
    config.module.rules = config.module.rules.map(rule => {
      if (rule.use && rule.use.find && rule.use.find(use => use && use.loader && use.loader.includes('react-docgen-typescript-loader'))) {
        return {
          ...rule,
          use: rule.use.filter(use => !use || !use.loader || !use.loader.includes('react-docgen-typescript-loader'))
        };
      }
      return rule;
    });
    
    return config;
  }
};

export default config;