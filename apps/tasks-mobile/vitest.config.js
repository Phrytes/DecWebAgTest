import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot  = path.resolve(__dirname, '../..');

export default defineConfig({
  // Treat .js files in this app's source as JSX-bearing — App.js +
  // future src/screens/*.js + src/components/*.js all use JSX. This
  // is the same trade-off stoop-mobile makes; we just declare it
  // explicitly for vitest's esbuild loader.
  esbuild: {
    loader: 'jsx',
    include: [
      /apps\/tasks-mobile\/.*\.jsx?$/,
      /packages\/react-native\/src\/(qr|mnemonic)\/.*\.jsx?$/,
    ],
    exclude: [],
  },
  resolve: {
    alias: {
      // Tasks app barrel — imported for the V2.8 single-agent factories
      // + role policy. Same platform-shell pattern as folio-mobile +
      // stoop-mobile (locked 2026-05-08, see
      // Project Files/conventions/architectural-layering.md).
      '@decwebag-app/tasks-v0/MeshAgent':       path.resolve(repoRoot, 'apps/tasks-v0/src/MeshAgent.js'),
      '@decwebag-app/tasks-v0/wireSkills':      path.resolve(repoRoot, 'apps/tasks-v0/src/wireSkills.js'),
      '@decwebag-app/tasks-v0/bundleResolver':  path.resolve(repoRoot, 'apps/tasks-v0/src/bundleResolver.js'),
      '@decwebag-app/tasks-v0/Crew':            path.resolve(repoRoot, 'apps/tasks-v0/src/Crew.js'),
      '@decwebag-app/tasks-v0/locales/en':      path.resolve(repoRoot, 'apps/tasks-v0/locales/en.json'),
      '@decwebag-app/tasks-v0/locales/nl':      path.resolve(repoRoot, 'apps/tasks-v0/locales/nl.json'),
      '@decwebag-app/tasks-v0':                 path.resolve(repoRoot, 'apps/tasks-v0/src/index.js'),

      // SDK packages — point at sources, not node_modules.
      '@decwebag/core':                         path.resolve(repoRoot, 'packages/core/src/index.js'),
      '@decwebag/pod-client':                   path.resolve(repoRoot, 'packages/pod-client/src/index.js'),

      // Deep-path aliases must come BEFORE the package-root mapping so
      // vite picks the longer prefix (BRING-UP-NOTES Trap 2).
      '@decwebag/react-native/src':             path.resolve(repoRoot, 'packages/react-native/src'),
      '@decwebag/react-native/identity/bootstrap': path.resolve(repoRoot, 'packages/react-native/src/identity/bootstrapIdentity.js'),
      '@decwebag/react-native/identity':        path.resolve(repoRoot, 'packages/react-native/src/identity/index.js'),
      '@decwebag/react-native/storage':         path.resolve(repoRoot, 'packages/react-native/src/storage/index.js'),
      '@decwebag/react-native/deepLinks':       path.resolve(repoRoot, 'packages/react-native/src/deepLinks/index.js'),
      '@decwebag/react-native/theme':           path.resolve(repoRoot, 'packages/react-native/src/theme/index.js'),
      '@decwebag/react-native/components':      path.resolve(repoRoot, 'packages/react-native/src/components/index.js'),
      '@decwebag/react-native/picker':          path.resolve(repoRoot, 'packages/react-native/src/picker/index.js'),
      '@decwebag/react-native/qr/view':         path.resolve(repoRoot, 'packages/react-native/src/qr/QrCodeView.jsx'),
      '@decwebag/react-native/qr':              path.resolve(repoRoot, 'packages/react-native/src/qr/index.js'),
      '@decwebag/react-native/mnemonic/view':   path.resolve(repoRoot, 'packages/react-native/src/mnemonic/MnemonicView.jsx'),
      '@decwebag/react-native/mnemonic':        path.resolve(repoRoot, 'packages/react-native/src/mnemonic/index.js'),
      '@decwebag/react-native/push':            path.resolve(repoRoot, 'packages/react-native/src/push/index.js'),
      '@decwebag/react-native/i18n':            path.resolve(repoRoot, 'packages/react-native/src/i18n/index.js'),
      '@decwebag/react-native':                 path.resolve(repoRoot, 'packages/react-native/index.js'),

      '@decwebag/sync-engine-rn/react':         path.resolve(repoRoot, 'packages/sync-engine-rn/src/react/index.js'),
      '@decwebag/sync-engine-rn':               path.resolve(repoRoot, 'packages/sync-engine-rn/index.js'),
      '@decwebag/online-cadence':               path.resolve(repoRoot, 'packages/online-cadence/index.js'),
      '@decwebag/oidc-session-rn/hook':         path.resolve(repoRoot, 'packages/oidc-session-rn/hook.js'),
      '@decwebag/oidc-session-rn':              path.resolve(repoRoot, 'packages/oidc-session-rn/index.js'),
      '@decwebag/local-store':                  path.resolve(repoRoot, 'packages/local-store/index.js'),
      '@decwebag/identity-resolver/display':    path.resolve(repoRoot, 'packages/identity-resolver/src/display.js'),
      '@decwebag/identity-resolver/skills':     path.resolve(repoRoot, 'packages/identity-resolver/src/skills.js'),
      '@decwebag/identity-resolver':            path.resolve(repoRoot, 'packages/identity-resolver/src/index.js'),
      '@decwebag/item-store':                   path.resolve(repoRoot, 'packages/item-store/src/index.js'),
      '@decwebag/notifier':                     path.resolve(repoRoot, 'packages/notifier/src/index.js'),
      '@decwebag/skill-match':                  path.resolve(repoRoot, 'packages/skill-match/src/index.js'),
      '@decwebag/chat-p2p':                     path.resolve(repoRoot, 'packages/chat-p2p/index.js'),

      // ESM resolution + Node-only deps — same fixes as stoop-mobile.
      '@scure/bip39/wordlists/english': path.resolve(__dirname, 'node_modules/@scure/bip39/wordlists/english.js'),
      '@inrupt/solid-client':              path.resolve(__dirname, 'test/stubs/inrupt.js'),
      '@inrupt/solid-client-authn-node':   path.resolve(__dirname, 'test/stubs/inrupt.js'),
      'chokidar':                          path.resolve(__dirname, 'test/stubs/chokidar.js'),
    },
  },
  test: {
    environment: 'node',
    globals:     true,
    setupFiles:  [path.resolve(__dirname, 'test/setup.js')],
  },
});
