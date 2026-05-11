/**
 * core.identity.webid — small wrapper around the
 * `@decwebag/webid-discovery` substrate.
 *
 * Exists so callers that pull from `@decwebag/core` get the
 * WebID-discovery surface without needing a separate package
 * import.  This file is intentionally a re-export — the substrate
 * itself owns the implementation.
 *
 * Standardisation Phase 50.2 — see
 * `Project Files/SDK/core-v2-coding-plan-2026-05-11.md`.
 */

export {
  discoverPointers,
  resolvePointers,
  WebIdCache,
  WEBID_PREDICATES,
} from '@decwebag/webid-discovery';
