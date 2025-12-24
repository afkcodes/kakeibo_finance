module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '~': './src',
          '@kakeibo/core': '../../packages/core/src',
        },
      },
    ],
    // Required for Zod v4
    '@babel/plugin-transform-export-namespace-from',
    // Must be last - required for react-native-reanimated
    'react-native-worklets/plugin',
  ],
};
