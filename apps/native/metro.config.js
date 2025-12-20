const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const path = require('node:path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      '~': path.resolve(__dirname, 'src'),
      '@kakeibo/core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },
};

module.exports = withUniwindConfig(mergeConfig(getDefaultConfig(__dirname), config), {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind-types.d.ts',
});
