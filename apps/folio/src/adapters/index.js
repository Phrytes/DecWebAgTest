// Lifted to @decwebag/sync-engine.  Re-export shim for back-compat.
// The full FsAdapter/HashAdapter/WatcherAdapter contracts are documented
// in @decwebag/sync-engine/adapters.
export {
  fsNode,
  watcherNode,
  hashNode,
  joinPosix,
  dirnamePosix,
  basenamePosix,
  extnamePosix,
} from '@decwebag/sync-engine/adapters';
