const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');

/**
 * Metro needs to know about the local @decwebag packages so it can watch
 * and bundle them.  We add them to watchFolders so hot-reload works when
 * you edit SDK code during development.
 */
const config = {
  watchFolders: [
    path.resolve(repoRoot, 'packages/core'),
    path.resolve(repoRoot, 'packages/react-native'),
  ],

  resolver: {
    // Resolve @decwebag/* to the local packages (supplements the file: links in package.json)
    extraNodeModules: {
      '@decwebag/core':          path.resolve(repoRoot, 'packages/core'),
      '@decwebag/react-native':  path.resolve(repoRoot, 'packages/react-native'),
    },
    // Honour package.json "exports" field (needed for @decwebag/core's subpath exports)
    unstable_enablePackageExports: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
