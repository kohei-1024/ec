module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            ['react-app', { flow: false, typescript: true }],
          ],
        },
      }
    ],
  });
  
  // Add support for absolute imports
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': require('path').resolve(__dirname, '../src'),
  };
  
  config.resolve.extensions.push('.ts', '.tsx');
  
  return config;
};