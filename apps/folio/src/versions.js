// Lifted to @decwebag/sync-engine.  Re-export shim for back-compat.
// All version-store logic now lives in @decwebag/sync-engine/versions.
export {
  VERSIONS_DIR_RELPATH,
  DEFAULT_VERSIONS_PER_FILE,
  DEFAULT_VERSIONS_BUDGET_MB,
  DEBOUNCE_MS,
  isVersionable,
  sha256Of,
  sha256OfAsync,
  _clearVersionsCache,
  captureVersion,
  listVersions,
  restoreVersion,
  dropVersions,
  pruneVersions,
  listFilesWithVersions,
  readVersionContent,
  _pathSep,
} from '@decwebag/sync-engine/versions';
