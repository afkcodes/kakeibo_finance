const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const path = require('node:path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

// Get the project root (monorepo root)
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = {
  projectRoot,
  watchFolders: [workspaceRoot],
  resolver: {
    extraNodeModules: {
      '~': path.resolve(__dirname, 'src'),
      '@kakeibo/core': path.resolve(workspaceRoot, 'packages/core/src'),
    },
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
  },
};

module.exports = withUniwindConfig(mergeConfig(getDefaultConfig(__dirname), config), {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind-types.d.ts',
});
