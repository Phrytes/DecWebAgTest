/**
 * backgroundTasks — re-export shim around `@decwebag/sync-engine-rn`.
 *
 * **2026-05-08:** the implementation lifted into the substrate
 * (Stoop V3 mobile = rule-of-two consumer). The helpers are fully
 * generic — peer-injected `TaskManager` / `BackgroundFetch` — so
 * no folio-specific glue stays here.
 */

export {
  defineBackgroundTask,
  registerBackgroundFetch,
  unregisterBackgroundFetch,
  statusBackgroundFetch,
  DEFAULT_BACKGROUND_FETCH_INTERVAL_S,
} from '@decwebag/sync-engine-rn';
